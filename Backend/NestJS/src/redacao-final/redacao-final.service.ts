import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedacaoFinalService {
    constructor(private prisma: PrismaService) { }

    async create(data: { proposituraId: string; comissaoId: string; texto: string }) {
        return this.prisma.redacaoFinal.create({ data });
    }

    async findByPropositura(proposituraId: string) {
        return this.prisma.redacaoFinal.findUnique({ where: { proposituraId } });
    }

    async aprovar(id: string) {
        return this.prisma.redacaoFinal.update({ where: { id }, data: { aprovada: true } });
    }

    async updateTexto(id: string, texto: string) {
        return this.prisma.redacaoFinal.update({ where: { id }, data: { texto } });
    }
}
