# Sistema de Gestão Legislativa - Câmara Municipal de Manaus
## Arquitetura Completa do Sistema

### VISÃO GERAL
Sistema integrado para gestão completa dos processos legislativos, administrativos e de controle da Câmara Municipal de Manaus, baseado no Regimento Interno atualizado até a Resolução n. 169/2025.

---

## 1. MÓDULOS PRINCIPAIS DO SISTEMA

### 1.1 MÓDULO DE GESTÃO DA MESA DIRETORA
**Objetivo:** Gerenciar composição, eleições e atribuições da Mesa Diretora

#### Funcionalidades:
- **Eleição da Mesa Diretora**
  - Cadastro de candidaturas por cargo
  - Votação nominal com validação de quórum (maioria absoluta)
  - Sistema de escrutínio e apuração
  - Segundo turno automático (maioria simples)
  - Desempate por critérios (idade, legislaturas)
  - Termo de posse automático

- **Gestão de Membros**
  - Presidente, 3 Vice-Presidentes
  - Secretário-Geral, 3 Secretários
  - Corregedor e Ouvidor-Geral
  - Controle de mandatos (2 anos, vedada reeleição imediata)
  - Gestão de vacâncias e substituições
  - Hierarquia de substituições automáticas

- **Controle de Competências**
  - Workflow de aprovações por cargo
  - Delegação de competências
  - Registro de decisões da Mesa
  - Convocação e atas de reuniões mensais

- **Processo de Destituição**
  - Recebimento de representações (maioria absoluta)
  - Formação de Comissão Processante
  - Tramitação com ampla defesa
  - Votação qualificada

---

### 1.2 MÓDULO DE GESTÃO DE VEREADORES

#### Funcionalidades:
- **Cadastro de Vereadores**
  - Dados pessoais e mandato
  - Diploma e documentação
  - Declaração de bens (atualização automática)
  - Histórico de legislaturas

- **Posse e Compromisso**
  - Sessão preparatória (1º de janeiro)
  - Verificação de quórum
  - Termo de compromisso padronizado
  - Livro de posse eletrônico
  - Controle de prazo (15 dias)
  - Motivos justos (saúde, maternidade/paternidade)

- **Controle de Presença**
  - Registro de presença por reunião
  - Chamadas nominais
  - Justificativas de ausência
  - Relatórios de comparecimento
  - Alertas de faltas consecutivas

- **Bancadas e Lideranças**
  - Agrupamento por partido
  - Designação de líderes e vice-líderes
  - Proporção: 1 vice-líder por 5 vereadores
  - Líder do Governo (indicação do Prefeito)
  - Formação de blocos partidários
  - Conselho de Líderes

- **Prerrogativas e Direitos**
  - Controle de uso de tribuna
  - Inscrições (Pequeno e Grande Expediente)
  - Apartes regimentais
  - Questões de ordem
  - Reclamações

---

### 1.3 MÓDULO DE COMISSÕES TÉCNICAS PERMANENTES

#### Estrutura de 28 Comissões:
1. Executiva (Mesa Diretora)
2. Constituição, Justiça e Redação (CCJ)
3. Finanças, Economia e Orçamento
4. Educação
5. Agricultura e Política Rural
6. Saúde
7. Serviço e Obras Públicas
8. Transporte, Mobilidade Urbana e Acessibilidade
9. Cultura e Patrimônio Histórico
10. Indústria, Comércio, Desenvolvimento Econômico, Trabalho e Renda
11. Assuntos Sociocomunitários e Legislação Participativa
12. Ética (Art. 48 - **Instalação sob demanda**, não permanente)
13. Direitos Humanos, Povos Indígenas e Minorias
14. Meio Ambiente, Recursos Naturais, Sustentabilidade e Vigilância da Amazônia
15. Implementação e Acompanhamento de Leis
16. Água e Saneamento
17. Esportes
18. Defesa e Proteção dos Direitos da Mulher
19. Defesa do Consumidor (com competência para audiências conciliatórias)
20. Direitos da Criança, Adolescente, Juventude e Idoso
21. Habitação e Regularização Fundiária Urbana
22. **Segurança Pública Municipal** (Art. 57-A, Resolução 140/2021)
23. **Defesa dos Direitos da Pessoa com Deficiência** (Art. 57-B, Resolução 141/2021)
24. Fiscalização Financeira, Controle e Transparência Municipal (Art. 57-C revogado, originalmente 166/2023)
25. **Turismo e Relações Internacionais** (Art. 57-C, Resolução 169/2025)
26. **Proteção e Bem-Estar Animal** (Art. 57-D, Resolução 169/2025)
27. Comendas e Títulos Honoríficos (Comissão Especial)
28. Representativa (funcionamento em recesso)

