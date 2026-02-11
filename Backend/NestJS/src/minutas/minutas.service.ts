import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class MinutasService {
    constructor(private prisma: PrismaService) { }

    async create(data: { titulo: string; tipo: string; conteudo: string; autorId: string }) {
        return this.prisma.minuta.create({ data: { ...data, status: 'RASCUNHO' } });
    }

    async findAll() {
        return this.prisma.minuta.findMany({ include: { assinaturas: true }, orderBy: { createdAt: 'desc' } });
    }

    async findOne(id: string) {
        return this.prisma.minuta.findUnique({ where: { id }, include: { assinaturas: true } });
    }

    async submeterAprovacao(id: string) {
        return this.prisma.minuta.update({ where: { id }, data: { status: 'AGUARDANDO_APROVACAO' } });
    }

    async aprovar(id: string, aprovadorId: string) {
        return this.prisma.minuta.update({
            where: { id },
            data: { status: 'APROVADA', aprovadorId, dataAprovacao: new Date() },
        });
    }

    async rejeitar(id: string) {
        return this.prisma.minuta.update({ where: { id }, data: { status: 'REJEITADA' } });
    }

    async expedir(id: string) {
        return this.prisma.minuta.update({
            where: { id },
            data: { expedida: true, dataExpedicao: new Date(), status: 'EXPEDIDA' },
        });
    }

    async assinar(minutaId: string, assinanteId: string) {
        const minuta = await this.prisma.minuta.findUnique({ where: { id: minutaId } });
        if (!minuta) throw new Error('Minuta não encontrada');

        const hash = crypto.createHash('sha256').update(minuta.conteudo).digest('hex');
        const codigoVerificacao = `LEGIS-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        return this.prisma.assinaturaDigital.create({
            data: { minutaId, assinanteId, hashDocumento: hash, codigoVerificacao },
        });
    }

    async verificarAssinatura(codigoVerificacao: string) {
        return this.prisma.assinaturaDigital.findUnique({ where: { codigoVerificacao } });
    }
}
