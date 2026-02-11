import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PresencaService {
    constructor(private prisma: PrismaService) { }

    /**
     * Registra presença eletrônica de um vereador em uma sessão.
     * Impacta cálculo de subsídios — Regimento arts. 116, 136.
     */
    async registrarPresenca(sessaoId: string, vereadorId: string, tipo: string = 'PRESENTE') {
        return this.prisma.presenca.upsert({
            where: { sessaoId_vereadorId: { sessaoId, vereadorId } },
            update: { tipo, registradoEm: new Date() },
            create: { sessaoId, vereadorId, tipo, registradoEm: new Date() },
        });
    }

    async listarPresencasSessao(sessaoId: string) {
        return this.prisma.presenca.findMany({
            where: { sessaoId },
            include: { vereador: { include: { partido: true } } },
            orderBy: { vereador: { nome: 'asc' } },
        });
    }

    /**
     * Relatório de presença para cálculo de subsídios.
     * Faltas sem justificativa = desconto proporcional.
     */
    async relatorioPresencaVereador(vereadorId: string, mesAno?: string) {
        const where: any = { vereadorId };
        if (mesAno) {
            const [ano, mes] = mesAno.split('-').map(Number);
            where.sessao = {
                data: {
                    gte: new Date(ano, mes - 1, 1),
                    lt: new Date(ano, mes, 1),
                },
            };
        }
        const presencas = await this.prisma.presenca.findMany({
            where, include: { sessao: true },
        });
        const total = presencas.length;
        const presentes = presencas.filter(p => p.tipo === 'PRESENTE').length;
        const ausenciasJustificadas = presencas.filter(p => p.tipo === 'AUSENTE_JUSTIFICADO').length;
        const ausenciasSemJustificativa = presencas.filter(p => p.tipo === 'AUSENTE').length;
        const percentualPresenca = total > 0 ? (presentes / total) * 100 : 0;
        const descontoSubsidio = ausenciasSemJustificativa > 0;

        return {
            vereadorId, total, presentes, ausenciasJustificadas, ausenciasSemJustificativa,
            percentualPresenca: Math.round(percentualPresenca * 10) / 10,
            descontoSubsidio,
            valorDesconto: descontoSubsidio ? `${ausenciasSemJustificativa} sessão(ões) a descontar` : null,
        };
    }

    async registrarPresencaEmLote(sessaoId: string, presencas: { vereadorId: string; tipo: string }[]) {
        return Promise.all(
            presencas.map(p => this.registrarPresenca(sessaoId, p.vereadorId, p.tipo)),
        );
    }
}
