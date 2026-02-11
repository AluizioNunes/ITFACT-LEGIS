import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LicencasService {
    constructor(private prisma: PrismaService) { }

    async create(data: { vereadorId: string; tipo: string; inicio: Date; fim?: Date; laudoMedico?: string; suplenteId?: string }) {
        // Atualizar mandato do vereador para LICENCIADO
        const mandato = await this.prisma.mandatoVereador.findFirst({
            where: { vereadorId: data.vereadorId, status: 'ATIVO' },
        });
        if (mandato) {
            await this.prisma.mandatoVereador.update({ where: { id: mandato.id }, data: { status: 'LICENCIADO' } });
        }

        return this.prisma.licencaVereador.create({ data: { ...data, tipo: data.tipo as any, status: 'ATIVA' } });
    }

    async findAll() {
        return this.prisma.licencaVereador.findMany({ include: { vereador: true }, orderBy: { createdAt: 'desc' } });
    }

    async findAtivas() {
        return this.prisma.licencaVereador.findMany({ where: { status: 'ATIVA' }, include: { vereador: true } });
    }

    async encerrar(id: string) {
        const licenca = await this.prisma.licencaVereador.update({
            where: { id }, data: { status: 'ENCERRADA', fim: new Date() },
        });
        // Reativar mandato
        const mandato = await this.prisma.mandatoVereador.findFirst({
            where: { vereadorId: licenca.vereadorId, status: 'LICENCIADO' },
        });
        if (mandato) {
            await this.prisma.mandatoVereador.update({ where: { id: mandato.id }, data: { status: 'ATIVO' } });
        }
        return licenca;
    }
}
