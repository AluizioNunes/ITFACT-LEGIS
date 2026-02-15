"""
ITFACT LEGIS FastAPI - Hub Modular de Servicos
==============================================
Todos os endpoints estao organizados em routers sob `routers/`.
Configuracao e conexoes em `core/`.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Rate limiting (#11)
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from core.BancoDados import startup_connections, shutdown_connections
from routers.Saude import router as saude_router
from routers.Pdf import router as pdf_router
from routers.LegislativoIA import router as legislativo_ia_router
from routers.GraphitiRouter import router as graphiti_router
from routers.Armazenamento import router as armazenamento_router
from routers.SemanticoIA import router as semantico_ia_router, setup_pgvector
from routers.FilaMensagens import router as fila_router
from routers.SystemRouter import router as system_router
from routers.ChatbotRouter import router as chatbot_router
from routers.IntegracoesRouter import router as integracoes_router
from routers.EditorRouter import router as editor_router
from routers.KnowledgeBaseRouter import router as kb_router
from routers.PackageRouter import router as package_router

# -- Rate limiter --
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="ITFACT LEGIS FastAPI",
    description="Backend Python para processamento IA/ML e gestão documental — Modular v2.0",
    version="2.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -- Registrar Routers --
app.include_router(saude_router)
app.include_router(pdf_router)
app.include_router(legislativo_ia_router)
app.include_router(graphiti_router)
app.include_router(armazenamento_router)
app.include_router(semantico_ia_router)
app.include_router(fila_router)
app.include_router(system_router)
app.include_router(chatbot_router)
app.include_router(integracoes_router)
app.include_router(editor_router)
app.include_router(kb_router)
app.include_router(package_router)


# -- Ciclo de Vida --

@app.on_event("startup")
async def startup_event():
    await startup_connections()
    await setup_pgvector()


@app.on_event("shutdown")
async def shutdown_event():
    await shutdown_connections()
