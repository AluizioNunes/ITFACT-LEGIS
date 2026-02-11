import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CargoMesa } from '@prisma/client';

@Injectable()
export class MesaDiretoraService {
    constructor(private prisma: PrismaService) { }

    async create(data: { legislaturaId: string; inicio: Date; fim: Date }) {
        // Ensure only one active mesa per legislatura at a time or handle accordingly
        return this.prisma.mesaDiretora.create({
            data,
        });
    }

    async addMembro(mesaId: string, data: { vereadorId: string; cargo: CargoMesa }) {
        // Validate if vereador is in the legislatura of the mesa
        const mesa = await this.prisma.mesaDiretora.findUnique({
            where: { id: mesaId },
        });
        if (!mesa) throw new NotFoundException('Mesa Diretora not found');

        const mandato = await this.prisma.mandatoVereador.findFirst({
            where: {
                vereadorId: data.vereadorId,
                legislaturaId: mesa.legislaturaId,
                status: 'ATIVO',
            },
        });

        if (!mandato) {
            throw new BadRequestException('Vereador must have an active mandate in this legislatura');
        }

        return this.prisma.membroMesa.create({
            data: {
                mesaId,
                vereadorId: data.vereadorId,
                cargo: data.cargo,
            },
        });
    }

    async findActive() {
        return this.prisma.mesaDiretora.findFirst({
            where: { ativa: true },
            include: {
                membros: {
                    include: {
                        vereador: true,
                    },
                },
                legislatura: true,
            },
        });
    }
}
