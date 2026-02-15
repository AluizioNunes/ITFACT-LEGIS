"""
System Configuration Router.
Endpoints para gerenciar configurações dinâmicas do sistema, como provedores de IA.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Optional, List
from core.AIConfig import ai_config
from core import BancoDados

router = APIRouter(prefix="/system", tags=["System Configuration"])

class AIConfigUpdate(BaseModel):
    provider: str
    model: str
    embedding_model: Optional[str] = None
    image_model: Optional[str] = None
    keys: Dict[str, str]

@router.get("/config/ai")
async def get_ai_config():
    """Retorna a configuração atual de IA (com chaves mascaradas)."""
    masked_keys = {k: (v[:4] + "..." + v[-4:] if v and len(v) > 8 else "****") for k, v in ai_config.keys.items()}
    return {
        "provider": ai_config.provider,
        "model": ai_config.model,
        "embedding_model": ai_config.embedding_model,
        "image_model": ai_config.image_model,
        "keys_configured": list(ai_config.keys.keys()),
        "keys_masked": masked_keys,
        "custom_providers": ai_config.custom_providers
    }

@router.post("/config/ai")
async def update_ai_config(config: AIConfigUpdate):
    """Atualiza a configuração de IA e reinicia serviços dependentes."""
    try:
        # Atualiza o Singleton de Configuração
        ai_config.update_config(
            config.provider, 
            config.model, 
            config.keys, 
            embedding_model=config.embedding_model,
            image_model=config.image_model
        )
        
        # Persiste no arquivo .env para permanência
        ai_config.save_to_env()
        
        # Reinicia serviços que dependem das credenciais (ex: Graphiti)
        await BancoDados.reconnect_graphiti()
        
        return {
            "status": "updated", 
            "provider": ai_config.provider, 
            "model": ai_config.model,
            "message": "AI Configuration updated and services reconnected."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CustomProviderConfig(BaseModel):
    id: str
    name: str # Frontend display name
    base_url: Optional[str] = None
    api_key: Optional[str] = None
    model: Optional[str] = None # Default model for this provider
    packages: Optional[List[str]] = [] # Required python packages

@router.post("/config/ai/provider")
async def add_custom_provider(config: CustomProviderConfig):
    """Adiciona ou atualiza um provedor de IA customizado."""
    try:
        # Convert Pydantic model to dict
        provider_data = config.dict()
        ai_config.add_custom_provider(provider_data)
        
        return {"status": "success", "message": f"Provider {config.id} added/updated.", "providers": ai_config.custom_providers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/config/ai/provider/{provider_id}")
async def remove_custom_provider(provider_id: str):
    """Remove um provedor de IA customizado."""
    try:
        ai_config.remove_custom_provider(provider_id)
        return {"status": "success", "message": f"Provider {provider_id} removed.", "providers": ai_config.custom_providers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/services")
async def get_services_status():
    """Retorna estatísticas em tempo real de todos os serviços conectados."""
    return await BancoDados.get_all_stats()
