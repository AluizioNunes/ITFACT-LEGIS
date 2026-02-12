"""
Core configuration — environment variables and constants.
"""
import os

# Database connections
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://LEGIS:LEGIS@postgres:5432/LEGIS")
REDIS_URL = os.getenv("REDIS_URL", "redis://:LEGIS@redis:6379")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://LEGIS:LEGIS@mongodb:27017")
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://neo4j:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "LEGIS")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "LEGIS")
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://LEGIS:LEGIS@rabbitmq:5672/")
# AI Provider Configuration
AI_PROVIDER = os.getenv("AI_PROVIDER", "google")  # google | openai | anthropic | deepseek
AI_MODEL = os.getenv("AI_MODEL", "gemini-2.0-flash")
GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# MinIO
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin123")
MINIO_BUCKET = "itfact-legis"

# Embedding models (multilingual for pt-BR)
EMBEDDING_MODEL = "intfloat/multilingual-e5-large"
EMBEDDING_DIMS = 1024
CROSS_ENCODER_MODEL = "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1"
