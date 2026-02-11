import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PareceresService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        proposituraId: string;
        comissaoId: string;
        relatorId?: string;
        tipo: string; // CONSTITUCIONALIDADE, MERITO, FINANCEIRO, REDACAO_FINAL
        prazoLimite?: Date;
    }) {
        return this.prisma.parecerComissao.create({
            data: {
                ...data,
                tipo: data.tipo as any,
                status: data.relatorId ? 'COM_RELATOR' : 'AGUARDANDO_RELATOR',
            },
        });
    }

    async findByPropositura(proposituraId: string) {
        return this.prisma.parecerComissao.findMany({
            where: { proposituraId },
            include: { comissao: true },
            orderBy: { createdAt: 'asc' },
        });
    }

    async findByComissao(comissaoId: string) {
        return this.prisma.parecerComissao.findMany({
            where: { comissaoId },
            include: { propositura: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findPendentes() {
        return this.prisma.parecerComissao.findMany({
            where: { status: { in: ['AGUARDANDO_RELATOR', 'COM_RELATOR'] } },
            include: { comissao: true, propositura: true },
            orderBy: { prazoLimite: 'asc' },
        });
    }

    async designarRelator(id: string, relatorId: string) {
        return this.prisma.parecerComissao.update({
            where: { id },
            data: { relatorId, status: 'COM_RELATOR' },
        });
    }

    async emitirParecer(id: string, data: { texto: string; voto: string }) {
        return this.prisma.parecerComissao.update({
            where: { id },
            data: {
                texto: data.texto,
                voto: data.voto as any,
                dataEmissao: new Date(),
                status: 'PARECER_EMITIDO',
            },
        });
    }

    async aprovarParecer(id: string, aprovado: boolean) {
        return this.prisma.parecerComissao.update({
            where: { id },
            data: {
                status: aprovado ? 'APROVADO_COMISSAO' : 'REJEITADO_COMISSAO',
            },
        });
    }

    async checkPrazosVencidos() {
        const now = new Date();
        const vencidos = await this.prisma.parecerComissao.findMany({
            where: {
                status: { in: ['AGUARDANDO_RELATOR', 'COM_RELATOR'] },
                prazoLimite: { lt: now },
            },
            include: { comissao: true, propositura: true },
        });

        // Marcar como prazo vencido
        for (const parecer of vencidos) {
            await this.prisma.parecerComissao.update({
                where: { id: parecer.id },
                data: { status: 'PRAZO_VENCIDO' },
            });
        }

        return vencidos;
    }
}
