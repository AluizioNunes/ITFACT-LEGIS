"""
Semantic Deduplication Engine — pgvector + multilingual-e5-large + mmarco cross-encoder.
Detecta duplicatas entre 41 origens diferentes em tempo real.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import text
import json
import uuid as uuid_lib
import numpy as np

from core.Configuracao import EMBEDDING_MODEL, EMBEDDING_DIMS, CROSS_ENCODER_MODEL
from core.BancoDados import engine

router = APIRouter(prefix="/semantic", tags=["Semantic Deduplication"])

# ── Lazy-loaded models ──
_embedding_model = None
_cross_encoder_model = None


def get_embedding_model():
    """Lazy-load multilingual-e5-large (1024 dimensions) — optimized for pt-BR"""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL)
        print(f"INFO: Loaded embedding model: {EMBEDDING_MODEL} ({EMBEDDING_DIMS} dims)")
    return _embedding_model


def get_cross_encoder():
    """Lazy-load mmarco multilingual cross-encoder for precision re-ranking"""
    global _cross_encoder_model
    if _cross_encoder_model is None:
        from sentence_transformers import CrossEncoder
        _cross_encoder_model = CrossEncoder(CROSS_ENCODER_MODEL)
        print(f"INFO: Loaded cross-encoder: {CROSS_ENCODER_MODEL}")
    return _cross_encoder_model


# ── pgvector Setup ──

PGVECTOR_SETUP_SQL = f"""
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "DocEmbeddings" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "IdDocumento" TEXT NOT NULL,
    "TipoDocumento" TEXT NOT NULL,
    "Origem" TEXT NOT NULL,
    "Titulo" TEXT NOT NULL,
    "ResumoConteudo" TEXT,
    "Embedding" vector({EMBEDDING_DIMS}),
    "Metadata" JSONB DEFAULT '{{}}',
    "DataCriacao" TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'IdxEmbeddings_vector'
    ) THEN
        CREATE INDEX "IdxEmbeddings_vector" ON "DocEmbeddings"
            USING ivfflat ("Embedding" vector_cosine_ops) WITH (lists = 100);
    END IF;
