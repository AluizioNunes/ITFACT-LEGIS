# Especificações de APIs RESTful
## Sistema de Gestão Legislativa - CMM

---

## CONVENÇÕES GERAIS

### Base URL
```
https://api.cmm.am.gov.br/v1
```

### Autenticação
```
Authorization: Bearer {token}
```

### Formato de Resposta
```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso",
  "timestamp": "2025-02-10T10:30:00Z"
}
```

### Formato de Erro
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": []
  },
  "timestamp": "2025-02-10T10:30:00Z"
}
```

### Paginação
```
?page=1&limit=20&sort=created_at&order=desc
```

### Códigos HTTP
- 200: OK
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 500: Internal Server Error

---

## 1. API DE VEREADORES

### 1.1 Listar Vereadores
```http
GET /vereadores
```

**Query Parameters:**
- `situacao`: ATIVO, LICENCIADO, AFASTADO, SUPLENTE_EXERCICIO, CASSADO
- `partido`: ID do partido
- `legislatura`: Número da legislatura
- `nome`: Busca por nome

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id_vereador": 1,
        "cpf": "12345678901",
        "nome_completo": "João da Silva Santos",
        "nome_parlamentar": "João Silva",
        "partido": {
          "id_partido": 5,
          "sigla": "PMDB",
          "nome": "Partido do Movimento Democrático Brasileiro"
        },
        "situacao": "ATIVO",
        "legislatura": 19,
        "foto_url": "https://cdn.cmm.am.gov.br/fotos/vereador-1.jpg",
        "email": "joao.silva@cmm.am.gov.br",
        "telefone": "(92) 3622-xxxx"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 41,
      "items_per_page": 20
    }
  }
}
```

### 1.2 Obter Vereador
```http
GET /vereadores/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_vereador": 1,
    "cpf": "12345678901",
    "nome_completo": "João da Silva Santos",
    "nome_parlamentar": "João Silva",
    "data_nascimento": "1975-05-15",
    "sexo": "M",
    "partido": {
      "id_partido": 5,
      "sigla": "PMDB",
      "nome": "Partido do Movimento Democrático Brasileiro"
    },
    "situacao": "ATIVO",
    "legislatura": 19,
    "data_posse": "2021-01-01",
    "data_fim_mandato": "2024-12-31",
    "foto_url": "https://cdn.cmm.am.gov.br/fotos/vereador-1.jpg",
    "email": "joao.silva@cmm.am.gov.br",
    "telefone": "(92) 3622-xxxx",
    "biografia": "Texto da biografia...",
    "comissoes": [
      {
        "id_comissao": 3,
        "nome": "Comissão de Finanças",
        "cargo": "PRESIDENTE"
      }
    ],
    "estatisticas": {
      "proposicoes_apresentadas": 45,
      "proposicoes_aprovadas": 23,
      "percentual_presenca": 95.5,
      "total_sessoes": 120
    }
  }
}
```

### 1.3 Criar Vereador
```http
POST /vereadores
```

**Request Body:**
```json
{
  "cpf": "12345678901",
  "nome_completo": "João da Silva Santos",
  "nome_parlamentar": "João Silva",
  "data_nascimento": "1975-05-15",
  "sexo": "M",
  "id_partido": 5,
  "numero_diploma": "DIPL-2020-001",
  "data_diploma": "2020-11-20",
  "legislatura": 19,
  "email": "joao.silva@cmm.am.gov.br",
  "telefone": "(92) 3622-xxxx"
}
```

### 1.4 Atualizar Vereador
```http
PUT /vereadores/{id}
PATCH /vereadores/{id}
```

### 1.5 Registrar Posse
```http
POST /vereadores/{id}/posse
```

**Request Body:**
```json
{
  "data_posse": "2021-01-01",
  "declaracao_bens_url": "https://storage.cmm.am.gov.br/docs/decl-bens-1.pdf"
}
```

