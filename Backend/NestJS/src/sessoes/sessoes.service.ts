import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessoesService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        legislaturaId: string;
        tipo: string;
        data: Date;
    }) {
        return this.prisma.sessao.create({
            data: {
                ...data,
                status: 'AGENDADA',
            },
        });
    }

    async findAll() {
        return this.prisma.sessao.findMany({
            orderBy: { data: 'desc' },
            include: {
                legislatura: true,
                _count: {
                    select: { presencas: true, votacoes: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const sessao = await this.prisma.sessao.findUnique({
            where: { id },
            include: {
                presencas: { include: { vereador: true } },
                inscritos: { include: { vereador: true }, orderBy: { ordem: 'asc' } },
                ordemDoDia: { include: { propositura: true }, orderBy: { ordem: 'asc' } },
                votacoes: { include: { votos: true, propositura: true } },
            },
        });
        if (!sessao) throw new NotFoundException('Sessão not found');
        return sessao;
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.sessao.update({
            where: { id },
            data: { status },
        });
    }
}
