"""
Tests for the health router.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, AsyncMock

# Mock database before import
with patch("core.BancoDados.startup_connections", new_callable=AsyncMock):
    with patch("routers.SemanticoIA.setup_pgvector", new_callable=AsyncMock):
        import sys, os
        sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
        from main import app


@pytest.mark.asyncio
async def test_root_returns_welcome():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "ITFACT LEGIS" in data["message"]


@pytest.mark.asyncio
async def test_health_returns_ok():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "2.0.0"
    assert "connections" in data
