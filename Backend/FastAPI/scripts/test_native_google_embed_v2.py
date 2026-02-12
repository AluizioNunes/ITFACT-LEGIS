import google.generativeai as genai
import os
import sys
import asyncio

# Add parent dir to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.AIConfig import ai_config

async def test_native():
    api_key = ai_config.get_active_key()
    genai.configure(api_key=api_key)
    
    print(f"GenAI Version: {genai.__version__}")
    
    print("Listing models...")
    embedding_model = None
    for m in genai.list_models():
        print(f"Found model: {m.name}")
        if 'embedContent' in m.supported_generation_methods:
            print(f"   -> Supports embedContent")
            if not embedding_model:
                embedding_model = m.name
    
    if not embedding_model:
        print("ERROR: No model with embedContent support found.")
        return

    print(f"INFO: Testing native Google embedding with {embedding_model}...")
    
    try:
        # Embedding content
        result = genai.embed_content(
            model=embedding_model,
            content="Hello world",
            task_type="retrieval_document",
            title="Embedding of single string"
        )
        print(f"SUCCESS: Got embedding from {embedding_model}.")
        # Google API returns dict with 'embedding' key which is a list
        print(f"Embedding length: {len(result['embedding'])}")
        
    except Exception as e:
        print(f"ERROR with {embedding_model}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_native())
