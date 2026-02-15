import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VotacoesService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        sessaoId: string;
        proposituraId?: string;
        tipo: string;
        objetivo?: string;
        quorumMinimo: number;
    }) {
        return this.prisma.votacao.create({
            data,
        });
    }

    async registrarVoto(votacaoId: string, data: { parlamentarId: string; escolha: string }) {
        const votacao = await this.prisma.votacao.findUnique({
            where: { id: votacaoId },
        });
        if (!votacao) throw new NotFoundException('Votação not found');

        // Check if vote already exists
        const existingVoto = await this.prisma.voto.findFirst({
            where: { votacaoId, parlamentarId: data.parlamentarId },
        });

        if (existingVoto) {
            return this.prisma.voto.update({
                where: { id: existingVoto.id },
                data: { escolha: data.escolha },
            });
        }

        return this.prisma.voto.create({
            data: {
                votacaoId,
                parlamentarId: data.parlamentarId,
                escolha: data.escolha,
            },
        });
    }

    async finalizarVotacao(id: string, resultado: string) {
        return this.prisma.votacao.update({
            where: { id },
            data: { resultado },
        });
    }
}
