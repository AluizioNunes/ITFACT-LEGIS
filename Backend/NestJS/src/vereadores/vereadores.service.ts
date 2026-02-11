import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VereadoresService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        nomeCompleto: string;
        nomeParlamentar: string;
        cpf: string;
        partidoId: string;
        email?: string;
        biografia?: string;
        userId?: string;
    }) {
        return this.prisma.simplifiedVereador.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.simplifiedVereador.findMany({
            include: {
                partido: true,
                mandatos: {
                    include: { legislatura: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const vereador = await this.prisma.simplifiedVereador.findUnique({
            where: { id },
            include: {
                partido: true,
                mandatos: {
                    include: { legislatura: true },
                },
                liderancaBancada: true,
                membrosComissao: {
                    include: { comissao: true },
                },
            },
        });
        if (!vereador) throw new NotFoundException('Vereador not found');
        return vereador;
    }

    async addMandato(vereadorId: string, data: { legislaturaId: string; inicio: Date; status: string }) {
        return this.prisma.mandatoVereador.create({
            data: {
                ...data,
                vereadorId,
            },
        });
    }
}
