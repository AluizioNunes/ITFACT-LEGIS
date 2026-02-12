import sys
import os
import asyncio
import traceback
from datetime import datetime

# Add parent dir to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.Configuracao import (
    NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
)
from core.AIConfig import ai_config
from graphiti_core import Graphiti
from graphiti_core.llm_client import LLMConfig, OpenAIClient

async def test_ingest():
    print("INFO: Testing Graphiti Connection...")
    print(f"INFO: Provider={ai_config.provider} Model={ai_config.model}")
    
    try:
        active_key = ai_config.get_active_key()
        
        # Manually force API key to env for safety
        if ai_config.provider == "google":
            os.environ["GOOGLE_API_KEY"] = active_key
            
        llm_config = LLMConfig(
            api_key=active_key,
            model=ai_config.model or "gemini-2.0-flash",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/" if ai_config.provider == "google" else None
        )
        
        llm_client = OpenAIClient(config=llm_config)
        
        client = Graphiti(
            "bolt://localhost:7687",
            NEO4J_USER,
            NEO4J_PASSWORD,
            llm_client=llm_client
        )
        
        print("INFO: Client initialized. Attempting to add simple episode...")
        
        # Test add_episode
        await client.add_episode(
            name="Test Episode",
            episode_body="This is a test content from the debug script.",
            source_description="Debug Script",
            reference_time=datetime.utcnow(),
            group_id="debug_group"
        )
        print("SUCCESS: Added test episode.")
        
        # Test search
        print("INFO: Testing Search...")
        results = await client.search("test", group_ids=["debug_group"])
        print(f"SUCCESS: Search returned {len(results)} results.")
        
        await client.close()
        
    except Exception as e:
        print(f"ERROR: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_ingest())
