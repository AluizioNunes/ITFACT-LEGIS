import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProtocolosService {
    constructor(private prisma: PrismaService) { }

    async getNextNumber(ano: number, orgaoId?: string) {
        const lastProtocolo = await this.prisma.protocolo.findFirst({
            where: { ano, orgaoId },
            orderBy: { numero: 'desc' },
        });

        const nextNumber = lastProtocolo ? lastProtocolo.numero + 1 : 1;
        const padding = nextNumber.toString().padStart(4, '0');
        const codigoUnico = `PROT-${ano}-${padding}`;

        return { numero: nextNumber, codigoUnico };
    }

    async createProtocolo(data: {
        tipo: string;
        assunto?: string;
        classificacao?: string;
        userId: string;
        orgaoId?: string;
        proposituraId?: string;
        documentId?: string;
    }) {
        const ano = new Date().getFullYear();
        const { numero, codigoUnico } = await this.getNextNumber(ano, data.orgaoId);

        return this.prisma.protocolo.create({
            data: {
                ...data,
                numero,
                ano,
                codigoUnico,
            },
            include: {
                user: { select: { name: true } },
                orgao: { select: { nome: true } },
            }
        });
    }

    async findAll(orgaoId?: string) {
        return this.prisma.protocolo.findMany({
            where: { orgaoId },
            include: {
                user: { select: { name: true } },
                propositura: true,
                document: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.protocolo.findUnique({
            where: { id },
            include: {
                user: { select: { name: true } },
                propositura: true,
                document: true,
            },
        });
    }
}
