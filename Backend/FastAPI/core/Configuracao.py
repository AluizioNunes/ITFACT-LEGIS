"""
Core configuration — environment variables and constants.
"""
import os

# Database connections
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://LEGIS:LEGIS@postgres:5432/LEGIS")
REDIS_URL = os.getenv("REDIS_URL", "redis://:LEGIS@redis:6379")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://LEGIS:LEGIS@mongodb:27017")
# If running locally (not in docker), use localhost for Neo4j
if os.getenv("PYTHON_ENV") == "development" and not os.path.exists("/.dockerenv"):
    NEO4J_URI = os.getenv("NEO4J_URI", "neo4j://localhost:7687")
else:
    NEO4J_URI = os.getenv("NEO4J_URI", "neo4j://neo4j:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "LEGIS")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "LEGIS")
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://LEGIS:LEGIS@rabbitmq:5672/")
# AI Provider Configuration
# AI Provider Configuration
AI_PROVIDER = "ollama"
AI_MODEL = "llama3.1"
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama:11434")

# MinIO
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin123")
MINIO_BUCKET = "itfact-legis"

# Active Directory
AD_HOST = os.getenv("AD_HOST", "")
AD_PORT = os.getenv("AD_PORT", "636")
AD_DOMAIN = os.getenv("AD_DOMAIN", "")
AD_BASE_DN = os.getenv("AD_BASE_DN", "")
AD_SERVICE_USER = os.getenv("AD_SERVICE_USER", "")
AD_SERVICE_PASSWORD = os.getenv("AD_SERVICE_PASSWORD", "")
AD_ADMIN_USER = os.getenv("AD_ADMIN_USER", "")
AD_ADMIN_PASSWORD = os.getenv("AD_ADMIN_PASSWORD", "")
AD_USE_SSL = os.getenv("AD_USE_SSL", "true").lower() == "true"

# LDAP
LDAP_URI = os.getenv("LDAP_URI", "")
LDAP_BIND_DN = os.getenv("LDAP_BIND_DN", "")
LDAP_BIND_PASSWORD = os.getenv("LDAP_BIND_PASSWORD", "")
LDAP_SEARCH_BASE = os.getenv("LDAP_SEARCH_BASE", "")
LDAP_SEARCH_FILTER = os.getenv("LDAP_SEARCH_FILTER", "(uid=%s)")
LDAP_GROUP_BASE = os.getenv("LDAP_GROUP_BASE", "")

# Monitoring
PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://prometheus:9090")
GRAFANA_URL = os.getenv("GRAFANA_URL", "http://grafana:3000")

# Embedding models (multilingual for pt-BR)
EMBEDDING_MODEL = "intfloat/multilingual-e5-large"
EMBEDDING_DIMS = 1024
CROSS_ENCODER_MODEL = "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1"
