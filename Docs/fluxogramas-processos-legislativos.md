# Fluxogramas dos Processos Legislativos
## Sistema de Gestão Legislativa - CMM

---

## 1. FLUXO DE TRAMITAÇÃO DE PROJETO DE LEI

```mermaid
flowchart TD
    A[Início: Apresentação do Projeto] --> B{Origem}
    B -->|Vereador| C[Protocolo na Diretoria Legislativa]
    B -->|Executivo| C
    B -->|Popular| D[Validação de Assinaturas<br/>5% do eleitorado]
    D --> C
    
    C --> E[Numeração Automática]
    E --> F[Verificação Formal]
    F --> G{Atende<br/>Requisitos?}
    
    G -->|Não| H[Devolução ao Autor]
    G -->|Sim| I[Distribuição à CCJ]
    
    I --> J[Procuradoria Legislativa<br/>Parecer Prévio]
    J --> K[CCJ - Análise Constitucional]
    K --> L{Prazo}
    L -->|Ordinário| M[5 dias úteis]
    L -->|Urgente| N[1 dia útil]
    
    M --> O{Parecer CCJ}
    N --> O
    
    O -->|Inconstitucional| P[Arquivamento]
    P --> Q{Recurso?<br/>1/3 + fundamentação}
    Q -->|Sim| R[Votação no Plenário]
    Q -->|Não| S[Fim: Arquivado]
    
    R --> T{Resultado}
    T -->|Mantém Arquivamento| S
    T -->|Derruba Parecer| U[Continua Tramitação]
    
    O -->|Constitucional| U
    U --> V[Distribuição às Comissões<br/>de Mérito]
    
    V --> W[Comissão de Finanças<br/>se houver impacto orçamentário]
    W --> X[Demais Comissões Temáticas]
    X --> Y[Relatores Designados<br/>Ordem Alfabética]
    
    Y --> Z[Emissão de Pareceres]
    Z --> AA{Admite<br/>Emendas?}
    
    AA -->|Sim| AB[Prazo para Emendas]
    AB --> AC[Análise de Emendas<br/>pelas Comissões]
    AA -->|Não| AD
    
    AC --> AD[Retorno à CCJ<br/>Redação Final]
    AD --> AE[Inclusão na Ordem do Dia]
    
    AE --> AF{Regime}
    AF -->|Ordinário| AG[Aguarda Pauta Normal]
    AF -->|Urgente| AH[Prioridade na Pauta]
    AF -->|Prioridade| AH
    
    AG --> AI[Sessão Plenária]
    AH --> AI
    
    AI --> AJ[1ª Discussão]
    AJ --> AK{Tipo}
    AK -->|Lei Ordinária| AL[Votação Única]
    AK -->|Lei Complementar| AM[2 Turnos]
    AK -->|Emenda LOMAN| AN[2 Turnos + 2/3]
    
    AL --> AO[Votação]
    AM --> AO
    AN --> AO
    
    AO --> AP{Resultado}
    AP -->|Rejeitado| S
    AP -->|Aprovado| AQ[Redação Final pela CCJ]
    
    AQ --> AR[Autógrafos]
    AR --> AS[Encaminhamento ao Prefeito]
    
    AS --> AT[Prefeito: 15 dias]
    AT --> AU{Decisão}
    
    AU -->|Sanção| AV[Lei Sancionada]
    AU -->|Veto Total/Parcial| AW[Retorno à Câmara]
    AU -->|Silêncio| AX[Sanção Tácita]
    
    AW --> AY[Prazo: 30 dias para análise]
    AY --> AZ[Votação do Veto<br/>Maioria Absoluta]
    AZ --> BA{Resultado}
    
    BA -->|Veto Mantido| S
    BA -->|Veto Derrubado| AV
    
    AV --> BB[Promulgação]
    AX --> BB
    BB --> BC[Publicação no e-DOLM]
    BC --> BD[Fim: Lei Vigente]
```

---

## 2. FLUXO DE SESSÃO PLENÁRIA ORDINÁRIA