### 1.6 Alterar Situação
```http
PUT /vereadores/{id}/situacao
```

**Request Body:**
```json
{
  "situacao": "LICENCIADO",
  "motivo": "Licença médica",
  "data_inicio": "2023-03-01",
  "data_fim": "2023-03-31",
  "documento_url": "https://storage.cmm.am.gov.br/docs/atestado.pdf"
}
```

---

## 2. API DE PROPOSIÇÕES

### 2.1 Listar Proposições
```http
GET /proposicoes
```

**Query Parameters:**
- `tipo`: PROJETO_LEI, PROJETO_RESOLUCAO, PROJETO_DECRETO, EMENDA_LOMAN
- `situacao`: EM_TRAMITACAO, APROVADA, REJEITADA, ARQUIVADA, SANCIONADA
- `autor`: ID do vereador
- `ano`: Ano de apresentação
- `regime`: ORDINARIO, URGENTE, PRIORIDADE
- `q`: Busca textual (ementa, indexação)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id_proposicao": 123,
        "tipo": "PROJETO_LEI",
        "numero": 45,
        "ano": 2023,
        "ementa": "Dispõe sobre a criação de áreas de lazer...",
        "autor": {
          "id_vereador": 1,
          "nome_parlamentar": "João Silva"
        },
        "situacao": "EM_TRAMITACAO",
        "regime_tramitacao": "ORDINARIO",
        "data_apresentacao": "2023-03-15",
        "comissao_atual": {
          "id_comissao": 2,
          "nome": "Comissão de Constituição, Justiça e Redação",
          "data_entrada": "2023-03-16",
          "data_limite": "2023-03-23"
        },
        "em_atraso": false
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 15,
      "total_items": 289,
      "items_per_page": 20
    }
  }
}
```

### 2.2 Obter Proposição
```http
GET /proposicoes/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_proposicao": 123,
    "tipo": "PROJETO_LEI",
    "numero": 45,
    "ano": 2023,
    "ementa": "Dispõe sobre a criação de áreas de lazer...",
    "justificativa": "Texto da justificativa...",
    "texto_integral": "Artigo 1º...",
    "autor_principal": {
      "id_vereador": 1,
      "nome_parlamentar": "João Silva"
    },
    "coautores": [
      {
        "id_vereador": 5,
        "nome_parlamentar": "Maria Souza"
      }
    ],
    "origem": "VEREADOR",
    "regime_tramitacao": "ORDINARIO",
    "situacao": "EM_TRAMITACAO",
    "data_apresentacao": "2023-03-15",
    "data_protocolo": "2023-03-15T14:30:00Z",
    "legislatura": 19,
    "tramitacao": [
      {
        "id_tramitacao": 456,
        "comissao": {
          "id_comissao": 2,
          "nome": "CCJ",
          "sigla": "CCJ"
        },
        "data_entrada": "2023-03-16",
        "data_limite": "2023-03-23",
        "situacao": "AGUARDANDO_PARECER",
        "relator": {
          "id_vereador": 8,
          "nome_parlamentar": "Pedro Costa"
        }
      }
    ],
    "emendas": [],
    "documentos": [
      {
        "id_documento": 789,
        "nome_arquivo": "projeto-lei-45-2023.pdf",
        "url": "https://storage.cmm.am.gov.br/docs/pl-45-2023.pdf"
      }
    ]
  }
}
```

### 2.3 Criar Proposição
```http
POST /proposicoes
```

**Request Body:**
```json
{
  "tipo": "PROJETO_LEI",
  "ementa": "Dispõe sobre...",
  "justificativa": "Texto...",
  "texto_integral": "Art. 1º...",
  "id_autor_principal": 1,
  "coautores": [5, 7],
  "origem": "VEREADOR",
  "regime_tramitacao": "ORDINARIO",
  "documentos": ["base64_encoded_file"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_proposicao": 124,
    "tipo": "PROJETO_LEI",
    "numero": 46,
    "ano": 2023,
    "protocolo": "CMM-2023/0046"
  },
  "message": "Proposição criada com sucesso"
}
```

### 2.4 Adicionar Emenda
```http
POST /proposicoes/{id}/emendas
```

**Request Body:**
```json
{
  "tipo": "ADITIVA",
  "texto_emenda": "Adicione-se ao Art. 3º...",
  "justificativa": "A emenda visa...",
  "id_autor": 5
}
```

### 2.5 Alterar Regime de Tramitação
```http
PUT /proposicoes/{id}/regime
```

**Request Body:**
```json
{
  "regime": "URGENTE",
  "justificativa": "Situação emergencial..."
}
```

---

## 3. API DE SESSÕES PLENÁRIAS

### 3.1 Listar Sessões
```http
GET /sessoes
```

**Query Parameters:**
- `tipo`: ORDINARIA, EXTRAORDINARIA, PREPARATORIA, SOLENE
- `data_inicio`: Data inicial (YYYY-MM-DD)
- `data_fim`: Data final (YYYY-MM-DD)
- `situacao`: CONVOCADA, REALIZADA, CANCELADA
- `legislatura`: Número da legislatura

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id_sessao": 234,
        "tipo": "ORDINARIA",
        "numero": 15,
        "legislatura": 19,
        "sessao_legislativa": 1,
        "data_sessao": "2023-03-20",
        "hora_inicio": "09:00:00",
        "hora_fim": "12:30:00",
        "quorum_abertura": 25,
        "situacao": "REALIZADA",
        "video_url": "https://youtube.com/watch?v=xxxxx",
        "ata_aprovada": true
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 8,
      "total_items": 156,
      "items_per_page": 20
    }
  }
}
```

