"""
Tests for the semantic deduplication router.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, AsyncMock, MagicMock
import numpy as np

# Mock database before import
with patch("core.BancoDados.startup_connections", new_callable=AsyncMock):
    with patch("routers.SemanticoIA.setup_pgvector", new_callable=AsyncMock):
        import sys, os
        sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
        from main import app


@pytest.mark.asyncio
async def test_semantic_stats_returns_data():
    """GET /semantic/stats should return at least total count"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/semantic/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_documentos_indexados" in data


@pytest.mark.asyncio
async def test_check_duplicate_missing_fields():
    """POST /semantic/check-duplicate without body → 422"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/semantic/check-duplicate", json={})
    assert response.status_code == 422  # validation error


@pytest.mark.asyncio
async def test_semantic_index_missing_fields():
    """POST /semantic/index without body → 422"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/semantic/index", json={})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_semantic_search_missing_fields():
    """POST /semantic/search without body → 422"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/semantic/search", json={})
    assert response.status_code == 422
