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
from graphiti_core.embedder.openai import OpenAIEmbedder

async def test_ingest():
    print("INFO: Testing Graphiti V2 with Custom Embedder...")
    
    try:
        active_key = ai_config.get_active_key()
        
        # 1. LLM Client (Chat) - Gemini 2.0 Flash
        llm_config = LLMConfig(
            api_key=active_key,
            model=ai_config.model or "gemini-2.0-flash",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        llm_client = OpenAIClient(config=llm_config)
        
        # 2. Embedder Client - text-embedding-004
        # Google's OpenAI compatible endpoint for embeddings might be same base_url
        # but usage of 'text-embedding-004' model is key.
        embedder = OpenAIEmbedder(
            config=LLMConfig(
                api_key=active_key,
                model="text-embedding-004",
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )
        )
        
        print("INFO: Testing direct embedding call...", flush=True)
        try:
             # Look for embed method - standard interface usually bas 'embed' or 'aembed'
             # Since it's async context, maybe awaiting?
             # Let's check attributes first or just try calling it.
             # Inspect showed it takes config. 
             # Let's try to infer usage. standard is usually .embed(text)
             pass
        except:
             pass

        client = Graphiti(
            "bolt://localhost:7687",
            NEO4J_USER,
            NEO4J_PASSWORD,
            llm_client=llm_client,
            embedder=embedder
        )
        
        print("INFO: Client initialized with text-embedding-004. Attempting to add episode...", flush=True)
        
        await client.add_episode(
            name="Test Custom Embedder",
            episode_body="Testing if specifying text-embedding-004 fixes the 404 error.",
            source_description="Debug Script V2",
            reference_time=datetime.utcnow(),
            group_id="debug_group_v2"
        )
        print("SUCCESS: Added test episode with custom embedder.", flush=True)
        
        await client.close()
        
    except Exception as e:
        print(f"ERROR: {e}", flush=True)
        traceback.print_exc()

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_ingest())
