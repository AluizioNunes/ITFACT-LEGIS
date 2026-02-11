# 🗺️ ROADMAP COMPLETO DE TELAS - CÂMARA DIGITAL
## Sistema de Gestão Eletrônica de Documentos Legislativos

**Baseado em:** 477 tabelas, 265+ funcionalidades  
**Framework:** Next.js 15+, React 19, shadcn/ui, Tailwind CSS 4  
**Data:** 07/02/2026

---

## 📋 ESTRUTURA DE MENUS E TELAS

### 🏠 HOME
- **Login.tsx** - Autenticação do usuário
- **Dashboard.tsx** - Dashboard principal com widgets

---

### 📄 PROTOCOLOS (Menu Principal)

#### 📥 Entrada de Protocolos
- **ProtocolosEntrada.tsx** - Lista de protocolos de entrada
- **ProtocoloEntradaModal.tsx** - Cadastro/edição de protocolo entrada
- **ProtocoloDetalhes.tsx** - Visualização completa do protocolo
- **ProtocoloAnexosModal.tsx** - Gestão de anexos

#### 📤 Saída de Protocolos
- **ProtocolosSaida.tsx** - Lista de protocolos de saída
- **ProtocoloSaidaModal.tsx** - Cadastro/edição de protocolo saída

#### 🔍 Pesquisa
- **PesquisaSimples.tsx** - Pesquisa básica de protocolos
- **PesquisaAvancada.tsx** - Pesquisa avançada com múltiplos filtros
- **PesquisaResultados.tsx** - Exibição de resultados

#### 📊 Relatórios de Protocolos
- **RelatoriosProtocolos.tsx** - Central de relatórios
- **RelatorioPersonalizado.tsx** - Criador de relatórios customizados

---

### 🔄 TRAMITAÇÃO (Menu Principal)

#### ➡️ Tramitação de Documentos
- **TramitacaoRecebida.tsx** - Caixa de entrada (tramitações recebidas)
- **TramitacaoEnviada.tsx** - Caixa de saída (tramitações enviadas)
- **TramitarDocumentoModal.tsx** - Modal para tramitar documento
- **RecebimentoModal.tsx** - Modal para receber tramitação
- **DistribuicaoModal.tsx** - Modal para distribuição de processos

#### 📋 Gestão de Tramitação
- **HistoricoTramitacao.tsx** - Histórico completo de tramitações
- **TramitacaoLote.tsx** - Tramitação em lote
- **TramitacaoGuiaModal.tsx** - Geração de guia de tramitação

#### ⏰ Prazos e Controles
- **ControleprazosModal.tsx** - Controle de prazos de resposta
- **Prazos.tsx** - Lista de prazos vencidos/a vencer
- **DiligenciasModal.tsx** - Registro de diligências

#### 🚫 Sobrestamento
- **Sobrestar.tsx** - Lista de processos sobrestados
- **SobrestarModal.tsx** - Modal para sobrestar processo

---

### ✍️ MINUTAS (Menu Principal)

#### 📝 Gestão de Minutas
- **Minutas.tsx** - Lista de minutas cadastradas
- **MinutaModal.tsx** - Criar/editar minuta
- **MinutaEditor.tsx** - Editor de texto rico para minutas
- **MinutaVersoesModal.tsx** - Controle de versões da minuta

#### ✅ Aprovação de Minutas
- **MinutasAprovacao.tsx** - Fila de aprovação
- **AprovarMinutaModal.tsx** - Modal para aprovar/rejeitar

#### 📤 Expedição de Minutas
- **MinutasExpedir.tsx** - Lista para expedição
- **ExpedicaoMinutaModal.tsx** - Modal de expedição

---

### 🏛️ PROPOSITURAS LEGISLATIVAS (Menu Principal)