```mermaid
flowchart TD
    A[Início: Dia de Sessão Ordinária] --> B[Abertura: Horário Regimental]
    B --> C[Presidente assume a direção]
    C --> D[1ª Chamada Nominal]
    
    D --> E{Quórum?<br/>Maioria Absoluta}
    E -->|Não| F[Aguarda 15 minutos]
    F --> G[2ª Chamada]
    G --> H{Quórum?}
    H -->|Não| I[Sessão Cancelada]
    I --> J[Fim]
    
    E -->|Sim| K[Abertura Oficial]
    H -->|Sim| K
    
    K --> L[Comunicação da Presidência]
    L --> M[Leitura da Ata Anterior]
    M --> N{Aprovação da Ata}
    
    N -->|Retificações| O[Ajustes Solicitados]
    O --> M
    N -->|Aprovada| P[Pequeno Expediente]
    
    P --> Q[Leitura do Expediente]
    Q --> R[Comunicações de Líderes<br/>5 min cada]
    R --> S[Grande Expediente]
    
    S --> T[Oradores Inscritos<br/>10 min cada]
    T --> U[Apartes Permitidos<br/>3 por orador, 3 min cada]
    U --> V{Mais<br/>Oradores?}
    
    V -->|Sim| T
    V -->|Não| W[Ordem do Dia]
    
    W --> X[Anúncio da Pauta]
    X --> Y[Verificação de Quórum]
    Y --> Z{Quórum<br/>Deliberativo?}
    
    Z -->|Não| AA[Matérias Retiradas]
    AA --> AB[Próxima Sessão]
    
    Z -->|Sim| AC[Matéria 1]
    AC --> AD{Tipo}
    
    AD -->|Discussão| AE[Inscrição de Oradores]
    AD -->|Votação| AF[Encaminhamento de Votação<br/>Líderes: 3 min]
    AD -->|Discussão + Votação| AE
    
    AE --> AG[Debates]
    AG --> AH{Emendas<br/>Destaques?}
    
    AH -->|Sim| AI[Votação em Separado]
    AH -->|Não| AJ[Votação da Matéria]
    AI --> AJ
    
    AJ --> AK{Tipo de<br/>Votação}
    AK -->|Simbólica| AL[Levantados/Sentados]
    AK -->|Nominal| AM[Chamada Individual]
    AK -->|Secreta| AN[Urna Eletrônica]
    
    AL --> AO[Proclamação do Resultado]
    AM --> AO
    AN --> AO
    
    AO --> AP[Registro em Ata]
    AP --> AQ{Mais<br/>Matérias?}
    
    AQ -->|Sim| AC
    AQ -->|Não| AR[Explicações Pessoais<br/>5 min, sem apartes]
    
    AR --> AS{Mais<br/>Inscritos?}
    AS -->|Sim| AR
    AS -->|Não| AT[Encerramento]
    
    AT --> AU[Convocação Próxima Sessão]
    AU --> AV[Fim da Sessão]
    AV --> J
```

---

## 3. FLUXO DE ELEIÇÃO DA MESA DIRETORA

```mermaid
flowchart TD
    A[Início: Sessão Preparatória<br/>1º de janeiro] --> B[Vereadores Reunidos<br/>17h]
    B --> C[Direção Provisória]
    C --> D[Presidente Mais Antigo<br/>ou Mais Idoso]
    
    D --> E[Verificação de Quórum<br/>Maioria Absoluta]
    E --> F{Quórum?}
    
    F -->|Não| G[Sessão não Realizada]
    G --> H[Nova Convocação]
    H --> A
    
    F -->|Sim| I[Presidente Provisório<br/>Assume Direção]
    I --> J[Designa 2 Secretários<br/>Partidos Diferentes]
    
    J --> K[Coleta de Diplomas]
    K --> L[Declarações de Bens]
    L --> M[Suspensão dos Trabalhos]
    
    M --> N[Organização Lista<br/>Ordem Alfabética]
    N --> O[Reabertura]
    
    O --> P[Leitura da Lista]
    P --> Q[Proclamação dos Vereadores]
    Q --> R[Análise de Reclamações]
    
    R --> S[Compromisso do<br/>Presidente Provisório]
    S --> T[Posse Individual dos Vereadores<br/>'Assim prometo']
    T --> U[Assinatura do Livro de Posse]
    
    U --> V[ELEIÇÃO DA MESA]
    V --> W[Escolha de 2 Escrutinadores<br/>Partidos Diferentes]
    
    W --> X[ELEIÇÃO DO PRESIDENTE]
    X --> Y[Apresentação de Candidatos<br/>Até início dos trabalhos]
    Y --> Z[Manifestação dos Candidatos<br/>5 min cada]
    
    Z --> AA[Votação Nominal Aberta]
    AA --> AB[Chamada ao Microfone]
    AB --> AC[Vereador Declara Voto]
    
    AC --> AD[Anotação e Checagem]
    AD --> AE{Todos<br/>Votaram?}
    
    AE -->|Não| AB
    AE -->|Sim| AF[Apuração]
    
    AF --> AG{Maioria<br/>Absoluta?}
    AG -->|Não| AH[2º Turno<br/>2 Mais Votados]
    AH --> AI[Nova Votação<br/>Maioria Simples]
    
    AI --> AJ{Empate?}
    AJ -->|Sim| AK[Eleito: Mais Idoso<br/>Mais Legislaturas]
    AJ -->|Não| AL[Presidente Eleito]
    
    AG -->|Sim| AL
    AK --> AL
    
    AL --> AM[Posse Automática]
    AM --> AN[Assume a Presidência]
    
    AN --> AO[ELEIÇÃO DOS DEMAIS CARGOS]
    AO --> AP[1º Vice-Presidente]
    AP --> AQ[2º Vice-Presidente]
    AQ --> AR[3º Vice-Presidente]
    AR --> AS[Secretário-Geral]
    AS --> AT[1º Secretário]
    AT --> AU[2º Secretário]
    AU --> AV[3º Secretário]
    AV --> AW[Corregedor]
    AW --> AX[Ouvidor-Geral]
    
    AX --> AY[Mesa Completa]
    AY --> AZ[Proclamação Oficial]
    AZ --> BA[Publicação no e-DOLM]
    BA --> BB[Mandato: 2 anos]
    BB --> BC[Fim]
```

