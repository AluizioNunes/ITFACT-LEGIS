# Guia de Implementação - Sistema Legislativo CMM
## Exemplos Práticos de Código

---

## 1. ESTRUTURA DE PASTAS DO PROJETO

```
sistema-legislativo-cmm/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   └── validators/
│   │   ├── models/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── utils/
│   │   ├── config/
│   │   └── database/
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── mobile/
├── docs/
└── docker-compose.yml
```

---

## 2. BACKEND - NODE.JS + TYPESCRIPT

### 2.1 Configuração Inicial (package.json)

```json
{
  "name": "sistema-legislativo-cmm-backend",
  "version": "1.0.0",
  "description": "Backend do Sistema Legislativo da CMM",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "migrate": "knex migrate:latest",
    "seed": "knex seed:run"
  },
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.0.0",
    "pg": "^8.11.0",
    "knex": "^2.5.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "joi": "^17.9.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "multer": "^1.4.5-lts.1",
    "winston": "^3.8.2",
    "redis": "^4.6.0",
    "socket.io": "^4.6.0",
    "pdf-lib": "^1.17.1",
    "nodemailer": "^6.9.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "@types/jest": "^29.5.0",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.5.0"
  }
}
```

### 2.2 Configuração do Servidor (src/server.ts)

```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './api/routes';
import { errorHandler } from './api/middlewares/errorHandler';
import { logger } from './utils/logger';
import { connectDatabase } from './database/connection';

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 1000, // 1000 requisições por hora
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// Rotas
app.use('/api/v1', routes);

// WebSocket
io.on('connection', (socket) => {
  logger.info(`Cliente conectado: ${socket.id}`);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    logger.info(`Cliente ${socket.id} entrou na sala ${room}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Cliente desconectado: ${socket.id}`);
  });
});

// Error Handler
app.use(errorHandler);

// Inicialização
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    logger.info('Database conectado com sucesso');
    
    httpServer.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

export { io };
```

### 2.3 Model de Proposição (src/models/Proposicao.ts)

```typescript
import { Model } from 'objection';

export class Proposicao extends Model {
  static tableName = 'proposicao';

  id_proposicao!: number;
  tipo!: string;
  numero!: number;
  ano!: number;
  ementa!: string;
  justificativa?: string;
  texto_integral?: string;
  id_autor_principal!: number;
  origem!: string;
  regime_tramitacao!: string;
  data_apresentacao!: Date;
  data_protocolo?: Date;
  situacao!: string;
  legislatura!: number;
  created_at!: Date;
  updated_at!: Date;

  // Relacionamentos
  static relationMappings = {
    autor: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Vereador').Vereador,
      join: {
        from: 'proposicao.id_autor_principal',
        to: 'vereador.id_vereador'
      }
    },
    coautores: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Vereador').Vereador,
      join: {
        from: 'proposicao.id_proposicao',
        through: {
          from: 'proposicao_coautor.id_proposicao',
          to: 'proposicao_coautor.id_vereador'
        },
        to: 'vereador.id_vereador'
      }
    },
    tramitacoes: {
      relation: Model.HasManyRelation,
      modelClass: require('./Tramitacao').Tramitacao,
      join: {
        from: 'proposicao.id_proposicao',
        to: 'tramitacao.id_proposicao'
      }
    },
    emendas: {
      relation: Model.HasManyRelation,
      modelClass: require('./Emenda').Emenda,
      join: {
        from: 'proposicao.id_proposicao',
        to: 'emenda.id_proposicao'
      }
    }
  };

  // Validações
  static jsonSchema = {
    type: 'object',
    required: ['tipo', 'ementa', 'id_autor_principal', 'origem', 'data_apresentacao'],
    properties: {
      tipo: { 
        type: 'string',
        enum: ['PROJETO_LEI', 'PROJETO_RESOLUCAO', 'PROJETO_DECRETO', 'EMENDA_LOMAN']
      },
      ementa: { type: 'string', minLength: 10, maxLength: 2000 },
      id_autor_principal: { type: 'integer' },
      origem: {
        type: 'string',
        enum: ['VEREADOR', 'MESA', 'COMISSAO', 'EXECUTIVO', 'POPULAR']
      },
      regime_tramitacao: {
        type: 'string',
        enum: ['ORDINARIO', 'URGENTE', 'PRIORIDADE']
      }
    }
  };

  // Hooks
  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}
```