### 3.2 Obter Sessão
```http
GET /sessoes/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_sessao": 234,
    "tipo": "ORDINARIA",
    "numero": 15,
    "legislatura": 19,
    "sessao_legislativa": 1,
    "data_sessao": "2023-03-20",
    "hora_inicio": "09:00:00",
    "hora_fim": "12:30:00",
    "local": "Plenário Adriano Jorge",
    "quorum_abertura": 25,
    "presidente_sessao": {
      "id_vereador": 10,
      "nome_parlamentar": "Carlos Almeida"
    },
    "situacao": "REALIZADA",
    "video_url": "https://youtube.com/watch?v=xxxxx",
    "ordem_dia": [
      {
        "sequencia": 1,
        "proposicao": {
          "id_proposicao": 123,
          "tipo": "PROJETO_LEI",
          "numero": 45,
          "ano": 2023,
          "ementa": "Dispõe sobre..."
        },
        "tipo_deliberacao": "DISCUSSAO_VOTACAO",
        "regime": "ORDINARIO"
      }
    ],
    "presencas": [
      {
        "vereador": {
          "id_vereador": 1,
          "nome_parlamentar": "João Silva"
        },
        "presente": true,
        "hora_chegada": "08:55:00"
      }
    ],
    "votacoes": [
      {
        "id_votacao": 567,
        "proposicao": {
          "id_proposicao": 123,
          "identificacao": "PL 45/2023"
        },
        "resultado": "APROVADA",
        "votos_sim": 28,
        "votos_nao": 10,
        "votos_abstencao": 3
      }
    ],
    "ata": {
      "id_ata": 234,
      "aprovada": true,
      "data_aprovacao": "2023-03-27",
      "texto_url": "https://storage.cmm.am.gov.br/atas/ata-234.pdf"
    }
  }
}
```

### 3.3 Criar Sessão
```http
POST /sessoes
```

**Request Body:**
```json
{
  "tipo": "ORDINARIA",
  "data_sessao": "2023-03-20",
  "hora_inicio": "09:00:00",
  "legislatura": 19,
  "sessao_legislativa": 1,
  "local": "Plenário Adriano Jorge"
}
```

