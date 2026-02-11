import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Workflow Engine — Máquina de estados para o ciclo de vida da propositura.
 * Implementa o fluxo completo conforme Regimento Interno da CMM.
 */
@Injectable()
export class WorkflowService {
    constructor(private prisma: PrismaService) { }

    // Mapa de transições válidas
    private transitions: Record<string, string[]> = {
        PROTOCOLO: ['DELIBERACAO', 'ARQUIVADO'],
        DELIBERACAO: ['COMISSAO_CCJ', 'ARQUIVADO'],
        COMISSAO_CCJ: ['COMISSAO_MERITO', 'ARQUIVADO'], // Inconstitucional → Arquivado
        COMISSAO_MERITO: ['COMISSAO_FINANCAS', 'PRIMEIRA_DISCUSSAO'],
        COMISSAO_FINANCAS: ['PRIMEIRA_DISCUSSAO'],
        PRIMEIRA_DISCUSSAO: ['SEGUNDA_DISCUSSAO', 'EMENDAS_COMISSAO', 'ARQUIVADO'],
        EMENDAS_COMISSAO: ['SEGUNDA_DISCUSSAO'],
        SEGUNDA_DISCUSSAO: ['REDACAO_FINAL', 'ARQUIVADO'],
        REDACAO_FINAL: ['ENVIADO_PREFEITO'],
        ENVIADO_PREFEITO: ['SANCIONADO', 'VETADO'],
        SANCIONADO: ['PROMULGADO'],
        VETADO: ['VETO_EM_VOTACAO'],
        VETO_EM_VOTACAO: ['PROMULGADO', 'ARQUIVADO'],
        PROMULGADO: ['PUBLICADO'],
        PUBLICADO: [], // Estado final
        ARQUIVADO: [], // Estado final
    };

    // Prazos regimentais em dias
    private prazos = {
        RELATOR_ORDINARIO: 28,    // 4 reuniões (~28 dias)
        COMISSAO_ORDINARIO: 42,   // 6 reuniões (~42 dias)
        RELATOR_URGENCIA: 7,      // 1 reunião
        COMISSAO_URGENCIA: 14,    // 2 reuniões
        PREFEITO_SANCAO: 15,      // 15 dias úteis
        VETO_VOTACAO: 30,         // 30 dias
        PROMULGACAO: 2,           // 48 horas
    };

    async avancarFase(proposituraId: string, novaFase: string, observacao?: string) {
        const propositura = await this.prisma.propositura.findUnique({
            where: { id: proposituraId },
        });

        if (!propositura) throw new BadRequestException('Propositura não encontrada');

        const faseAtual = propositura.faseAtual;
        const transicoesValidas = this.transitions[faseAtual] || [];

        if (!transicoesValidas.includes(novaFase)) {
            throw new BadRequestException(
                `Transição inválida: ${faseAtual} → ${novaFase}. Transições válidas: ${transicoesValidas.join(', ')}`
            );
        }

        // Atualizar campos de data conforme a fase
        const updateData: any = {
            faseAtual: novaFase,
            status: this.faseToStatus(novaFase),
        };

        switch (novaFase) {
            case 'DELIBERACAO':
                updateData.dataDeliberacao = new Date();
                break;
            case 'PRIMEIRA_DISCUSSAO':
                updateData.data1aDiscussao = new Date();
                break;
            case 'SEGUNDA_DISCUSSAO':
                updateData.data2aDiscussao = new Date();
                break;
            case 'REDACAO_FINAL':
                updateData.dataRedacaoFinal = new Date();
                break;
            case 'SANCIONADO':
                updateData.dataSancao = new Date();
                break;
            case 'PROMULGADO':
                updateData.dataPromulgacao = new Date();
                break;
            case 'PUBLICADO':
                updateData.dataPublicacao = new Date();
                break;
        }

        const updated = await this.prisma.propositura.update({
            where: { id: proposituraId },
            data: updateData,
        });

        // Criar alertas automáticos de prazo
        await this.criarAlertasAutomaticos(proposituraId, novaFase, propositura.regime);

        return updated;
    }

    async getWorkflowState(proposituraId: string) {
        const propositura = await this.prisma.propositura.findUnique({
            where: { id: proposituraId },
            include: {
                emendas: true,
                pareceres: { include: { comissao: true } },
                discussoes: true,
                redacaoFinal: true,
                veto: true,
                alertas: { where: { vencido: false } },
            },
        });

        if (!propositura) throw new BadRequestException('Propositura não encontrada');

        const faseAtual = propositura.faseAtual;
        return {
            propositura,
            faseAtual,
            transicoesDisponiveis: this.transitions[faseAtual] || [],
            timeline: this.buildTimeline(propositura),
        };
    }

