from typing import List, Union, Optional, Any
import google.generativeai as genai
from pydantic import BaseModel
import asyncio
import functools

class GoogleEmbeddingData(BaseModel):
    embedding: List[float]
    index: int = 0
    object: str = "embedding"

class GoogleEmbeddingResponse(BaseModel):
    data: List[GoogleEmbeddingData]
    model: str
    object: str = "list"
    usage: dict = {"prompt_tokens": 0, "total_tokens": 0}

class GenerateConfig:
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key
        self.model = model

class GoogleEmbedder:
    """
    Custom Embedder for Graphiti using Google Generative AI native library.
    Mimics OpenAIEmbedder interface for compatibility.
    """
    def __init__(self, config: Any):
        self.config = config
        self.api_key = getattr(config, 'api_key', None)
        # Default to a known working model if not specified or if incompatible
        self.model = "models/gemini-embedding-001" 
        
        # If config has a specific embedding model (not flash/pro chat model), use it
        if config and hasattr(config, 'model') and config.model and "embedding" in config.model:
             self.model = config.model
        
        if self.api_key:
            genai.configure(api_key=self.api_key)

    async def create(self, input: Union[str, List[str]], model: Optional[str] = None) -> GoogleEmbeddingResponse:
        """
        Generate embeddings for input.
        """
        target_model = model or self.model
        
        is_batch = isinstance(input, list)
        inputs = input if is_batch else [input]
        
        loop = asyncio.get_running_loop()
        
        print(f"DEBUG: GoogleEmbedder.create called with model={target_model}, is_batch={is_batch}, batch_size={len(inputs)}", flush=True)
        import traceback
        try:
            # Run blocking call directly (blocking the loop, but for debug purpose)
            # Remove task_type for now to simplify
            result = genai.embed_content(
                model=target_model,
                content=inputs,
            )
            print("DEBUG: GoogleEmbedder.create success", flush=True)
            
            data = []
            embeddings = result.get('embedding', [])
            print(f"DEBUG: Embeddings type: {type(embeddings)}", flush=True)
            if embeddings:
                 print(f"DEBUG: First element type: {type(embeddings[0])}", flush=True)
                 # print(f"DEBUG: First element: {embeddings[0]}", flush=True) # Too verbose if list
            
            # API returns list of embeddings for batch, or list of floats for single?
            # Documentation says:
            # If content is a list, output is a dict with 'embedding' as a list of embeddings.
            # If content is a string, output is a dict with 'embedding' as a list of floats.
            
            if not is_batch:
                # result['embedding'] is list[list[float]] because we passed list wrapping single input
                if embeddings and isinstance(embeddings[0], list):
                     data.append(GoogleEmbeddingData(embedding=embeddings[0], index=0))
                else:
                     # Fallback if API changes behavior
                     data.append(GoogleEmbeddingData(embedding=embeddings, index=0))
            else:
                # result['embedding'] is list[list[float]]
                for i, emb in enumerate(embeddings):
                    data.append(GoogleEmbeddingData(embedding=emb, index=i))
            
            return GoogleEmbeddingResponse(data=data, model=target_model)
                    
        except Exception as e:
            print(f"GoogleEmbedder Native Error: {e}", flush=True)
            traceback.print_exc()
            raise e

    # Helper alias if Graphiti calls underscore method
    async def _create(self, input, model=None):
        return await self.create(input, model)

    async def create_batch(self, input: List[str], model: Optional[str] = None) -> GoogleEmbeddingResponse:
        """
        Generate embeddings for a batch of inputs.
        Mimics OpenAIEmbedder.create_batch
        """
        return await self.create(input, model)
