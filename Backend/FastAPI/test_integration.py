import httpx
import time
import asyncio
import sys
import traceback

# Using 127.0.0.1 explicitly for intra-container loopback
BASE_URL = "http://127.0.0.1:8000"

async def test_integration():
    async with httpx.AsyncClient(timeout=600.0) as client:
        print("1. Checking System Config...")
        try:
            resp = await client.get(f"{BASE_URL}/system/config/ai")
            resp.raise_for_status()
            config = resp.json()
            print(f"   Current Config: Provider={config.get('provider')}, Model={config.get('model')}")
        except Exception as e:
            print(f"   FAILED Step 1: {type(e).__name__} - {e}")
            return

        print("\n2. Testing Chatbot (Llama 4 Maverick)...")
        try:
            payload = {"message": "Olá, quem é você?", "context_path": "/dashboard/"}
            print("   Sending request to /chat/query...")
            resp = await client.post(f"{BASE_URL}/chat/query", json=payload)
            print(f"   Response Status: {resp.status_code}")
            if resp.status_code == 200:
                print(f"   Success! Response: {resp.json().get('response', '')}")
            else:
                print(f"   FAILED Step 2: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"   FAILED Step 2 Exception: {type(e).__name__} - {e}")
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_integration())
