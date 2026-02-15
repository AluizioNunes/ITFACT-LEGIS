from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import os
import json

# Singleton para gerenciar configuração de IA em tempo de execução
class AIConfigManager:
    _instance = None

    def __init__(self):
        # Carrega defaults do ambiente
        self.provider = os.getenv("AI_PROVIDER", "ollama")
        self.model = os.getenv("AI_MODEL", "llama3.1")
        self.embedding_model = os.getenv("AI_EMBEDDING_MODEL", "bge-m3")
        self.image_model = os.getenv("AI_IMAGE_MODEL", "stable-diffusion-v1.5")
        
        self.keys = {
            "google": os.getenv("GOOGLE_AI_API_KEY", ""),
            "openai": os.getenv("OPENAI_API_KEY", ""),
            "anthropic": os.getenv("ANTHROPIC_API_KEY", ""),
            "deepseek": os.getenv("DEEPSEEK_API_KEY", ""),
        }
        self.custom_providers = self.load_custom_providers()

    def load_custom_providers(self) -> dict:
        """Load custom providers from JSON file."""
        json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ai_providers.json")
        if os.path.exists(json_path):
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"ERROR: Failed to load ai_providers.json: {e}")
        return {}

    def save_custom_providers(self):
        """Save custom providers to JSON file."""
        json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ai_providers.json")
        try:
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(self.custom_providers, f, indent=2)
            print(f"DONE: Saved custom providers to {json_path}")
        except Exception as e:
            print(f"ERROR: Failed to save ai_providers.json: {e}")

    def add_custom_provider(self, provider_config: dict):
        """Add or update a custom provider."""
        pid = provider_config.get("id")
        if not pid:
            raise ValueError("Provider ID required")
        self.custom_providers[pid] = provider_config
        self.save_custom_providers()

    def remove_custom_provider(self, provider_id: str):
        """Remove a custom provider."""
        if provider_id in self.custom_providers:
            del self.custom_providers[provider_id]
            self.save_custom_providers()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def update_config(self, provider: str, model: str, keys: dict, embedding_model: str = None, image_model: str = None):
        self.provider = provider
        self.model = model
        if embedding_model:
            self.embedding_model = embedding_model
        if image_model:
            self.image_model = image_model
            
        for k, v in keys.items():
            if v: # Só atualiza se vier valor não vazio
                self.keys[k] = v
        
        # Atualiza variáveis de ambiente para compatibilidade com libs que leem diretamento do os.environ
        os.environ["AI_PROVIDER"] = self.provider
        os.environ["AI_MODEL"] = self.model
        os.environ["AI_EMBEDDING_MODEL"] = self.embedding_model
        os.environ["AI_IMAGE_MODEL"] = self.image_model
        
        if "google" in keys and keys["google"]:
            os.environ["GOOGLE_AI_API_KEY"] = keys["google"]
            os.environ["GOOGLE_API_KEY"] = keys["google"]
        if "openai" in keys and keys["openai"]:
            os.environ["OPENAI_API_KEY"] = keys["openai"]

    def get_active_key(self):
        # First check in custom providers
        if self.provider in self.custom_providers:
            custom = self.custom_providers[self.provider]
            return custom.get("api_key") or custom.get("key") or self.keys.get(self.provider, "")
            
        return self.keys.get(self.provider, "")

    def save_to_env(self):
        """Persist current AI config to the root .env file."""
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            root_dir = os.path.normpath(os.path.join(current_dir, "..", "..", ".."))
            env_path = os.path.join(root_dir, ".env")

            if not os.path.exists(env_path):
                print(f"WARNING: .env not found at {env_path}, trying current work dir...")
                env_path = os.path.join(os.getcwd(), ".env")
                if not os.path.exists(env_path):
                    print(f"ERROR: .env STILL not found.")
                    return

            with open(env_path, "r", encoding="utf-8") as f:
                lines = f.readlines()

            new_lines = []
            keys_to_update = {
                "AI_PROVIDER": self.provider,
                "AI_MODEL": self.model,
                "AI_EMBEDDING_MODEL": self.embedding_model,
                "AI_IMAGE_MODEL": self.image_model,
                "GOOGLE_AI_API_KEY": self.keys.get("google", ""),
                "OPENAI_API_KEY": self.keys.get("openai", ""),
                "ANTHROPIC_API_KEY": self.keys.get("anthropic", ""),
                "DEEPSEEK_API_KEY": self.keys.get("deepseek", ""),
            }

            processed_keys = set()
            for line in lines:
                updated = False
                for key, value in keys_to_update.items():
                    if line.strip().startswith(f"{key}="):
                        new_lines.append(f"{key}={value}\n")
                        processed_keys.add(key)
                        updated = True
                        break
                if not updated:
                    new_lines.append(line)

            # Append keys that weren't in the original .env
            for key, value in keys_to_update.items():
                if key not in processed_keys:
                    new_lines.append(f"{key}={value}\n")

            with open(env_path, "w", encoding="utf-8") as f:
                f.writelines(new_lines)
            
            print(f"DONE: Persisted AI config to {env_path}")
        except Exception as e:
            print(f"ERROR: Failed to save .env: {e}")

# Instância global
ai_config = AIConfigManager.get_instance()
