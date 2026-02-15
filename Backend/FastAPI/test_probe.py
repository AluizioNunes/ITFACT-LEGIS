import requests
import time

API_URL = "http://localhost:8000"

def check_health():
    print(f"Checking health at {API_URL}/saude")
    try:
        res = requests.get(f"{API_URL}/saude", timeout=5)
        print(f"Health: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Health Error: {e}")

def check_kb_list():
    print(f"Checking KB List at {API_URL}/ai/knowledge-base/files")
    try:
        res = requests.get(f"{API_URL}/ai/knowledge-base/files", timeout=5)
        print(f"Files: {res.status_code}")
        print(res.json())
    except Exception as e:
        print(f"Files Error: {e}")


def check_health_ip():
    print(f"Checking health at http://127.0.0.1:8000/health")
    try:
        res = requests.get(f"http://127.0.0.1:8000/health", timeout=5)
        print(f"Health IP: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Health IP Error: {e}")

def check_nginx():
    print(f"Checking health via Nginx at http://localhost:80/saude") # Assuming Nginx proxies /saude
    try:
        res = requests.get(f"http://localhost:80/api/python/saude", timeout=5) # Typical nginx routing
        print(f"Health Nginx: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Health Nginx Error: {e}")

if __name__ == "__main__":
    check_health()
    check_health_ip()
    check_nginx()
