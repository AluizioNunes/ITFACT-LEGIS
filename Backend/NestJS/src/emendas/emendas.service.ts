import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmendasService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        proposituraId: string;
        numero: number;
        tipo: string; // SUPRESSIVA, SUBSTITUTIVA, ADITIVA, MODIFICATIVA
        texto: string;
        justificativa?: string;
        autorId: string;
        fase?: string; // PRIMEIRA ou SEGUNDA
    }) {
        const propositura = await this.prisma.propositura.findUnique({
            where: { id: data.proposituraId },
        });
        if (!propositura) throw new NotFoundException('Propositura não encontrada');

        // Emendas só podem ser apresentadas durante discussão
        const fasesValidas = ['PRIMEIRA_DISCUSSAO', 'SEGUNDA_DISCUSSAO'];
        if (!fasesValidas.includes(propositura.faseAtual)) {
            throw new BadRequestException(
                `Emendas só podem ser apresentadas durante 1ª ou 2ª discussão. Fase atual: ${propositura.faseAtual}`
            );
        }

        return this.prisma.emenda.create({
            data: {
                ...data,
                tipo: data.tipo as any,
                fase: data.fase as any || (propositura.faseAtual === 'PRIMEIRA_DISCUSSAO' ? 'PRIMEIRA' : 'SEGUNDA'),
                status: 'APRESENTADA',
            },
        });
    }

    async findByPropositura(proposituraId: string) {
        return this.prisma.emenda.findMany({
            where: { proposituraId },
            orderBy: { numero: 'asc' },
        });
    }

    async findOne(id: string) {
        const emenda = await this.prisma.emenda.findUnique({ where: { id } });
        if (!emenda) throw new NotFoundException('Emenda não encontrada');
        return emenda;
    }

    async updateStatus(id: string, status: string, parecerComissao?: string) {
        return this.prisma.emenda.update({
            where: { id },
            data: { status: status as any, parecerComissao },
        });
    }

    async countByPropositura(proposituraId: string) {
        return this.prisma.emenda.count({ where: { proposituraId } });
    }
}
