"""
IntegracoesRouter.py - Gerenciamento de Integrações do Sistema.
Endpoints para consulta de configuração, status de serviços Docker e testes de conexão.
"""
import os
import socket
import asyncio
import time
from typing import Dict, List, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

from core import BancoDados
from core import Configuracao

router = APIRouter(prefix="/system/integracoes", tags=["Integrações"])

class ServiceStatusResponse(BaseModel):
    id: str
    label: str
    status: str  # "online" | "offline"
    latency: Optional[float] = None
    error: Optional[str] = None
    type: str  # "database" | "directory" | "monitoring" | "queue" | "proxy"

def check_tcp_port(host: str, port: int, timeout: float = 2.0) -> bool:
    """Verifica se uma porta TCP está aberta."""
    if not host:
        return False
    try:
        with socket.create_connection((host, int(port)), timeout=timeout):
            return True
    except (socket.timeout, ConnectionRefusedError, socket.gaierror, OSError):
        return False

async def check_http_status(url: str, timeout: float = 2.0) -> bool:
    """Verifica se uma URL HTTP responde com sucesso."""
    if not url:
        return False
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=timeout)
            return resp.status_code < 500
    except Exception:
        return False

@router.get("/config")
async def get_integracoes_config():
    """Retorna as configurações atuais dos serviços (com campos sensíveis mascarados)."""
    
    def mask(v):
        return (v[:4] + "..." + v[-4:] if v and len(v) > 8 else "****") if v else ""

    config = {
        "postgresql": {
            "host": Configuracao.DATABASE_URL.split("@")[-1].split(":")[0] if "@" in Configuracao.DATABASE_URL else "localhost",
            "database": Configuracao.DATABASE_URL.split("/")[-1],
            "user": Configuracao.DATABASE_URL.split("//")[-1].split(":")[0]
        },
        "active_directory": {
            "host": Configuracao.AD_HOST,
            "port": Configuracao.AD_PORT,
            "domain": Configuracao.AD_DOMAIN,
            "base_dn": Configuracao.AD_BASE_DN,
            "service_user": Configuracao.AD_SERVICE_USER,
            "admin_user": Configuracao.AD_ADMIN_USER,
            "use_ssl": str(Configuracao.AD_USE_SSL).lower()
        },
        "ldap": {
            "uri": Configuracao.LDAP_URI,
            "bind_dn": Configuracao.LDAP_BIND_DN,
            "search_base": Configuracao.LDAP_SEARCH_BASE,
            "search_filter": Configuracao.LDAP_SEARCH_FILTER,
            "group_base": Configuracao.LDAP_GROUP_BASE
        },
        "redis": {
            "host": Configuracao.REDIS_URL.split("@")[-1].split(":")[0] if "@" in Configuracao.REDIS_URL else "localhost",
            "port": Configuracao.REDIS_URL.split(":")[-1].split("/")[0] if ":" in Configuracao.REDIS_URL else "6379"
        },
        "mongodb": {
            "uri": Configuracao.MONGODB_URL.split("@")[-1] if "@" in Configuracao.MONGODB_URL else Configuracao.MONGODB_URL
        },
        "neo4j": {
            "uri": Configuracao.NEO4J_URI,
            "user": Configuracao.NEO4J_USER
        },
        "rabbitmq": {
            "url": Configuracao.RABBITMQ_URL.split("@")[-1] if "@" in Configuracao.RABBITMQ_URL else Configuracao.RABBITMQ_URL
        },
        "minio": {
            "endpoint": Configuracao.MINIO_ENDPOINT,
            "access_key": Configuracao.MINIO_ACCESS_KEY,
            "bucket": Configuracao.MINIO_BUCKET
        },
        "prometheus": {
            "url": Configuracao.PROMETHEUS_URL
        },
        "grafana": {
            "url": Configuracao.GRAFANA_URL
        }
    }
    return config

