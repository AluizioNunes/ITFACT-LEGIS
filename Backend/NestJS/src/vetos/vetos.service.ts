import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VetosService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        tipo: string; // TOTAL ou PARCIAL
        razoes: string;
        artigosVetados?: string;
        proposituraId: string;
    }) {
        const prazo30dias = new Date();
        prazo30dias.setDate(prazo30dias.getDate() + 30);

        const veto = await this.prisma.veto.create({
            data: {
                tipo: data.tipo as any,
                razoes: data.razoes,
                artigosVetados: data.artigosVetados,
                prazo30dias,
            },
        });

        // Vincular veto à propositura e atualizar fase
        await this.prisma.propositura.update({
            where: { id: data.proposituraId },
            data: { vetoId: veto.id, faseAtual: 'VETADO', status: 'VETADO' },
        });

        // Criar alerta de prazo
        await this.prisma.alertaPrazo.create({
            data: {
                proposituraId: data.proposituraId,
                tipo: 'PRAZO_VETO',
                titulo: 'Prazo para deliberação do veto',
                descricao: `A Câmara tem 30 dias para deliberar sobre o veto ${data.tipo}`,
                prazoLimite: prazo30dias,
            },
        });

        return veto;
    }

    async findAll() {
        return this.prisma.veto.findMany({
            include: { propositura: true },
            orderBy: { dataRecebimento: 'desc' },
        });
    }

    async findPendentes() {
        return this.prisma.veto.findMany({
            where: { resultado: 'PENDENTE' },
            include: { propositura: true },
            orderBy: { prazo30dias: 'asc' },
        });
    }

    async votarVeto(id: string, resultado: string) {
        const veto = await this.prisma.veto.update({
            where: { id },
            data: {
                resultado: resultado as any,
                dataVotacao: new Date(),
            },
            include: { propositura: true },
        });

        // Se o veto foi rejeitado, promulgar
        if (resultado === 'REJEITADO' && veto.propositura) {
            await this.prisma.propositura.update({
                where: { id: veto.propositura.id },
                data: { faseAtual: 'PROMULGADO', status: 'PROMULGADO', dataPromulgacao: new Date() },
            });
        }

        return veto;
    }
}