---

## 4. FLUXO DE COMISSÃO PARLAMENTAR DE INQUÉRITO (CPI)

```mermaid
flowchart TD
    A[Início: Requerimento de CPI] --> B[Verificação de Assinaturas<br/>Mínimo: 1/3 dos Vereadores]
    B --> C{Assinaturas<br/>Válidas?}
    
    C -->|Não| D[Requerimento Indeferido]
    D --> E[Fim]
    
    C -->|Sim| F[Verificação de Fato Determinado]
    F --> G{Fato<br/>Determinado?}
    
    G -->|Não| D
    G -->|Sim| H[Verificação de Prazo Certo<br/>90 dias + prorrogação 90]
    
    H --> I[Leitura no Plenário]
    I --> J[Criação Automática da CPI]
    J --> K[Composição Proporcional]
    
    K --> L[Indicação de Membros<br/>pelos Líderes]
    L --> M[Nomeação pelo Presidente<br/>da Câmara]
    
    M --> N[1ª Reunião da CPI]
    N --> O[Eleição de Presidente]
    O --> P[Eleição de Vice-Presidente]
    P --> Q[Eleição de Relator]
    
    Q --> R[Aprovação do Plano de Trabalho]
    R --> S[Início das Investigações]
    
    S --> T[Requerimentos de Diligências]
    T --> U[Convocação de Testemunhas]
    U --> V[Requisição de Documentos]
    V --> W[Quebra de Sigilo<br/>Autorização Judicial]
    
    W --> X[Oitivas e Depoimentos]
    X --> Y[Inspeções Locais]
    Y --> Z[Perícias Técnicas]
    
    Z --> AA[Análise de Documentos]
    AA --> AB{Prazo<br/>Esgotado?}
    
    AB -->|Não| AC{Necessita<br/>Prorrogação?}
    AC -->|Sim| AD[Requerimento ao Plenário]
    AD --> AE[Votação da Prorrogação<br/>Máximo: 90 dias]
    AE --> T
    
    AC -->|Não| T
    AB -->|Sim| AF[Elaboração do Relatório]
    
    AF --> AG[Relatório do Relator]
    AG --> AH[Discussão na CPI]
    AH --> AI{Votos<br/>em Separado?}
    
    AI -->|Sim| AJ[Anexação ao Relatório]
    AI -->|Não| AK
    AJ --> AK[Aprovação do Relatório<br/>Maioria]
    
    AK --> AL[Encaminhamentos]
    AL --> AM{Conclusões}
    
    AM -->|Irregularidades| AN[Ministério Público]
    AM -->|Crimes| AO[Autoridades Competentes]
    AM -->|Admin.| AP[Poder Executivo]
    AM -->|Legislação| AQ[Mesa Diretora/Vereadores]
    
    AN --> AR[Leitura no Plenário]
    AO --> AR
    AP --> AR
    AQ --> AR
    
    AR --> AS[Publicação Oficial]
    AS --> AT[Arquivo da CPI]
    AT --> E
```

---

## 5. FLUXO DE APROVAÇÃO DO ORÇAMENTO (LOA)

