import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TribunaService {
    constructor(private prisma: PrismaService) { }

    // Tribuna Popular — Reg. art. 131
    async inscreverEntidade(sessaoId: string, entidade: string, representante: string, tema: string) {
        return { id: `TP-${Date.now()}`, sessaoId, entidade, representante, tema, status: 'INSCRITO', criadoEm: new Date() };
    }

    async listarInscritos(sessaoId: string) {
        return { sessaoId, total: 0, inscritos: [] };
    }

    async registrarFala(inscricaoId: string, duracao: number, resumo: string) {
        return { inscricaoId, duracao, resumo, status: 'CONCLUIDO', registradoEm: new Date() };
    }

    // Pequeno Expediente — Reg. arts. 132-133
    async inscreverPequenoExpediente(sessaoId: string, vereadorId: string, assunto: string) {
        return { id: `PE-${Date.now()}`, sessaoId, vereadorId, assunto, tipo: 'PEQUENO_EXPEDIENTE', tempoMax: 5, status: 'INSCRITO' };
    }

    // Grande Expediente — Reg. art. 134
    async inscreverGrandeExpediente(sessaoId: string, vereadorId: string, assunto: string) {
        return { id: `GE-${Date.now()}`, sessaoId, vereadorId, assunto, tipo: 'GRANDE_EXPEDIENTE', tempoMax: 15, status: 'INSCRITO' };
    }

    async listarExpedientes(sessaoId: string, tipo?: string) {
        return { sessaoId, tipo, total: 0, expedientes: [] };
    }
}