### 2.4 Repository de Proposição (src/repositories/ProposicaoRepository.ts)

```typescript
import { Proposicao } from '../models/Proposicao';
import { transaction, Transaction } from 'objection';

export class ProposicaoRepository {
  async create(data: Partial<Proposicao>, trx?: Transaction): Promise<Proposicao> {
    const query = Proposicao.query(trx);
    
    // Gerar número sequencial
    const ultimaProposicao = await query
      .where('tipo', data.tipo!)
      .where('ano', new Date().getFullYear())
      .orderBy('numero', 'desc')
      .first();
    
    data.numero = ultimaProposicao ? ultimaProposicao.numero + 1 : 1;
    data.ano = new Date().getFullYear();
    data.situacao = 'EM_TRAMITACAO';
    
    return await Proposicao.query(trx).insert(data);
  }

  async findById(id: number): Promise<Proposicao | undefined> {
    return await Proposicao.query()
      .findById(id)
      .withGraphFetched('[autor, coautores, tramitacoes.[comissao, parecer.[relator]], emendas.[autor]]');
  }

  async findAll(filters: any, page: number = 1, limit: number = 20) {
    const query = Proposicao.query()
      .withGraphFetched('[autor, coautores]');

    // Aplicar filtros
    if (filters.tipo) {
      query.where('tipo', filters.tipo);
    }
    if (filters.situacao) {
      query.where('situacao', filters.situacao);
    }
    if (filters.autor) {
      query.where('id_autor_principal', filters.autor);
    }
    if (filters.ano) {
      query.where('ano', filters.ano);
    }
    if (filters.q) {
      query.where(function() {
        this.where('ementa', 'ilike', `%${filters.q}%`)
          .orWhere('indexacao', 'ilike', `%${filters.q}%`);
      });
    }

    // Paginação
    const offset = (page - 1) * limit;
    const result = await query.page(offset, limit);

    return {
      items: result.results,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(result.total / limit),
        total_items: result.total,
        items_per_page: limit
      }
    };
  }

  async update(id: number, data: Partial<Proposicao>): Promise<Proposicao> {
    return await Proposicao.query()
      .patchAndFetchById(id, data);
  }

  async alterarRegime(id: number, regime: string, justificativa: string): Promise<Proposicao> {
    return await transaction(Proposicao.knex(), async (trx) => {
      const proposicao = await Proposicao.query(trx)
        .patchAndFetchById(id, { regime_tramitacao: regime });

      // Registrar log
      await this.registrarLog(id, 'ALTERACAO_REGIME', { 
        regime_novo: regime,
        justificativa 
      }, trx);

      return proposicao;
    });
  }

  async emTramitacao(comissao_id?: number): Promise<Proposicao[]> {
    const query = Proposicao.query()
      .where('situacao', 'EM_TRAMITACAO')
      .withGraphFetched('[autor, tramitacoes(current).[comissao]]')
      .modifiers({
        current(builder) {
          builder.whereNull('data_saida');
        }
      });

    if (comissao_id) {
      query.whereExists(
        Proposicao.relatedQuery('tramitacoes')
          .where('id_comissao', comissao_id)
          .whereNull('data_saida')
      );
    }

    return await query;
  }

  private async registrarLog(id: number, acao: string, dados: any, trx: Transaction) {
    // Implementar registro de log de auditoria
  }
}
```

### 2.5 Service de Proposição (src/services/ProposicaoService.ts)

