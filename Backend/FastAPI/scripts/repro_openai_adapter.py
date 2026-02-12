import sys
import os
import asyncio
import logging
from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig
# Add parent dir to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.AIConfig import ai_config

# Configure logging to see HTTP requests
logging.basicConfig(level=logging.DEBUG)
logging.getLogger("httpx").setLevel(logging.DEBUG)
logging.getLogger("openai").setLevel(logging.DEBUG)

async def test_adapter():
    print("INFO: Testing OpenAIEmbedder with Google Adapter and OpenAIEmbedderConfig...")
    
    active_key = ai_config.get_active_key()
    
    # Try the base_url we used
    base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
    model = "models/gemini-embedding-001"
    
    print(f"Config: BaseURL={base_url}, Model={model}")
    
    config = OpenAIEmbedderConfig(
        api_key=active_key,
        embedding_model=model,
        base_url=base_url
    )
    
    embedder = OpenAIEmbedder(config=config)
    
    try:
        # Test simple embed
        # OpenAIEmbedder.create returns list of list of floats?
        # Or an object? The signature in inspect was generic.
        # Let's try create
        res = await embedder.create(["Hello world"])
        print("SUCCESS: Got embedding")
        # Check structure
        # print(res) 
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_adapter())
