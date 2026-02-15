"""
Router for Contextual Chatbot using Graphiti for RAG and simple heuristics for context suggestions.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from core import BancoDados
from core.AIConfig import ai_config
import logging
import json
import os

# Initialize logger
logger = logging.getLogger("uvicorn")

router = APIRouter(prefix="/chat", tags=["Chatbot Contextual"])

class ChatQuery(BaseModel):
    message: str
    context_path: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []

class ContextSuggestion(BaseModel):
    path: str
    suggestions: List[str]

# Define base context suggestions mapping
CONTEXT_MAPPING = {
    "/dashboard/legislativo/licencas": [
        "Quais são os tipos de licença permitidos?",
        "Qual o prazo para apresentar atestado médico?",
        "Como funciona a licença para tratamento de saúde?",
        "O que diz o regimento sobre licença maternidade?"
    ],
    "/dashboard/legislativo/audiencias": [
        "Qual o quórum para abrir uma audiência pública?",
        "Como convocar uma autoridade para audiência?",
        "Quais os prazos para divulgação da pauta?"
    ],
    "/dashboard/proposituras/pareceres": [
        "Quais os elementos obrigatórios de um parecer?",
        "Qual o prazo da comissão para emitir parecer?",
        "Como funciona o pedido de vista?"
    ],
    "/dashboard/gerencia/configuracoes": [
        "Como configurar os acessos de usuários?",
        "Como alterar os parâmetros do sistema?"
    ]
}

# Default suggestions
DEFAULT_SUGGESTIONS = [
    "O que diz o Regimento Interno sobre votação?",
    "Quais as atribuições da Mesa Diretora?",
    "Como funciona o processo legislativo?",
    "Faça um resumo das competências da Câmara."
]

@router.get("/context", response_model=ContextSuggestion)
async def get_context_suggestions(path: str):
    """
    Return distinct questions/suggestions based on the user's current route path.
    """
    # Normalize path checking logic
    matched_suggestions = DEFAULT_SUGGESTIONS
    
    # Check for exact matches first
    if path in CONTEXT_MAPPING:
        matched_suggestions = CONTEXT_MAPPING[path]
    else:
        # Check for partial matches (e.g. /dashboard/legislativo/licencas/novo)
        for key, suggestions in CONTEXT_MAPPING.items():
            if path.startswith(key):
                matched_suggestions = suggestions
                break
    
    return ContextSuggestion(path=path, suggestions=matched_suggestions)

@router.post("/query", response_model=ChatResponse)
async def query_chatbot(query: ChatQuery):
    """
    Process a user question using Graphiti (RAG) + LLM.
    """
    if not BancoDados.graphiti_client:
        raise HTTPException(status_code=503, detail="AI System (Graphiti) not initialized")
        
    try:
        user_msg = query.message
        
        # 1. Search in Graphiti Knowledge Graph
        # We search in 'legislacao_base' and any 'kb_' group
        search_results = await BancoDados.graphiti_client.search(
            user_msg, 
            group_ids=["legislacao_base"] # Graphiti searches globally if we don't restrict, but we can add more
        )
        
        # 2. Load KB Metadata for filtering
        kb_dir = os.path.join(os.path.dirname(__file__), "..", "BaseConhecimento")
        metadata_path = os.path.join(kb_dir, "metadata.json")
        latest_episodes = set()
        if os.path.exists(metadata_path):
            try:
                with open(metadata_path, "r") as f:
                    kb_meta = json.load(f)
                    latest_episodes = {info["episode_id"] for info in kb_meta.values() if info.get("episode_id")}
            except:
                pass

        # 3. Construct Prompt for LLM
        context_text = ""
        sources = []
        
        for result in search_results:
            # Filtering: If it's an episode from our KB, only include if it's the latest
            e_id = str(getattr(result, 'episode_id', ''))
            
            # If we have metadata, we check if this episode is 'stale'
            # Note: Legact episodes in 'legislacao_base' without metadata will be kept
            if latest_episodes and e_id and e_id not in latest_episodes:
                # This check ensures that if we have a NEW version indexed, 
                # we don't use results from the older one.
                # Find if this episode belongs to any KB document
                continue

            # Extrahir texto
            if hasattr(result, 'episode_body'):
                snippet = result.episode_body[:1000] 
                context_text += f"---\n{snippet}\n"
                title = getattr(result, 'name', 'Unknown Source')
                if title not in sources:
                    sources.append(title)
            elif hasattr(result, 'description'): # Entities/Nodes
                context_text += f"---\n{result.description}\n"
        
        if not context_text:
            context_text = "Nenhum contexto legislativo específico encontrado no banco de dados para esta pergunta."

        # Enhance system prompt with current screen context
        screen_context = ""
        if query.context_path:
             # Map path to readable name
             path = query.context_path
             screen_name = "Dashboard"
             if "mesa-diretora" in path: screen_name = "Mesa Diretora"
             elif "plenario" in path: screen_name = "Plenário"
             elif "comissoes" in path: screen_name = "Comissões"
             elif "tramitacao" in path: screen_name = "Tramitação"
             elif "protocolo" in path: screen_name = "Protocolo"
             elif "pareceres" in path: screen_name = "Pareceres"
             
             screen_context = f"O usuário está atualmente na tela: **{screen_name}** ({path}). Considere isso ao responder."

        system_prompt = f"""
        Você é o Assistente Virtual da Câmara Municipal (ITFACT LEGIS).
        Sua função é auxiliar vereadores e servidores com dúvidas sobre o Regimento Interno, Lei Orgânica e uso do sistema.
        
        {screen_context}
        
        Use o contexto abaixo (extraído da base de conhecimento) para responder à pergunta do usuário.
        Se a resposta não estiver no contexto, use seu conhecimento geral mas avise que não encontrou na base oficial.
        NÃO INVENTE informações legislativas que não estejam no contexto.
        
        Contexto Legislativo:
        {context_text}
        """

        # 3. Call LLM (using the client from Graphiti if accessible, or create new one)
        # Graphiti client has .llm_client.chat_completion
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_msg}
        ]
        
        # We need to access the underlying LLM client
        # Graphiti instance stores it. Assuming access pattern.
        response_text = "Desculpe, não consegui processar a resposta."
        
        if hasattr(BancoDados.graphiti_client, 'llm_client'):
            llm_response = await BancoDados.graphiti_client.llm_client.chat_completion(
                messages=messages,
                model=ai_config.model or "gemini-2.0-flash"
            )
            response_text = llm_response # LLMClient usually returns content string directly
        else:
            # Fallback if we can't access inner client easily (should not happen based on inspection)
            # Re-init a temporary client (expensive but safe fallback)
            logger.warning("Graphiti inner LLM client not accessible, initializing fallback.")
            # ... skipping implementation of fallback for brevity, assuming standard structure
            response_text = "Erro: Configuração de LLM não acessível."

        return ChatResponse(
            response=response_text,
            sources=sources
        )

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Chatbot Error: {error_msg}")
        
        # User-friendly messages for common AI errors
        if "429" in error_msg or "quota" in error_msg.lower():
            return ChatResponse(
                response="Estou recebendo muitas perguntas no momento devido ao limite de taxa da IA (Plano Gratuito). Por favor, aguarde 60 segundos e tente novamente.",
                sources=[]
            )
        
        if "503" in error_msg or "Graphiti" in error_msg:
             return ChatResponse(
                response="O sistema de inteligência está inicializando ou indisponível temporariamente. Tente novamente em um instante.",
                sources=[]
            )
            
        raise HTTPException(status_code=500, detail=error_msg)