@router.get("/status", response_model=List[ServiceStatusResponse])
async def get_all_services_status():
    """Verifica o status de todos os serviços integrados."""
    results = []
    
    # 1. PostgreSQL (SQLAlchemy)
    try:
        start = time.time()
        # Ping via engine
        async with BancoDados.engine.connect() as conn:
            await conn.execute("SELECT 1")
        results.append(ServiceStatusResponse(id="postgresql", label="PostgreSQL", status="online", latency=round((time.time()-start)*1000, 2), type="database"))
    except Exception as e:
        results.append(ServiceStatusResponse(id="postgresql", label="PostgreSQL", status="offline", error=str(e), type="database"))

    # 2. Redis
    try:
        start = time.time()
        if BancoDados.redis_client:
            await BancoDados.redis_client.ping()
            results.append(ServiceStatusResponse(id="redis", label="Redis", status="online", latency=round((time.time()-start)*1000, 2), type="database"))
        else:
            results.append(ServiceStatusResponse(id="redis", label="Redis", status="offline", error="Client not initialized", type="database"))
    except Exception as e:
        results.append(ServiceStatusResponse(id="redis", label="Redis", status="offline", error=str(e), type="database"))

    # 3. MongoDB
    try:
        start = time.time()
        if BancoDados.mongo_client:
            await BancoDados.mongo_client.admin.command("ping")
            results.append(ServiceStatusResponse(id="mongodb", label="MongoDB", status="online", latency=round((time.time()-start)*1000, 2), type="database"))
        else:
            results.append(ServiceStatusResponse(id="mongodb", label="MongoDB", status="offline", error="Client not initialized", type="database"))
    except Exception as e:
        results.append(ServiceStatusResponse(id="mongodb", label="MongoDB", status="offline", error=str(e), type="database"))

    # 4. Neo4j
    try:
        start = time.time()
        if BancoDados.neo4j_driver:
            results.append(ServiceStatusResponse(id="neo4j", label="Neo4j", status="online", latency=round((time.time()-start)*1000, 2), type="database"))
        else:
            results.append(ServiceStatusResponse(id="neo4j", label="Neo4j", status="offline", error="Driver not initialized", type="database"))
    except Exception as e:
        results.append(ServiceStatusResponse(id="neo4j", label="Neo4j", status="offline", error=str(e), type="database"))

    # 5. RabbitMQ (TCP Ping)
    host = Configuracao.RABBITMQ_URL.split("@")[-1].split(":")[0] if "@" in Configuracao.RABBITMQ_URL else "rabbitmq"
    port = int(Configuracao.RABBITMQ_URL.split(":")[-1].split("/")[0]) if ":" in Configuracao.RABBITMQ_URL else 5672
    if check_tcp_port(host, port):
        results.append(ServiceStatusResponse(id="rabbitmq", label="RabbitMQ", status="online", type="queue"))
    else:
        results.append(ServiceStatusResponse(id="rabbitmq", label="RabbitMQ", status="offline", type="queue"))

    # 6. MinIO (TCP Ping or Header Check)
    m_host = Configuracao.MINIO_ENDPOINT.split(":")[0]
    m_port = int(Configuracao.MINIO_ENDPOINT.split(":")[-1])
    if check_tcp_port(m_host, m_port):
        results.append(ServiceStatusResponse(id="minio", label="MinIO (S3)", status="online", type="database"))
    else:
        results.append(ServiceStatusResponse(id="minio", label="MinIO (S3)", status="offline", type="database"))

    # 7. Active Directory (LDAPS TCP Check)
    if Configuracao.AD_HOST:
        if check_tcp_port(Configuracao.AD_HOST, int(Configuracao.AD_PORT)):
            results.append(ServiceStatusResponse(id="active_directory", label="Active Directory", status="online", type="directory"))
        else:
            results.append(ServiceStatusResponse(id="active_directory", label="Active Directory", status="offline", type="directory"))
    else:
        results.append(ServiceStatusResponse(id="active_directory", label="Active Directory", status="offline", error="Host not configured", type="directory"))

    # 8. LDAP (TCP Check)
    if Configuracao.LDAP_URI:
        l_host = Configuracao.LDAP_URI.split("//")[-1].split(":")[0]
        l_port = int(Configuracao.LDAP_URI.split(":")[-1]) if ":" in Configuracao.LDAP_URI else 389
        if check_tcp_port(l_host, l_port):
            results.append(ServiceStatusResponse(id="ldap", label="LDAP", status="online", type="directory"))
        else:
            results.append(ServiceStatusResponse(id="ldap", label="LDAP", status="offline", type="directory"))
    else:
        results.append(ServiceStatusResponse(id="ldap", label="LDAP", status="offline", error="URI not configured", type="directory"))

    # 9. Prometheus (HTTP Check)
    if await check_http_status(Configuracao.PROMETHEUS_URL):
        results.append(ServiceStatusResponse(id="prometheus", label="Prometheus", status="online", type="monitoring"))
    else:
        results.append(ServiceStatusResponse(id="prometheus", label="Prometheus", status="offline", type="monitoring"))

    # 10. Grafana (HTTP Check)
    if await check_http_status(Configuracao.GRAFANA_URL):
        results.append(ServiceStatusResponse(id="grafana", label="Grafana", status="online", type="monitoring"))
    else:
        results.append(ServiceStatusResponse(id="grafana", label="Grafana", status="offline", type="monitoring"))

    return results

@router.post("/test/{service_id}")
async def test_service_connection(service_id: str):
    """Executa um teste de conexão em tempo real para um serviço específico."""
    statuses = await get_all_services_status()
    target = next((s for s in statuses if s.id == service_id), None)
    if not target:
        raise HTTPException(status_code=404, detail=f"Serviço '{service_id}' não encontrado.")
    
    if target.status == "offline":
        return {"success": False, "error": target.error or "Serviço inacessível."}
    
    return {"success": True, "latency": target.latency}