#### 📜 Gestão de Proposituras
- **PropositurasLegislativas.tsx** - Lista de proposituras
- **ProposituraModal.tsx** - Cadastrar/editar propositura
- **ProposituraDetalhes.tsx** - Detalhes completos da propositura
- **ProposituraAnexosModal.tsx** - Anexos da propositura

#### 🔄 Tramitação Legislativa
- **PropostituraTramitacao.tsx** - Tramitação específica legislativa
- **TramitarProposituraModal.tsx** - Modal para tramitar propositura
- **ProposituraFases.tsx** - Gestão de fases

#### 📋 Comissões
- **Comissoes.tsx** - Lista de comissões
- **ComissaoModal.tsx** - Cadastrar/editar comissão
- **ComissaoMembros.tsx** - Gestão de membros
- **ComissaoParecer.tsx** - Pareceres de comissões
- **ParecerModal.tsx** - Criar/editar parecer

#### 🗳️ Votações
- **Votacoes.tsx** - Lista de votações
- **VotacaoModal.tsx** - Registrar votação
- **ResultadoVotacao.tsx** - Resultado detalhado

#### ✏️ Emendas
- **Emendas.tsx** - Lista de emendas
- **EmendaModal.tsx** - Cadastrar/editar emenda

---

### ✅ ASSINATURAS DIGITAIS (Menu Principal)

#### 🔐 Assinatura de Documentos
- **DocumentosAssinar.tsx** - Fila de documentos para assinar
- **AssinaturaDigitalModal.tsx** - Interface de assinatura ICP-Brasil
- **AssinaturaLogin.tsx** - Assinatura com login/senha

#### ✔️ Validação de Assinaturas
- **ValidarAssinatura.tsx** - Validar assinatura digital
- **AssinaturaDetalhes.tsx** - Detalhes da assinatura validada

#### 📋 Relatórios de Assinaturas
- **RelatorioAssinaturas.tsx** - Relatório de documentos assinados

---

### 📁 ARQUIVO (Menu Principal)

#### 📦 Gestão de Arquivo
- **Arquivo.tsx** - Gestão de arquivo físico
- **ArquivarModal.tsx** - Modal para arquivamento
- **Inventario.tsx** - Inventário de documentos arquivados
- **InventarioModal.tsx** - Criar/editar inventário

#### 📮 Caixas de Arquivo
- **Caixas.tsx** - Gestão de caixas
- **CaixaModal.tsx** - Cadastrar/editar caixa
- **CaixaEtiqueta.tsx** - Gerar etiquetas de caixas

#### 🔄 Empréstimos
- **Emprestimos.tsx** - Controle de empréstimos
- **EmprestimoModal.tsx** - Registrar empréstimo
- **DevolucaoModal.tsx** - Registrar devolução

#### 🗑️ Eliminação
- **Eliminacao.tsx** - Processos de eliminação
- **EliminacaoModal.tsx** - Registrar eliminação

---

### 📚 ACERVO DOCUMENTAL (Menu Principal)

#### 📖 Gestão de Acervo
- **AcervoDocumentos.tsx** - Catálogo de documentos históricos
- **AcervoDocumentoModal.tsx** - Catalogar documento
- **AcervoTipos.tsx** - Tipos de acervo

#### 🔍 Pesquisa no Acervo
- **PesquisaAcervo.tsx** - Pesquisa no acervo histórico

---

### 🏛️ LEGISLATIVO (Menu Principal)

#### 👥 Parlamentares
- **Parlamentares.tsx** - Lista de parlamentares
- **ParlamentarModal.tsx** - Cadastrar/editar parlamentar
- **ParlamentarDetalhes.tsx** - Perfil completo

#### 🎭 Partidos Políticos
- **Partidos.tsx** - Lista de partidos
- **PartidoModal.tsx** - Cadastrar/editar partido
- **FiliacoesPartidarias.tsx** - Gestão de filiações

#### 📅 Mandatos
- **Mandatos.tsx** - Gestão de mandatos
- **MandatoModal.tsx** - Cadastrar/editar mandato

