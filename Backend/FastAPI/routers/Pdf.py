"""
PDF processing endpoints.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
import fitz  # PyMuPDF

router = APIRouter(prefix="/pdf", tags=["PDF Processing"])


@router.post("/extract")
async def extract_pdf_text(file: UploadFile = File(...)):
    """Extract text from PDF using PyMuPDF"""
    try:
        contents = await file.read()
        pdf_document = fitz.open(stream=contents, filetype="pdf")

        text_content = []
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            text = page.get_text()
            text_content.append({"page": page_num + 1, "text": text})

        pdf_document.close()

        return {
            "filename": file.filename,
            "pages": len(text_content),
            "content": text_content,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
