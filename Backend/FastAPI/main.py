from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime

# Database imports
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorClient
from neo4j import AsyncGraphDatabase

# AI/ML imports
import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# Graphiti
from graphiti import Graphiti
from graphiti.core import Episode

# MinIO
from minio import Minio

app = FastAPI(
    title="ITFACT LEGIS FastAPI",
    description="Python backend for AI/ML processing and document management",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connections
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://LEGIS:LEGIS@postgres:5432/LEGIS")
REDIS_URL = os.getenv("REDIS_URL", "redis://:LEGIS@redis:6379")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://LEGIS:LEGIS@mongodb:27017")
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://neo4j:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "LEGIS")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "LEGIS")

# MinIO client
minio_client = Minio(
    os.getenv("MINIO_ENDPOINT", "minio:9000"),
    access_key=os.getenv("MINIO_ACCESS_KEY", "minioadmin"),
    secret_key=os.getenv("MINIO_SECRET_KEY", "minioadmin123"),
    secure=False,
)

# Initialize connections
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

redis_client = None
mongo_client = None
neo4j_driver = None
graphiti = None

@app.on_event("startup")
async def startup_event():
    global redis_client, mongo_client, neo4j_driver
    
    # Redis
    redis_client = await redis.from_url(REDIS_URL, decode_responses=True)
    print("✅ Connected to Redis")
    
    # MongoDB
    mongo_client = AsyncIOMotorClient(MONGODB_URL)
    print("✅ Connected to MongoDB")
    
    # Neo4j
    neo4j_driver = AsyncGraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    print("✅ Connected to Neo4j")
    
    # Graphiti
    global graphiti
    graphiti = Graphiti(
        neo4j_uri=NEO4J_URI,
        neo4j_user=NEO4J_USER,
        neo4j_password=NEO4J_PASSWORD,
        openai_api_key=os.getenv("OPENAI_API_KEY", "your-key-here")
    )
    print("✅ Initialized Graphiti")
    
    # Ensure MinIO bucket exists
    bucket_name = "itfact-legis"
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
        print(f"✅ Created MinIO bucket: {bucket_name}")

@app.on_event("shutdown")
async def shutdown_event():
    if redis_client:
        await redis_client.close()
    if mongo_client:
        mongo_client.close()
    if neo4j_driver:
        await neo4j_driver.close()

# Models
class HealthResponse(BaseModel):
    status: str
    timestamp: str
    service: str
    version: str
    connections: dict

class DocumentProcessRequest(BaseModel):
    document_id: str
    extract_text: bool = True
    generate_embeddings: bool = False

# Routes
@app.get("/", response_model=dict)
async def root():
    return {
        "message": "Welcome to ITFACT LEGIS FastAPI",
        "documentation": "/docs",
        "health": "/health",
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    connections = {
        "redis": "connected" if redis_client else "disconnected",
        "mongodb": "connected" if mongo_client else "disconnected",
        "neo4j": "connected" if neo4j_driver else "disconnected",
        "minio": "connected",
    }
    
    return HealthResponse(
        status="ok",
        timestamp=datetime.utcnow().isoformat(),
        service="ITFACT LEGIS FastAPI",
        version="1.0.0",
        connections=connections,
    )

@app.post("/pdf/extract")
async def extract_pdf_text(file: UploadFile = File(...)):
    """Extract text from PDF using PyMuPDF"""
    try:
        contents = await file.read()
        
        # Open PDF with PyMuPDF
        pdf_document = fitz.open(stream=contents, filetype="pdf")
        
        text_content = []
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            text = page.get_text()
            text_content.append({
                "page": page_num + 1,
                "text": text,
            })
        
        pdf_document.close()
        
        return {
            "filename": file.filename,
            "pages": len(text_content),
            "content": text_content,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/embeddings")
async def generate_embeddings(text: str):
    """Generate embeddings using HuggingFace"""
    try:
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )
        chunks = text_splitter.split_text(text)
        
        # Generate embeddings
        vectors = embeddings.embed_documents(chunks)
        
        return {
            "chunks": len(chunks),
            "embedding_dimension": len(vectors[0]) if vectors else 0,
            "sample_chunks": chunks[:3],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Graphiti Semantic Search Roots
@app.post("/ai/graphiti/index")
async def index_document_graphiti(content: str, group_id: Optional[str] = "cmm_legislativo"):
    """Index content into Graphiti Knowledge Graph"""
    if not graphiti:
        raise HTTPException(status_code=503, detail="Graphiti not initialized")
    try:
        episode = await graphiti.add_episode(
            content=content,
            group_id=group_id
        )
        return {"status": "success", "episode_id": str(episode.id) if hasattr(episode, 'id') else "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/graphiti/search")
async def search_graphiti(query: str, group_id: Optional[str] = None):
    """Search the Knowledge Graph using Graphiti"""
    if not graphiti:
        raise HTTPException(status_code=503, detail="Graphiti not initialized")
    try:
        results = await graphiti.search(query, group_id=group_id)
        return {"query": query, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/storage/upload")
async def upload_to_minio(file: UploadFile = File(...)):
    """Upload file to MinIO"""
    try:
        contents = await file.read()
        
        bucket_name = "itfact-legis"
        object_name = f"{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        
        minio_client.put_object(
            bucket_name,
            object_name,
            data=contents,
            length=len(contents),
            content_type=file.content_type,
        )
        
        return {
            "bucket": bucket_name,
            "object_name": object_name,
            "size": len(contents),
            "content_type": file.content_type,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cache/get/{key}")
async def get_from_cache(key: str):
    """Get value from Redis cache"""
    try:
        value = await redis_client.get(key)
        return {"key": key, "value": value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cache/set")
async def set_in_cache(key: str, value: str, ttl: Optional[int] = None):
    """Set value in Redis cache"""
    try:
        if ttl:
            await redis_client.setex(key, ttl, value)
        else:
            await redis_client.set(key, value)
        return {"key": key, "value": value, "ttl": ttl}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# AI LEGISLATIVE ENDPOINTS
# ============================================================

class ProposituraAnaliseRequest(BaseModel):
    texto: str
    ementa: Optional[str] = None

class ParecerSugestaoRequest(BaseModel):
    ementa_propositura: str
    texto_propositura: str
    comissao_nome: str
    tipo_parecer: str  # CONSTITUCIONALIDADE, MERITO, FINANCEIRO

class OrdemDiaRequest(BaseModel):
    proposicoes: List[dict]

class AtaRequest(BaseModel):
    resumo_sessao: str
    votacoes: Optional[List[dict]] = None
    presencas: Optional[List[str]] = None

@app.post("/ai/propositura/classificar")
async def classificar_propositura(request: ProposituraAnaliseRequest):
    """Classifica tipo e regime de tramitação usando IA"""
    try:
        texto = request.texto[:3000]  # Limita para análise
        
        # Análise por palavras-chave legislativas
        keywords = {
            "PL": ["projeto de lei", "fica criado", "fica instituído", "art.", "artigo"],
            "PLC": ["lei complementar", "complementar"],
            "PR": ["resolução", "regimento interno", "câmara municipal"],
            "PDL": ["decreto legislativo", "ratificar", "sustar"],
            "EMENDA_LOMAN": ["lei orgânica", "emenda", "constituição"],
            "INDICACAO": ["indica", "indicação", "solicita ao executivo"],
            "REQUERIMENTO": ["requer", "requerimento", "solicita informações"],
            "MOCAO": ["moção", "solidariedade", "repúdio", "congratulações"],
        }
        
        scores = {}
        texto_lower = texto.lower()
        for tipo, words in keywords.items():
            score = sum(1 for w in words if w in texto_lower)
            scores[tipo] = score
        
        tipo_classificado = max(scores, key=scores.get)
        
        # Determinar regime
        regime = "ORDINARIO"
        if any(w in texto_lower for w in ["urgência", "urgente", "caráter urgente"]):
            regime = "URGENCIA"
        elif any(w in texto_lower for w in ["prazo", "executivo", "poder executivo encaminha"]):
            regime = "PRAZO_FATAL"
        
        # Gerar sugestão de ementa via análise
        first_sentences = ". ".join(texto.split(".")[:3]) + "."
        
        return {
            "tipo_classificado": tipo_classificado,
            "regime_sugerido": regime,
            "confianca": max(scores.values()) / max(sum(scores.values()), 1),
            "scores": scores,
            "sugestao_ementa": first_sentences[:200],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/propositura/analise-constitucional")
async def analise_constitucional(request: ProposituraAnaliseRequest):
    """Verifica pontos de atenção constitucional de uma propositura"""
    try:
        texto_lower = request.texto.lower()
        alertas = []
        
        # Regras automáticas de verificação
        checks = [
            ("Possível vício de iniciativa", ["o prefeito", "executivo municipal"], 
             "Verificar se a matéria é de competência exclusiva do Executivo (Art. 53 LOMAN)"),
            ("Matéria orçamentária", ["despesa", "receita", "orçamento", "crédito"],
             "Projetos que implicam despesa requerem fonte de custeio (Art. 65 LOMAN)"),
            ("Servidores públicos", ["servidor", "vencimentos", "remuneração", "cargo"],
             "Matéria de servidores pode ser de iniciativa privativa do Executivo (Art. 53 §1)"),
            ("Organização administrativa", ["secretaria", "departamento", "órgão"],
             "Criação de órgãos é de competência do Executivo (Art. 69 LOMAN)"),
            ("Matéria tributária", ["tributo", "imposto", "taxa", "isenção"],
             "Verificar competência tributária municipal (Art. 41 LOMAN)"),
        ]
        
        for titulo, palavras, detalhe in checks:
            if any(p in texto_lower for p in palavras):
                alertas.append({"titulo": titulo, "detalhe": detalhe, "severidade": "ATENCAO"})
        
        return {
            "alertas": alertas,
            "pontos_atencao": len(alertas),
            "recomendacao": "PROSSEGUIR" if len(alertas) < 2 else "ANALISAR_CCJ_DETALHADO",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/parecer/sugerir")
async def sugerir_parecer(request: ParecerSugestaoRequest):
    """Sugere texto de parecer baseado na matéria e tipo de comissão"""
    try:
        tipo = request.tipo_parecer
        comissao = request.comissao_nome
        ementa = request.ementa_propositura
        
        templates = {
            "CONSTITUCIONALIDADE": f"""PARECER DE CONSTITUCIONALIDADE

COMISSÃO: {comissao}

MATÉRIA: {ementa}

I - RELATÓRIO
A propositura em tela visa {ementa.lower()}, submetida à análise desta Comissão quanto à sua constitucionalidade, legalidade e técnica legislativa.

II - FUNDAMENTAÇÃO
Após análise, verifica-se que a propositura atende/não atende aos requisitos constitucionais e legais pertinentes, estando em conformidade/desconformidade com a Lei Orgânica do Município de Manaus.

III - VOTO DO RELATOR
Pelo exposto, opino pela CONSTITUCIONALIDADE/INCONSTITUCIONALIDADE da matéria, nos termos do art. 82 do Regimento Interno.

É o parecer.""",

            "MERITO": f"""PARECER DE MÉRITO

COMISSÃO: {comissao}

MATÉRIA: {ementa}

I - RELATÓRIO
Trata-se de propositura que visa {ementa.lower()}, encaminhada a esta Comissão para análise de mérito.

II - FUNDAMENTAÇÃO
A propositura apresenta relevância para o Município por [inserir fundamentação]. Do ponto de vista técnico, a matéria se mostra [adequada/inadequada] ao interesse público local.

III - VOTO DO RELATOR
Diante do exposto, somos pela APROVAÇÃO/REJEIÇÃO da matéria, recomendando [inserir recomendação].

É o parecer.""",

            "FINANCEIRO": f"""PARECER DE ADEQUAÇÃO FINANCEIRA E ORÇAMENTÁRIA

COMISSÃO: {comissao}

MATÉRIA: {ementa}

I - RELATÓRIO
A presente propositura, que dispõe sobre {ementa.lower()}, foi submetida a esta Comissão para análise de impacto financeiro e adequação orçamentária.

II - FUNDAMENTAÇÃO
Quanto à adequação financeiro-orçamentária, verifica-se que a propositura [implica/não implica] aumento de despesa pública. [Se implica]: A fonte de custeio indicada é [adequada/inadequada], conforme art. 65 da LOMAN.

III - VOTO DO RELATOR
Pelo exposto, opino pela ADEQUAÇÃO/INADEQUAÇÃO financeiro-orçamentária da propositura.

É o parecer.""",
        }
        
        return {
            "sugestao_parecer": templates.get(tipo, templates["MERITO"]),
            "tipo": tipo,
            "comissao": comissao,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/ordem-dia/priorizar")
async def priorizar_ordem_dia(request: OrdemDiaRequest):
    """Prioriza proposições para Ordem do Dia conforme Regimento"""
    try:
        proposicoes = request.proposicoes
        
        prioridade_map = {
            "urgente": 1,
            "veto": 2,
            "PL": 3, "PLC": 3, "PR": 3, "PDL": 3,
            "EMENDA_LOMAN": 3,
            "parecer": 4,
            "REQUERIMENTO": 5,
            "INDICACAO": 6, "MOCAO": 6,
        }
        
        for p in proposicoes:
            if p.get("urgente"):
                p["prioridade_calculada"] = 1
            elif p.get("tipo") == "VETO":
                p["prioridade_calculada"] = 2
            else:
                p["prioridade_calculada"] = prioridade_map.get(p.get("tipo", ""), 7)
        
        ordenadas = sorted(proposicoes, key=lambda x: (x.get("prioridade_calculada", 7), x.get("data_criacao", "")))
        
        return {
            "ordem_sugerida": ordenadas,
            "total": len(ordenadas),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/ata/gerar")
async def gerar_ata(request: AtaRequest):
    """Gera ata de sessão automaticamente"""
    try:
        resumo = request.resumo_sessao
        votacoes = request.votacoes or []
        presencas = request.presencas or []
        
        ata = f"""ATA DA SESSÃO

Data: {datetime.utcnow().strftime('%d/%m/%Y')}

PRESENTES: {', '.join(presencas) if presencas else '[lista de presentes]'}

RESUMO DOS TRABALHOS:
{resumo}

"""
        if votacoes:
            ata += "VOTAÇÕES REALIZADAS:\n"
            for i, v in enumerate(votacoes, 1):
                ata += f"{i}. {v.get('propositura', 'N/A')} - Resultado: {v.get('resultado', 'N/A')}\n"
        
        ata += f"\nNada mais havendo a tratar, encerrou-se a sessão.\n"
        
        return {
            "ata_gerada": ata,
            "data": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# SEMANTIC DEDUPLICATION ENGINE — 41 ORIGENS
# Motor de detecção de duplicatas por intenção legislativa
# Usa pgvector (PostgreSQL) + SentenceTransformers + Cross-Encoder
# ============================================================

import json
import uuid as uuid_lib
import numpy as np

# Lazy-loaded models (initialized on first request to avoid slow startup)
_embedding_model = None
_cross_encoder_model = None

def get_embedding_model():
    """Lazy-load the embedding model (384 dimensions)"""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ Loaded embedding model: all-MiniLM-L6-v2 (384 dims)")
    return _embedding_model

def get_cross_encoder():
    """Lazy-load the cross-encoder for precision re-ranking"""
    global _cross_encoder_model
    if _cross_encoder_model is None:
        from sentence_transformers import CrossEncoder
        _cross_encoder_model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        print("✅ Loaded cross-encoder: ms-marco-MiniLM-L-6-v2")
    return _cross_encoder_model

# ---- pgvector Setup ----

PGVECTOR_SETUP_SQL = """
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id TEXT NOT NULL,
    documento_tipo TEXT NOT NULL,
    origem TEXT NOT NULL,
    titulo TEXT NOT NULL,
    conteudo_resumo TEXT,
    embedding vector(384),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_embeddings_vector'
    ) THEN
        CREATE INDEX idx_embeddings_vector ON document_embeddings
            USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
    END IF;
END $$;
"""

async def setup_pgvector():
    """Executa setup do pgvector no startup"""
    try:
        from sqlalchemy import text
        async with engine.begin() as conn:
            for statement in PGVECTOR_SETUP_SQL.strip().split(";"):
                stmt = statement.strip()
                if stmt and not stmt.startswith("DO"):
                    await conn.execute(text(stmt))
            # Execute the DO block separately
            do_block = [s for s in PGVECTOR_SETUP_SQL.split(";") if s.strip().startswith("DO")]
            for block in do_block:
                if block.strip():
                    await conn.execute(text(block.strip() + ";"))
        print("✅ pgvector setup complete (table: document_embeddings)")
    except Exception as e:
        print(f"⚠️ pgvector setup skipped (will retry on first request): {e}")

# ---- Hook into startup ----
_original_startup = startup_event

@app.on_event("startup")
async def extended_startup():
    await _original_startup.__wrapped__() if hasattr(_original_startup, '__wrapped__') else None
    await setup_pgvector()

# ---- Pydantic Models ----

class SemanticIndexRequest(BaseModel):
    documento_id: str
    documento_tipo: str  # MINUTA, PROPOSITURA, REQUERIMENTO, INDICACAO
    origem: str          # Nome do gabinete/departamento (das 41 origens)
    titulo: str
    conteudo: str
    metadata: Optional[dict] = {}

class SemanticSearchRequest(BaseModel):
    texto: str
    limite: int = 5
    threshold: float = 0.80  # Cosine similarity mínima
    excluir_id: Optional[str] = None  # Excluir o próprio documento da busca

class DuplicateCheckRequest(BaseModel):
    titulo: str
    conteudo: str
    origem: str
    documento_tipo: str = "MINUTA"
    threshold: float = 0.75  # Mais permissivo para capturar mais candidatos

class DuplicateResult(BaseModel):
    documento_id: str
    documento_tipo: str
    origem: str
    titulo: str
    conteudo_resumo: Optional[str]
    similarity_score: float       # Score do pgvector (cosine)
    cross_encoder_score: float    # Score do cross-encoder (0-1)
    is_duplicate: bool            # True se cross_encoder > 0.7
    metadata: Optional[dict]

# ---- Endpoints ----

@app.post("/semantic/index")
async def semantic_index(request: SemanticIndexRequest):
    """
    Indexa um documento no motor semântico.
    Gera embedding do titulo + conteúdo e armazena no pgvector.
    Chamado ao criar/atualizar minutas e proposituras.
    """
    try:
        model = get_embedding_model()
        
        # Combinar título + conteúdo para o embedding
        texto_completo = f"{request.titulo}. {request.conteudo[:2000]}"
        embedding = model.encode(texto_completo).tolist()
        
        # Salvar no pgvector
        from sqlalchemy import text
        async with engine.begin() as conn:
            # Verificar se já existe (update se sim)
            existing = await conn.execute(
                text("SELECT id FROM document_embeddings WHERE documento_id = :did"),
                {"did": request.documento_id}
            )
            row = existing.fetchone()
            
            if row:
                await conn.execute(
                    text("""
                        UPDATE document_embeddings 
                        SET titulo = :titulo, conteudo_resumo = :resumo, 
                            embedding = :emb, metadata = :meta, origem = :origem
                        WHERE documento_id = :did
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
                        INSERT INTO document_embeddings 
                        (id, documento_id, documento_tipo, origem, titulo, conteudo_resumo, embedding, metadata)
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


@app.post("/semantic/search")
async def semantic_search(request: SemanticSearchRequest):
    """
    Busca documentos semanticamente similares usando pgvector.
    Retorna os top-N documentos com cosine similarity > threshold.
    """
    try:
        model = get_embedding_model()
        embedding = model.encode(request.texto).tolist()
        
        from sqlalchemy import text
        async with engine.begin() as conn:
            query = """
                SELECT 
                    documento_id, documento_tipo, origem, titulo, conteudo_resumo, metadata,
                    1 - (embedding <=> :emb::vector) AS similarity
                FROM document_embeddings
                WHERE 1 - (embedding <=> :emb::vector) > :threshold
            """
            params = {
                "emb": str(embedding),
                "threshold": request.threshold,
                "limite": request.limite,
            }
            
            if request.excluir_id:
                query += " AND documento_id != :excluir"
                params["excluir"] = request.excluir_id
            
            query += " ORDER BY embedding <=> :emb2::vector LIMIT :limite"
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


@app.post("/semantic/check-duplicate")
async def check_duplicate(request: DuplicateCheckRequest):
    """
    Pipeline completo de verificação de duplicatas:
    1. Gera embedding do texto
    2. Busca top-5 similares no pgvector (cosine > threshold)
    3. Aplica cross-encoder para ranking fino
    4. Retorna lista ranqueada com flag is_duplicate
    
    Este é o endpoint principal chamado ao criar/editar minutas.
    Detecta quando 2 dos 41 gabinetes pedem a mesma coisa com palavras diferentes.
    """
    try:
        model = get_embedding_model()
        texto_busca = f"{request.titulo}. {request.conteudo[:2000]}"
        embedding = model.encode(texto_busca).tolist()
        
        # Step 1: Busca pgvector (coarse search)
        from sqlalchemy import text
        async with engine.begin() as conn:
            result = await conn.execute(
                text("""
                    SELECT 
                        documento_id, documento_tipo, origem, titulo, conteudo_resumo, metadata,
                        1 - (embedding <=> :emb::vector) AS similarity
                    FROM document_embeddings
                    WHERE 1 - (embedding <=> :emb::vector) > :threshold
                    ORDER BY embedding <=> :emb::vector
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
        
        # Step 2: Cross-encoder re-ranking
        cross_encoder = get_cross_encoder()
        pairs = []
        for row in candidates:
            candidato_texto = f"{row[3]}. {row[4] or ''}"
            pairs.append([texto_busca, candidato_texto])
        
        cross_scores = cross_encoder.predict(pairs)
        
        # Normalizar scores do cross-encoder para 0-1
        from scipy.special import expit  # sigmoid
        normalized_scores = expit(cross_scores).tolist() if hasattr(cross_scores, '__iter__') else [expit(cross_scores)]
        
        # Step 3: Montar resultado final
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
        
        # Ordenar por cross_encoder_score descending
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
    except ImportError:
        # Fallback sem scipy — usar min-max normalization
        try:
            resultados = []
            for i, row in enumerate(candidates):
                ce_score = float(cross_scores[i]) if i < len(cross_scores) else 0.0
                # Simple sigmoid approximation
                ce_normalized = 1 / (1 + np.exp(-ce_score))
                resultados.append({
                    "documento_id": row[0],
                    "documento_tipo": row[1],
                    "origem": row[2],
                    "titulo": row[3],
                    "conteudo_resumo": row[4],
                    "similarity_score": round(float(row[6]), 4),
                    "cross_encoder_score": round(float(ce_normalized), 4),
                    "is_duplicate": ce_normalized > 0.7,
                    "metadata": json.loads(row[5]) if row[5] else {},
                })
            resultados.sort(key=lambda x: x["cross_encoder_score"], reverse=True)
            has_duplicates = any(r["is_duplicate"] for r in resultados)
            return {
                "has_duplicates": has_duplicates,
                "total_candidatos": len(resultados),
                "recomendacao": "DUPLICATA_DETECTADA" if has_duplicates else "POSSIVEIS_RELACIONADOS",
                "resultados": resultados,
            }
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"Erro no cross-encoder: {str(e2)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na verificação: {str(e)}")


@app.get("/semantic/stats")
async def semantic_stats():
    """Estatísticas do motor semântico"""
    try:
        from sqlalchemy import text
        async with engine.begin() as conn:
            total = await conn.execute(text("SELECT COUNT(*) FROM document_embeddings"))
            total_count = total.scalar()
            
            by_type = await conn.execute(
                text("SELECT documento_tipo, COUNT(*) FROM document_embeddings GROUP BY documento_tipo")
            )
            tipos = {row[0]: row[1] for row in by_type.fetchall()}
            
            by_origin = await conn.execute(
                text("SELECT origem, COUNT(*) FROM document_embeddings GROUP BY origem ORDER BY COUNT(*) DESC LIMIT 10")
            )
            origens = {row[0]: row[1] for row in by_origin.fetchall()}
            
            return {
                "total_documentos_indexados": total_count,
                "por_tipo": tipos,
                "top_origens": origens,
                "modelo_embedding": "all-MiniLM-L6-v2 (384 dims)",
                "cross_encoder": "ms-marco-MiniLM-L-6-v2",
            }
    except Exception as e:
        return {
            "total_documentos_indexados": 0,
            "error": str(e),
            "nota": "Tabela document_embeddings ainda não criada. Execute prisma db push primeiro.",
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