#### Funcionalidades:
- **Composição**
  - 7 titulares + 7 suplentes por comissão
  - Cálculo automático de proporcionalidade partidária
  - Limitações: máximo 6 comissões/vereador, mínimo 2
  - Máximo 2 presidências por vereador
  - Indicação por líderes partidários
  - **Comissão de Ética**: Mesa Diretora define número de membros por ato próprio quando instalada

- **Gestão de Trabalhos**
  - Eleição de Presidente e Vice
  - Pautas e convocações
  - Ordem de tramitação (chegada)
  - Designação de relatores (ordem alfabética)
  - Subcomissões (aprovação 2/3)
  - Convocação de autoridades
  - Audiências públicas (organizadas pelo Departamento de Comissões)
  - Inspeções e diligências
  - **Reuniões externas**: permitidas com aprovação de maioria absoluta dos membros
  - **Frequência**: CCJ e Finanças (semanal), demais (quinzenal)
  - **Convocação extraordinária**: 24 horas de antecedência (exceto urgência)

- **Pareceres**
  - Prazo padrão: 4 reuniões ordinárias (relator), 6 reuniões (comissão)
  - Regime de urgência: 1 reunião (relator), 2 reuniões (comissão)
  - Parecer da CCJ (constitucionalidade)
  - Recurso contra parecer (1/3 + fundamentação)
  - Tramitação entre comissões
  - Arquivo ou aprovação
  - **Pedido de vista**: 5 dias úteis, vedado ao autor, penalidade por não cumprimento
  - **Diligências**: prazo máximo de 15 dias úteis para resposta

- **Comissão de CCJ - Especial**
  - Recebimento via Procuradoria Legislativa
  - Análise constitucional obrigatória
  - Fundamentação jurídica necessária
  - Priorização por relevância social
  - Recurso de inconstitucionalidade
  - **Arquivamento com aprovação por unanimidade**: reapreciação possível com 1/3 dos vereadores

- **Comissão de Finanças - Especial**
  - Análise de impacto financeiro
  - Acompanhamento orçamentário
  - Convocação de Prefeito/ex-Prefeito
  - Análise de contas públicas
  - Parecer TCE

- **Comissão de Defesa do Consumidor - Especial**
  - **Audiências conciliatórias** (Art. 55, VI)
  - **Acordos com força de Título Extrajudicial** (parágrafo único)
  - Possibilidade de execução judicial dos acordos

- **Audiências Públicas** (Art. 93-94)
  - Realização mensal (facultativa) ou por requerimento
  - Obrigatória quando requerida por 0,1% do eleitorado
  - Organização pelo Departamento de Comissões (não por gabinetes)
  - Convites eletrônicos obrigatórios
  - Antecedência: 15 dias para convidados
  - Requerimento aprovado em Plenário (maioria simples)
  - Entidades da sociedade civil podem solicitar
  - Ordem dos trabalhos padronizada com limites de tempo
  - Duração máxima: 3 horas

---

### 1.4 MÓDULO DE COMISSÕES TEMPORÁRIAS

#### Tipos:
- **Comissões Especiais**
  - Criação por demanda específica
  - Proporcionalidade partidária
  - Prazo determinado
  - Prorrogação via deliberação

- **Comissões Parlamentares de Inquérito (CPI)**
  - Requerimento: 1/3 dos vereadores
  - Poderes de investigação
  - Prazo: 90 dias (prorrogável 90 dias)
  - Relatório final obrigatório

- **Comissão Processante**
  - Apuração de responsabilidade
  - Cassação de mandato
  - Ampla defesa e contraditório
  - Prazo processual

- **Comissão Representativa**
  - Funcionamento no recesso
  - Composição proporcional
  - Poderes limitados
  - Posse de vereadores convocados

