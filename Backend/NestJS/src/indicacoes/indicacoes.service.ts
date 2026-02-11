import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IndicacoesService {
    constructor(private prisma: PrismaService) { }

    async criarIndicacao(autorId: string, tipo: string, descricao: string, valorEstimado?: number, bairro?: string) {
        return { id: `IND-${Date.now()}`, autorId, tipo, descricao, valorEstimado, bairro, status: 'PROTOCOLADA', criadoEm: new Date() };
    }

    async listarIndicacoes(filtro?: { tipo?: string; status?: string; autorId?: string }) {
        return { total: 0, indicacoes: [], filtro };
    }

    async encaminharExecutivo(indicacaoId: string) {
        return { indicacaoId, status: 'ENCAMINHADA_EXECUTIVO', encaminhadoEm: new Date() };
    }

    async registrarResposta(indicacaoId: string, resposta: string, atendida: boolean) {
        return { indicacaoId, resposta, atendida, status: atendida ? 'ATENDIDA' : 'NAO_ATENDIDA', respondidoEm: new Date() };
    }

    // Contas do Executivo — LOMAN art. 23
    async registrarContasExecutivo(exercicio: number, parecerTCE: string, documentos: string[]) {
        return { id: `CE-${exercicio}`, exercicio, parecerTCE, documentos, status: 'RECEBIDA', criadoEm: new Date() };
    }

    async votarContasExecutivo(contasId: string, aprovadas: boolean, votosA: number, votosC: number) {
        return { contasId, aprovadas, votosA, votosC, status: aprovadas ? 'APROVADAS' : 'REJEITADAS', votadoEm: new Date() };
    }
}
