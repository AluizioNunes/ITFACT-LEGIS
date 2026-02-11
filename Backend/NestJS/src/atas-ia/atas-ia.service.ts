import { Injectable } from '@nestjs/common';

/**
 * Geração Automática de Atas com IA.
 * Transcrição taquigráfica e produção de atas plenárias.
 */
@Injectable()
export class AtasIaService {
    private readonly FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

    /**
     * Gera ata plenária a partir de dados da sessão.
     */
    async gerarAta(sessaoId: string, dadosSessao: {
        tipo: string;
        data: string;
        presidente: string;
        presentes: string[];
        ausentes: string[];
        itensDiscutidos: { titulo: string; resultado: string; votosA?: number; votosC?: number }[];
        expedientes: { tipo: string; vereador: string; assunto: string }[];
        tribunaPopular: { entidade: string; representante: string; tema: string }[];
    }) {
        const presencaTexto = dadosSessao.presentes.join(', ');
        const ausentesTexto = dadosSessao.ausentes.length > 0 ? dadosSessao.ausentes.join(', ') : 'Nenhum';

        let ataTexto = `ATA DA ${dadosSessao.tipo.toUpperCase()}\n`;
        ataTexto += `Data: ${dadosSessao.data}\n`;
        ataTexto += `Presidência: ${dadosSessao.presidente}\n\n`;
        ataTexto += `Sob a Presidência do(a) Vereador(a) ${dadosSessao.presidente}, com a presença dos Vereadores: ${presencaTexto}. `;
        ataTexto += `Ausentes: ${ausentesTexto}. `;
        ataTexto += `Verificado o quórum regimental, foi aberta a sessão.\n\n`;

        // Expedientes
        if (dadosSessao.expedientes.length > 0) {
            ataTexto += `EXPEDIENTE:\n`;
            dadosSessao.expedientes.forEach((e, i) => {
                ataTexto += `${i + 1}. ${e.tipo}: Ver. ${e.vereador} – ${e.assunto}.\n`;
            });
            ataTexto += '\n';
        }

        // Tribuna Popular
        if (dadosSessao.tribunaPopular.length > 0) {
            ataTexto += `TRIBUNA POPULAR:\n`;
            dadosSessao.tribunaPopular.forEach((t, i) => {
                ataTexto += `${i + 1}. ${t.entidade}, representada por ${t.representante}, tratou do tema: ${t.tema}.\n`;
            });
            ataTexto += '\n';
        }

        // Ordem do Dia
        if (dadosSessao.itensDiscutidos.length > 0) {
            ataTexto += `ORDEM DO DIA:\n`;
            dadosSessao.itensDiscutidos.forEach((item, i) => {
                ataTexto += `${i + 1}. ${item.titulo} – `;
                if (item.votosA !== undefined) {
                    ataTexto += `Votação: ${item.votosA} a favor, ${item.votosC} contra. Resultado: ${item.resultado}.\n`;
                } else {
                    ataTexto += `${item.resultado}.\n`;
                }
            });
            ataTexto += '\n';
        }

        ataTexto += `Nada mais havendo a tratar, o(a) Presidente encerrou a sessão, da qual eu, secretário(a), lavrei a presente ata.\n`;

        return {
            id: `ATA-${Date.now()}`,
            sessaoId,
            texto: ataTexto,
            formato: 'TEXTO_CORRIDO',
            totalPalavras: ataTexto.split(' ').length,
            geradoPorIA: true,
            status: 'RASCUNHO',
            criadoEm: new Date().toISOString(),
        };
    }

    /**
     * Transcreve áudio de sessão para texto usando IA.
     */
    async transcreverAudio(sessaoId: string, audioUrl: string) {
        try {
            const response = await fetch(`${this.FASTAPI_URL}/ai/transcribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessao_id: sessaoId, audio_url: audioUrl }),
            });
            if (response.ok) return response.json();
        } catch {
            // Fallback se FastAPI não estiver disponível
        }
        return {
            sessaoId,
            status: 'PENDENTE',
            mensagem: 'Motor de transcrição indisponível. Envie o áudio quando o serviço estiver ativo.',
        };
    }

    /**
     * Refina ata rascunho usando IA (corrige erros, melhora redação).
     */
    async refinarAta(ataId: string, textoRascunho: string) {
        try {
            const response = await fetch(`${this.FASTAPI_URL}/ai/refine-text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textoRascunho, style: 'legislativo_formal' }),
            });
            if (response.ok) {
                const data = await response.json();
                return { ataId, textoRefinado: data.refined_text || textoRascunho, refinadoPorIA: true, status: 'REFINADO' };
            }
        } catch {
            // Fallback
        }
        return { ataId, textoRefinado: textoRascunho, refinadoPorIA: false, status: 'RASCUNHO' };
    }
}
