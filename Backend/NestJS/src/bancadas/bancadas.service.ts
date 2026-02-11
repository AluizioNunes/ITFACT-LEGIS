import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BancadasService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        nome: string;
        partidoId?: string;
        legislaturaId: string;
    }) {
        return this.prisma.bancada.create({ data });
    }

    async setLideranca(id: string, data: { liderId?: string; viceLiderId?: string }) {
        return this.prisma.bancada.update({
            where: { id },
            data,
        });
    }

    async findAllByLegislatura(legislaturaId: string) {
        return this.prisma.bancada.findMany({
            where: { legislaturaId },
            include: {
                partido: true,
                lider: true,
                viceLider: true,
            },
        });
    }
}