#### 📆 Legislaturas
- **Legislaturas.tsx** - Gestão de legislaturas
- **LegislaturaModal.tsx** - Cadastrar/editar legislatura
- **SessoesLegislativas.tsx** - Sessões legislativas

#### 🏢 Mesa Diretora
- **MesaDiretora.tsx** - Composição da mesa diretora
- **MesaDiretoraModal.tsx** - Editar mesa diretora

---

### 🎤 SESSÕES PLENÁRIAS (Menu Principal)

#### 📋 Gestão de Sessões
- **SessoesPlenarias.tsx** - Lista de sessões plenárias
- **SessaoPlenariaModal.tsx** - Cadastrar/editar sessão
- **SessaoDetalhes.tsx** - Detalhes da sessão

#### 📝 Pautas
- **Pautas.tsx** - Gestão de pautas
- **PautaModal.tsx** - Criar/editar pauta
- **OrdemDia.tsx** - Ordem do dia

#### ✅ Presenças
- **RegistroPresenca.tsx** - Registro de presença
- **ListaPresenca.tsx** - Lista de presença

#### 📄 Atas
- **Atas.tsx** - Atas de sessões
- **AtaModal.tsx** - Criar/editar ata

---

### 📊 RELATÓRIOS (Menu Principal)

#### 📈 Relatórios Gerenciais
- **RelatoriosGerenciais.tsx** - Dashboard de relatórios
- **RelatorioProtocolos.tsx** - Relatório de protocolos
- **RelatorioTramitacao.tsx** - Relatório de tramitação
- **RelatorioProdutividade.tsx** - Relatório de produtividade

#### 📉 Estatísticas
- **Estatisticas.tsx** - Estatísticas do sistema
- **EstatisticasOrgao.tsx** - Estatísticas por órgão

#### 📊 Dashboards
- **DashboardExecutivo.tsx** - Dashboard executivo
- **DashboardOperacional.tsx** - Dashboard operacional

---

### ⚙️ SISTEMA (Menu Principal)

#### 🏠 Casa Principal
- **CasaPrincipal.tsx** - Dashboard da Casa Legislativa (Usuários, Gabinetes, etc)
- **ModalCasa Legislativa** - Cadastro institucional da Câmara

#### 🏢 Estrutura e Pessoal
- **Gabinetes.tsx** - Gestão de Gabinetes
- **Departamentos.tsx** - Organograma (antigo Órgãos)
- **Servidores.tsx** - Cadastro de pessoal
- **Permissoes.tsx** - Gestão de RBAC
- **Perfil.tsx** - Perfil do usuário logado
sões
- **PermissoesModal.tsx** - Gerenciar permissões específicas

#### 🏢 Órgãos
- **Orgaos.tsx** - Gestão de órgãos
- **OrgaoModal.tsx** - Cadastrar/editar órgão
- **OrgaoEstrutura.tsx** - Estrutura organizacional

#### 📋 Assuntos
- **Assuntos.tsx** - Gestão de assuntos (classificação)
- **AssuntoModal.tsx** - Cadastrar/editar assunto
- **AssuntoArvore.tsx** - Árvore hierárquica

#### 📝 Tipos de Documento
- **TiposDocumento.tsx** - Gestão de tipos
- **TipoDocumentoModal.tsx** - Cadastrar/editar tipo

#### 🔄 Situações e Status
- **Situacoes.tsx** - Gestão de situações/status
- **SituacaoModal.tsx** - Cadastrar/editar situação

#### ⚙️ Configurações
- **ConfiguracoesGerais.tsx** - Configurações do sistema
- **ConfiguracoesNumeracao.tsx** - Numeração de documentos
- **ConfiguracoesIntegracao.tsx** - Integrações externas

---

### 🔍 PESQUISA INTELIGENTE (Menu Principal)

