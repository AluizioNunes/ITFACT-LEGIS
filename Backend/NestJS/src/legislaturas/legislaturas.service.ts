import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegislaturasService {
    constructor(private prisma: PrismaService) { }

    async create(data: { numero: number; inicio: Date; fim: Date }) {
        return this.prisma.legislatura.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.legislatura.findMany({
            orderBy: { numero: 'desc' },
            include: {
                _count: {
                    select: { vereadores: true, mesas: true, sessoes: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const legislatura = await this.prisma.legislatura.findUnique({
            where: { id },
        });
        if (!legislatura) throw new NotFoundException('Legislatura not found');
        return legislatura;
    }
}