```typescript
import { ProposicaoRepository } from '../repositories/ProposicaoRepository';
import { TramitacaoService } from './TramitacaoService';
import { NotificacaoService } from './NotificacaoService';
import { DocumentoService } from './DocumentoService';
import { Proposicao } from '../models/Proposicao';
import { transaction } from 'objection';
import { AppError } from '../utils/AppError';

export class ProposicaoService {
  private repository: ProposicaoRepository;
  private tramitacaoService: TramitacaoService;
  private notificacaoService: NotificacaoService;
  private documentoService: DocumentoService;

  constructor() {
    this.repository = new ProposicaoRepository();
    this.tramitacaoService = new TramitacaoService();
    this.notificacaoService = new NotificacaoService();
    this.documentoService = new DocumentoService();
  }

  async criar(data: any, arquivo?: Express.Multer.File): Promise<Proposicao> {
    return await transaction(Proposicao.knex(), async (trx) => {
      // Validar dados
      this.validarDados(data);

      // Criar proposição
      const proposicao = await this.repository.create(data, trx);

      // Upload de documento
      if (arquivo) {
        await this.documentoService.upload({
          arquivo,
          tipo_documento: 'PROPOSICAO',
          id_referencia: proposicao.id_proposicao,
          tabela_referencia: 'proposicao'
        }, trx);
      }

      // Iniciar tramitação na CCJ
      await this.tramitacaoService.iniciarTramitacao({
        id_proposicao: proposicao.id_proposicao,
        id_comissao: 2, // CCJ
        prazo_dias: data.regime_tramitacao === 'URGENTE' ? 1 : 5
      }, trx);

      // Notificar interessados
      await this.notificacaoService.enviar({
        tipo: 'PROPOSICAO_CRIADA',
        destinatarios: ['ccj', 'autor'],
        dados: { proposicao }
      });

      return proposicao;
    });
  }

  async obter(id: number): Promise<Proposicao> {
    const proposicao = await this.repository.findById(id);
    
    if (!proposicao) {
      throw new AppError('Proposição não encontrada', 404);
    }

    return proposicao;
  }

  async listar(filtros: any, page: number, limit: number) {
    return await this.repository.findAll(filtros, page, limit);
  }

  async alterarRegime(id: number, regime: string, justificativa: string, usuario_id: number) {
    // Validar permissão
    if (!this.validarPermissaoAlterarRegime(usuario_id)) {
      throw new AppError('Usuário sem permissão para alterar regime', 403);
    }

    const proposicao = await this.repository.alterarRegime(id, regime, justificativa);

    // Atualizar prazos nas tramitações
    await this.tramitacaoService.atualizarPrazos(id, regime);

    // Notificar
    await this.notificacaoService.enviar({
      tipo: 'REGIME_ALTERADO',
      destinatarios: ['comissoes', 'autor'],
      dados: { proposicao, regime, justificativa }
    });

    return proposicao;
  }

  async adicionarEmenda(id: number, emendaData: any): Promise<any> {
    const proposicao = await this.obter(id);

    // Validar se aceita emendas
    if (!this.aceitaEmendas(proposicao)) {
      throw new AppError('Proposição não aceita emendas no momento', 400);
    }

    return await transaction(Proposicao.knex(), async (trx) => {
      // Criar emenda
      const emenda = await this.tramitacaoService.adicionarEmenda({
        id_proposicao: id,
        ...emendaData
      }, trx);

      // Notificar comissões
      await this.notificacaoService.enviar({
        tipo: 'EMENDA_APRESENTADA',
        destinatarios: ['comissoes'],
        dados: { proposicao, emenda }
      });

      return emenda;
    });
  }

  private validarDados(data: any): void {
    if (!data.tipo || !data.ementa || !data.id_autor_principal) {
      throw new AppError('Dados obrigatórios não fornecidos', 400);
    }

    if (data.ementa.length < 10) {
      throw new AppError('Ementa muito curta (mínimo 10 caracteres)', 400);
    }

    if (data.tipo === 'EMENDA_LOMAN' && !data.texto_integral) {
      throw new AppError('Emenda à LOMAN requer texto integral', 400);
    }
  }

  private validarPermissaoAlterarRegime(usuario_id: number): boolean {
    // Implementar lógica de validação de permissão
    // Apenas Mesa Diretora pode alterar regime
    return true;
  }

  private aceitaEmendas(proposicao: Proposicao): boolean {
    // Verificar se está em fase de receber emendas
    return proposicao.situacao === 'EM_TRAMITACAO';
  }
}
```