---

### 1.5 MÓDULO DE PROPOSIÇÕES LEGISLATIVAS

#### Tipos de Proposições:
- **Projetos de Lei**
  - Ordinária
  - Complementar
  - Código (consolidação)

- **Projetos de Resolução**
  - Matéria interna
  - Regimento Interno
  - Mesa Diretora

- **Projetos de Decreto Legislativo**
  - Aprovação de contas
  - Convênios
  - Cassação de mandato

- **Emendas**
  - À Lei Orgânica (2/3 em 2 turnos)
  - Aos projetos em tramitação
  - Aditivas, supressivas, substitutivas, modificativas

- **Substitutivos**
  - Proposição alternativa
  - Análise comparativa

#### Funcionalidades:
- **Protocolo Eletrônico**
  - Recebimento de proposições
  - Numeração automática
  - Validação formal
  - Autoria (individual, coletiva, popular)
  - Iniciativa (Executivo, Legislativo, Popular)

- **Tramitação**
  - Distribuição às comissões competentes
  - Controle de prazos
  - Regime de tramitação (ordinário, urgente, prioridade)
  - Workflow automático
  - Notificações aos interessados

- **Iniciativa Popular**
  - Cadastro de subscrições
  - Validação de assinaturas (5% eleitorado)
  - Protocolo especial
  - Prioridade na tramitação

- **Controle de Constitucionalidade**
  - Análise obrigatória CCJ
  - Parecer da Procuradoria
  - Recurso ao Plenário

- **Emendas e Substitutivos**
  - Prazo para apresentação
  - Compatibilidade temática
  - Análise de admissibilidade
  - Votação em separado

---

### 1.6 MÓDULO DE SESSÕES PLENÁRIAS

#### Tipos de Sessões:
- **Sessão Preparatória**
  - 1º de janeiro (primeira sessão legislativa)
  - Posse de vereadores
  - Eleição da Mesa Diretora

- **Sessões Ordinárias**
  - Calendário legislativo
  - Periodicidade definida
  - Quórum mínimo
  - Ordem do Dia estruturada

- **Sessões Extraordinárias**
  - Convocação especial
  - Pauta específica
  - Matérias predefinidas

- **Sessões Solenes**
  - Homenagens
  - Títulos honoríficos
  - Eventos especiais

- **Sessões Especiais**
  - Debates temáticos
  - Fora da sede (autorização)

#### Estrutura da Sessão Ordinária:
1. **Abertura**
   - Verificação de quórum
   - Leitura da ata anterior
   - Aprovação da ata

2. **Pequeno Expediente**
   - Comunicações da Presidência
   - Leitura de expediente
   - Comunicações de líderes (5 min cada)

3. **Grande Expediente**
   - Oradores inscritos (10 min cada)
   - Inscrição via liderança
   - Apartes (3 por orador, 3 min cada)

4. **Ordem do Dia**
   - Discussão de proposições
   - Votações
   - Regime de tramitação

5. **Explicações Pessoais**
   - Esclarecimentos (5 min)
   - Sem apartes

#### Funcionalidades:
- **Convocação**
  - Calendário anual
  - Convocações extraordinárias
  - Publicação oficial
  - Notificações aos vereadores

- **Pauta e Ordem do Dia**
  - Montagem automática
  - Prioridades regimentais
  - Urgências
  - Publicação prévia (48h)

- **Controle de Quórum**
  - Chamada nominal
  - Verificação automática
  - Quórum deliberativo: maioria absoluta (21)
  - Quórum especial: 2/3 (28)
  - Alertas de quórum

- **Gestão de Inscrições**
  - Pequeno Expediente (ordem de inscrição)
  - Grande Expediente (via líder)
  - Ordem dos oradores
  - Controle de tempo

- **Votações**
  - Simbólica (levanta/sentado)
  - Nominal (chamada)
  - Secreta (quando legal)
  - Painel eletrônico
  - Registro individual de votos
  - Proclamação de resultado

- **Atas**
  - Geração automática
  - Resumo dos trabalhos
  - Aprovação na sessão seguinte
  - Publicação no e-DOLM
  - Assinaturas eletrônicas

- **Transmissão**
  - TV Câmara
  - Streaming
  - Redes sociais
  - Arquivo de vídeos

