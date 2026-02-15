import os
from typing import Optional, Any
from core.AIConfig import ai_config
from graphiti_core.llm_client import LLMConfig, OpenAIClient
from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig
from core.CustomOpenAIClient import CustomOpenAIClient
from openai import AsyncOpenAI

class ClientAI:
    """
    Central factory for creating AI clients (LLM, Embeddings, Image)
    based on the active configuration in AIConfig.
    """
    
    # Static block to ensure OPENAI_API_KEY is set for libs that check env
    if not os.getenv("OPENAI_API_KEY"):
        os.environ["OPENAI_API_KEY"] = "ollama"

    @staticmethod
    def get_llm_config() -> LLMConfig:
        """Returns the LLM configuration based on active provider."""
        provider = ai_config.provider
        model = ai_config.model
        
        # 0. Check Custom Providers
        if provider in ai_config.custom_providers:
            custom = ai_config.custom_providers[provider]
            return LLMConfig(
                api_key=custom.get("api_key", ""),
                model=model or custom.get("model", "gpt-3.5-turbo"),
                base_url=custom.get("base_url")
            )
        
        # 1. OpenAI (Standard)
        if provider == "openai":
            return LLMConfig(
                api_key=ai_config.keys.get("openai", ""),
                model=model or "gpt-4-turbo",
                base_url=None # Standard OpenAI URL
            )
            
        # 2. Google (via OpenAI Adapter)
        if provider == "google":
            return LLMConfig(
                api_key=ai_config.keys.get("google", ""),
                model=model or "gemini-1.5-pro",
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )

        # 3. Ollama (Local/Default)
        # Default to Ollama if provider is ollama or unknown/local
        ollama_url = os.getenv('OLLAMA_URL', 'http://ollama:11434')
        return LLMConfig(
            api_key="ollama",
            model=model or "llama3.1",
            base_url=f"{ollama_url}/v1"
        )

    @staticmethod
    def get_llm_client() -> Any:
        """
        Returns a configured LLM client for Graphiti/LangChain.
        Currently returns CustomOpenAIClient configured for Ollama.
        """
        config = ClientAI.get_llm_config()
        return CustomOpenAIClient(config=config)

    @staticmethod
    def get_embedding_client() -> Any:
        """
        Returns a configured Embedding client for Graphiti/VectorDB.
        """
        provider = ai_config.provider
        
        # 0. Check Custom Providers
        # 0. Check Custom Providers
        if provider in ai_config.custom_providers:
            custom = ai_config.custom_providers[provider]
            base_url = custom.get("base_url")
            
            # Detect Google/Gemini in Custom Provider
            default_model = "text-embedding-3-small"
            if base_url and "googleapis" in base_url:
                default_model = "models/text-embedding-004"
            
            config = OpenAIEmbedderConfig(
                api_key=custom.get("api_key", ""),
                embedding_model=ai_config.embedding_model or custom.get("embedding_model", default_model),
                base_url=base_url
            )
            return OpenAIEmbedder(config=config)
        
        # 1. OpenAI
        if provider == "openai":
            config = OpenAIEmbedderConfig(
                api_key=ai_config.keys.get("openai", ""),
                embedding_model=ai_config.embedding_model or "text-embedding-3-small"
            )
            return OpenAIEmbedder(config=config)
            
        # 2. Google
        if provider == "google":
             config = OpenAIEmbedderConfig(
                api_key=ai_config.keys.get("google", ""),
                embedding_model=ai_config.embedding_model or "models/text-embedding-004",
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )
             return OpenAIEmbedder(config=config)

        # 3. Ollama (Default)
        ollama_url = os.getenv('OLLAMA_URL', 'http://ollama:11434')
        config = OpenAIEmbedderConfig(
            api_key="ollama",
            embedding_model=ai_config.embedding_model or "bge-m3",
            base_url=f"{ollama_url}/v1"
        )
        return OpenAIEmbedder(config=config)

    @staticmethod
    def get_chat_client() -> AsyncOpenAI:
        """
        Returns a standard AsyncOpenAI client for general chat/text analysis (Editor).
        """
        provider = ai_config.provider
        # model is used in the call site, but we need to configure the client base_url/key
        
        # 0. Check Custom Providers
        # 0. Check Custom Providers
        if provider in ai_config.custom_providers:
            custom = ai_config.custom_providers[provider]
            return AsyncOpenAI(
                api_key=custom.get("api_key", ""),
                base_url=custom.get("base_url"),
                timeout=20.0
            )

        # 1. OpenAI
        if provider == "openai":
             return AsyncOpenAI(
                 api_key=ai_config.keys.get("openai", ""),
                 timeout=20.0
             )
        
        # 2. Google
        if provider == "google":
            return AsyncOpenAI(
                api_key=ai_config.keys.get("google", ""),
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
                timeout=20.0
            )

        # 3. Ollama (Default)
        return AsyncOpenAI(
            api_key="ollama",
            base_url=f"{os.getenv('OLLAMA_URL', 'http://ollama:11434')}/v1",
            timeout=20.0
        )
    
    @staticmethod
    def get_image_client() -> Any:
        """
        Placeholder for Image Generation Client.
        """
        # To be implemented when Image generation is required.
        return None
