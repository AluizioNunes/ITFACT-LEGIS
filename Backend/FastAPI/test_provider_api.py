import requests
import json

API_URL = "http://localhost:8000/system/config/ai/provider"

def test_custom_provider():
    # 1. ADD
    payload = {
        "id": "test-dynamic",
        "name": "Dynamic Test AI",
        "base_url": "http://localhost:11434",
        "api_key": "optional-key",
        "model": "llama3.1",
        "packages": []
    }
    
    print(f"POST {API_URL}...")
    res = requests.post(API_URL, json=payload)
    if res.status_code == 200:
        print(f"SUCCESS: Provider added: {res.json()}")
    else:
        print(f"FAILED: {res.status_code} - {res.text}")
        return

    # 2. LIST (check if it appears in config)
    res = requests.get("http://localhost:8000/system/config/ai")
    config = res.json()
    if "test-dynamic" in config.get("custom_providers", {}):
        print("SUCCESS: Provider found in global config.")
    else:
        print("FAILED: Provider not found in custom_providers list.")

    # 3. DELETE
    print(f"DELETE {API_URL}/test-dynamic...")
    res = requests.delete(f"{API_URL}/test-dynamic")
    if res.status_code == 200:
        print(f"SUCCESS: Provider removed: {res.json()}")
    else:
        print(f"FAILED: {res.status_code} - {res.text}")

if __name__ == "__main__":
    test_custom_provider()