### 2.6 Controller de Proposição (src/api/controllers/ProposicaoController.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import { ProposicaoService } from '../../services/ProposicaoService';
import { logger } from '../../utils/logger';

export class ProposicaoController {
  private service: ProposicaoService;

  constructor() {
    this.service = new ProposicaoService();
  }

  criar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const arquivo = req.file;
      const usuario = (req as any).usuario;

      data.id_autor_principal = usuario.id_vereador;
      
      const proposicao = await this.service.criar(data, arquivo);

      logger.info(`Proposição criada: ${proposicao.id_proposicao}`, {
        usuario_id: usuario.id,
        proposicao_id: proposicao.id_proposicao
      });

      return res.status(201).json({
        success: true,
        data: proposicao,
        message: 'Proposição criada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 20, ...filtros } = req.query;

      const resultado = await this.service.listar(
        filtros,
        Number(page),
        Number(limit)
      );

      return res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  };

  obter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const proposicao = await this.service.obter(Number(id));

      return res.json({
        success: true,
        data: proposicao
      });
    } catch (error) {
      next(error);
    }
  };

  alterarRegime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { regime, justificativa } = req.body;
      const usuario = (req as any).usuario;

      const proposicao = await this.service.alterarRegime(
        Number(id),
        regime,
        justificativa,
        usuario.id
      );

      return res.json({
        success: true,
        data: proposicao,
        message: 'Regime alterado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };

  adicionarEmenda = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const emendaData = req.body;
      const usuario = (req as any).usuario;

      emendaData.id_autor = usuario.id_vereador;

      const emenda = await this.service.adicionarEmenda(Number(id), emendaData);

      return res.status(201).json({
        success: true,
        data: emenda,
        message: 'Emenda adicionada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };
}
```

### 2.7 Rotas (src/api/routes/proposicao.routes.ts)

```typescript
import { Router } from 'express';
import { ProposicaoController } from '../controllers/ProposicaoController';
import { authenticateToken } from '../middlewares/auth';
import { validateProposicao } from '../validators/proposicao.validator';
import { upload } from '../middlewares/upload';

const router = Router();
const controller = new ProposicaoController();

// Rotas públicas
router.get('/', controller.listar);
router.get('/:id', controller.obter);

// Rotas protegidas
router.post(
  '/',
  authenticateToken,
  upload.single('arquivo'),
  validateProposicao,
  controller.criar
);

router.put(
  '/:id/regime',
  authenticateToken,
  controller.alterarRegime
);

router.post(
  '/:id/emendas',
  authenticateToken,
  controller.adicionarEmenda
);

export default router;
```

---

## 3. FRONTEND - REACT + TYPESCRIPT

### 3.1 Service de API (src/services/api.ts)

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor de Request
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de Response
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return await this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return await this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return await this.api.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return await this.api.delete(url, config);
  }
}

export const api = new ApiService();
```

### 3.2 Service de Proposição (src/services/proposicao.service.ts)

```typescript
import { api } from './api';

export interface Proposicao {
  id_proposicao: number;
  tipo: string;
  numero: number;
  ano: number;
  ementa: string;
  autor: {
    id_vereador: number;
    nome_parlamentar: string;
  };
  situacao: string;
  regime_tramitacao: string;
  data_apresentacao: string;
}

export interface ListarProposicoesParams {
  page?: number;
  limit?: number;
  tipo?: string;
  situacao?: string;
  autor?: number;
  ano?: number;
  q?: string;
}

export class ProposicaoService {
  async listar(params: ListarProposicoesParams) {
    return await api.get<{
      success: boolean;
      data: {
        items: Proposicao[];
        pagination: any;
      };
    }>('/proposicoes', { params });
  }

  async obter(id: number) {
    return await api.get<{
      success: boolean;
      data: Proposicao;
    }>(`/proposicoes/${id}`);
  }

  async criar(data: any, arquivo?: File) {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    if (arquivo) {
      formData.append('arquivo', arquivo);
    }

    return await api.post<{
      success: boolean;
      data: Proposicao;
      message: string;
    }>('/proposicoes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async alterarRegime(id: number, regime: string, justificativa: string) {
    return await api.put<{
      success: boolean;
      data: Proposicao;
      message: string;
    }>(`/proposicoes/${id}/regime`, { regime, justificativa });
  }

  async adicionarEmenda(id: number, emenda: any) {
    return await api.post<{
      success: boolean;
      data: any;
      message: string;
    }>(`/proposicoes/${id}/emendas`, emenda);
  }
}

export const proposicaoService = new ProposicaoService();
```

### 3.3 Componente de Listagem (src/components/ProposicaoList.tsx)

```tsx
import React, { useState, useEffect } from 'react';
import { proposicaoService, Proposicao } from '../services/proposicao.service';
import { Link } from 'react-router-dom';
import { Alert } from './Alert';
import { Loader } from './Loader';
import { Pagination } from './Pagination';

export const ProposicaoList: React.FC = () => {
  const [proposicoes, setProposicoes] = useState<Proposicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtros, setFiltros] = useState({
    tipo: '',
    situacao: '',
    q: ''
  });

  useEffect(() => {
    carregarProposicoes();
  }, [page, filtros]);

  const carregarProposicoes = async () => {
    try {
      setLoading(true);
      const response = await proposicaoService.listar({
        page,
        limit: 20,
        ...filtros
      });

      setProposicoes(response.data.items);
      setTotalPages(response.data.pagination.total_pages);
      setError(null);
    } catch (err: any) {
      setError(err.error?.message || 'Erro ao carregar proposições');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPage(1);
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="proposicao-list">
      <div className="header">
        <h2>Proposições</h2>
        <Link to="/proposicoes/nova" className="btn btn-primary">
          Nova Proposição
        </Link>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar..."
          value={filtros.q}
          onChange={(e) => handleFiltroChange('q', e.target.value)}
          className="form-control"
        />

        <select
          value={filtros.tipo}
          onChange={(e) => handleFiltroChange('tipo', e.target.value)}
          className="form-control"
        >
          <option value="">Todos os tipos</option>
          <option value="PROJETO_LEI">Projeto de Lei</option>
          <option value="PROJETO_RESOLUCAO">Projeto de Resolução</option>
          <option value="PROJETO_DECRETO">Projeto de Decreto</option>
        </select>

        <select
          value={filtros.situacao}
          onChange={(e) => handleFiltroChange('situacao', e.target.value)}
          className="form-control"
        >
          <option value="">Todas as situações</option>
          <option value="EM_TRAMITACAO">Em Tramitação</option>
          <option value="APROVADA">Aprovada</option>
          <option value="REJEITADA">Rejeitada</option>
          <option value="ARQUIVADA">Arquivada</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Proposição</th>
              <th>Ementa</th>
              <th>Autor</th>
              <th>Situação</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {proposicoes.map(prop => (
              <tr key={prop.id_proposicao}>
                <td>
                  <Link to={`/proposicoes/${prop.id_proposicao}`}>
                    {prop.tipo} {prop.numero}/{prop.ano}
                  </Link>
                </td>
                <td className="ementa">{prop.ementa}</td>
                <td>{prop.autor.nome_parlamentar}</td>
                <td>
                  <span className={`badge badge-${getSituacaoClass(prop.situacao)}`}>
                    {prop.situacao}
                  </span>
                </td>
                <td>{formatarData(prop.data_apresentacao)}</td>
                <td>
                  <Link 
                    to={`/proposicoes/${prop.id_proposicao}`}
                    className="btn btn-sm btn-secondary"
                  >
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

function getSituacaoClass(situacao: string): string {
  const classes: Record<string, string> = {
    'EM_TRAMITACAO': 'info',
    'APROVADA': 'success',
    'REJEITADA': 'danger',
    'ARQUIVADA': 'secondary'
  };
  return classes[situacao] || 'secondary';
}

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR');
}
```

---

Este guia fornece uma base sólida para implementação. Cada módulo pode ser expandido conforme as necessidades específicas do sistema.