---

### 1.7 MÓDULO DE VOTAÇÕES

#### Tipos de Votação:
- **Simbólica**
  - Maioria simples
  - Levantados/sentados
  - Resultado visual

- **Nominal**
  - Chamada individual
  - Voto declarado
  - Registro público
  - Matérias importantes

- **Secreta**
  - Casos específicos (cassação)
  - Urna eletrônica
  - Sigilo do voto

#### Quóruns:
- **Maioria Simples:** 50% + 1 dos presentes (mínimo 21)
- **Maioria Absoluta:** 21 vereadores
- **2/3:** 28 vereadores
- **3/5:** 25 vereadores

#### Funcionalidades:
- **Painel Eletrônico**
  - Votação individualizada
  - Tempo cronometrado
  - Resultado em tempo real
  - Registro permanente

- **Encaminhamento de Votação**
  - 3 minutos por líder
  - Orientação de bancada
  - Declaração de voto

- **Destaque**
  - Votação em separado
  - Requerimento de destaque
  - Emendas destacadas

- **Questões de Ordem**
  - Verificação de quórum
  - Procedimento regimental
  - Decisão da Presidência
  - Recurso ao Plenário

- **Resultados**
  - Proclamação oficial
  - Publicação
  - Estatísticas
  - Histórico individual

---

### 1.8 MÓDULO DE GESTÃO ORÇAMENTÁRIA

#### Funcionalidades:
- **Proposta Orçamentária da Câmara**
  - Elaboração anual
  - Discussão com vereadores
  - Aprovação pela Mesa
  - Envio ao Executivo (até 31/agosto)

- **PPA, LDO e LOA**
  - Recebimento do Executivo
  - Distribuição às comissões
  - Emendas parlamentares
  - Emendas de comissões
  - Prazos constitucionais
  - Votação em turnos

- **Execução Orçamentária**
  - Acompanhamento mensal
  - Relatórios gerenciais
  - Publicação (até dia 20)
  - Créditos adicionais
  - Remanejamentos

- **Controle Financeiro**
  - Despesas da Câmara
  - Empenhos e liquidações
  - Pagamentos
  - Transparência
  - Portal da Transparência

- **Prestação de Contas**
  - Balanço anual
  - Envio ao TCE
  - Análise pela Comissão de Finanças
  - Parecer prévio
  - Julgamento pelo Plenário

- **Tribunal de Contas**
  - Recebimento de pareceres
  - Representações
  - Convocação de relatores
  - Análise de irregularidades

---

### 1.9 MÓDULO DE CONTROLE DE LEIS

#### Funcionalidades:
- **Sanção e Promulgação**
  - Envio ao Prefeito
  - Controle de prazos (15 dias)
  - Sanção tácita
  - Promulgação pela Mesa (veto ou sanção tácita)
  - Publicação no e-DOLM

- **Vetos**
  - Recebimento e protocolo
  - Prazo de apreciação (30 dias)
  - Análise e parecer
  - Votação (maioria absoluta para derrubar)
  - Promulgação se derrubado

- **Controle de Constitucionalidade**
  - Registro de ADIs
  - Defesa judicial
  - Acompanhamento processual

- **Implementação de Leis**
  - Comissão específica
  - Fiscalização de cumprimento
  - Relatórios de efetividade
  - Indicações ao Executivo

- **Consolidação Legislativa**
  - Códigos municipais
  - Compilações temáticas
  - Atualização permanente
  - Portal legislativo

---

### 1.10 MÓDULO DE FISCALIZAÇÃO E CONTROLE

#### Funcionalidades:
- **Convocação de Autoridades**
  - Secretários municipais
  - Dirigentes de autarquias
  - Concessionárias de serviços
  - Pauta prévia
  - Registro de comparecimento

- **Pedidos de Informação**
  - Requerimentos
  - Prazo de resposta (30 dias)
  - Controle de pendências
  - Insistências
  - Crime de responsabilidade

- **Audiências Públicas**
  - Convocação por comissão
  - Temas de interesse público
  - Inscrição de participantes
  - Registro e ata
  - Encaminhamentos

- **Inspeções e Diligências**
  - Autorizações
  - Programação
  - Relatórios
  - Fotografias e evidências

