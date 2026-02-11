import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscussoesService {
    constructor(private prisma: PrismaService) { }

    async registrarDiscussao(data: {
        proposituraId: string;
        sessaoId: string;
        fase: string; // PRIMEIRA ou SEGUNDA
        resultado?: string;
        observacoes?: string;
    }) {
        return this.prisma.discussaoPlenaria.create({
            data: {
                ...data,
                fase: data.fase as any,
            },
        });
    }

    async findByPropositura(proposituraId: string) {
        return this.prisma.discussaoPlenaria.findMany({
            where: { proposituraId },
            orderBy: { dataDiscussao: 'asc' },
        });
    }

    async findBySessao(sessaoId: string) {
        return this.prisma.discussaoPlenaria.findMany({
            where: { sessaoId },
            include: { propositura: true },
        });
    }

    async encerrarDiscussao(id: string, resultado: string) {
        return this.prisma.discussaoPlenaria.update({
            where: { id },
            data: { resultado },
        });
    }
}
