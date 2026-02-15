import asyncio
import os
from datetime import datetime
from graphiti_core import Graphiti
from core.ClientAI import ClientAI

# Mock DB connection details for direct test
NEO4J_URI = "neo4j://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "LEGIS2026"

async def test_simple_add():
    print("Initializing Graphiti...")
    
    # Setup ClientAI with Ollama
    llm = ClientAI.get_llm_client()
    embedder = ClientAI.get_embedding_client()
    
    client = Graphiti(
        NEO4J_URI,
        NEO4J_USER,
        NEO4J_PASSWORD,
        llm_client=llm,
        embedder=embedder
    )
    
    print("Adding simple episode...")
    try:
        # Very simple text to avoid complex extraction issues
        text = "O Brasil é um país da América do Sul. Sua capital é Brasília."
        
        await client.add_episode(
            name="Teste Simples",
            episode_body=text,
            source_description="Teste Unitário",
            reference_time=datetime.utcnow()
        )
        print("SUCCESS: Episode addeed.")
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    # Import inside main to ensure env vars are set before first use if possible, 
    # but here we update the singleton directly
    from core.AIConfig import ai_config
    ai_config.update_config(provider="ollama", model="llama3.1", keys={})
    
    os.environ["OLLAMA_URL"] = "http://localhost:11434"
    
    asyncio.run(test_simple_add())
