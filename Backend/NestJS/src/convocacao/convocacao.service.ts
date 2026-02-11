import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConvocacaoService {
    constructor(private prisma: PrismaService) { }

    // Convocação de Prefeito/Secretários — Reg. arts. 233-238
    async criarConvocacao(tipo: string, convocadoNome: string, convocadoCargo: string, assunto: string, dataComparecimento: Date) {
        return {
            id: `CONV-${Date.now()}`, tipo, convocadoNome, convocadoCargo, assunto,
            dataComparecimento, prazo: '30 dias para comparecer', status: 'CONVOCADO', criadoEm: new Date(),
        };
    }

    async listarConvocacoes(status?: string) {
        return { total: 0, convocacoes: [], filtro: status };
    }

    async registrarComparecimento(convocacaoId: string, compareceu: boolean, resumo?: string) {
        return {
            convocacaoId, compareceu,
            status: compareceu ? 'COMPARECEU' : 'NAO_COMPARECEU',
            resumo, registradoEm: new Date(),
        };
    }

    async cancelarConvocacao(convocacaoId: string, motivo: string) {
        return { convocacaoId, motivo, status: 'CANCELADA', canceladoEm: new Date() };
    }
}
