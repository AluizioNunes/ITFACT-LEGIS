import asyncio
import os
import sys
from pathlib import Path

# Add parent dir to path
sys.path.append(os.path.join(os.getcwd(), "Backend", "FastAPI"))

from core.Configuracao import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
from core.AIConfig import ai_config
from graphiti_core import Graphiti
from core.CustomOpenAIClient import CustomOpenAIClient
from graphiti_core.llm_client import LLMConfig
from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig

async def test_search():
    active_key = ai_config.get_active_key()
    
    # Minimal config for searching
    llm_config = LLMConfig(
        api_key=active_key,
        model="gemini-2.0-flash",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    llm_client = CustomOpenAIClient(config=llm_config)
    
    embedder_config = OpenAIEmbedderConfig(
        api_key=active_key,
        embedding_model="models/gemini-embedding-001",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    embedder = OpenAIEmbedder(config=embedder_config)
    
    client = Graphiti(
        NEO4J_URI,
        NEO4J_USER,
        NEO4J_PASSWORD,
        llm_client=llm_client,
        embedder=embedder
    )
    
    query = "Qual o prazo para que o Vereador tome posse?"
    print(f"Searching for: {query}")
    
    results = await client.search(query, group_ids=["legislacao_base"])
    
    print(f"Found {len(results)} results")
    for r in results:
        # Check result type
        name = getattr(r, 'name', 'N/A')
        snippet = getattr(r, 'episode_body', '')[:200]
        print(f"- Result: {name}")
        print(f"  Snippet: {snippet}...")
        
    await client.close()

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_search())
