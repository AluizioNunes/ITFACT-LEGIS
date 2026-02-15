import sys
import os
import asyncio
from pathlib import Path
from pypdf import PdfReader
import time
import logging
import traceback
import json
from dotenv import load_dotenv

# Load env from root
load_dotenv(os.path.join(os.getcwd(), ".env"))

# Add parent dir to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    filename='ingest_internal.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
# Enable debug for httpx/openai
logging.getLogger("httpx").setLevel(logging.DEBUG)
logging.getLogger("openai").setLevel(logging.DEBUG)

from core.ClientAI import ClientAI

DOCS_DIR = Path("d:/PROJETOS/ITFACT-LEGIS/Docs")

async def get_graphiti_client():
    """Initialize Graphiti client using ClientAI factory."""
    
    # Load AI Config (defaults or env vars)
    print(f"INFO: Initializing Graphiti with ClientAI...")
    
    llm_client = ClientAI.get_llm_client()
    embedder = ClientAI.get_embedding_client()
    
    return Graphiti(
        "bolt://localhost:7687", # Use localhost for script running on host
        NEO4J_USER,
        NEO4J_PASSWORD,
        llm_client=llm_client,
        embedder=embedder
    )

def extract_text_from_pdf(pdf_path: Path) -> str:
    print(f"INFO: Extraction text from {pdf_path.name}...")
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

from datetime import datetime

async def ingest_docs():
    client = await get_graphiti_client()
    
    pdf_files = [
        "REGIMENTO-INTERNO-ATUALIZADO-ATE-RESOLUCAO_169_DE_19_02_2025.pdf",
        "LOMAN_Atualizada_ate_Emenda_120_19a_Leg.pdf",
        "Regulamento_Adm.pdf"
    ]
    
    for filename in pdf_files:
        path = DOCS_DIR / filename
        if not path.exists():
            print(f"WARN: File not found: {path} - Skipping")
            continue
            
        text = extract_text_from_pdf(path)
        
        print(f"INFO: Indexing {filename} into Graphiti...")
        try:
            # Chunk text into smaller pieces for embedding model limits
            # text-embedding-004/gemini-embedding-001 has input limit of 2048 tokens (~8000 chars).
            # We use 4000 chars to be safe.
            chunk_size = 4000
            total_len = len(text)
            chunks = [text[i:i + chunk_size] for i in range(0, total_len, chunk_size)]
            
            print(f"INFO: Document {filename} split into {len(chunks)} chunks.")
            
            for i, chunk in enumerate(chunks):
                chunk_name = f"Ingest {filename} Part {i+1}/{len(chunks)}"
                
                max_retries = 5
                retry_delay = 10 # Start with 10 seconds
                success = False
                
                for attempt in range(max_retries):
                    try:
                        await client.add_episode(
                            name=chunk_name,
                            episode_body=chunk,
                            source_description=f"File: {filename}, Chunk: {i+1}",
                            reference_time=datetime.utcnow(),
                            group_id="legislacao_base"
                        )
                        success = True
                        break # Success
                    except Exception as inner_e:
                        error_msg = str(inner_e)
                        if "429" in error_msg or "Rate limit" in error_msg or "404" in error_msg: 
                            # 404 might be transient or related to quota? No, 404 is usually permanent.
                            # But if I still get 404, maybe retry won't help. 
                            # However, previous log showed "Rate limit exceeded".
                            if attempt < max_retries - 1:
                                print(f"WARN: Chunk {i+1} failed (Attempt {attempt+1}): {error_msg}. Retrying in {retry_delay}s...", flush=True)
                                time.sleep(retry_delay)
                                retry_delay *= 2 # Exponential backoff
                                continue
                        
                        print(f"ERROR: Failed chunk {i+1}: {inner_e}", flush=True)
                        break 
                
                if success:
                    if i % 10 == 0:
                        print(f"INFO: Indexed chunk {i+1}/{len(chunks)}", flush=True)
                    # Proactive sleep after successful chunk
                    time.sleep(15) 
                else:
                    print(f"ERROR: Giving up on chunk {i+1}", flush=True)
                    # If a 429 error caused the failure, wait longer
                    if "429" in error_msg or "Rate limit" in error_msg:
                        print(f"WARN: Rate limit hit on chunk {i+1}. Waiting 60s...", flush=True)
                        time.sleep(60)
                    else:
                        # Default sleep for other errors
                        time.sleep(10)
            
            logging.info(f"SUCCESS: Indexed {filename} ({len(chunks)} chunks)")
            print(f"SUCCESS: Indexed {filename} ({len(chunks)} chunks)", flush=True)
        except Exception as e:
            logging.error(f"ERROR: Failed to index {filename}: {e}")
            logging.error(traceback.format_exc())
            print(f"ERROR: Failed to index {filename}: {e}", flush=True)

    await client.close()

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(ingest_docs())