### 3.4 Registrar Presença
```http
POST /sessoes/{id}/presencas
```

**Request Body:**
```json
{
  "presencas": [
    {
      "id_vereador": 1,
      "presente": true,
      "hora_chegada": "08:55:00"
    },
    {
      "id_vereador": 2,
      "presente": false,
      "justificada": true,
      "justificativa": "Licença médica"
    }
  ]
}
```

### 3.5 Incluir Matéria na Ordem do Dia
```http
POST /sessoes/{id}/ordem-dia
```

**Request Body:**
```json
{
  "id_proposicao": 123,
  "sequencia": 5,
  "tipo_deliberacao": "DISCUSSAO_VOTACAO",
  "regime": "URGENTE",
  "incluida_por": "REQUERIMENTO"
}
```

---

## 4. API DE VOTAÇÕES

### 4.1 Listar Votações
```http
GET /votacoes
```

**Query Parameters:**
- `id_sessao`: ID da sessão
- `id_proposicao`: ID da proposição
- `data_inicio`: Data inicial
- `data_fim`: Data final
- `resultado`: APROVADA, REJEITADA, PREJUDICADA

### 4.2 Obter Votação
```http
GET /votacoes/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_votacao": 567,
    "sessao": {
      "id_sessao": 234,
      "data_sessao": "2023-03-20"
    },
    "proposicao": {
      "id_proposicao": 123,
      "tipo": "PROJETO_LEI",
      "numero": 45,
      "ano": 2023,
      "ementa": "Dispõe sobre..."
    },
    "tipo_votacao": "NOMINAL",
    "quorum_exigido": "MAIORIA_ABSOLUTA",
    "data_votacao": "2023-03-20T11:30:00Z",
    "votos_sim": 28,
    "votos_nao": 10,
    "votos_abstencao": 3,
    "votos_obstrucao": 0,
    "total_votantes": 41,
    "resultado": "APROVADA",
    "votos_detalhados": [
      {
        "vereador": {
          "id_vereador": 1,
          "nome_parlamentar": "João Silva"
        },
        "voto": "SIM"
      },
      {
        "vereador": {
          "id_vereador": 2,
          "nome_parlamentar": "Maria Souza"
        },
        "voto": "NAO",
        "declaracao_voto": "Voto contrário porque..."
      }
    ]
  }
}
```

### 4.3 Criar Votação
```http
POST /votacoes
```

**Request Body:**
```json
{
  "id_sessao": 234,
  "id_proposicao": 123,
  "tipo_votacao": "NOMINAL",
  "quorum_exigido": "MAIORIA_ABSOLUTA"
}
```

### 4.4 Registrar Votos
```http
POST /votacoes/{id}/votos
```

**Request Body:**
```json
{
  "votos": [
    {
      "id_vereador": 1,
      "voto": "SIM"
    },
    {
      "id_vereador": 2,
      "voto": "NAO",
      "declaracao_voto": "Voto contrário..."
    },
    {
      "id_vereador": 3,
      "voto": "ABSTENCAO"
    }
  ]
}
```

### 4.5 Finalizar Votação
```http
PUT /votacoes/{id}/finalizar
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_votacao": 567,
    "resultado": "APROVADA",
    "votos_sim": 28,
    "votos_nao": 10,
    "votos_abstencao": 3,
    "quorum_alcancado": true
  }
}
```

---

## 5. API DE COMISSÕES

### 5.1 Listar Comissões
```http
GET /comissoes
```

**Query Parameters:**
- `tipo`: PERMANENTE, ESPECIAL, CPI, PROCESSANTE
- `ativa`: true/false
- `legislatura`: Número da legislatura

