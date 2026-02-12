"""
Graphiti Knowledge Graph endpoints.
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime
from core import BancoDados

router = APIRouter(prefix="/ai/graphiti", tags=["Graphiti Knowledge Graph"])


@router.post("/index")
async def index_document_graphiti(content: str, group_id: Optional[str] = "cmm_legislativo"):
    """Index content into Graphiti Knowledge Graph"""
    if not BancoDados.graphiti_client:
        raise HTTPException(status_code=503, detail="Graphiti not initialized")
    try:
        episode = await BancoDados.graphiti_client.add_episode(
            name=f"legis_episode_{group_id}",
            episode_body=content,
            source_description="ITFACT LEGIS FastAPI",
            reference_time=datetime.utcnow(),
            group_id=group_id,
        )
        return {"status": "success", "episode_id": str(episode.episode_id) if hasattr(episode, 'episode_id') else "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search")
async def search_graphiti(query: str, group_id: Optional[str] = None):
    """Search the Knowledge Graph using Graphiti"""
    if not BancoDados.graphiti_client:
        raise HTTPException(status_code=503, detail="Graphiti not initialized")
    try:
        results = await BancoDados.graphiti_client.search(query, group_ids=[group_id] if group_id else None)
        serialized = []
        for r in results:
            serialized.append(str(r) if not hasattr(r, '__dict__') else r.__dict__)
        return {"query": query, "total": len(serialized), "results": serialized}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/deduplicacao/index")
async def graphiti_index_for_dedup(
    documento_id: str,
    titulo: str,
    conteudo: str,
    origem: str,
    tipo: str = "MINUTA",
):
    """
    #12 — Integra Graphiti com deduplicação.
    Ao indexar um documento, também cria um episode no Knowledge Graph
    para correlação semântica entre entidades legislativas.
    """
    if not BancoDados.graphiti_client:
        raise HTTPException(status_code=503, detail="Graphiti not initialized")
    try:
        content = f"[{tipo}] [{origem}] {titulo}. {conteudo[:2000]}"
        episode = await BancoDados.graphiti_client.add_episode(
            name=f"dedup_{documento_id}",
            episode_body=content,
            source_description=f"Deduplicacao {tipo} via FastAPI",
            reference_time=datetime.utcnow(),
            group_id=f"dedup_{tipo.lower()}",
        )
        return {
            "status": "indexed_graphiti",
            "documento_id": documento_id,
            "episode_id": str(episode.episode_id) if hasattr(episode, 'episode_id') else "created",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
