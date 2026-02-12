# 🤖 ITFACT-LEGIS — Documentação de Inteligência Artificial

> **Última atualização**: 2026-02-11
> **Versão**: 2.0.0
> **Provedor padrão**: Google Gemini Pro (gemini-2.0-flash)

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de IA](#arquitetura-de-ia)
3. [Modelos Instalados](#modelos-instalados)
4. [Módulos que Usam IA](#módulos-que-usam-ia)
5. [Configurações de Provedores](#configurações-de-provedores)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Endpoints de IA](#endpoints-de-ia)
8. [Fluxos de Dados](#fluxos-de-dados)
9. [Histórico de Alterações](#histórico-de-alterações)

---

## Visão Geral

O ITFACT-LEGIS utiliza **6 sistemas de IA** distribuídos entre dois backends (FastAPI e NestJS). As IAs cobrem desde busca semântica vetorial local até análise jurídica com LLMs em nuvem.

### Resumo Rápido

| # | IA | Tipo | Execução | Precisa API Key? | Provedor Atual |
|---|---|---|---|---|---|
| 1 | multilingual-e5-large | Embedding | 🖥️ Local | ❌ | HuggingFace (local) |
| 2 | mmarco Cross-Encoder | Re-ranking | 🖥️ Local | ❌ | HuggingFace (local) |
| 3 | Graphiti KG | Knowledge Graph | ☁️ Neo4j + LLM | ✅ | **Google Gemini** |
| 4 | Legislativo IA | Rule-based NLP | 🖥️ Local | ❌ | N/A (regras) |
| 5 | Atas IA | Template + LLM | 🖥️ Local + ☁️ | ✅ | **Google Gemini** |
| 6 | Deduplicação IA | Proxy | Via FastAPI | ❌ | e5-large (local) |

---

## Arquitetura de IA

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│  Pesquisa Inteligente │ Deduplicação │ Workflow │ Atas │ etc.  │
└────────────────┬────────────────────────┬───────────────────────┘
                 │                        │
     ┌───────────▼──────────┐  ┌──────────▼──────────┐
     │   NestJS Backend     │  │   FastAPI Backend    │
     │                      │  │                      │
     │ • Atas IA Service    │  │ • SemanticoIA.py     │
     │ • Deduplicação Svc   │──│ • LegislativoIA.py   │
     │ • Workflow Service   │  │ • GraphitiRouter.py  │
     └──────────────────────┘  └──────┬───────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
     ┌────────▼──────┐    ┌──────────▼────────┐    ┌────────▼──────┐
     │   PostgreSQL   │    │      Neo4j        │    │  Google AI    │
     │   + pgvector   │    │   (Graphiti KG)   │    │  (Gemini Pro) │
     │   Embeddings   │    │   Grafo de        │    │  LLM Cloud    │
     │   1024 dims    │    │   Conhecimento    │    │               │
     └────────────────┘    └───────────────────┘    └───────────────┘
```

---

## Modelos Instalados

### 1. `intfloat/multilingual-e5-large` — Embeddings

| Campo | Valor |
|---|---|
| **Nome completo** | `intfloat/multilingual-e5-large` |
| **Tipo** | Sentence Transformer (Bi-Encoder) |
| **Framework** | `sentence-transformers` (Python) |
| **Dimensões** | 1024 |
| **Idiomas** | 100+ (otimizado para pt-BR) |
| **Tamanho** | ~2.2 GB |
| **Execução** | Local (CPU/GPU) |
| **Prefixos** | `"query: "` para buscas, `"passage: "` para indexação |
| **Armazenamento** | PostgreSQL + pgvector (tabela `DocEmbeddings`) |
| **Índice** | IVFFlat com cosine similarity, 100 listas |

**Arquivo de configuração**: `Backend/fastapi/core/Configuracao.py`
```python
EMBEDDING_MODEL = "intfloat/multilingual-e5-large"
EMBEDDING_DIMS = 1024
```

**Carregamento**: Lazy-load na primeira requisição
```python
# Backend/fastapi/routers/SemanticoIA.py
def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL)
    return _embedding_model
```

---

### 2. `cross-encoder/mmarco-mMiniLMv2-L12-H384-v1` — Re-ranking

| Campo | Valor |
|---|---|
| **Nome completo** | `cross-encoder/mmarco-mMiniLMv2-L12-H384-v1` |
| **Tipo** | Cross-Encoder |
| **Framework** | `sentence-transformers` (Python) |
| **Tamanho** | ~440 MB |
| **Execução** | Local (CPU/GPU) |
| **Função** | Recebe pares (query, candidato) e retorna score de similaridade |
| **Uso** | Segunda fase da deduplicação — ranking fino após busca vetorial |

**Arquivo de configuração**: `Backend/fastapi/core/Configuracao.py`
```python
CROSS_ENCODER_MODEL = "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1"
```

**Pipeline de deduplicação**:
1. Texto → e5-large → embedding 1024d
2. pgvector busca top-5 candidatos (cosine > 0.75)
3. Cross-encoder ranqueia candidatos com precisão fina
4. Flag `is_duplicate` se score > threshold

---

### 3. `graphiti-core` — Knowledge Graph

| Campo | Valor |
|---|---|
| **Biblioteca** | `graphiti-core` (Python) |
| **Grafo** | Neo4j (bolt://neo4j:7687) |
| **LLM backend** | Google Gemini (configurável) |
| **Função** | Extração automática de entidades e relações de textos legislativos |
| **Entidades** | Vereadores, Leis, Comissões, Sessões, Votos |
| **Método** | `add_episode()` com `reference_time` |

**Inicialização**: `Backend/fastapi/core/BancoDados.py`
```python
from graphiti_core import Graphiti
graphiti_client = Graphiti(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)
```

---

### 4. Legislativo IA — NLP Baseado em Regras

| Campo | Valor |
|---|---|
| **Tipo** | Rule-based (sem modelo externo) |
| **Framework** | Python puro |
| **Execução** | 100% local, sem API key |
| **Arquivo** | `Backend/fastapi/routers/LegislativoIA.py` |

**Funcionalidades**:

| Endpoint | O que faz |
|---|---|
| `POST /ai/propositura/classificar` | Classifica tipo (PL, PLC, PR, PDL, etc.) e regime (Ordinário, Urgência, Prazo Fatal) via keyword scoring |
| `POST /ai/propositura/analise-constitucional` | Verifica vícios de iniciativa, impacto orçamentário, competência tributária conforme LOMAN |
| `POST /ai/parecer/sugerir` | Gera sugestão de parecer (Constitucionalidade, Mérito, Financeiro) com templates do Regimento |
| `POST /ai/ordem-dia/priorizar` | Prioriza proposições por tipo e urgência conforme Art. 82 do Regimento |
| `POST /ai/ata/gerar` | Gera ata de sessão a partir de resumo, votações e presenças |

---

### 5. Atas IA — Geração de Atas Plenárias

| Campo | Valor |
|---|---|
| **Backend** | NestJS (`atas-ia` module) |
| **Arquivo** | `Backend/NestJS/src/atas-ia/atas-ia.service.ts` |
| **LLM** | Google Gemini (via FastAPI proxy) |

**Funcionalidades**:

| Método | O que faz | Usa LLM? |
|---|---|---|
| `gerarAta()` | Gera ata completa (presentes, expedientes, tribuna, votações) | ❌ Template |
| `transcreverAudio()` | Transcrição de áudio de sessão → texto | ✅ via `/ai/transcribe` |
| `refinarAta()` | Refina rascunho com estilo `legislativo_formal` | ✅ via `/ai/refine-text` |

---

### 6. Deduplicação IA — Proxy NestJS → FastAPI

| Campo | Valor |
|---|---|
| **Backend** | NestJS (`deduplicacao` module) |
| **Arquivo** | `Backend/NestJS/src/deduplicacao/deduplicacao.service.ts` |
| **Modelos** | Nenhum próprio — chama FastAPI (e5-large + mmarco) |

**Métodos**:

| Método | FastAPI Endpoint | O que faz |
|---|---|---|
| `verificarDuplicatas()` | `POST /semantic/check-duplicate` | Verifica se documento é duplicata |
| `indexarDocumento()` | `POST /semantic/index` | Indexa documento no motor semântico |
| `buscarSimilares()` | `POST /semantic/search` | Busca por similaridade |
| `obterEstatisticas()` | `GET /semantic/stats` | Stats do motor |

---

## Configurações de Provedores

### Provedor Ativo: Google Gemini Pro

| Campo | Valor |
|---|---|
| **Provedor** | Google AI (Gemini) |
| **Modelo padrão** | `gemini-2.0-flash` |
| **API Key** | Configurada via `GOOGLE_AI_API_KEY` no `.env` |
| **Base URL** | `https://generativelanguage.googleapis.com/v1beta` |
| **Usado por** | Graphiti KG, Atas IA (transcrição/refinamento) |

### Provedores Disponíveis (configuráveis na tela `/dashboard/sistema/integracoes`)

| Provedor | Modelos | Status |
|---|---|---|
| **Google Gemini** | gemini-2.0-flash, gemini-2.0-pro, gemini-1.5-pro | ✅ Ativo |
| OpenAI | gpt-4o, gpt-4o-mini, o1, o3-mini | ⚪ Disponível |
| Anthropic | claude-sonnet-4, claude-3.5-sonnet | ⚪ Disponível |
| DeepSeek | deepseek-chat, deepseek-reasoner | ⚪ Disponível |
| Kimi (Moonshot) | moonshot-v1-8k/32k/128k | ⚪ Disponível |
| Mistral | mistral-large, codestral | ⚪ Disponível |
| Groq | llama-3.3-70b, mixtral-8x7b | ⚪ Disponível |
| Cohere | command-r+, embed-v3 | ⚪ Disponível |
| Ollama (Local) | llama3.3, qwen2.5, phi4 | ⚪ Disponível |

---

## Variáveis de Ambiente

```bash
# ═══ IA — Provedor Principal ═══
AI_PROVIDER=google                    # google | openai | anthropic | deepseek | ...
AI_MODEL=gemini-2.0-flash            # modelo padrão

# ═══ Google Gemini ═══
GOOGLE_AI_API_KEY=AIzaSy...          # chave da API Google AI
GOOGLE_AI_PROJECT_ID=                 # opcional

# ═══ OpenAI (backup) ═══
OPENAI_API_KEY=                       # vazio = desabilitado

# ═══ Embeddings (sempre local) ═══
EMBEDDING_MODEL=intfloat/multilingual-e5-large
EMBEDDING_DIMS=1024
CROSS_ENCODER_MODEL=cross-encoder/mmarco-mMiniLMv2-L12-H384-v1

# ═══ Graphiti / Neo4j ═══
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=LEGIS2026
```

---

## Endpoints de IA

### FastAPI (porta 8000)

| Método | Rota | IA | Descrição |
|---|---|---|---|
| `POST` | `/semantic/index` | e5-large | Indexa documento com embedding |
| `POST` | `/semantic/search` | e5-large + pgvector | Busca vetorial semântica |
| `POST` | `/semantic/check-duplicate` | e5-large + mmarco | Pipeline completo de deduplicação |
| `GET` | `/semantic/stats` | — | Estatísticas do motor semântico |
| `POST` | `/ai/propositura/classificar` | Rule-based | Classifica tipo e regime |
| `POST` | `/ai/propositura/analise-constitucional` | Rule-based | Verifica constitucionalidade |
| `POST` | `/ai/parecer/sugerir` | Template | Gera sugestão de parecer |
| `POST` | `/ai/ordem-dia/priorizar` | Rule-based | Prioriza Ordem do Dia |
| `POST` | `/ai/ata/gerar` | Template | Gera ata de sessão |
| `POST` | `/ai/graphiti/index` | Graphiti + Gemini | Indexa no Knowledge Graph |
| `GET` | `/ai/graphiti/search` | Graphiti | Busca no grafo de conhecimento |
| `POST` | `/ai/graphiti/deduplicacao/index` | Graphiti + Gemini | Indexa para correlação |

### NestJS (porta 3001)

| Método | Rota | IA | Descrição |
|---|---|---|---|
| `POST` | `/atas-ia/gerar` | Template | Gera ata plenária |
| `POST` | `/atas-ia/transcrever` | Gemini (proxy) | Transcreve áudio |
| `POST` | `/atas-ia/refinar` | Gemini (proxy) | Refina redação |
| `POST` | `/deduplicacao/verificar` | e5-large (proxy) | Verifica duplicatas |
| `POST` | `/deduplicacao/indexar` | e5-large (proxy) | Indexa documento |
| `POST` | `/deduplicacao/buscar` | e5-large (proxy) | Busca similares |

---

## Fluxos de Dados

### Fluxo 1: Deduplicação de Minuta

```
Usuário cria Minuta
    │
    ▼
NestJS (deduplicacao.service.ts)
    │ POST /semantic/check-duplicate
    ▼
FastAPI (SemanticoIA.py)
    │
    ├── 1. e5-large gera embedding (1024d)
    ├── 2. pgvector busca top-5 (cosine > 0.75)
    ├── 3. mmarco cross-encoder re-ranking
    └── 4. Retorna: has_duplicates + lista ranqueada
    │
    ▼
NestJS retorna resultado ao frontend
    │
    ▼
Frontend mostra alertas de duplicatas
```

### Fluxo 2: Indexação no Knowledge Graph

```
Documento indexado
    │
    ▼
FastAPI (GraphitiRouter.py)
    │ graphiti_client.add_episode()
    ▼
Graphiti Core
    │
    ├── 1. Envia texto → Google Gemini (NER)
    ├── 2. Extrai entidades: Vereadores, Leis, Comissões
    ├── 3. Cria nós e relações no Neo4j
    └── 4. Retorna episode_id
```

### Fluxo 3: Geração de Ata

```
Dados da Sessão (presentes, votações, etc.)
    │
    ▼
NestJS (atas-ia.service.ts)
    │
    ├── gerarAta() → Template local (sem LLM)
    │      └── ATA completa formatada
    │
    ├── transcreverAudio() → POST /ai/transcribe
    │      └── FastAPI → Google Gemini
    │
    └── refinarAta() → POST /ai/refine-text
           └── FastAPI → Google Gemini
```

---

## Histórico de Alterações

| Data | Alteração | Arquivos |
|---|---|---|
| 2026-02-11 | Documentação inicial criada | `IA.md` |
| 2026-02-11 | Gemini Pro configurado como provedor padrão | `.env`, `Configuracao.py` |
| 2026-02-11 | Fix mutable globals em 3 routers | `Saude.py`, `GraphitiRouter.py`, `Armazenamento.py` |
| 2026-02-11 | Fix Graphiti `add_episode()` API (reference_time) | `GraphitiRouter.py` |
| 2026-02-11 | Tela de Integrações criada com 9 provedores de IA | `page.tsx` (integracoes) |
