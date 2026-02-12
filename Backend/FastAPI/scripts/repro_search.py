import sys
import os
import asyncio
import traceback

# Add parent dir to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.Configuracao import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
from core.AIConfig import ai_config
from graphiti_core import Graphiti
from graphiti_core.llm_client import LLMConfig, OpenAIClient
from core.GoogleEmbedder import GoogleEmbedder

async def test_search():
    print("INFO: Testing Graphiti Search...")
    
    try:
        active_key = ai_config.get_active_key()
        
        llm_config = LLMConfig(
            api_key=active_key,
            model=ai_config.model or "gemini-2.0-flash",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        llm_client = OpenAIClient(config=llm_config)
        
        embedder_config = type('Config', (), {'api_key': active_key, 'model': 'models/gemini-embedding-001'})()
        embedder = GoogleEmbedder(config=embedder_config)
        
        client = Graphiti(
            NEO4J_URI,
            NEO4J_USER,
            NEO4J_PASSWORD,
            llm_client=None, # DISABLE LLM CLIENT TO ISOLATE ERROR
            embedder=embedder
        )
        
        print("INFO: Client initialized. Searching...")
        
        # Search for something (index might be empty but call should succeed)
        results = await client.search("test query", group_id="legislacao_base")
        
        print("SUCCESS: Search call completed.")
        print(f"Results: {len(results)}")
        
        await client.close()
        
    except Exception as e:
        print(f"ERROR: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_search())
