import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartidosService {
    constructor(private prisma: PrismaService) { }

    async create(data: { nome: string; sigla: string; logo?: string }) {
        return this.prisma.partido.create({ data });
    }

    async findAll() {
        return this.prisma.partido.findMany({
            include: {
                _count: { select: { parlamentares: true } },
            },
        });
    }

    async findOne(id: string) {
        const partido = await this.prisma.partido.findUnique({
            where: { id },
            include: {
                parlamentares: true,
                bancadas: true,
            },
        });
        if (!partido) throw new NotFoundException('Partido not found');
        return partido;
    }
}
