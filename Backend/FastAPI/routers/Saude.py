"""
Health check and root endpoints.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from core import BancoDados

router = APIRouter(tags=["Health"])


@router.get("/")
async def root():
    return {"message": "ITFACT LEGIS FastAPI - Modular v2.0", "status": "running"}


@router.get("/health")
async def health_check():
    connections = {}
    try:
        if BancoDados.redis_client:
            await BancoDados.redis_client.ping()
            connections["redis"] = "connected"
        else:
            connections["redis"] = "disconnected"
    except Exception:
        connections["redis"] = "disconnected"

    try:
        if BancoDados.mongo_client:
            await BancoDados.mongo_client.admin.command("ping")
            connections["mongodb"] = "connected"
        else:
            connections["mongodb"] = "disconnected"
    except Exception:
        connections["mongodb"] = "disconnected"

    try:
        if BancoDados.neo4j_driver:
            connections["neo4j"] = "connected"
        else:
            connections["neo4j"] = "disconnected"
    except Exception:
        connections["neo4j"] = "disconnected"

    connections["minio"] = "connected" if BancoDados.minio_client else "disconnected"

    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ITFACT LEGIS FastAPI",
        "version": "2.0.0",
        "connections": connections,
    }
