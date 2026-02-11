import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AudienciasService {
    constructor(private prisma: PrismaService) { }

    async create(data: { comissaoId: string; tema: string; descricao?: string; data: Date; local?: string; convidados?: string }) {
        return this.prisma.audienciaPublica.create({ data: { ...data, status: 'AGENDADA' } });
    }

    async findAll() {
        return this.prisma.audienciaPublica.findMany({ include: { comissao: true }, orderBy: { data: 'desc' } });
    }

    async findByComissao(comissaoId: string) {
        return this.prisma.audienciaPublica.findMany({ where: { comissaoId }, include: { comissao: true }, orderBy: { data: 'desc' } });
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.audienciaPublica.update({ where: { id }, data: { status } });
    }

    async registrarAta(id: string, ata: string) {
        return this.prisma.audienciaPublica.update({ where: { id }, data: { ata, status: 'REALIZADA' } });
    }
}
