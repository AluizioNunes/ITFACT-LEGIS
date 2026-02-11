# 🏛️ Câmara Digital - Frontend

Sistema de Gestão Eletrônica de Documentos Legislativos da Câmara Municipal de Manaus.

## 🚀 Tecnologias

- **Next.js 15.1.6** - Framework React com App Router
- **React 19.0** - Biblioteca UI
- **TypeScript 5.7** - Tipagem estática
- **Tailwind CSS 4.1** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI baseados em Radix UI
- **Lucide React** - Ícones
- **Zustand** - Gerenciamento de estado
- **React Query** - Data fetching e cache
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📁 Estrutura do Projeto

```
src/
├── app/                          # App Router (Next.js 15+)
│   ├── login/                    # Página de login
│   │   └── page.tsx
│   ├── dashboard/                # Dashboard principal
│   │   └── page.tsx
│   ├── protocolos/               # Módulo de protocolos
│   │   ├── entrada/
│   │   ├── saida/
│   │   └── pesquisa/
│   ├── tramitacao/               # Módulo de tramitação
│   │   ├── recebida/
│   │   ├── enviada/
│   │   └── historico/
│   ├── minutas/                  # Módulo de minutas
│   ├── proposituras/             # Módulo de proposituras legislativas
│   ├── assinaturas/              # Assinaturas digitais
│   ├── arquivo/                  # Gestão de arquivo
│   ├── acervo/                   # Acervo documental
│   ├── legislativo/              # Parlamentares, partidos, etc
│   ├── sessoes/                  # Sessões plenárias
│   ├── relatorios/               # Relatórios gerenciais
│   ├── gerencia/                 # Administração do sistema
│   │   ├── usuarios/
│   │   ├── perfis/
│   │   ├── orgaos/
│   │   └── configuracoes/
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Página inicial (redireciona para login)
│   └── globals.css               # Estilos globais
│
├── components/
│   ├── ui/                       # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── checkbox.tsx
│   │   ├── label.tsx
│   │   └── scroll-area.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── Navbar.tsx            # Barra de navegação superior
│   │   └── Sidebar.tsx           # Sidebar com menus
│   └── modals/                   # Modais reutilizáveis
│       └── UsuarioModal.tsx      # Exemplo de modal CRUD
│
├── lib/
│   └── utils.ts                  # Funções utilitárias (cn, formatDate, etc)
│
├── hooks/                        # Custom hooks
├── types/                        # TypeScript types/interfaces
├── store/                        # Zustand stores
└── services/                     # Serviços de API
```

## 🛠️ Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0 ou yarn ou pnpm

### Passo a passo

1. **Clone o repositório:**

```bash
git clone https://github.com/cmm/camara-digital-frontend.git
cd camara-digital-frontend
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Outras configurações
NEXT_PUBLIC_APP_NAME=Câmara Digital
NEXT_PUBLIC_APP_VERSION=1.0.0
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. **Acesse o sistema:**

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📋 Roadmap de Telas

### ✅ Implementadas

- **Login.tsx** - Autenticação de usuários
- **Dashboard.tsx** - Dashboard principal com estatísticas
- **Navbar** - Barra de navegação superior
- **Sidebar** - Menu lateral com navegação hierárquica

### 🚧 Em Desenvolvimento

Consulte o arquivo `ROADMAP_TELAS.md` para a lista completa de 130+ telas planejadas.

## 🎨 Padrões de Código

### Nomenclatura de Arquivos

- **Páginas:** `PascalCase.tsx` (ex: `Usuarios.tsx`, `TramitacaoRecebida.tsx`)
- **Modais:** `[Nome]Modal.tsx` (ex: `UsuarioModal.tsx`, `TramitarDocumentoModal.tsx`)
- **Componentes UI:** `PascalCase.tsx` (ex: `Button.tsx`, `DataTable.tsx`)

### Estrutura de Componentes

```tsx
"use client"; // Apenas se necessário (interatividade)

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ComponentProps {
  // Props tipadas
}

export function Component({ ...props }: ComponentProps) {
  // Lógica do componente
  
  return (
    // JSX
  );
}
```

### Exemplo de Modal CRUD

```tsx
// src/components/modals/UsuarioModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario?: any;
  onSave: (data: any) => void;
}

export function UsuarioModal({
  open,
  onOpenChange,
  usuario,
  onSave,
}: UsuarioModalProps) {
  // Lógica do formulário
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {usuario ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        
        {/* Formulário */}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## 🔌 Integração com Backend

### API Client (Axios)

```typescript
// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Exemplo de Service

```typescript
// src/services/usuarios.service.ts
import { api } from "./api";

export const usuariosService = {
  async listar() {
    const { data } = await api.get("/usuarios");
    return data;
  },

  async buscar(id: number) {
    const { data } = await api.get(`/usuarios/${id}`);
    return data;
  },

  async criar(usuario: any) {
    const { data } = await api.post("/usuarios", usuario);
    return data;
  },

  async atualizar(id: number, usuario: any) {
    const { data } = await api.put(`/usuarios/${id}`, usuario);
    return data;
  },

  async deletar(id: number) {
    const { data } = await api.delete(`/usuarios/${id}`);
    return data;
  },
};
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint
npm run type-check   # Verifica tipos TypeScript
```

## 🎯 Funcionalidades Principais

### 1. Gestão de Protocolos
- ✅ Protocolo de entrada/saída
- ✅ Pesquisa simples e avançada
- ✅ Anexação de documentos
- ✅ Relatórios

### 2. Tramitação
- ✅ Caixa de entrada/saída
- ✅ Tramitação de documentos
- ✅ Controle de prazos
- ✅ Histórico completo

### 3. Minutas
- ✅ Editor de minutas
- ✅ Controle de versões
- ✅ Aprovação de minutas
- ✅ Expedição

### 4. Proposituras Legislativas
- ✅ Gestão de proposituras
- ✅ Tramitação legislativa
- ✅ Comissões e pareceres
- ✅ Votações

### 5. Assinaturas Digitais
- ✅ Assinatura ICP-Brasil
- ✅ Validação de assinaturas
- ✅ Assinatura com login/senha

### 6. Gerência
- ✅ Gestão de usuários
- ✅ Perfis e permissões
- ✅ Configurações do sistema

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:

```typescript
// Login
const response = await api.post("/auth/login", {
  username: "admin",
  password: "senha123",
});

localStorage.setItem("token", response.data.access_token);

// Logout
localStorage.removeItem("token");
```

## 🎨 Temas

O sistema suporta tema claro e escuro (configurável via Tailwind CSS):

```tsx
// Componente ThemeProvider pode ser implementado usando next-themes
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="light">
  {children}
</ThemeProvider>
```

## 📱 Responsividade

Todos os componentes são responsivos e seguem o padrão mobile-first do Tailwind CSS:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Conteúdo */}
</div>
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## 📚 Documentação Adicional

- [Roadmap de Telas](./ROADMAP_TELAS.md)
- [Documentação do Backend](../fastapi-backend/README.md)
- [Análise do Banco de Dados](../docs/ANALISE_BANCO_DE_DADOS.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário da Câmara Municipal de Manaus.

## 👥 Time de Desenvolvimento

- **Backend:** Python + FastAPI
- **Frontend:** Next.js + React 19
- **Design:** Tailwind CSS + shadcn/ui

---

**Versão:** 1.0.0  
**Última atualização:** 07/02/2026
