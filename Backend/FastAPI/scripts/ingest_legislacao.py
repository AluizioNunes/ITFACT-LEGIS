import sys
import os
import asyncio
from pathlib import Path
from pypdf import PdfReader
import time
import logging
import traceback
import json

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

from core.Configuracao import (
    NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
)
from core.AIConfig import ai_config
from graphiti_core import Graphiti
from graphiti_core.llm_client import LLMConfig, OpenAIClient
from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig

# Imports for Custom Client
from core.CustomOpenAIClient import CustomOpenAIClient

DOCS_DIR = Path("d:/PROJETOS/ITFACT-LEGIS/Docs")

async def get_graphiti_client():
    """Initialize Graphiti client similar to BancoDados.py but for standalone script."""
    
    # Load AI Config (defaults or env vars)
    print(f"INFO: Initializing Graphiti with Provider={ai_config.provider} Model={ai_config.model}")
    
    active_key = ai_config.get_active_key()
    
    # Set environment variables as fallback
    if ai_config.provider == "google":
        os.environ["GOOGLE_API_KEY"] = active_key
        os.environ["GOOGLE_AI_API_KEY"] = active_key
        os.environ["OPENAI_API_KEY"] = active_key
        os.environ["OPENAI_BASE_URL"] = "https://generativelanguage.googleapis.com/v1beta/openai/"
        
        # LLM Config for Chat
        llm_config = LLMConfig(
            api_key=active_key,
            model=ai_config.model or "gemini-2.0-flash",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        # USE CUSTOM CLIENT
        llm_client = CustomOpenAIClient(config=llm_config)
        
        # Embedder Config for Embeddings using OpenAI Adapter
        embedder_config = OpenAIEmbedderConfig(
            api_key=active_key,
            embedding_model="models/gemini-embedding-001",
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        embedder = OpenAIEmbedder(config=embedder_config)
        
    else:
        llm_config = LLMConfig(
            api_key=active_key,
            model=ai_config.model
        )
        llm_client = OpenAIClient(config=llm_config)
        embedder = None

    
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
                else:
                    print(f"ERROR: Giving up on chunk {i+1}", flush=True)
                    # continue to next chunk or abort? continue.

                # Sleep to avoid Rate Limits (Free Tier) - Base sleep even on success
                time.sleep(4) 
            
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
