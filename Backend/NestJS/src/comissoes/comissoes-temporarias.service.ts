import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type TipoComissaoTemporaria = 'ESPECIAL' | 'CPI' | 'PROCESSANTE' | 'MISTA' | 'REPRESENTATIVA';

/**
 * Comissões Temporárias — Regimento arts. 64-74
 * Especial: temas específicos, prazo máximo legislatura
 * CPI: poderes de investigação, prazo 120 dias
 * Processante: decoro parlamentar
 * Mista: Câmara + Executivo
 * Representativa: representar Câmara em eventos
 */
@Injectable()
export class ComissoesTemporariasService {
    constructor(private prisma: PrismaService) { }

    async criarComissaoTemporaria(
        tipo: TipoComissaoTemporaria,
        objetivo: string,
        membrosIds: string[],
        presidenteId: string,
        relatorId: string,
        prazo: number, // dias
    ) {
        const prazosMaximos: Record<TipoComissaoTemporaria, number> = {
            ESPECIAL: 365 * 4,
            CPI: 120,
            PROCESSANTE: 90,
            MISTA: 180,
            REPRESENTATIVA: 30,
        };

        const prazoFinal = Math.min(prazo, prazosMaximos[tipo]);
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + prazoFinal);

        return {
            id: `CT-${Date.now()}`,
            tipo,
            objetivo,
            membros: membrosIds,
            presidenteId,
            relatorId,
            prazoDias: prazoFinal,
            dataLimite: dataLimite.toISOString(),
            status: 'ATIVA',
            quorumMinimo: tipo === 'CPI' ? '1/3 dos membros da Câmara' : 'Maioria simples',
            poderes: tipo === 'CPI' ? 'Poderes de investigação judicial (Reg. art. 68)' : 'Estudo e parecer',
            criadoEm: new Date().toISOString(),
        };
    }

    async listarComissoesTemporarias(tipo?: TipoComissaoTemporaria, status?: string) {
        return { total: 0, comissoes: [], filtro: { tipo, status } };
    }

    async prorrogarPrazo(comissaoId: string, diasExtras: number, justificativa: string) {
        return { comissaoId, diasExtras, justificativa, status: 'PRORROGADA', prorrogadoEm: new Date().toISOString() };
    }

    async encerrarComissao(comissaoId: string, relatorioFinal: string) {
        return { comissaoId, relatorioFinal, status: 'ENCERRADA', encerradoEm: new Date().toISOString() };
    }

    async criarCPI(
        fato: string,
        prazo: number,
        requerentesIds: string[],
        fundamentacao: string,
    ) {
        if (requerentesIds.length < 7) {
            // 1/3 de 21 vereadores = 7
            throw new Error('CPI requer no mínimo 1/3 dos membros da Câmara (7 requerentes). Reg. art. 68.');
        }
        return {
            id: `CPI-${Date.now()}`,
            tipo: 'CPI' as TipoComissaoTemporaria,
            fato,
            prazo: Math.min(prazo, 120),
            requerentes: requerentesIds,
            fundamentacao,
            poderes: [
                'Convocar testemunhas sob pena de responsabilidade',
                'Requisitar documentos de órgãos públicos',
                'Determinar diligências',
                'Quebra de sigilo bancário, fiscal e telefônico (via judiciário)',
            ],
            status: 'REQUERIDA',
            criadoEm: new Date().toISOString(),
        };
    }
}