- **Representações**
  - Ministério Público
  - Tribunal de Contas
  - Judiciário
  - Ouvidoria

---

### 1.11 MÓDULO DE PARTICIPAÇÃO POPULAR

#### Funcionalidades:
- **Iniciativa Popular**
  - Cadastro de propostas
  - Coleta de assinaturas online/física
  - Validação (5% do eleitorado)
  - Tramitação prioritária

- **Tribuna Popular**
  - Inscrição de cidadãos
  - Tempo regulamentado (5 min)
  - Transmissão oficial
  - Registro em ata

- **Comissão de Legislação Participativa**
  - Recebimento de sugestões
  - Entidades da sociedade civil
  - Adequação técnica
  - Conversão em proposição
  - Acompanhamento do proponente

- **Ouvidoria Municipal**
  - Portal 0800
  - Reclamações
  - Sugestões
  - Denúncias
  - Protocolo e acompanhamento
  - Prazos de resposta

- **Portal da Transparência**
  - Proposituras em tramitação
  - Estatísticas mensais
  - Votações nominais
  - Presença de vereadores
  - Execução orçamentária
  - Contratos e licitações
  - Folha de pagamento

---

### 1.12 MÓDULO ADMINISTRATIVO

#### Funcionalidades:
- **Recursos Humanos**
  - Quadro de servidores
  - Cargos comissionados
  - Efetivos
  - Contratações temporárias
  - Requisições
  - Folha de pagamento
  - Licenças e férias
  - Aposentadorias

- **Licitações e Contratos**
  - Comissão Permanente de Licitação
  - Processos licitatórios
  - Dispensa/Inexigibilidade
  - Contratos
  - Aditivos
  - Fiscalização contratual
  - Convênios

- **Patrimônio**
  - Bens móveis
  - Bens imóveis
  - Inventário
  - Manutenção
  - Depreciação
  - Alienações

- **Tecnologia da Informação**
  - Infraestrutura
  - Sistemas integrados
  - Segurança da informação
  - Backup
  - Suporte técnico

- **Comunicação Institucional**
  - TV Câmara
  - Rádio Câmara
  - Portal institucional
  - Redes sociais
  - Assessoria de imprensa
  - Campanhas educativas

---

### 1.13 MÓDULO DE CORREGEDORIA

#### Funcionalidades:
- **Processos Disciplinares**
  - Abertura de sindicância
  - Instrução processual
  - Defesa prévia
  - Julgamento

- **Apuração de Denúncias**
  - Recebimento
  - Triagem
  - Investigação preliminar
  - Encaminhamentos

- **Quebra de Decoro**
  - Representação
  - Comissão de Ética
  - Penalidades:
    * Advertência
    * Censura verbal
    * Censura escrita
    * Suspensão de prerrogativas
    * Cassação de mandato (2/3)

- **Segurança Institucional**
  - Controle de acesso
  - Revista de segurança
  - Proibição de armas
  - Policiamento interno

---

### 1.14 MÓDULO JURÍDICO

#### Funcionalidades:
- **Procuradoria Legislativa**
  - Pareceres jurídicos
  - Análise de proposições
  - Consultoria à Mesa
  - Prazo CCJ: 5 dias úteis (1 dia em urgência)

- **Defesa Judicial**
  - Mandados de segurança
  - Ações civis
  - Ações penais
  - Recursos

- **Assessoria às Comissões**
  - Análise técnica
  - Minuta de pareceres
  - Pesquisa jurisprudencial
  - Legislação comparada

- **Coordenadoria Parlamentar**
  - Defesa da honra da Casa
  - Defesa de vereadores
  - Direito de resposta
  - Medidas judiciais
  - Publicidade reparadora

---

### 1.15 MÓDULO DE PROTOCOLO E ARQUIVO

#### Funcionalidades:
- **Protocolo Eletrônico**
  - Recebimento de documentos
  - Numeração automática
  - Digitalização
  - Distribuição
  - Rastreamento

- **Arquivo Geral**
  - Organização documental
  - Processo: corrente, intermediário, permanente
  - Tabela de temporalidade
  - Preservação de documentos históricos
  - Acesso público

