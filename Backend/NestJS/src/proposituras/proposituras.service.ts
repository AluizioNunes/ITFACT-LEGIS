import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposituraDto } from './dto/create-propositura.dto';
import { ProtocolosService } from '../protocolos/protocolos.service';

@Injectable()
export class PropositurasService {
    constructor(
        private prisma: PrismaService,
        private protocolosService: ProtocolosService
    ) { }

    async create(autorId: string, data: CreateProposituraDto) {
        // First create the propositura
        const propositura = await this.prisma.propositura.create({
            data: {
                ...data,
                autorId,
                status: 'PROTOCOLADO',
            },
        });

        // Then create the institutional protocol
        await this.protocolosService.createProtocolo({
            tipo: 'INTERNO',
            assunto: 'Processo Legislativo',
            classificacao: data.tipo,
            userId: autorId,
            proposituraId: propositura.id,
        });

        return propositura;
    }

    async findAll() {
        return this.prisma.propositura.findMany({
            include: {
                autor: {
                    select: { name: true, email: true },
                },
                tramitacoes: true,
            },
        });
    }

    async findOne(id: string) {
        const propositura = await this.prisma.propositura.findUnique({
            where: { id },
            include: {
                autor: true,
                tramitacoes: {
                    orderBy: { dataEnvio: 'desc' },
                },
            },
        });

        if (!propositura) {
            throw new NotFoundException(`Propositura with ID ${id} not found`);
        }

        return propositura;
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.propositura.update({
            where: { id },
            data: { status },
        });
    }
}
