import requests
import json
import time
from reportlab.pdfgen import canvas
import os

API_URL = "http://localhost:8000"

def create_pdf(filename="test_system.pdf"):
    print(f"Creating PDF: {filename}")
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "Documento de Teste de Sistema - ITFACT-LEGIS")
    c.drawString(100, 730, "Este documento deve ser processado pelo Graphiti e Neo4j.")
    c.drawString(100, 710, "Validando infraestrutura 100% local com Ollama.")
    c.save()
    return filename

def test_kb_upload(filename):
    print("\n--- Testing Knowledge Base Upload (Graphiti/Neo4j) ---")
    url = f"{API_URL}/ai/knowledge-base/upload"
    files = {'file': open(filename, 'rb')}
    
    start_time = time.time()
    try:
        with requests.post(url, files=files, stream=True) as r:
            print(f"Status Code: {r.status_code}")
            if r.status_code != 200:
                print(f"Error: {r.text}")
                return

            print("Streaming response:")
            for line in r.iter_lines():
                if line:
                    decoded = line.decode('utf-8')
                    try:
                        data = json.loads(decoded)
                        print(f"  [{data.get('type')}] {data.get('message')}")
                        if data.get('type') == 'error':
                             print("  !!! ERROR DETECTED IN STREAM !!!")
                    except:
                        print(f"  {decoded}")
    except Exception as e:
        print(f"Request Failed: {e}")
    
    print(f"KB Upload Duration: {time.time() - start_time:.2f}s")

def test_text_analysis():
    print("\n--- Testing Text Analysis (Editor/Llama 3.1) ---")
    url = f"{API_URL}/editor/analyze"
    payload = {
        "text": "O vereador requereu envio de offício ao Prefeito, solicitando tapamento de buracos."
    }
    
    start_time = time.time()
    try:
        r = requests.post(url, json=payload)
        print(f"Status Code: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print("Response:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
        else:
            print(f"Error: {r.text}")
    except Exception as e:
         print(f"Request Failed: {e}")
    
    print(f"Analysis Duration: {time.time() - start_time:.2f}s")

if __name__ == "__main__":
    pdf_file = create_pdf()
    try:
        test_kb_upload(pdf_file)
        test_text_analysis()
    finally:
        if os.path.exists(pdf_file):
            os.remove(pdf_file)
            print(f"\nCleaned up {pdf_file}")
