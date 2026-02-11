import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PropositurasService } from '../proposituras/proposituras.service';

@Injectable()
export class TramitacoesService {
    constructor(
        private prisma: PrismaService,
        private propositurasService: PropositurasService,
    ) { }

    async forward(
        proposituraId: string,
        origemId: string,
        destinoId: string,
        remetenteId: string,
        destinatarioId?: string,
        observacao?: string
    ) {
        // 1. Create the detailed tramitation record
        const tramitacao = await this.prisma.tramitacao.create({
            data: {
                proposituraId,
                origemId,
                destinoId,
                remetenteId,
                destinatarioId,
                status: 'ENVIADO',
                observacao,
            },
            include: {
                destino: true,
            }
        });

        // 2. Update propositura status
        await this.propositurasService.updateStatus(
            proposituraId,
            `EM_TRAMITACAO: ${tramitacao.destino.sigla}`
        );

        return tramitacao;
    }

    async receive(id: string, destinatarioId: string) {
        const now = new Date();
        const tramitacao = await this.prisma.tramitacao.update({
            where: { id },
            data: {
                status: 'RECEBIDO',
                dataRecebimento: now,
                destinatarioId, // Assign the person who actually received it
            },
            include: {
                destino: true,
                origem: true,
            }
        });

        await this.propositurasService.updateStatus(
            tramitacao.proposituraId,
            `RECEBIDO EM: ${tramitacao.destino.sigla}`
        );

        return tramitacao;
    }

    async closeAndForward(id: string, nextDestinoId: string, nextRemetenteId: string, observacao?: string) {
        const now = new Date();

        // 1. Update current tramitation as completed
        const current = await this.prisma.tramitacao.findUnique({ where: { id } });
        if (!current) throw new Error('Tramitação não encontrada');

        const stayDuration = current.dataRecebimento
            ? Math.floor((now.getTime() - current.dataRecebimento.getTime()) / 1000)
            : null;

        await this.prisma.tramitacao.update({
            where: { id },
            data: {
                dataSaida: now,
                duracaoSegundos: stayDuration,
                status: 'CONCLUIDO (ENCAMINHADO)',
            }
        });

        // 2. Create the next step
        return this.forward(
            current.proposituraId,
            current.destinoId,
            nextDestinoId,
            nextRemetenteId,
            undefined,
            observacao
        );
    }

    async findByPropositura(proposituraId: string) {
        return this.prisma.tramitacao.findMany({
            where: { proposituraId },
            include: {
                origem: true,
                destino: true,
                remetente: { select: { name: true } },
                destinatario: { select: { name: true } },
            },
            orderBy: { dataEnvio: 'desc' },
        });
    }
}
