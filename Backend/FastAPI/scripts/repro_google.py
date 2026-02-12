import sys
import os
import asyncio
import traceback

# Add parent dir to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.GoogleEmbedder import GoogleEmbedder
from core.AIConfig import ai_config

async def test_repro():
    print("INFO: Testing GoogleEmbedder in isolation...")
    
    try:
        active_key = ai_config.get_active_key()
        # Mock config object
        config = type('Config', (), {'api_key': active_key, 'model': 'models/gemini-embedding-001'})()
        
        embedder = GoogleEmbedder(config=config)
        
        print(f"INFO: Embedder initialized with model: {embedder.model}")
        
        # Test create
        input_text = "Hello world from repro script"
        print(f"INFO: Calling create with '{input_text}'...")
        
        response = await embedder.create(input_text)
        
        print("SUCCESS: Got response.")
        print(f"Response model: {response.model}")
        print(f"Embeddings count: {len(response.data)}")
        print(f"Embedding length: {len(response.data[0].embedding)}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_repro())