#### 🤖 Graphiti Search
- **PesquisaInteligente.tsx** - Pesquisa com Memória em Grafo (Graphiti)
- **PesquisaSemantica.tsx** - Busca semântica dinâmica

---

### 🔔 NOTIFICAÇÕES (Menu Principal)

#### 📬 Central de Notificações
- **Notificacoes.tsx** - Central de notificações
- **NotificacoesConfiguracao.tsx** - Configurar notificações

---

### 🌐 PORTAL EXTERNO (Menu Principal)

#### 👤 Usuários Externos
- **UsuariosExternos.tsx** - Gestão de usuários externos
- **UsuarioExternoModal.tsx** - Cadastrar usuário externo

#### 📋 Consulta Pública
- **ConsultaPublica.tsx** - Portal de consulta pública
- **ConsultarProtocolo.tsx** - Consultar protocolo (público)

---

### 📱 MOBILE (Menu Principal)

#### 📲 App Mobile
- **AssinaturaMobile.tsx** - Assinatura via mobile
- **ConsultaMobile.tsx** - Consulta via mobile

---

### 📖 AJUDA (Menu Principal)

#### ❓ Suporte
- **Ajuda.tsx** - Central de ajuda
- **Manual.tsx** - Manual do usuário
- **Tutoriais.tsx** - Tutoriais em vídeo
- **FAQ.tsx** - Perguntas frequentes

---

### 👤 MEU PERFIL (Menu Usuário)

#### 👤 Perfil do Usuário
- **MeuPerfil.tsx** - Dados do perfil
- **AlterarSenha.tsx** - Alterar senha
- **ConfiguracoesUsuario.tsx** - Preferências do usuário

---

## 📊 RESUMO QUANTITATIVO

| Categoria | Quantidade de Telas |
|-----------|---------------------|
| Protocolos | 8 telas |
| Tramitação | 10 telas |
| Minutas | 7 telas |
| Proposituras Legislativas | 15 telas |
| Assinaturas Digitais | 6 telas |
| Arquivo | 11 telas |
| Acervo Documental | 4 telas |
| Legislativo | 14 telas |
| Sessões Plenárias | 10 telas |
| Relatórios | 7 telas |
| Gerência (Admin) | 21 telas |
| Pesquisa Inteligente | 2 telas |
| Notificações | 2 telas |
| Portal Externo | 4 telas |
| Mobile | 2 telas |
| Ajuda | 4 telas |
| Meu Perfil | 3 telas |

**TOTAL: 130+ telas principais**  
**+ ~50 modais auxiliares**  
**= ~180 componentes de UI**

---

## 🎨 PADRÕES DE NOMENCLATURA

### Páginas (Telas Principais)
```
PascalCase.tsx
Exemplos: Usuarios.tsx, TramitacaoRecebida.tsx, Protocolos.tsx
```

### Modais
```
[Nome]Modal.tsx
Exemplos: UsuarioModal.tsx, TramitarDocumentoModal.tsx, MinutaModal.tsx
```

### Componentes
```
PascalCase.tsx (sem sufixo)
Exemplos: DataTable.tsx, Button.tsx, Input.tsx
```

---

