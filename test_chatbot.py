import requests
import json

url = "http://localhost:8000/chat/query"
payload = {
    "message": "Qual o prazo para que o Vereador tome posse e o que é considerado motivo justo para prorrogação?",
    "history": []
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except:
        print("Raw Response:", response.text)
except Exception as e:
    print(f"Error: {e}")
