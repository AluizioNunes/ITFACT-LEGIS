import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Ordem do Dia — Montagem automática da pauta (Art. 135 do Regimento)
 * Prioridades: 1) Urgência → 2) Vetos → 3) PLs → 4) Pareceres → 5) Requerimentos → 6) Indicações
 */
@Injectable()
export class OrdemDoDiaService {
    constructor(private prisma: PrismaService) { }

    async montarAutomatica(sessaoId: string) {
        // Busca proposituras prontas para votação, ordenadas por prioridade
        const proposituras = await this.prisma.propositura.findMany({
            where: {
                faseAtual: { in: ['PRIMEIRA_DISCUSSAO', 'SEGUNDA_DISCUSSAO', 'VETO_EM_VOTACAO'] },
            },
            orderBy: [{ urgente: 'desc' }, { createdAt: 'asc' }],
        });

        // Separar por prioridade
        const urgentes = proposituras.filter(p => p.urgente);
        const vetos = proposituras.filter(p => p.faseAtual === 'VETO_EM_VOTACAO');
        const projetos = proposituras.filter(p => !p.urgente && p.faseAtual !== 'VETO_EM_VOTACAO');

        const ordenada = [...urgentes, ...vetos, ...projetos];
        const items = [];

        for (let i = 0; i < ordenada.length; i++) {
            const p = ordenada[i];
            const prioridade = p.urgente ? 'URGENCIA' : p.faseAtual === 'VETO_EM_VOTACAO' ? 'VETO' : 'PROJETO_LEI';

            items.push(
                await this.prisma.ordemDoDia.create({
                    data: {
                        sessaoId,
                        proposituraId: p.id,
                        ordem: i + 1,
                        prioridade: prioridade as any,
                        status: 'PENDENTE',
                    },
                })
            );
        }

        return items;
    }

    async findBySessao(sessaoId: string) {
        return this.prisma.ordemDoDia.findMany({
            where: { sessaoId },
            include: { propositura: { include: { veto: true } } },
            orderBy: { ordem: 'asc' },
        });
    }

    async reordenar(sessaoId: string, items: { id: string; ordem: number }[]) {
        for (const item of items) {
            await this.prisma.ordemDoDia.update({
                where: { id: item.id },
                data: { ordem: item.ordem },
            });
        }
        return this.findBySessao(sessaoId);
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.ordemDoDia.update({ where: { id }, data: { status } });
    }
}
