from pydantic import BaseModel, Field
from typing import Optional, List
import os

# Singleton para gerenciar configuração de IA em tempo de execução
class AIConfigManager:
    _instance = None

    def __init__(self):
        # Carrega defaults do ambiente
        self.provider = os.getenv("AI_PROVIDER", "google")
        self.model = os.getenv("AI_MODEL", "gemini-2.0-flash")
        self.keys = {
            "google": os.getenv("GOOGLE_AI_API_KEY", ""),
            "openai": os.getenv("OPENAI_API_KEY", ""),
            "anthropic": os.getenv("ANTHROPIC_API_KEY", ""),
            "deepseek": os.getenv("DEEPSEEK_API_KEY", ""),
            # Adicionar outros conforme necessário
        }

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def update_config(self, provider: str, model: str, keys: dict):
        self.provider = provider
        self.model = model
        for k, v in keys.items():
            if v: # Só atualiza se vier valor não vazio
                self.keys[k] = v
        
        # Atualiza variáveis de ambiente para compatibilidade com libs que leem diretamento do os.environ
        os.environ["AI_PROVIDER"] = self.provider
        os.environ["AI_MODEL"] = self.model
        if "google" in keys and keys["google"]:
            os.environ["GOOGLE_AI_API_KEY"] = keys["google"]
            os.environ["GOOGLE_API_KEY"] = keys["google"]
        if "openai" in keys and keys["openai"]:
            os.environ["OPENAI_API_KEY"] = keys["openai"]

    def get_active_key(self):
        return self.keys.get(self.provider, "")

# Instância global
ai_config = AIConfigManager.get_instance()
