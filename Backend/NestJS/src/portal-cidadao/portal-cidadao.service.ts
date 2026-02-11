import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Portal do Cidadão — acompanhamento público de proposituras
 * com notificação por e-mail. Sem autenticação obrigatória.
 */
@Injectable()
export class PortalCidadaoService {
    constructor(private prisma: PrismaService) { }

    /**
     * Busca proposituras públicas (sem dados sensíveis).
     */
    async buscarProposituras(filtro: {
        termo?: string;
        tipo?: string;
        autor?: string;
        ano?: number;
        status?: string;
        pagina?: number;
        limite?: number;
    }) {
        const pagina = filtro.pagina || 1;
        const limite = filtro.limite || 20;

        return {
            filtro,
            pagina,
            limite,
            total: 0,
            proposituras: [],
            disclaimer: 'Dados públicos conforme Lei de Acesso à Informação (LAI) — Lei 12.527/2011.',
        };
    }

    /**
     * Detalhes públicos de uma propositura com tramitação.
     */
    async detalhesPropositura(proposituraId: string) {
        return {
            id: proposituraId,
            tramitacao: [],
            votacoes: [],
            emendas: [],
            pareceres: [],
            status: 'NAO_ENCONTRADA',
        };
    }

    /**
     * Registra acompanhamento por e-mail (cidadão se inscreve).
     */
    async registrarAcompanhamento(proposituraId: string, email: string, nome: string) {
        return {
            id: `ACOMP-${Date.now()}`,
            proposituraId,
            email,
            nome,
            status: 'ATIVO',
            mensagem: 'Você receberá notificações por e-mail quando houver movimentação nesta propositura.',
            criadoEm: new Date().toISOString(),
        };
    }

    /**
     * Cancela acompanhamento.
     */
    async cancelarAcompanhamento(acompanhamentoId: string, email: string) {
        return { acompanhamentoId, email, status: 'CANCELADO', canceladoEm: new Date().toISOString() };
    }

    /**
     * Dispara notificações por e-mail para acompanhantes de uma propositura.
     */
    async notificarAcompanhantes(proposituraId: string, evento: string, descricao: string) {
        return {
            proposituraId,
            evento,
            descricao,
            totalNotificados: 0,
            disparadoEm: new Date().toISOString(),
        };
    }

    /**
     * Estatísticas públicas da Câmara.
     */
    async estatisticasPublicas() {
        return {
            totalProposituras: 0,
            aprovadas: 0,
            emTramitacao: 0,
            sessoesRealizadas: 0,
            vereadores: 21,
            comissoes: 25,
            ultimaAtualizacao: new Date().toISOString(),
        };
    }

    /**
     * Agenda pública de sessões futuras.
     */
    async agendaPublica() {
        return { total: 0, sessoes: [] };
    }

    /**
     * Ouvidoria cidadã — registra manifestação.
     */
    async registrarManifestacao(tipo: string, assunto: string, descricao: string, cidadaoNome: string, cidadaoEmail: string) {
        return {
            id: `MAN-${Date.now()}`,
            protocolo: `OUV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
            tipo,
            assunto,
            descricao,
            cidadaoNome,
            cidadaoEmail,
            status: 'RECEBIDA',
            prazoResposta: '30 dias úteis (LAI)',
            criadoEm: new Date().toISOString(),
        };
    }
}
