from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
import json
import re
import fitz  # PyMuPDF
from datetime import datetime
from typing import List, Dict, Any
from core import BancoDados
import logging

logger = logging.getLogger("uvicorn")

router = APIRouter(prefix="/ai/knowledge-base", tags=["Knowledge Base (RAG)"])

# Directories
BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "BaseConhecimento")
METADATA_FILE = os.path.join(BASE_DIR, "metadata.json")
os.makedirs(BASE_DIR, exist_ok=True)

def load_metadata() -> Dict[str, Any]:
    if os.path.exists(METADATA_FILE):
        try:
            with open(METADATA_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_metadata(metadata: Dict[str, Any]):
    with open(METADATA_FILE, "w") as f:
        json.dump(metadata, f, indent=4)

@router.get("/files", response_model=List[Dict[str, Any]])
async def list_files():
    """List all indexed files with version info."""
    metadata = load_metadata()
    files = []
    for filename, info in metadata.items():
        path = os.path.join(BASE_DIR, info["current_file"])
        if os.path.exists(path):
            stats = os.stat(path)
            files.append({
                "base_name": filename,
                "name": info["current_file"],
                "version": info["version"],
                "size": stats.st_size,
                "created_at": info["created_at"],
                "episode_id": info.get("episode_id")
            })
    return files

from fastapi.responses import StreamingResponse
import asyncio

async def index_document_stream(file: UploadFile, base_name: str, doc_info: Dict[str, Any]):
    """Generator to yield indexing progress events."""
    new_version = doc_info["version"] + 1
    new_filename = f"{base_name}_v{new_version}.pdf"
    file_path = os.path.join(BASE_DIR, new_filename)
    
    try:
        yield json.dumps({"type": "log", "message": f"Iniciando processamento: {file.filename}"}) + "\n"
        yield json.dumps({"type": "progress", "value": 10}) + "\n"
        
        # 2. Save new version to disk
        yield json.dumps({"type": "log", "message": "Salvando arquivo no servidor..."}) + "\n"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        yield json.dumps({"type": "progress", "value": 30}) + "\n"
        
        # 3. Extract text
        yield json.dumps({"type": "log", "message": "Extraindo texto do PDF..."}) + "\n"
        doc = fitz.open(file_path)
        full_text = ""
        total_pages = len(doc)
        for i, page in enumerate(doc):
            full_text += page.get_text()
            if i % 5 == 0 or i == total_pages - 1:
                yield json.dumps({"type": "log", "message": f"Lendo página {i+1}/{total_pages}..."}) + "\n"
                # Progress from 30 to 60
                progress = 30 + (i + 1) / total_pages * 30
                yield json.dumps({"type": "progress", "value": int(progress)}) + "\n"
        doc.close()

        # 4. Manage Graphiti (Latest Only)
        episode_id = None
        if BancoDados.graphiti_client:
            yield json.dumps({"type": "log", "message": "Enviando conteúdo para o Grafo de Conhecimento (IA)..."}) + "\n"
            yield json.dumps({"type": "progress", "value": 70}) + "\n"
            
            try:
                # Add 60s timeout to prevent hang
                episode = await asyncio.wait_for(
                    BancoDados.graphiti_client.add_episode(
                        name=f"{base_name} (v{new_version})",
                        episode_body=full_text[:50000],
                        source_description=f"Base de Conhecimento - Versão {new_version}",
                        reference_time=datetime.utcnow()
                    ),
                    timeout=60.0
                )
                logger.info(f"Graphiti Episode Created: {episode}")
                episode_id = str(episode.episode_id) if hasattr(episode, 'episode_id') else "created"
                yield json.dumps({"type": "log", "message": "Indexação concluída no Graphiti/Neo4j."}) + "\n"
                yield json.dumps({"type": "progress", "value": 90}) + "\n"
            except asyncio.TimeoutError:
                logger.error("Graphiti indexing timed out (60s)")
                yield json.dumps({"type": "log", "message": "Erro: Tempo limite de indexação (60s) excedido."}) + "\n"
            except Exception as e:
                import traceback
                error_trace = traceback.format_exc()
                logger.error(f"Erro no Graphiti: {str(e)}\n{error_trace}")
                yield json.dumps({"type": "log", "message": f"Erro Neo4j/Graphiti: {str(e)}"}) + "\n"
                # Non-blocking error for now
                yield json.dumps({"type": "log", "message": "Prosseguindo sem indexação vetorial backend..."}) + "\n"

        # 5. Update Metadata
        doc_info["version"] = new_version
        doc_info["current_file"] = new_filename
        doc_info["created_at"] = datetime.utcnow().isoformat()
        doc_info["episode_id"] = episode_id
        doc_info["history"].append({
            "version": new_version,
            "filename": new_filename,
            "episode_id": episode_id,
            "timestamp": doc_info["created_at"]
        })
        
        metadata = load_metadata()
        metadata[base_name] = doc_info
        save_metadata(metadata)
        
        yield json.dumps({"type": "progress", "value": 100}) + "\n"
        yield json.dumps({
            "type": "done", 
            "base_name": base_name,
            "version": new_version,
            "filename": new_filename,
            "status": "success"
        }) + "\n"

    except Exception as e:
        logger.error(f"Erro no upload versionado: {str(e)}")
        if os.path.exists(file_path):
            os.remove(file_path)
        yield json.dumps({"type": "error", "message": str(e)}) + "\n"

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a PDF with automatic versioning and Graphiti indexing (Streaming)."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Somente arquivos PDF são permitidos.")

    base_name = os.path.splitext(file.filename)[0]
    base_name = re.sub(r"_v\d+$", "", base_name)
    
    metadata = load_metadata()
    doc_info = metadata.get(base_name, {"version": 0, "history": []})
    
    return StreamingResponse(
        index_document_stream(file, base_name, doc_info),
        media_type="application/x-ndjson"
    )

@router.delete("/files/{base_name}")
async def delete_document(base_name: str):
    """Delete all versions of a document identity."""
    metadata = load_metadata()
    if base_name not in metadata:
        raise HTTPException(status_code=404, detail="Documento não encontrado.")
    
    try:
        doc_info = metadata[base_name]
        # Remove all physical files in history
        for entry in doc_info["history"]:
            path = os.path.join(BASE_DIR, entry["filename"])
            if os.path.exists(path):
                os.remove(path)
        
        # Remove from metadata
        del metadata[base_name]
        save_metadata(metadata)
        
        return {"status": "deleted", "base_name": base_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/stats")
async def get_kb_stats():
    """Get global stats for the knowledge base."""
    metadata = load_metadata()
    total_files = len(metadata)
    total_size = 0
    episodes_count = 0
    
    for info in metadata.values():
        path = os.path.join(BASE_DIR, info["current_file"])
        if os.path.exists(path):
            total_size += os.stat(path).st_size
        if info.get("episode_id"):
            episodes_count += 1
            
    return {
        "total_documents": total_files,
        "total_size_bytes": total_size,
        "indexed_episodes": episodes_count,
        "storage_path": BASE_DIR
    }