### 5.2 Obter Comissão
```http
GET /comissoes/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_comissao": 3,
    "nome": "Comissão de Finanças, Economia e Orçamento",
    "sigla": "CFO",
    "tipo": "PERMANENTE",
    "competencia": "Opinar sobre matéria financeira...",
    "ativa": true,
    "legislatura": 19,
    "membros": [
      {
        "id_membro": 45,
        "vereador": {
          "id_vereador": 1,
          "nome_parlamentar": "João Silva"
        },
        "cargo": "PRESIDENTE",
        "data_designacao": "2021-02-01"
      },
      {
        "id_membro": 46,
        "vereador": {
          "id_vereador": 5,
          "nome_parlamentar": "Maria Souza"
        },
        "cargo": "TITULAR",
        "data_designacao": "2021-02-01"
      }
    ],
    "proposicoes_tramitando": 15,
    "pareceres_pendentes": 8
  }
}
```

### 5.3 Adicionar Membro
```http
POST /comissoes/{id}/membros
```

**Request Body:**
```json
{
  "id_vereador": 1,
  "cargo": "PRESIDENTE",
  "data_designacao": "2021-02-01"
}
```

### 5.4 Remover Membro
```http
DELETE /comissoes/{id}/membros/{id_membro}
```

### 5.5 Listar Pareceres
```http
GET /comissoes/{id}/pareceres
```

---

## 6. API DE PARECERES

### 6.1 Criar Parecer
```http
POST /pareceres
```

**Request Body:**
```json
{
  "id_tramitacao": 456,
  "id_relator": 8,
  "tipo": "MERITO",
  "conclusao": "FAVORAVEL",
  "texto_parecer": "O relator, após análise...",
  "fundamentacao": "Com base no artigo..."
}
```

### 6.2 Obter Parecer
```http
GET /pareceres/{id}
```

### 6.3 Aprovar Parecer na Comissão
```http
PUT /pareceres/{id}/aprovar
```

**Request Body:**
```json
{
  "votos_favoraveis": 5,
  "votos_contrarios": 2,
  "data_aprovacao": "2023-03-22"
}
```

---

## 7. API DE ORÇAMENTO

### 7.1 Obter Orçamento
```http
GET /orcamentos/{ano}
```

### 7.2 Listar Dotações
```http
GET /orcamentos/{ano}/dotacoes
```

**Query Parameters:**
- `orgao`: Nome do órgão
- `funcao`: Nome da função
- `programa`: Nome do programa

### 7.3 Adicionar Emenda Orçamentária
```http
POST /orcamentos/{ano}/emendas
```

**Request Body:**
```json
{
  "id_autor": 1,
  "tipo": "INDIVIDUAL",
  "texto_emenda": "Acrescente-se...",
  "valor": 500000.00,
  "finalidade": "Construção de praça..."
}
```

### 7.4 Executar Orçamento
```http
POST /orcamentos/{ano}/execucao
```

**Request Body:**
```json
{
  "id_dotacao": 123,
  "tipo_movimentacao": "EMPENHO",
  "valor": 50000.00,
  "descricao": "Contratação de serviços..."
}
```

---

## 8. API DE LEIS

### 8.1 Listar Leis
```http
GET /leis
```

**Query Parameters:**
- `tipo`: ORDINARIA, COMPLEMENTAR
- `ano`: Ano da lei
- `q`: Busca textual
- `ativa`: true/false

### 8.2 Obter Lei
```http
GET /leis/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_lei": 789,
    "tipo": "ORDINARIA",
    "numero": 2345,
    "ano": 2023,
    "ementa": "Dispõe sobre...",
    "texto_lei": "Art. 1º...",
    "data_sancao": "2023-04-10",
    "data_publicacao": "2023-04-11",
    "data_vigencia": "2023-04-11",
    "ativa": true,
    "proposicao_origem": {
      "id_proposicao": 123,
      "tipo": "PROJETO_LEI",
      "numero": 45,
      "ano": 2023
    }
  }
}
```

### 8.3 Pesquisar Legislação
```http
GET /leis/pesquisa
```

**Query Parameters:**
- `q`: Termo de busca
- `tipo`: Tipo de lei
- `ano_inicio`: Ano inicial
- `ano_fim`: Ano final
- `tags`: Tags separadas por vírgula

