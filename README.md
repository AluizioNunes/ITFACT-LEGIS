# ITFACT LEGIS

Sistema completo de gestão legislativa com arquitetura moderna e recursos avançados de IA/ML.

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 16.1.6** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **shadcn/ui** - Componentes UI premium
- **Tailwind CSS** - Framework CSS utilitário
- **TanStack Query** - Gerenciamento de estado do servidor
- **Zustand** - Gerenciamento de estado global
- **Socket.io Client** - Comunicação em tempo real

### Backend
- **NestJS** - Framework Node.js com TypeScript
- **FastAPI** - Framework Python de alta performance
- **Prisma** - ORM moderno para TypeScript
- **Passport.js** - Autenticação
- **Socket.io** - WebSockets

### Bancos de Dados
- **PostgreSQL (latest)** - Banco relacional principal
- **Redis (latest)** - Cache e sessões
- **MongoDB** - Armazenamento de documentos
- **Neo4j** - Banco de dados de grafos

### Serviços
- **RabbitMQ** - Message broker
- **MinIO** - Object storage (S3-compatible)
- **Nginx** - Reverse proxy
- **Docker Compose** - Orquestração de containers

### AI/ML
- **LangChain** - Framework para aplicações com LLMs
- **LlamaIndex** - Framework de dados para LLMs
- **Graphiti (Zep)** - Memória de grafos para IA
- **PyMuPDF/Marker** - Processamento de PDFs
- **HuggingFace** - Embeddings e modelos

## 📋 Pré-requisitos

- **Docker** e **Docker Compose**
- **Node.js 25.6.0**
- **Python 3.14**
- **Git**

## 🛠️ Instalação e Configuração

### 1. Clone o repositório

```bash
cd d:/PROJETOS/ITFACT-LEGIS
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

### 3. Inicie os serviços com Docker Compose

```bash
docker-compose up -d
```

Isso irá iniciar todos os serviços:
- PostgreSQL
- Redis
- MongoDB
- Neo4j
- RabbitMQ
- MinIO
- NestJS Backend
- FastAPI Backend
- Next.js Frontend
- Nginx

### 4. Acesse a aplicação

- **Frontend**: http://localhost
- **NestJS API**: http://localhost/api/nest
- **FastAPI**: http://localhost/api/python
- **Swagger (NestJS)**: http://localhost/api/nest/api/docs
- **FastAPI Docs**: http://localhost/api/python/docs

## 📊 Portas dos Serviços

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| NestJS API | 3001 | http://localhost:3001 |
| FastAPI | 8000 | http://localhost:8000 |
| Nginx | 80, 443 | http://localhost |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| MongoDB | 27017 | localhost:27017 |
| Neo4j Browser | 7474 | http://localhost:7474 |
| Neo4j Bolt | 7687 | bolt://localhost:7687 |
| RabbitMQ Management | 15672 | http://localhost:15672 |
| RabbitMQ AMQP | 5672 | localhost:5672 |
| MinIO API | 9000 | http://localhost:9000 |
| MinIO Console | 9001 | http://localhost:9001 |

## 🔧 Desenvolvimento

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### Backend NestJS

```bash
cd backend/nestjs
npm install

# Gerar Prisma Client
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Iniciar em modo desenvolvimento
npm run start:dev
```

### Backend FastAPI

```bash
cd backend/fastapi
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📚 Estrutura do Projeto

```
ITFACT-LEGIS/
├── frontend/                 # Next.js 16.1.6 Application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities and stores
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── nestjs/              # NestJS TypeScript API
│   │   ├── src/
│   │   │   ├── auth/        # Authentication module
│   │   │   ├── users/       # Users module
│   │   │   ├── events/      # WebSocket gateway
│   │   │   └── prisma/      # Prisma service
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── fastapi/             # FastAPI Python Service
│       ├── main.py
│       ├── requirements.txt
│       └── Dockerfile
│
├── nginx/
│   └── nginx.conf           # Nginx configuration
│
├── docker-compose.yml       # Docker orchestration
├── .env.example             # Environment variables template
└── README.md
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação.

### Registro de Usuário

```bash
POST /api/nest/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

### Login

```bash
POST /api/nest/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER"
  }
}
```

## 🤖 Recursos de IA/ML

### Extração de Texto de PDF

```bash
POST /api/python/pdf/extract
Content-Type: multipart/form-data

file: [PDF file]
```

### Geração de Embeddings

```bash
POST /api/python/ai/embeddings
Content-Type: application/json

{
  "text": "Texto para gerar embeddings"
}
```

### Upload para MinIO

```bash
POST /api/python/storage/upload
Content-Type: multipart/form-data

file: [Any file]
```

## 🔄 WebSocket (Tempo Real)

Conecte-se ao WebSocket em `ws://localhost/socket.io`

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost');

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

socket.emit('message', { data: 'Hello' });
```

## 📦 Comandos Úteis

### Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Ver status dos containers
docker-compose ps
```

### Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Criar migração
npx prisma migrate dev --name migration_name

# Abrir Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

## 🧪 Testes

### Frontend
```bash
cd frontend
npm test
```

### Backend NestJS
```bash
cd backend/nestjs
npm test
```

## 📝 Credenciais Padrão

### PostgreSQL
- User: `postgres`
- Password: `postgres123`
- Database: `itfact_legis`

### MongoDB
- User: `admin`
- Password: `admin123`

### Neo4j
- User: `neo4j`
- Password: `neo4j123`

### RabbitMQ
- User: `admin`
- Password: `admin123`

### MinIO
- Access Key: `minioadmin`
- Secret Key: `minioadmin123`

**⚠️ IMPORTANTE: Altere todas as credenciais em produção!**

## 🚀 Deploy

Para produção, configure:

1. Variáveis de ambiente seguras
2. Certificados SSL no Nginx
3. Senhas fortes para todos os serviços
4. Backup automático dos bancos de dados
5. Monitoramento e logs

## 📄 Licença

Este projeto é proprietário da ITFACT.

## 👥 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ usando as melhores tecnologias**