- **Biblioteca Ivaneide Chaves dos Anjos**
  - Acervo legislativo
  - Pesquisa jurídica
  - Documentação
  - Memória institucional

- **Gestão Documental**
  - GED - Gestão Eletrônica de Documentos
  - Workflow de aprovações
  - Controle de versões
  - Assinaturas digitais

---

### 1.16 MÓDULO DE PUBLICAÇÕES

#### Funcionalidades:
- **Diário Oficial Eletrônico (e-DOLM)**
  - Publicação diária
  - Edições especiais
  - Autenticidade
  - Pesquisa avançada
  - Download de edições

- **Conteúdo Publicável**
  - Atas de sessões
  - Leis promulgadas
  - Resoluções
  - Decretos legislativos
  - Editais
  - Portarias
  - Atos da Mesa
  - Pareceres
  - Relatórios financeiros (até dia 20)
  - Estatísticas legislativas (até dia 20)

- **Portal Legislativo**
  - Proposições em tramitação
  - Legislação municipal
  - Agenda de eventos
  - Transmissões ao vivo
  - Notícias institucionais

---

### 1.17 MÓDULO DE DENOMINAÇÃO DE LOGRADOUROS

#### Funcionalidades:
- **Projetos de Denominação**
  - Cadastro de propostas
  - Comissão de Cultura e Patrimônio
  - Requisitos legais
  - Parecer técnico do Executivo
  - Votação

- **Cadastro de Logradouros**
  - Ruas, avenidas, praças
  - Histórico de denominações
  - Localização geográfica
  - Homenageados (biografia)

- **Alteração de Denominação**
  - Justificativa
  - Consulta à população local
  - Impacto em documentos

---

### 1.18 MÓDULO DE TÍTULOS E HONRARIAS

#### Funcionalidades:
- **Títulos Honoríficos**
  - Cidadão de Manaus
  - Medalhas
  - Comendas
  - Diplomas de honra

- **Tramitação**
  - Proposta de vereador
  - Análise de requisitos
  - Votação
  - Sessão solene de entrega

- **Registro**
  - Livro de agraciados
  - Certificados
  - Publicidade

---

### 1.19 MÓDULO DE INDICAÇÕES E MOÇÕES

#### Funcionalidades:
- **Indicações**
  - Sugestões ao Executivo
  - Sem força normativa
  - Tramitação simplificada
  - Encaminhamento oficial
  - Controle de respostas

- **Moções**
  - Aplauso
  - Congratulações
  - Repúdio
  - Pesar
  - Apelo
  - Tramitação e publicação

- **Requerimentos**
  - Informação
  - Convocação
  - Urgência
  - Audiência pública
  - Regime de tramitação
  - CPI
  - Desarquivamento

---

### 1.20 MÓDULO DE RELATÓRIOS E ESTATÍSTICAS

#### Funcionalidades:
- **Estatísticas Legislativas**
  - Proposições por autor
  - Proposições por tipo
  - Aproveitamento por vereador
  - Tempo médio de tramitação
  - Comissões mais ativas
  - Publicação mensal (até dia 20)

- **Relatórios Gerenciais**
  - Resumo mensal de atividades
  - Resenha anual
  - Indicadores de desempenho
  - Produtividade

- **Dashboards**
  - Painel executivo
  - Indicadores em tempo real
  - Gráficos e visualizações
  - Exportação de dados

---

## 2. REQUISITOS TÉCNICOS

### 2.1 Arquitetura do Sistema
- **Frontend:** React.js / Vue.js (responsivo)
- **Backend:** Node.js / Python (Django/FastAPI)
- **Banco de Dados:** PostgreSQL (principal) + MongoDB (documentos)
- **Cache:** Redis
- **Mensageria:** RabbitMQ / Apache Kafka
- **Busca:** Elasticsearch
- **Storage:** MinIO / S3 (documentos e vídeos)

### 2.2 Segurança
- Autenticação: OAuth 2.0 / SAML
- Autorização: RBAC (Role-Based Access Control)
- Criptografia: TLS 1.3, dados em repouso
- Auditoria: Log completo de ações
- Backup: Diário incremental, semanal completo
- LGPD: Compliance total

