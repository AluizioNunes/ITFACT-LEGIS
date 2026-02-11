import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProporcionalidadeService {
    constructor(private prisma: PrismaService) { }

    /**
     * Calcula proporcionalidade partidária para distribuição de vagas em comissões.
     * Conforme Regimento art. 36 — coeficiente proporcional.
     */
    async calcularProporcionalidade(legislaturaId: string) {
        const vereadores = await this.prisma.vereador.findMany({
            where: { legislaturaId },
            include: { partido: true },
        });
        const totalVereadores = vereadores.length;
        const porPartido: Record<string, { partido: string; membros: number; coeficiente: number }> = {};

        vereadores.forEach(v => {
            const sigla = v.partido?.sigla || 'SEM_PARTIDO';
            if (!porPartido[sigla]) porPartido[sigla] = { partido: sigla, membros: 0, coeficiente: 0 };
            porPartido[sigla].membros++;
        });

        // Calcular coeficiente proporcional
        const totalComissoes = 25;
        const vagasPorComissao = 5; // padrão
        Object.values(porPartido).forEach(p => {
            p.coeficiente = Math.round((p.membros / totalVereadores) * vagasPorComissao * 100) / 100;
        });

        return {
            legislaturaId, totalVereadores, totalComissoes, vagasPorComissao,
            distribuicao: Object.values(porPartido).sort((a, b) => b.membros - a.membros),
        };
    }

    async distribuirVagas(legislaturaId: string, comissaoId: string) {
        const prop = await this.calcularProporcionalidade(legislaturaId);
        return { comissaoId, distribuicao: prop.distribuicao, status: 'DISTRIBUIDA' };
    }
}