```mermaid
flowchart TD
    A[Início: Recebimento do Projeto<br/>do Executivo] --> B[Prazo Legal]
    B --> C[Protocolo na Diretoria<br/>Legislativa]
    
    C --> D[Distribuição Imediata]
    D --> E[Comissão de Finanças]
    E --> F[Análise Técnica]
    
    F --> G[Audiência Pública<br/>Secretário de Finanças]
    G --> H[Prazo para Emendas<br/>Vereadores]
    
    H --> I{Emendas<br/>Apresentadas?}
    I -->|Sim| J[Análise de Admissibilidade]
    J --> K{Compatível<br/>com LDO?}
    
    K -->|Não| L[Emenda Rejeitada]
    K -->|Sim| M[Análise Técnica]
    
    M --> N{Fonte de<br/>Recurso?}
    N -->|Não Indicada| L
    N -->|Indicada| O[Emenda Aceita]
    
    I -->|Não| P[Parecer da Comissão]
    O --> P
    
    P --> Q[Relatório Geral]
    Q --> R[Substitutivo se necessário]
    R --> S[Aprovação na Comissão]
    
    S --> T[Distribuição aos Vereadores<br/>Mínimo 48h antes]
    T --> U[Inclusão na Ordem do Dia]
    
    U --> V[Sessão Plenária]
    V --> W[Leitura do Parecer]
    W --> X[Discussão]
    
    X --> Y{Destaques<br/>de Emendas?}
    Y -->|Sim| Z[Votação em Separado]
    Z --> AA[Votação do Projeto]
    
    Y -->|Não| AA
    AA --> AB{Aprovado?}
    
    AB -->|Não| AC[Prejudicado<br/>Perde Eficácia]
    AC --> AD[Comunicação ao Executivo]
    AD --> AE[Fim: Orçamento Anterior<br/>mantido por duodécimos]
    
    AB -->|Sim| AF[Redação Final]
    AF --> AG[Autógrafos]
    AG --> AH[Encaminhamento ao Prefeito]
    
    AH --> AI[Sanção]
    AI --> AJ[Promulgação]
    AJ --> AK[Publicação]
    
    AK --> AL[Lei Orçamentária]
    AL --> AM[Início da Vigência<br/>1º de janeiro]
    AM --> AN[Fim: Orçamento Aprovado]
```

---

## 6. FLUXO DE PROCESSO DE CASSAÇÃO DE MANDATO

```mermaid
flowchart TD
    A[Início: Denúncia] --> B[Protocolo na Mesa Diretora]
    B --> C[Análise Preliminar]
    
    C --> D{Requisitos<br/>Formais?}
    D -->|Não| E[Arquivamento<br/>Notificação ao Denunciante]
    E --> F[Fim]
    
    D -->|Sim| G[Leitura no Plenário]
    G --> H[Notificação ao Denunciado]
    
    H --> I[Prazo: 10 sessões<br/>para Defesa Prévia]
    I --> J[Recebimento da Defesa]
    J --> K[Leitura da Defesa no Plenário]
    
    K --> L[Votação: Formação de<br/>Comissão Processante]
    L --> M{Aprovada?<br/>Maioria Absoluta}
    
    M -->|Não| E
    M -->|Sim| N[Composição da Comissão<br/>3 Membros - Proporcional]
    
    N --> O[Sorteio dos Membros]
    O --> P[Instalação da Comissão]
    P --> Q[Eleição do Presidente]
    
    Q --> R[Notificação ao Denunciado<br/>Prazo: 15 dias para Defesa]
    R --> S[Instrução Processual<br/>Prazo: 90 dias]
    
    S --> T[Inquirição de Testemunhas]
    T --> U[Análise de Provas]
    U --> V[Diligências]
    
    V --> W[Alegações Finais<br/>Acusação: 2 sessões]
    W --> X[Alegações Finais<br/>Defesa: 2 sessões]
    
    X --> Y[Elaboração do Parecer]
    Y --> Z[Leitura do Parecer<br/>no Plenário]
    
    Z --> AA[Inclusão na Ordem do Dia]
    AA --> AB[Discussão: 5 sessões]
    
    AB --> AC[Votação Nominal Secreta]
    AC --> AD[Quórum: 2/3 para cassação<br/>28 vereadores]
    
    AD --> AE{Resultado}
    AE -->|Menos de 2/3| AF[Absolvição]
    AF --> AG[Arquivamento]
    AG --> F
    
    AE -->|2/3 ou mais| AH[Cassação do Mandato]
    AH --> AI[Declaração de Perda<br/>do Mandato]
    
    AI --> AJ[Comunicação ao TRE]
    AJ --> AK[Convocação do Suplente]
    AK --> AL[Publicação Oficial]
    AL --> F
```

---

## 7. FLUXO DE AUDIÊNCIA PÚBLICA

