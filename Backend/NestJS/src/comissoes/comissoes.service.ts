import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComissoesService {
    constructor(private prisma: PrismaService) { }

    async create(data: { nome: string; sigla: string; tipo: string; descricao?: string }) {
        return this.prisma.comissao.create({ data });
    }

    async findAll() {
        return this.prisma.comissao.findMany({
            include: {
                _count: { select: { membros: true } },
            },
        });
    }

    async findOne(id: string) {
        const comissao = await this.prisma.comissao.findUnique({
            where: { id },
            include: {
                membros: {
                    include: { vereador: true },
                },
            },
        });
        if (!comissao) throw new NotFoundException('Comissão not found');
        return comissao;
    }

    async addMembro(comissaoId: string, data: { vereadorId: string; cargo: string; inicio?: Date; fim?: Date }) {
        return this.prisma.membroComissao.create({
            data: {
                ...data,
                comissaoId,
            },
        });
    }
}
