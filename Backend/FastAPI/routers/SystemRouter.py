"""
System Configuration Router.
Endpoints para gerenciar configurações dinâmicas do sistema, como provedores de IA.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Optional
from core.AIConfig import ai_config
from core import BancoDados

router = APIRouter(prefix="/system", tags=["System Configuration"])

class AIConfigUpdate(BaseModel):
    provider: str
    model: str
    keys: Dict[str, str]

@router.get("/config/ai")
async def get_ai_config():
    """Retorna a configuração atual de IA (com chaves mascaradas)."""
    masked_keys = {k: (v[:4] + "..." + v[-4:] if v and len(v) > 8 else "****") for k, v in ai_config.keys.items()}
    return {
        "provider": ai_config.provider,
        "model": ai_config.model,
        "keys_configured": list(ai_config.keys.keys()),
        "keys_masked": masked_keys
    }

@router.post("/config/ai")
async def update_ai_config(config: AIConfigUpdate):
    """Atualiza a configuração de IA e reinicia serviços dependentes."""
    try:
        # Atualiza o Singleton de Configuração
        ai_config.update_config(config.provider, config.model, config.keys)
        
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
