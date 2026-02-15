import requests

API_URL = "http://127.0.0.1:8000"

def check_config():
    try:
        res = requests.get(f"{API_URL}/system/config/ai")
        print(f"Config: {res.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_config()
