import os
import sys
import asyncio
import httpx
import json

# Add parent dir to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.AIConfig import ai_config

async def test_direct_embedding():
    api_key = ai_config.get_active_key()
    base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
    url = f"{base_url}embeddings"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "input": "Test embedding string",
        "model": "models/gemini-embedding-001"
    }
    
    print(f"INFO: Testing embedding request to {url}")
    print(f"INFO: Model: {payload['model']}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            print(f"STATUS CODE: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                # print(data)
                print("SUCCESS: Got embedding response.")
                if "data" in data and len(data["data"]) > 0:
                    print(f"Embedding length: {len(data['data'][0]['embedding'])}")
            else:
                print(f"ERROR BODY: {response.text}")
        except Exception as e:
            print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_direct_embedding())
