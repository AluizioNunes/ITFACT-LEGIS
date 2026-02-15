import requests
import json
import time

API_URL = "http://localhost:8000"

def test_add_provider():
    print("\n--- Testing Add Provider ---")
    provider_id = "test_provider_v1"
    payload = {
        "id": provider_id,
        "name": "Test Provider",
        "base_url": "https://api.test.com/v1",
        "api_key": "sk-test-123",
        "model": "test-model-7b",
        "packages": ["requests"] 
    }
    
    try:
        res = requests.post(f"{API_URL}/system/config/ai/provider", json=payload)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.json()}")
        if res.status_code == 200:
            print("SUCCESS: Provider added.")
        else:
            print("FAILURE: Could not add provider.")
    except Exception as e:
        print(f"ERROR: {e}")

def test_get_config():
    print("\n--- Testing Get Config ---")
    try:
        res = requests.get(f"{API_URL}/system/config/ai")
        data = res.json()
        print(f"Provider: {data.get('provider')}")
        custom = data.get("custom_providers", {})
        print(f"Custom Providers: {list(custom.keys())}")
        
        if "test_provider_v1" in custom:
            print("SUCCESS: Test provider found in config.")
        else:
            print("FAILURE: Test provider NOT found in config.")
            
    except Exception as e:
        print(f"ERROR: {e}")

def test_package_check():
    print("\n--- Testing Package Check ---")
    payload = {"packages": ["requests", "non_existent_package_xyz_123"]}
    try:
        res = requests.post(f"{API_URL}/system/packages/check", json=payload)
        data = res.json()
        print(f"Response: {data}")
        if data["status"] == "missing_packages" and "non_existent_package_xyz_123" in data["missing"]:
             print("SUCCESS: Correctly identified missing package.")
        else:
             print("FAILURE: Did not identify missing package as expected.")
    except Exception as e:
        print(f"ERROR: {e}")

def main():
    # Ensure server is running before running this
    test_add_provider()
    test_get_config()
    test_package_check()
    
    # Clean up
    print("\n--- Cleaning Up ---")
    try:
        requests.delete(f"{API_URL}/system/config/ai/provider/test_provider_v1")
        print("Cleanup done.")
    except:
        pass

if __name__ == "__main__":
    main()