    async getTransicoesDisponiveis(proposituraId: string) {
        const propositura = await this.prisma.propositura.findUnique({
            where: { id: proposituraId },
        });
        if (!propositura) throw new BadRequestException('Propositura não encontrada');
        return this.transitions[propositura.faseAtual] || [];
    }

    private faseToStatus(fase: string): string {
        const statusMap: Record<string, string> = {
            PROTOCOLO: 'PROTOCOLADO',
            DELIBERACAO: 'EM_DELIBERACAO',
            COMISSAO_CCJ: 'EM_COMISSAO_CCJ',
            COMISSAO_MERITO: 'EM_COMISSAO_MERITO',
            COMISSAO_FINANCAS: 'EM_COMISSAO_FINANCAS',
            PRIMEIRA_DISCUSSAO: 'EM_1A_DISCUSSAO',
            EMENDAS_COMISSAO: 'EMENDAS_EM_COMISSAO',
            SEGUNDA_DISCUSSAO: 'EM_2A_DISCUSSAO',
            REDACAO_FINAL: 'EM_REDACAO_FINAL',
            ENVIADO_PREFEITO: 'ENVIADO_PREFEITO',
            SANCIONADO: 'SANCIONADO',
            VETADO: 'VETADO',
            VETO_EM_VOTACAO: 'VETO_EM_VOTACAO',
            PROMULGADO: 'PROMULGADO',
            PUBLICADO: 'PUBLICADO',
            ARQUIVADO: 'ARQUIVADO',
        };
        return statusMap[fase] || fase;
    }

    private buildTimeline(propositura: any) {
        const timeline = [];
        if (propositura.createdAt) timeline.push({ fase: 'Protocolo', data: propositura.createdAt });
        if (propositura.dataDeliberacao) timeline.push({ fase: 'Deliberação', data: propositura.dataDeliberacao });
        if (propositura.data1aDiscussao) timeline.push({ fase: '1ª Discussão', data: propositura.data1aDiscussao });
        if (propositura.data2aDiscussao) timeline.push({ fase: '2ª Discussão', data: propositura.data2aDiscussao });
        if (propositura.dataRedacaoFinal) timeline.push({ fase: 'Redação Final', data: propositura.dataRedacaoFinal });
        if (propositura.dataSancao) timeline.push({ fase: 'Sanção', data: propositura.dataSancao });
        if (propositura.dataPromulgacao) timeline.push({ fase: 'Promulgação', data: propositura.dataPromulgacao });
        if (propositura.dataPublicacao) timeline.push({ fase: 'Publicação', data: propositura.dataPublicacao });
        return timeline;
    }

    private async criarAlertasAutomaticos(proposituraId: string, fase: string, regime: string) {
        const now = new Date();
        let prazoLimite: Date | null = null;
        let tipo: string | null = null;
        let titulo = '';
        let descricao = '';

        const isUrgente = regime === 'URGENCIA';

        switch (fase) {
            case 'COMISSAO_CCJ':
            case 'COMISSAO_MERITO':
            case 'COMISSAO_FINANCAS':
                const dias = isUrgente ? this.prazos.COMISSAO_URGENCIA : this.prazos.COMISSAO_ORDINARIO;
                prazoLimite = new Date(now.getTime() + dias * 24 * 60 * 60 * 1000);
                tipo = 'PRAZO_COMISSAO';
                titulo = `Prazo de Comissão vencendo`;
                descricao = `A propositura deve ter parecer emitido em ${dias} dias (${isUrgente ? 'urgência' : 'ordinário'})`;
                break;

            case 'ENVIADO_PREFEITO':
                prazoLimite = new Date(now.getTime() + this.prazos.PREFEITO_SANCAO * 24 * 60 * 60 * 1000);
                tipo = 'PRAZO_PREFEITO';
                titulo = 'Prazo para sanção do Prefeito';
                descricao = `O Prefeito tem ${this.prazos.PREFEITO_SANCAO} dias úteis para sancionar ou vetar`;
                break;

            case 'VETADO':
                prazoLimite = new Date(now.getTime() + this.prazos.VETO_VOTACAO * 24 * 60 * 60 * 1000);
                tipo = 'PRAZO_VETO';
                titulo = 'Prazo para votação do veto';
                descricao = `A Câmara tem ${this.prazos.VETO_VOTACAO} dias para votar o veto`;
                break;
        }

        if (prazoLimite && tipo) {
            await this.prisma.alertaPrazo.create({
                data: {
                    proposituraId,
                    tipo: tipo as any,
                    titulo,
                    descricao,
                    prazoLimite,
                },
            });
        }
    }
}
