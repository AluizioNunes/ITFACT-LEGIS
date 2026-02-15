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
        foto?: string;
        biografia?: string;
        anoEleito?: number;
        userId?: string;
    }) {
        return this.prisma.parlamentar.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.parlamentar.findMany({
            include: {
                partido: true,
                mandatos: {
                    include: { legislatura: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const parlamentar = await this.prisma.parlamentar.findUnique({
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
        if (!parlamentar) throw new NotFoundException('Parlamentar not found');
        return parlamentar;
    }

    async addMandato(parlamentarId: string, data: { legislaturaId: string; inicio: Date; status: string }) {
        return this.prisma.mandatoParlamentar.create({
            data: {
                ...data,
                parlamentarId,
            },
        });
    }
}
