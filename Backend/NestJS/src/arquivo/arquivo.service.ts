import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArquivoService {
    constructor(private prisma: PrismaService) { }

    async registrarDocumento(titulo: string, tipo: string, origem: string, caixa: string, localizacao: string, metadata?: Record<string, any>) {
        return { id: `ARQ-${Date.now()}`, titulo, tipo, origem, caixa, localizacao, metadata, status: 'ARQUIVADO', criadoEm: new Date() };
    }

    async buscarDocumento(filtro: { titulo?: string; tipo?: string; caixa?: string; ano?: number }) {
        return { total: 0, documentos: [], filtro };
    }

    async registrarEmprestimo(documentoId: string, solicitanteId: string, prazoDevolver: Date) {
        return { id: `EMP-${Date.now()}`, documentoId, solicitanteId, prazoDevolver, status: 'EMPRESTADO', emprestadoEm: new Date() };
    }

    async devolverDocumento(emprestimoId: string) {
        return { emprestimoId, status: 'DEVOLVIDO', devolvidoEm: new Date() };
    }

    async listarCaixas() {
        return { total: 0, caixas: [] };
    }

    async inventario(ano?: number) {
        return { ano: ano || new Date().getFullYear(), totalDocumentos: 0, totalCaixas: 0, pendentesEliminacao: 0 };
    }

    async agendarEliminacao(documentoIds: string[], justificativa: string, dataEliminacao: Date) {
        return { ids: documentoIds, justificativa, dataEliminacao, status: 'AGENDADA_ELIMINACAO' };
    }
}
