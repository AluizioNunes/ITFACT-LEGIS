"""
Database connections — PostgreSQL, Redis, MongoDB, Neo4j, MinIO, Graphiti.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorClient
from neo4j import AsyncGraphDatabase
from minio import Minio
from graphiti_core import Graphiti

from core.Configuracao import (
    DATABASE_URL, REDIS_URL, MONGODB_URL,
    NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD,
    MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY,
    MINIO_BUCKET, OPENAI_API_KEY,
)
from graphiti_core.llm_client import LLMConfig, OpenAIClient

# SQLAlchemy async engine
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# MinIO client (sync)
minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
)

# Global mutable connections
redis_client = None
mongo_client = None
neo4j_driver = None
graphiti_client = None


async def startup_connections():
    """Initialize all database connections on app startup."""
    global redis_client, mongo_client, neo4j_driver, graphiti_client

    redis_client = await redis.from_url(REDIS_URL, decode_responses=True)
    print("DONE: Connected to Redis")

    mongo_client = AsyncIOMotorClient(MONGODB_URL)
    print("DONE: Connected to MongoDB")

    neo4j_driver = AsyncGraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    print("DONE: Connected to Neo4j")

    # Graphiti initialization with dynamic config
    await reconnect_graphiti()

    try:
        if not minio_client.bucket_exists(MINIO_BUCKET):
            minio_client.make_bucket(MINIO_BUCKET)
        print("DONE: Created MinIO bucket:", MINIO_BUCKET)
    except Exception as e:
        print("INFO: MinIO bucket check failed (will retry later):", e)


async def reconnect_graphiti():
    """Re-initialize Graphiti client with current AI configuration."""
    global graphiti_client
    import os
    from core.AIConfig import ai_config
    
    print(f"RECONNECT: Reconnecting Graphiti with Provider={ai_config.provider} Model={ai_config.model}")
    
    try:
        active_key = ai_config.get_active_key()
        
        # Set environment variables as fallback for libs reading directly from env
        if ai_config.provider == "google":
            os.environ["GOOGLE_API_KEY"] = active_key
            os.environ["GOOGLE_AI_API_KEY"] = active_key
            # Some libs might still expect OPENAI_API_KEY even for custom endpoints
            os.environ["OPENAI_API_KEY"] = active_key
            os.environ["OPENAI_BASE_URL"] = "https://generativelanguage.googleapis.com/v1beta/openai/"
            
            llm_config = LLMConfig(
                api_key=active_key,
                model=ai_config.model or "gemini-2.0-flash",
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )
            llm_client = OpenAIClient(config=llm_config)
        else:
            os.environ["OPENAI_API_KEY"] = active_key
            if "OPENAI_BASE_URL" in os.environ:
                del os.environ["OPENAI_BASE_URL"]
                
            llm_config = LLMConfig(
                api_key=active_key,
                model=ai_config.model
            )
            llm_client = OpenAIClient(config=llm_config)

        graphiti_client = Graphiti(
            NEO4J_URI,
            NEO4J_USER,
            NEO4J_PASSWORD,
            llm_client=llm_client
        )
        print("DONE: Graphiti Re-initialized")
    except Exception as e:
        print(f"ERROR: Failed to initialize Graphiti: {e}")


async def shutdown_connections():
    """Close all database connections on app shutdown."""
    if redis_client:
        await redis_client.close()
    if mongo_client:
        mongo_client.close()
    if neo4j_driver:
        await neo4j_driver.close()
