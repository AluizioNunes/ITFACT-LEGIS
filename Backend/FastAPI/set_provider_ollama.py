import requests

API_URL = "http://127.0.0.1:8000"

def set_ollama():
    payload = {
        "provider": "ollama",
        "model": "llama3.1",
        "keys": {}
    }
    try:
        res = requests.post(f"{API_URL}/system/config/ai", json=payload)
        print(f"Set Provider: {res.status_code}")
        print(res.json())
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    set_ollama()
