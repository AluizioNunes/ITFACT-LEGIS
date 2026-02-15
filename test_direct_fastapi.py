import requests
import json

url = "http://localhost:8000/chat/query"
payload = {
    "message": "o que é LOMAN?",
    "context_path": "/dashboard"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