END $$;
"""


async def setup_pgvector():
    """Executa setup do pgvector no startup"""
    try:
        async with engine.begin() as conn:
            for statement in PGVECTOR_SETUP_SQL.strip().split(";"):
                stmt = statement.strip()
                if stmt and not stmt.startswith("DO"):
                    await conn.execute(text(stmt))
            do_block = [s for s in PGVECTOR_SETUP_SQL.split(";") if s.strip().startswith("DO")]
            for block in do_block:
                if block.strip():
                    await conn.execute(text(block.strip() + ";"))
        print("INFO: pgvector setup complete (table: DocEmbeddings)")
    except Exception as e:
        print(f"INFO: pgvector setup skipped (will retry on first request): {e}")


# ── Pydantic Models ──

class SemanticIndexRequest(BaseModel):
    documento_id: str
    documento_tipo: str
    origem: str
    titulo: str
    conteudo: str
    metadata: Optional[dict] = {}


class SemanticSearchRequest(BaseModel):
    texto: str
    limite: int = 5
    threshold: float = 0.80
    excluir_id: Optional[str] = None


class DuplicateCheckRequest(BaseModel):
    titulo: str
    conteudo: str
    origem: str
    documento_tipo: str = "MINUTA"
    threshold: float = 0.75


# ── Endpoints ──

@router.post("/index")
async def semantic_index(request: SemanticIndexRequest):
    """Indexa um documento no motor semântico (multilingual-e5-large)"""
    try:
        model = get_embedding_model()
        # e5 models require "query: " or "passage: " prefix
        texto_completo = f"passage: {request.titulo}. {request.conteudo[:2000]}"
        embedding = model.encode(texto_completo).tolist()

        async with engine.begin() as conn:
            existing = await conn.execute(
                text('SELECT "Id" FROM "DocEmbeddings" WHERE "IdDocumento" = :did'),
                {"did": request.documento_id}
            )
            row = existing.fetchone()

            if row:
                await conn.execute(
                    text("""
                        UPDATE "DocEmbeddings"
                        SET "Titulo" = :titulo, "ResumoConteudo" = :resumo,
                            "Embedding" = :emb, "Metadata" = :meta, "Origem" = :origem
                        WHERE "IdDocumento" = :did
                    """),
                    {
                        "titulo": request.titulo,
                        "resumo": request.conteudo[:500],
                        "emb": str(embedding),
                        "meta": json.dumps(request.metadata or {}),
                        "origem": request.origem,
                        "did": request.documento_id,
                    }
                )
                return {"status": "updated", "documento_id": request.documento_id}
            else:
                doc_id = str(uuid_lib.uuid4())
                await conn.execute(
                    text("""
                        INSERT INTO "DocEmbeddings"
                        ("Id", "IdDocumento", "TipoDocumento", "Origem", "Titulo", "ResumoConteudo", "Embedding", "Metadata")
                        VALUES (:id, :did, :dtype, :origem, :titulo, :resumo, :emb, :meta)
                    """),
                    {
                        "id": doc_id,
                        "did": request.documento_id,
                        "dtype": request.documento_tipo,
                        "origem": request.origem,
                        "titulo": request.titulo,
                        "resumo": request.conteudo[:500],
                        "emb": str(embedding),
                        "meta": json.dumps(request.metadata or {}),
                    }
                )
                return {"status": "indexed", "documento_id": request.documento_id, "embedding_id": doc_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao indexar: {str(e)}")


@router.post("/search")
async def semantic_search(request: SemanticSearchRequest):
    """Busca documentos semanticamente similares usando pgvector"""
    try:
        model = get_embedding_model()
        embedding = model.encode(f"query: {request.texto}").tolist()

        async with engine.begin() as conn:
            query = """
                SELECT
                    "IdDocumento", "TipoDocumento", "Origem", "Titulo", "ResumoConteudo", "Metadata",
                    1 - ("Embedding" <=> :emb::vector) AS similarity
                FROM "DocEmbeddings"
                WHERE 1 - ("Embedding" <=> :emb::vector) > :threshold
            """
            params = {
                "emb": str(embedding),
                "threshold": request.threshold,
                "limite": request.limite,
            }

            if request.excluir_id:
                query += ' AND "IdDocumento" != :excluir'
                params["excluir"] = request.excluir_id

            query += ' ORDER BY "Embedding" <=> :emb2::vector LIMIT :limite'
            params["emb2"] = str(embedding)

            result = await conn.execute(text(query), params)
            rows = result.fetchall()

            similares = []
            for row in rows:
                similares.append({
                    "documento_id": row[0],
                    "documento_tipo": row[1],
                    "origem": row[2],
                    "titulo": row[3],
                    "conteudo_resumo": row[4],
                    "metadata": json.loads(row[5]) if row[5] else {},
                    "similarity": round(float(row[6]), 4),
                })

            return {
                "query": request.texto[:200],
                "total_encontrados": len(similares),
                "threshold": request.threshold,
                "resultados": similares,
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na busca: {str(e)}")


@router.post("/check-duplicate")
async def check_duplicate(request: DuplicateCheckRequest):
    """
    Pipeline completo de verificação de duplicatas:
    1. Gera embedding do texto (multilingual-e5-large)
    2. Busca top-5 similares no pgvector (cosine > threshold)
    3. Aplica cross-encoder mmarco para ranking fino
    4. Retorna lista ranqueada com flag is_duplicate
    """
    try:
        model = get_embedding_model()
        texto_busca = f"query: {request.titulo}. {request.conteudo[:2000]}"
        embedding = model.encode(texto_busca).tolist()

        # Step 1: pgvector coarse search
        async with engine.begin() as conn:
            result = await conn.execute(
                text("""
                    SELECT
                        "IdDocumento", "TipoDocumento", "Origem", "Titulo", "ResumoConteudo", "Metadata",
                        1 - ("Embedding" <=> :emb::vector) AS similarity
                    FROM "DocEmbeddings"
                    WHERE 1 - ("Embedding" <=> :emb::vector) > :threshold
                    ORDER BY "Embedding" <=> :emb::vector
                    LIMIT 5
                """),
                {"emb": str(embedding), "threshold": request.threshold}
            )
            candidates = result.fetchall()

        if not candidates:
            return {
                "has_duplicates": False,
                "total_candidatos": 0,
                "resultados": [],
                "recomendacao": "NENHUM_SIMILAR_ENCONTRADO",
            }

        # Step 2: Cross-encoder re-ranking (mmarco multilingual)
        cross_encoder = get_cross_encoder()
        pairs = []
        for row in candidates:
            candidato_texto = f"{row[3]}. {row[4] or ''}"
            pairs.append([texto_busca, candidato_texto])

        cross_scores = cross_encoder.predict(pairs)

        # Normalize scores to 0-1
        try:
            from scipy.special import expit
            normalized_scores = expit(cross_scores).tolist() if hasattr(cross_scores, '__iter__') else [expit(cross_scores)]
        except ImportError:
            normalized_scores = [1 / (1 + np.exp(-s)) for s in (cross_scores if hasattr(cross_scores, '__iter__') else [cross_scores])]

        # Step 3: Build ranked results
        resultados = []
        for i, row in enumerate(candidates):
            ce_score = normalized_scores[i] if i < len(normalized_scores) else 0.0
            resultados.append({
                "documento_id": row[0],
                "documento_tipo": row[1],
                "origem": row[2],
                "titulo": row[3],
                "conteudo_resumo": row[4],
                "similarity_score": round(float(row[6]), 4),
                "cross_encoder_score": round(ce_score, 4),
                "is_duplicate": ce_score > 0.7,
                "metadata": json.loads(row[5]) if row[5] else {},
            })

        resultados.sort(key=lambda x: x["cross_encoder_score"], reverse=True)
        has_duplicates = any(r["is_duplicate"] for r in resultados)

        recomendacao = "NENHUM_SIMILAR_ENCONTRADO"
        if has_duplicates:
            origens_dup = [r["origem"] for r in resultados if r["is_duplicate"]]
            recomendacao = f"DUPLICATA_DETECTADA — Origens: {', '.join(origens_dup)}"
        elif resultados:
            recomendacao = "POSSIVEIS_RELACIONADOS"

        return {
            "has_duplicates": has_duplicates,
            "total_candidatos": len(resultados),
            "recomendacao": recomendacao,
            "resultados": resultados,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na verificação: {str(e)}")


@router.get("/stats")
async def semantic_stats():
    """Estatísticas do motor semântico"""
    try:
        async with engine.begin() as conn:
            total = await conn.execute(text('SELECT COUNT(*) FROM "DocEmbeddings"'))
            total_count = total.scalar()

            by_type = await conn.execute(
                text('SELECT "TipoDocumento", COUNT(*) FROM "DocEmbeddings" GROUP BY "TipoDocumento"')
            )
            tipos = {row[0]: row[1] for row in by_type.fetchall()}

            by_origin = await conn.execute(
                text('SELECT "Origem", COUNT(*) FROM "DocEmbeddings" GROUP BY "Origem" ORDER BY COUNT(*) DESC LIMIT 10')
            )
            origens = {row[0]: row[1] for row in by_origin.fetchall()}

            return {
                "total_documentos_indexados": total_count,
                "por_tipo": tipos,
                "top_origens": origens,
                "modelo_embedding": f"{EMBEDDING_MODEL} ({EMBEDDING_DIMS} dims)",
                "cross_encoder": CROSS_ENCODER_MODEL,
            }
    except Exception as e:
        return {
            "total_documentos_indexados": 0,
            "error": str(e),
            "nota": "Tabela DocEmbeddings ainda não criada.",
        }