---

## 9. API DE VETOS

### 9.1 Registrar Veto
```http
POST /vetos
```

**Request Body:**
```json
{
  "id_proposicao": 123,
  "tipo": "PARCIAL",
  "razoes": "O Executivo veta os artigos 3º e 5º...",
  "data_veto": "2023-04-05"
}
```

### 9.2 Listar Vetos
```http
GET /vetos
```

### 9.3 Apreciar Veto
```http
PUT /vetos/{id}/apreciar
```

**Request Body:**
```json
{
  "id_votacao": 890,
  "resultado": "DERRUBADO"
}
```

---

## 10. API DE RELATÓRIOS E ESTATÍSTICAS

### 10.1 Estatísticas Gerais
```http
GET /estatisticas/geral
```

**Response:**
```json
{
  "success": true,
  "data": {
    "legislatura_atual": 19,
    "total_vereadores": 41,
    "vereadores_ativos": 39,
    "proposicoes_ano": {
      "total": 245,
      "em_tramitacao": 120,
      "aprovadas": 89,
      "rejeitadas": 36
    },
    "sessoes_ano": {
      "total": 45,
      "ordinarias": 40,
      "extraordinarias": 5
    },
    "presenca_media": 92.3
  }
}
```

### 10.2 Produtividade por Vereador
```http
GET /estatisticas/vereadores/{id}/produtividade
```

**Query Parameters:**
- `ano`: Ano de referência

**Response:**
```json
{
  "success": true,
  "data": {
    "vereador": {
      "id_vereador": 1,
      "nome_parlamentar": "João Silva"
    },
    "ano": 2023,
    "proposicoes": {
      "total": 45,
      "aprovadas": 23,
      "rejeitadas": 8,
      "em_tramitacao": 14,
      "taxa_aprovacao": 51.1
    },
    "presenca": {
      "total_sessoes": 45,
      "presencas": 43,
      "faltas_justificadas": 2,
      "faltas_injustificadas": 0,
      "percentual": 95.6
    },
    "atuacao_comissoes": [
      {
        "comissao": "Finanças",
        "cargo": "PRESIDENTE",
        "pareceres_emitidos": 34
      }
    ]
  }
}
```

### 10.3 Relatório de Tramitação
```http
GET /estatisticas/tramitacao
```

**Query Parameters:**
- `ano`: Ano de referência
- `tipo_proposicao`: Tipo de proposição

### 10.4 Relatório Financeiro
```http
GET /estatisticas/financeiro
```

**Query Parameters:**
- `mes`: Mês de referência (1-12)
- `ano`: Ano de referência

---

## 11. API DE DOCUMENTOS

### 11.1 Upload de Documento
```http
POST /documentos
```

**Request (multipart/form-data):**
```
arquivo: [file]
tipo_documento: "PROPOSICAO"
id_referencia: 123
tabela_referencia: "proposicao"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_documento": 456,
    "nome_arquivo": "projeto-lei-45-2023.pdf",
    "url": "https://storage.cmm.am.gov.br/docs/pl-45-2023.pdf",
    "hash_arquivo": "a1b2c3d4e5f6..."
  }
}
```

### 11.2 Download de Documento
```http
GET /documentos/{id}/download
```

### 11.3 Assinar Documento Digitalmente
```http
POST /documentos/{id}/assinar
```

**Request Body:**
```json
{
  "certificado": "base64_encoded_certificate",
  "pin": "encrypted_pin"
}
```

---

## 12. API DE PUBLICAÇÕES

### 12.1 Listar Edições do e-DOLM
```http
GET /publicacoes/dolm
```

**Query Parameters:**
- `data_inicio`: Data inicial
- `data_fim`: Data final
- `numero_edicao`: Número da edição

### 12.2 Obter Edição
```http
GET /publicacoes/dolm/{id}
```

