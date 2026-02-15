from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import os
import shutil
import tempfile
import docx
import pypdf
import pypdf
from core.ClientAI import ClientAI
from core.Configuracao import AI_MODEL
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/editor", tags=["Editor"])

class AnalysisRequest(BaseModel):
    text: str

class CorrectionResponse(BaseModel):
    original: str
    corrected: str
    suggestions: List[str]

@router.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """Extrai texto de variados formatos de arquivo."""
    extension = file.filename.split(".")[-1].lower()
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        text = ""
        if extension == "pdf":
            reader = pypdf.PdfReader(tmp_path)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        elif extension in ["doc", "docx"]:
            doc = docx.Document(tmp_path)
            text = "\n".join([p.text for p in doc.paragraphs])
        elif extension in ["txt", "html", "json"]:
            with open(tmp_path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
        
        return {"text": text, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/analyze", response_model=CorrectionResponse)
async def analyze_text(request: AnalysisRequest):
    """Analisa o texto usando IA (Ollama) para gramática e formatação."""

    prompt = f"""
    Analise o seguinte texto de uma propositura legislativa (Minuta) em Português do Brasil.
    Verifique os seguintes itens:
    1. Erros ortográficos e de acentuação.
    2. Concordância verbal e nominal.
    3. Pontuação.
    4. Formatação e margens (sugira se houver inconsistências).
    5. Estrutura jurídica/legislativa básica.

    Retorne APENAS um JSON com o seguinte formato:
    {{
        "corrected": "O texto totalmente corrigido e formatado corretamente",
        "suggestions": ["Lista de sugestões específicas e explicações das correções feitas"]
    }}

    TEXTO PARA ANÁLISE:
    {request.text}
    """

    try:
        # Use ClientAI to get the configured chat client
        client = ClientAI.get_chat_client()
        
        response = await client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Please output valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content
        import json
        result = json.loads(result_text)
        
        return CorrectionResponse(
            original=request.text,
            corrected=result.get("corrected", request.text),
            suggestions=result.get("suggestions", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise da IA: {str(e)}")

@router.post("/export/pdf")
async def export_pdf(request: AnalysisRequest):
    """Gera um PDF a partir do texto fornecido."""
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.units import cm
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        doc = SimpleDocTemplate(
            tmp.name, 
            pagesize=A4,
            rightMargin=2*cm, leftMargin=3*cm,
            topMargin=3*cm, bottomMargin=2*cm
        )
        styles = getSampleStyleSheet()
        # Custom style for legal text
        legal_style = ParagraphStyle(
            'Legal',
            parent=styles['Normal'],
            fontSize=12,
            leading=14,
            alignment=4, # Justified
            firstLineIndent=2*cm,
            spaceAfter=12
        )
        
        story = []
        # Support for multiple lines
        lines = request.text.split('\n')
        for line in lines:
            if line.strip():
                story.append(Paragraph(line, legal_style))
                story.append(Spacer(1, 0.2*cm))
        
        doc.build(story)
        tmp_path = tmp.name

    return FileResponse(tmp_path, media_type="application/pdf", filename="propositura.pdf")