## 📁 ESTRUTURA DE PASTAS

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                    # Login.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                      # Layout com Navbar/Sidebar
│   │   ├── page.tsx                        # Dashboard.tsx
│   │   │
│   │   ├── protocolos/
│   │   │   ├── entrada/
│   │   │   │   └── page.tsx                # ProtocolosEntrada.tsx
│   │   │   ├── saida/
│   │   │   │   └── page.tsx                # ProtocolosSaida.tsx
│   │   │   └── pesquisa/
│   │   │       ├── simples/
│   │   │       │   └── page.tsx            # PesquisaSimples.tsx
│   │   │       └── avancada/
│   │   │           └── page.tsx            # PesquisaAvancada.tsx
│   │   │
│   │   ├── tramitacao/
│   │   │   ├── recebida/
│   │   │   │   └── page.tsx                # TramitacaoRecebida.tsx
│   │   │   ├── enviada/
│   │   │   │   └── page.tsx                # TramitacaoEnviada.tsx
│   │   │   └── historico/
│   │   │       └── page.tsx                # HistoricoTramitacao.tsx
│   │   │
│   │   ├── minutas/
│   │   │   ├── page.tsx                    # Minutas.tsx
│   │   │   └── aprovacao/
│   │   │       └── page.tsx                # MinutasAprovacao.tsx
│   │   │
│   │   ├── proposituras/
│   │   │   ├── page.tsx                    # PropositurasLegislativas.tsx
│   │   │   ├── tramitacao/
│   │   │   │   └── page.tsx                # PropostituraTramitacao.tsx
│   │   │   ├── comissoes/
│   │   │   │   └── page.tsx                # Comissoes.tsx
│   │   │   └── votacoes/
│   │   │       └── page.tsx                # Votacoes.tsx
│   │   │
│   │   ├── assinaturas/
│   │   │   ├── assinar/
│   │   │   │   └── page.tsx                # DocumentosAssinar.tsx
│   │   │   └── validar/
│   │   │       └── page.tsx                # ValidarAssinatura.tsx
│   │   │
│   │   ├── arquivo/
│   │   │   ├── page.tsx                    # Arquivo.tsx
│   │   │   ├── caixas/
│   │   │   │   └── page.tsx                # Caixas.tsx
│   │   │   └── emprestimos/
│   │   │       └── page.tsx                # Emprestimos.tsx
│   │   │
│   │   ├── acervo/
│   │   │   └── page.tsx                    # AcervoDocumentos.tsx
│   │   │
│   │   ├── legislativo/
│   │   │   ├── parlamentares/
│   │   │   │   └── page.tsx                # Parlamentares.tsx
│   │   │   ├── partidos/
│   │   │   │   └── page.tsx                # Partidos.tsx
│   │   │   └── mandatos/
│   │   │       └── page.tsx                # Mandatos.tsx
│   │   │
│   │   ├── sessoes/
│   │   │   ├── page.tsx                    # SessoesPlenarias.tsx
│   │   │   ├── pautas/
│   │   │   │   └── page.tsx                # Pautas.tsx
│   │   │   └── atas/
│   │   │       └── page.tsx                # Atas.tsx
│   │   │
│   │   ├── relatorios/
│   │   │   └── page.tsx                    # RelatoriosGerenciais.tsx
│   │   │
│   │   ├── gerencia/
│   │   │   ├── usuarios/
│   │   │   │   └── page.tsx                # Usuarios.tsx
│   │   │   ├── perfis/
│   │   │   │   └── page.tsx                # Perfis.tsx
│   │   │   ├── orgaos/
│   │   │   │   └── page.tsx                # Orgaos.tsx
│   │   │   └── configuracoes/
│   │   │       └── page.tsx                # ConfiguracoesGerais.tsx
│   │   │
│   │   └── perfil/
│   │       └── page.tsx                    # MeuPerfil.tsx
│   │
│   └── api/                                # API Routes
│       └── ...
│
└── components/
    ├── ui/                                 # shadcn/ui components
    ├── layout/
    │   ├── Navbar.tsx
    │   ├── Sidebar.tsx
    │   └── Footer.tsx
    │
    └── modals/                             # Todos os modais
        ├── UsuarioModal.tsx
        ├── TramitarDocumentoModal.tsx
        ├── MinutaModal.tsx
        └── ...
```

---

## 🚀 PRÓXIMO PASSO

Agora vou gerar:
1. ✅ Estrutura completa do projeto Next.js 15+
2. ✅ Configuração (next.config, tailwind.config, etc)
3. ✅ Layout principal (Navbar + Sidebar)
4. ✅ Login.tsx
5. ✅ Dashboard.tsx
6. ✅ Alguns exemplos de telas e modais

---

**Documento gerado em:** 07/02/2026
