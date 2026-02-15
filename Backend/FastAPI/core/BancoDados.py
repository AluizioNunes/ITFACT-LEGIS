"""
Database connections — PostgreSQL, Redis, MongoDB, Neo4j, MinIO, Graphiti.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import redis.asyncio as redis
from motor.motor_asyncio import AsyncIOMotorClient
from neo4j import AsyncGraphDatabase
from minio import Minio
import os
os.environ["GRAPHITI_DISABLE_TELEMETRY"] = "true"
os.environ["DO_NOT_TRACK"] = "1"
os.environ["ANONYMIZED_TELEMETRY"] = "False"
from graphiti_core import Graphiti

from core.Configuracao import (
    DATABASE_URL, REDIS_URL, MONGODB_URL,
    NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD,
    MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY,
    MINIO_BUCKET,
)
from core.ClientAI import ClientAI

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
    """Re-initialize Graphiti client using ClientAI factory."""
    global graphiti_client
    
    print(f"RECONNECT: Reconnecting Graphiti via ClientAI...")
    
    try:
        # ClientAI handles all configuration reading from AIConfig/Env
        import asyncio
        async def _connect():
            global graphiti_client
            llm_client = ClientAI.get_llm_client()
            embedder = ClientAI.get_embedding_client()

            graphiti_client = Graphiti(
                NEO4J_URI,
                NEO4J_USER,
                NEO4J_PASSWORD,
                llm_client=llm_client,
                embedder=embedder
            )
        
        await asyncio.wait_for(_connect(), timeout=10.0)
        print("DONE: Graphiti Re-initialized (ClientAI)")
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

async def get_all_stats():
    """Collect statistics from all configured services."""
    stats = {}
    
    # 1. PostgreSQL
    try:
        from sqlalchemy import text
        async with async_session() as session:
            # Count databases
            db_res = await session.execute(text("SELECT count(*) FROM pg_database WHERE datistemplate = false"))
            db_count = db_res.scalar()
            # Count tables in current schema
            table_res = await session.execute(text("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'"))
            table_count = table_res.scalar()
            stats["postgresql"] = {"status": "online", "databases": db_count, "tables": table_count}
    except Exception as e:
        stats["postgresql"] = {"status": "error", "message": str(e)}

    # 2. Redis
    try:
        if redis_client:
            info = await redis_client.info()
            stats["redis"] = {
                "status": "online",
                "version": info.get("redis_version"),
                "memory_used": info.get("used_memory_human"),
                "keys": await redis_client.dbsize()
            }
        else:
            stats["redis"] = {"status": "offline"}
    except Exception as e:
        stats["redis"] = {"status": "error", "message": str(e)}

    # 3. MongoDB
    try:
        if mongo_client:
            dbs = await mongo_client.list_database_names()
            stats["mongodb"] = {"status": "online", "databases": len(dbs), "names": dbs[:5]}
        else:
            stats["mongodb"] = {"status": "offline"}
    except Exception as e:
        stats["mongodb"] = {"status": "error", "message": str(e)}

    # 4. Neo4j
    try:
        if neo4j_driver:
            async with neo4j_driver.session() as session:
                node_res = await session.run("MATCH (n) RETURN count(n) as count")
                node_count = (await node_res.single())["count"]
                rel_res = await session.run("MATCH ()-[r]->() RETURN count(r) as count")
                rel_count = (await rel_res.single())["count"]
                stats["neo4j"] = {"status": "online", "nodes": node_count, "relationships": rel_count}
        else:
            stats["neo4j"] = {"status": "offline"}
    except Exception as e:
        stats["neo4j"] = {"status": "error", "message": str(e)}

    # 5. MinIO
    try:
        buckets = minio_client.list_buckets()
        stats["minio"] = {"status": "online", "buckets": len(buckets), "names": [b.name for b in buckets]}
    except Exception as e:
        stats["minio"] = {"status": "error", "message": str(e)}

    # 6. Graphiti
    try:
        if graphiti_client:
            # Graphiti has its own method for stats or we query neo4j
            async with neo4j_driver.session() as session:
                epis_res = await session.run("MATCH (n:Episode) RETURN count(n) as count")
                epis_count = (await epis_res.single())["count"]
                ent_res = await session.run("MATCH (n:Entity) RETURN count(n) as count")
                ent_count = (await ent_res.single())["count"]
                stats["graphiti"] = {"status": "online", "episodes": epis_count, "entities": ent_count}
        else:
            stats["graphiti"] = {"status": "offline"}
    except Exception as e:
        stats["graphiti"] = {"status": "error", "message": str(e)}

    return stats