### 12.3 Publicar no e-DOLM
```http
POST /publicacoes/dolm
```

**Request Body:**
```json
{
  "data_publicacao": "2023-03-20",
  "itens": [
    {
      "tipo_item": "LEI",
      "id_referencia": 789,
      "tabela_referencia": "lei"
    },
    {
      "tipo_item": "ATA",
      "id_referencia": 234,
      "tabela_referencia": "ata"
    }
  ]
}
```

---

## 13. API DE AUDITORIA

### 13.1 Listar Logs
```http
GET /auditoria/logs
```

**Query Parameters:**
- `id_usuario`: ID do usuário
- `tabela`: Nome da tabela
- `acao`: INSERT, UPDATE, DELETE
- `data_inicio`: Data inicial
- `data_fim`: Data final

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id_log": 12345,
        "usuario": {
          "id_usuario": 5,
          "username": "joao.silva"
        },
        "tabela": "proposicao",
        "id_registro": 123,
        "acao": "UPDATE",
        "dados_anteriores": {
          "situacao": "EM_TRAMITACAO"
        },
        "dados_novos": {
          "situacao": "APROVADA"
        },
        "ip_address": "192.168.1.100",
        "created_at": "2023-03-20T11:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 50,
      "total_items": 1000,
      "items_per_page": 20
    }
  }
}
```

---

## 14. WEBHOOKS

### 14.1 Configurar Webhook
```http
POST /webhooks
```

**Request Body:**
```json
{
  "evento": "PROPOSICAO_CRIADA",
  "url": "https://sistema-externo.com/webhook",
  "secret": "webhook_secret_key"
}
```

### Eventos Disponíveis:
- `PROPOSICAO_CRIADA`
- `PROPOSICAO_APROVADA`
- `PROPOSICAO_REJEITADA`
- `SESSAO_CONVOCADA`
- `SESSAO_REALIZADA`
- `VOTACAO_REALIZADA`
- `LEI_PROMULGADA`
- `VETO_RECEBIDO`
- `PARECER_EMITIDO`

---

## 15. WEBSOCKETS

### 15.1 Conexão
```
ws://api.cmm.am.gov.br/v1/ws?token={auth_token}
```

### 15.2 Eventos em Tempo Real
```json
{
  "event": "SESSAO_INICIADA",
  "data": {
    "id_sessao": 234,
    "tipo": "ORDINARIA",
    "data_sessao": "2023-03-20"
  },
  "timestamp": "2023-03-20T09:00:00Z"
}
```

### Canais Disponíveis:
- `sessoes`: Eventos de sessões plenárias
- `votacoes`: Eventos de votações em tempo real
- `proposicoes`: Atualizações de proposições
- `notificacoes`: Notificações gerais do sistema

---

## CÓDIGOS DE ERRO

| Código | Descrição |
|--------|-----------|
| AUTH_001 | Token inválido ou expirado |
| AUTH_002 | Permissão insuficiente |
| VAL_001 | Dados de entrada inválidos |
| VAL_002 | Campo obrigatório ausente |
| BUS_001 | Quórum insuficiente |
| BUS_002 | Prazo expirado |
| BUS_003 | Situação inválida para operação |
| BUS_004 | Vereador já votou |
| BUS_005 | Proposição não encontrada |
| SYS_001 | Erro interno do servidor |
| SYS_002 | Serviço temporariamente indisponível |

---

## RATE LIMITING

- **Usuários autenticados:** 1000 requisições/hora
- **APIs públicas:** 100 requisições/hora
- **Webhooks:** 50 requisições/minuto

**Headers de Resposta:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1678456800
```

---

## VERSIONAMENTO

A API segue o versionamento semântico e mantém compatibilidade retroativa dentro da mesma versão major. Novas versões serão anunciadas com 90 dias de antecedência.

**Versões Suportadas:**
- v1 (atual)
- Deprecation: v0 (até 31/12/2025)
