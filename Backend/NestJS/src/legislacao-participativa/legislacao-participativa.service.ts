import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegislacaoParticipativaService {
    constructor(private prisma: PrismaService) { }

    // Legislação Participativa — Reg. art. 47
    async registrarSugestao(entidade: string, representante: string, assunto: string, texto: string) {
        return {
            id: `LP-${Date.now()}`, entidade, representante, assunto, texto,
            status: 'RECEBIDA', comissaoDestino: 'Comissão de Legislação Participativa', criadoEm: new Date(),
        };
    }

    async listarSugestoes(status?: string) {
        return { total: 0, sugestoes: [], filtro: status };
    }

    async analisarSugestao(sugestaoId: string, parecer: string, convertida: boolean) {
        return {
            sugestaoId, parecer, convertida,
            status: convertida ? 'CONVERTIDA_PROPOSITURA' : 'REJEITADA',
            analisadoEm: new Date(),
        };
    }

    async converterEmPropositura(sugestaoId: string, tipoPropositura: string) {
        return {
            sugestaoId, tipoPropositura,
            proposituraId: `PROP-${Date.now()}`,
            status: 'CONVERTIDA', convertidoEm: new Date(),
        };
    }
}
