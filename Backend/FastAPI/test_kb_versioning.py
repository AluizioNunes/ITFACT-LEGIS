import httpx
import asyncio
import os

BASE_URL = "http://127.0.0.1:8000"

async def test_versioning():
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Clean up Metadata if exists for test
        # (This is manual, but let's just upload)
        
        # 2. Prepare dummy PDF
        pdf_path = "test_doc.pdf"
        with open(pdf_path, "wb") as f:
            f.write(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 70 700 Td (Versao 1 Mandato 4 anos) Tj ET\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF")

        # 3. First Upload
        print("Uploading v1...")
        with open(pdf_path, "rb") as f:
            files = {"file": ("test_doc.pdf", f, "application/pdf")}
            res = await client.post(f"{BASE_URL}/ai/knowledge-base/upload", files=files)
            print(f"V1 Response: {res.json()}")

        # 4. Second Upload
        print("\nUploading v2...")
        with open(pdf_path, "wb") as f:
            f.write(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 70 700 Td (Versao 2 Mandato 8 anos) Tj ET\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF")
        
        with open(pdf_path, "rb") as f:
            files = {"file": ("test_doc.pdf", f, "application/pdf")}
            res = await client.post(f"{BASE_URL}/ai/knowledge-base/upload", files=files)
            print(f"V2 Response: {res.json()}")

        # 5. List Files
        print("\nListing Files...")
        res = await client.get(f"{BASE_URL}/ai/knowledge-base/files")
        print(f"Files: {res.json()}")

        # 6. Cleanup
        os.remove(pdf_path)

if __name__ == "__main__":
    asyncio.run(test_versioning())