### 2.3 Integrações
- **e-DOLM:** Publicação automática
- **Portal da Transparência:** Sincronização
- **TCE-AM:** Envio de prestações de contas
- **Receita Federal:** Validação de CPF/CNPJ
- **TSE:** Validação de eleitores (iniciativa popular)
- **Sistema de Assinatura Digital:** ICP-Brasil
- **Sistemas do Executivo:** Webservices

### 2.4 Performance
- Disponibilidade: 99.5%
- Tempo de resposta: < 2s
- Suporte a 1000 usuários simultâneos
- Escalabilidade horizontal

### 2.5 Acessibilidade
- WCAG 2.1 Nível AA
- Leitores de tela
- Alto contraste
- Navegação por teclado

---

## 3. MÓDULOS DE SUPORTE

### 3.1 Gestão de Usuários
- Vereadores
- Servidores
- Cidadãos (portal público)
- Perfis e permissões
- SSO (Single Sign-On)

### 3.2 Notificações
- E-mail
- SMS
- Push (aplicativo móvel)
- WhatsApp Business
- Alertas de prazos

### 3.3 Workflow Engine
- Processos customizáveis
- Regras de negócio
- Automações
- SLA (Service Level Agreement)

### 3.4 Business Intelligence
- Data Warehouse
- ETL (Extract, Transform, Load)
- Cubos OLAP
- Relatórios analíticos

### 3.5 Mobile
- Aplicativo iOS/Android
- Versão PWA
- Votação remota (sessões híbridas)
- Consulta de proposições

---

## 4. CRONOGRAMA DE IMPLEMENTAÇÃO (Sugestão)

### Fase 1 (3 meses): Core do Sistema
- Módulo de Vereadores
- Módulo de Proposições
- Módulo de Sessões Plenárias
- Módulo de Votações

### Fase 2 (3 meses): Comissões e Controle
- Módulo de Comissões Permanentes
- Módulo de Comissões Temporárias
- Módulo de Fiscalização
- Módulo Jurídico

### Fase 3 (2 meses): Administração
- Módulo Administrativo
- Módulo Orçamentário
- Módulo de Publicações
- Módulo de Protocolo

### Fase 4 (2 meses): Participação e Controle
- Módulo de Participação Popular
- Módulo de Corregedoria
- Portal da Transparência
- Ouvidoria

### Fase 5 (2 meses): Complementos
- Relatórios e BI
- Aplicativo móvel
- Integrações externas
- Treinamento

---

## 5. EQUIPE NECESSÁRIA

### Desenvolvimento
- 2 Arquitetos de Software
- 4 Desenvolvedores Backend
- 4 Desenvolvedores Frontend
- 2 Desenvolvedores Mobile
- 2 Analistas de BI
- 1 DBA

### Gestão e Qualidade
- 1 Gerente de Projetos
- 2 Analistas de Negócio
- 3 Analistas de QA
- 1 Especialista em Segurança

### Infraestrutura
- 2 DevOps Engineers
- 1 Administrador de Redes

### Suporte
- 1 Coordenador de Suporte
- 3 Analistas de Suporte

**Total: 28 profissionais**

---

## 6. INVESTIMENTO ESTIMADO

### Software e Licenças: R$ 200.000/ano
### Infraestrutura Cloud: R$ 15.000/mês
### Equipe (12 meses): R$ 3.600.000
### Treinamento: R$ 100.000
### Contingência (20%): R$ 783.000

**TOTAL ESTIMADO: R$ 4.863.000**

---

## 7. BENEFÍCIOS ESPERADOS

1. **Transparência total** das atividades legislativas
2. **Agilidade** na tramitação de proposições (redução de 40%)
3. **Participação popular** ampliada
4. **Economia** de recursos (processo digital)
5. **Compliance** com legislação e regimento
6. **Segurança jurídica** nas decisões
7. **Melhoria** da imagem institucional
8. **Acessibilidade** de informações
9. **Controle efetivo** de prazos e pendências
10. **Preservação** da memória institucional

---

**CONCLUSÃO:**
O sistema proposto atende integralmente ao Regimento Interno da Câmara Municipal de Manaus (Resolução n. 92/2015, atualizado até Resolução n. 169/2025), garantindo a automação, controle e transparência de todos os processos legislativos, administrativos e de fiscalização da Casa, além de promover ampla participação popular e eficiência na gestão pública.
