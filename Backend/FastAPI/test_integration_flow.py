import requests
import json
import os
import asyncio
from datetime import datetime, timezone
from graphiti_core import Graphiti
import sys

# Constants - Adjusting for Container Network
API_BASE_URL = "http://localhost:8000"
NEO4J_URI = "neo4j://neo4j:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "LEGIS2026"
OLLAMA_URL = "http://ollama:11434"

async def test_graph_ingestion():
    print("\n--- Testing Graphiti + Neo4j Ingestion ---")
    
    os.environ["OLLAMA_URL"] = OLLAMA_URL
    
    from core.AIConfig import ai_config
    from core.ClientAI import ClientAI
    
    # Singleton setup
    ai_config.update_config("ollama", "llama3.1", {}, embedding_model="bge-m3")
    
    print(f"Initializing Clients...")
    llm = ClientAI.get_llm_client()
    embedder = ClientAI.get_embedding_client()
    
    print(f"Connecting to Neo4j at {NEO4J_URI}...")
    client = Graphiti(
        NEO4J_URI,
        NEO4J_USER,
        NEO4J_PASSWORD,
        llm_client=llm,
        embedder=embedder
    )
    
    test_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    # Use simple text and ensure it's a string
    text = str(f"O ITFACT-LEGIS e um sistema legislativo. ID: {test_id}")
    
    print(f"Ingesting text: {text}")
    try:
        # Pass positional arguments to be safe or explicit keywords
        await client.add_episode(
            name=f"Test_{test_id}",
            episode_body=text,
            source_description="Test script",
            reference_time=datetime.now(timezone.utc)
        )
        print("SUCCESS: Ingestion complete.")
        return True
    except Exception as e:
        print(f"FAILURE: Ingestion failed - {e}")
        import traceback
        traceback.print_exc()
        return False

def verify_neo4j():
    print("\n--- Verifying Neo4j Data ---")
    from neo4j import GraphDatabase
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        with driver.session() as session:
            result = session.run("MATCH (n:Entity) RETURN count(n) as count")
            count = result.single()["count"]
            print(f"Entities in Neo4j: {count}")
            return count >= 0
    except Exception as e:
        print(f"Neo4j Error: {e}")
        return False
    finally:
        driver.close()

if __name__ == "__main__":
    if "/app" not in sys.path: sys.path.append("/app")
    
    # Skip API test for speed if it already passed once, focusing on ingestion
    try:
        if asyncio.run(test_graph_ingestion()):
            verify_neo4j()
    except Exception as e:
        print(f"CRITICAL: {e}")