```mermaid
flowchart TD
    A[Início: Demanda por<br/>Audiência Pública] --> B{Origem}
    
    B -->|Comissão| C[Deliberação da Comissão]
    B -->|Requerimento| D[Apresentação no Plenário]
    
    D --> E[Votação do Requerimento]
    E --> F{Aprovado?}
    F -->|Não| G[Fim]
    F -->|Sim| C
    
    C --> H[Definição do Tema]
    H --> I[Escolha da Data/Local]
    I --> J[Definição de Convidados]
    
    J --> K[Convites Oficiais<br/>Prazo: 7 dias antes]
    K --> L[Divulgação Pública<br/>Site, Redes Sociais]
    
    L --> M[Cadastro de Participantes]
    M --> N[Organização da Pauta]
    N --> O[Dia da Audiência]
    
    O --> P[Abertura pelo Presidente<br/>da Comissão]
    P --> Q[Exposições dos Convidados]
    
    Q --> R{Mais<br/>Expositores?}
    R -->|Sim| Q
    R -->|Não| S[Debates]
    
    S --> T[Inscrição de Participantes]
    T --> U[Manifestações do Público<br/>Tempo Controlado]
    
    U --> V{Mais<br/>Inscritos?}
    V -->|Sim| U
    V -->|Não| W[Considerações Finais]
    
    W --> X[Encerramento]
    X --> Y[Lavratura da Ata]
    Y --> Z[Gravação/Transmissão]
    
    Z --> AA[Encaminhamentos]
    AA --> AB{Propostas<br/>Legislativas?}
    
    AB -->|Sim| AC[Elaboração de Projetos]
    AB -->|Não| AD[Indicações ao Executivo]
    
    AC --> AE[Publicação da Ata]
    AD --> AE
    AE --> AF[Relatório da Audiência]
    AF --> G
```

---

## 8. FLUXO DE PARTICIPAÇÃO POPULAR (INICIATIVA POPULAR)

```mermaid
flowchart TD
    A[Início: Proposta Popular] --> B[Elaboração do Projeto<br/>com Apoio Técnico]
    B --> C[Início da Coleta<br/>de Assinaturas]
    
    C --> D[Divulgação da Proposta]
    D --> E[Coleta Física]
    D --> F[Coleta Digital<br/>Portal Legislativo]
    
    E --> G[Validação de Assinaturas]
    F --> G
    
    G --> H[Verificação com TSE]
    H --> I{Atingiu 5%<br/>do Eleitorado?}
    
    I -->|Não| J[Notificação aos Proponentes<br/>Prazo Adicional]
    J --> K{Desiste?}
    K -->|Sim| L[Fim]
    K -->|Não| C
    
    I -->|Sim| M[Protocolo Oficial]
    M --> N[Numeração como<br/>Projeto de Lei]
    
    N --> O[Designação de Relator<br/>da Sociedade Civil]
    O --> P[Tramitação Prioritária]
    
    P --> Q[CCJ - Análise]
    Q --> R[Comissões de Mérito]
    R --> S[Parecer das Comissões]
    
    S --> T[Inclusão na Ordem do Dia<br/>Prioridade]
    T --> U[Direito de Defesa na Tribuna<br/>Proponente: 5 minutos]
    
    U --> V[Discussão]
    V --> W[Votação]
    W --> X{Aprovado?}
    
    X -->|Não| Y[Arquivamento<br/>Notificação aos Proponentes]
    Y --> L
    
    X -->|Sim| Z[Encaminhamento<br/>ao Prefeito]
    Z --> AA[Sanção/Veto]
    AA --> AB[Promulgação]
    AB --> AC[Publicação]
    AC --> AD[Notificação aos Proponentes]
    AD --> L
```

---

## LEGENDA DOS SÍMBOLOS

- **Retângulo:** Processo/Ação
- **Losango:** Decisão/Condição
- **Retângulo Arredondado:** Início/Fim
- **Círculo:** Conector
- **Paralelogramo:** Entrada/Saída de Dados

---

## OBSERVAÇÕES IMPORTANTES

1. **Prazos:** Todos os prazos são contados em dias úteis, salvo especificação contrária
2. **Quórum:** Sempre verificado antes de votações importantes
3. **Publicidade:** Todas as decisões devem ser publicadas no e-DOLM
4. **Recursos:** Cabíveis conforme o Regimento Interno
5. **Urgência:** Altera prazos mas mantém os trâmites essenciais
6. **Proporcionalidade:** Sempre observada na composição de comissões
7. **Defesa:** Ampla defesa e contraditório garantidos em processos disciplinares
8. **Transparência:** Todos os processos acessíveis ao público via portal
