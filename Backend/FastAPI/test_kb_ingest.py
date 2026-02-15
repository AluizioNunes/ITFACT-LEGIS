import requests
import json
import os
import time

API_URL = "http://127.0.0.1:8000"
TEST_FILE = "test_document.pdf"

def create_test_pdf():
    """Create a dummy PDF for testing if not exists."""
    if not os.path.exists(TEST_FILE):
        try:
            import fitz
            doc = fitz.open()
            page = doc.new_page()
            page.insert_text((50, 50), "This is a test document for ITFACT-LEGIS Knowledge Base.\nIt contains sample legislative text for indexing.\nArt. 1º Est fica estabelecido o teste de ingestão.")
            doc.save(TEST_FILE)
            doc.close()
            print(f"Created dummy PDF: {TEST_FILE}")
        except ImportError:
            print("PyMuPDF not installed, cannot create dummy PDF. Please provide 'test_document.pdf'.")
            return False
    return True

def test_kb_upload():
    print("\n--- Testing KB Upload & Indexing ---")
    
    if not create_test_pdf():
        return

    files = {'file': open(TEST_FILE, 'rb')}
    try:
        print(f"Uploading {TEST_FILE} to {API_URL}/ai/knowledge-base/upload...")
        with requests.post(f"{API_URL}/ai/knowledge-base/upload", files=files, stream=True) as res:
            if res.status_code != 200:
                print(f"FAILURE: Upload failed with status {res.status_code}")
                print(res.text)
                return

            print("Stream started. Reading events...")
            for line in res.iter_lines():
                if line:
                    try:
                        data = json.loads(line.decode('utf-8'))
                        msg_type = data.get("type")
                        
                        if msg_type == "log":
                            print(f"[LOG] {data.get('message')}")
                        elif msg_type == "progress":
                            print(f"[PROGRESS] {data.get('value')}%")
                        elif msg_type == "error":
                            print(f"[ERROR] {data.get('message')}")
                        elif msg_type == "done":
                            print(f"[SUCCESS] Document indexed! Version: {data.get('version')}")
                            return True
                            
                    except json.JSONDecodeError:
                        print(f"Received raw line: {line}")
                        
    except Exception as e:
        print(f"EXCEPTION: {e}")
        return False

def test_list_files():
    print("\n--- Testing KB File List ---")
    try:
        res = requests.get(f"{API_URL}/ai/knowledge-base/files")
        if res.status_code == 200:
            files = res.json()
            print(f"Found {len(files)} files in Knowledge Base.")
            for f in files:
                print(f" - {f['base_name']} (v{f['version']}) | Episode: {f.get('episode_id')}")
        else:
            print(f"FAILURE: Could not list files. Status {res.status_code}")
            
    except Exception as e:
        print(f"EXCEPTION: {e}")

def main():
    if test_kb_upload():
        time.sleep(2)
        test_list_files()
        
    # Cleanup
    # try:
    #     os.remove(TEST_FILE)
    # except: pass

if __name__ == "__main__":
    main()
