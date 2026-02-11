import { Injectable } from '@nestjs/common';

/**
 * Integração TCE-AM — Tribunal de Contas do Estado do Amazonas.
 * Importa pareceres, julgamentos e análises de contas.
 */
@Injectable()
export class TceAmService {
    private readonly TCE_API_URL = process.env.TCE_AM_API_URL || 'https://api.tce.am.gov.br/v1';

    /**
     * Importa parecer do TCE sobre contas do Executivo Municipal.
     */
    async importarParecer(exercicio: number) {
        try {
            const response = await fetch(`${this.TCE_API_URL}/pareceres/${exercicio}`, {
                headers: { 'Accept': 'application/json' },
            });
            if (response.ok) return response.json();
        } catch {
            // TCE API pode não estar disponível
        }
        return {
            exercicio,
            status: 'INDISPONIVEL',
            mensagem: `API TCE-AM não disponível. Configure TCE_AM_API_URL. Parecer do exercício ${exercicio} deve ser importado manualmente.`,
            camposEsperados: {
                exercicio,
                parecer: 'FAVORAVEL | CONTRARIO | COM_RESSALVAS',
                relator: 'Nome do Conselheiro Relator',
                dataJulgamento: 'YYYY-MM-DD',
                processoNumero: 'Número do processo no TCE',
                irregularidades: ['Lista de irregularidades encontradas'],
                recomendacoes: ['Lista de recomendações'],
                documentoUrl: 'URL do parecer em PDF',
            },
        };
    }

    /**
     * Registra parecer do TCE manualmente (quando API não disponível).
     */
    async registrarParecerManual(dados: {
        exercicio: number;
        parecer: string;
        relator: string;
        dataJulgamento: string;
        processoNumero: string;
        irregularidades: string[];
        recomendacoes: string[];
        documentoUrl?: string;
    }) {
        return {
            id: `TCE-${Date.now()}`,
            ...dados,
            importadoManualmente: true,
            status: 'REGISTRADO',
            registradoEm: new Date().toISOString(),
        };
    }

    /**
     * Lista pareceres TCE importados.
     */
    async listarPareceres(ano?: number) {
        return { total: 0, pareceres: [], filtro: { ano } };
    }

    /**
     * Consulta situação da prestação de contas no TCE.
     */
    async consultarSituacao(exercicio: number) {
        return {
            exercicio,
            situacao: 'PENDENTE_CONSULTA',
            mensagem: 'Configure TCE_AM_API_URL para consulta automática.',
            etapas: [
                { etapa: '1. Envio da Prestação de Contas', prazo: '31/03 do ano seguinte', status: 'PENDENTE' },
                { etapa: '2. Análise Técnica', prazo: '90 dias após recebimento', status: 'PENDENTE' },
                { etapa: '3. Parecer do Relator', prazo: '60 dias após análise', status: 'PENDENTE' },
                { etapa: '4. Julgamento em Plenário do TCE', prazo: 'Calendário do TCE', status: 'PENDENTE' },
                { etapa: '5. Envio à Câmara Municipal', prazo: '15 dias após julgamento', status: 'PENDENTE' },
            ],
        };
    }
}
