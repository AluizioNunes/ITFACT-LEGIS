import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd()))

async def test_startup():
    print("Pre-importing...")
    from main import app
    from core.BancoDados import startup_connections
    from routers.SemanticoIA import setup_pgvector
    
    print("Running startup_connections...")
    try:
        await startup_connections()
        print("startup_connections DONE")
    except Exception as e:
        print(f"startup_connections FAILED: {e}")
        return

    print("Running setup_pgvector...")
    try:
        await setup_pgvector()
        print("setup_pgvector DONE")
    except Exception as e:
        print(f"setup_pgvector FAILED: {e}")
        return
    
    print("STARTUP SUCCESSFUL")

if __name__ == "__main__":
    # Setup env
    os.environ['DATABASE_URL'] = 'postgresql+asyncpg://LEGIS:LEGIS@localhost:5432/LEGIS'
    os.environ['REDIS_URL'] = 'redis://localhost:6379'
    os.environ['MONGODB_URL'] = 'mongodb://LEGIS:LEGIS@localhost:27017'
    os.environ['NEO4J_URI'] = 'bolt://localhost:7687'
    os.environ['NEO4J_USER'] = 'neo4j'
    os.environ['NEO4J_PASSWORD'] = 'LEGIS2026'
    os.environ['GOOGLE_AI_API_KEY'] = 'AIzaSyCMaoMfDAvB8PhZCKYdkXxw9o5qIqYQYjc'
    os.environ['AI_PROVIDER'] = 'google'
    
    asyncio.run(test_startup())
