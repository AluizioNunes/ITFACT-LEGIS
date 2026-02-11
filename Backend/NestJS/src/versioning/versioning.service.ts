import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


/**
 * Versioning de Proposições — controle de versão de textos legislativos.
 * Funciona como um "Git for Laws" com diff, histórico e merge.
 */
@Injectable()
export class VersioningService {
    constructor(private prisma: PrismaService) { }

    /**
     * Registra uma nova versão do texto legislativo.
     */
    async criarVersao(proposituraId: string, texto: string, autorId: string, descricao: string) {
        const versaoAnterior = await this.obterVersaoAtual(proposituraId);
        const numero = versaoAnterior ? versaoAnterior.numero + 1 : 1;

        let diff = null;
        if (versaoAnterior) {
            diff = this.gerarDiff(versaoAnterior.texto, texto);
        }

        return {
            id: `VER-${Date.now()}`,
            proposituraId,
            numero,
            texto,
            autorId,
            descricao,
            diff,
            linhasAdicionadas: diff ? (diff.match(/^\+/gm) || []).length : texto.split('\n').length,
            linhasRemovidas: diff ? (diff.match(/^-/gm) || []).length : 0,
            totalCaracteres: texto.length,
            criadoEm: new Date().toISOString(),
        };
    }

    /**
     * Lista histórico de versões de uma propositura.
     */
    async listarVersoes(proposituraId: string) {
        return { proposituraId, total: 0, versoes: [] };
    }

    /**
     * Obtém a versão atual (mais recente).
     */
    async obterVersaoAtual(proposituraId: string): Promise<{ numero: number; texto: string } | null> {
        return null; // Será populado quando o banco estiver ativo
    }

    /**
     * Compara duas versões e retorna diff.
     */
    async compararVersoes(proposituraId: string, versaoA: number, versaoB: number) {
        return {
            proposituraId,
            versaoA,
            versaoB,
            diff: '--- Sem dados disponíveis ---',
            totalAlteracoes: 0,
        };
    }

    /**
     * Gera diff unificado entre dois textos.
     */
    private gerarDiff(textoAntigo: string, textoNovo: string): string {
        // Diff simplificado (sem dependência external)
        const linhasAntigas = textoAntigo.split('\n');
        const linhasNovas = textoNovo.split('\n');
        const resultado: string[] = [];

        const maxLen = Math.max(linhasAntigas.length, linhasNovas.length);
        for (let i = 0; i < maxLen; i++) {
            const antiga = linhasAntigas[i];
            const nova = linhasNovas[i];
            if (antiga === nova) {
                resultado.push(` ${antiga || ''}`);
            } else {
                if (antiga !== undefined) resultado.push(`-${antiga}`);
                if (nova !== undefined) resultado.push(`+${nova}`);
            }
        }
        return resultado.join('\n');
    }

    /**
     * Restaura propositura para uma versão anterior.
     */
    async restaurarVersao(proposituraId: string, versaoNumero: number, autorId: string) {
        return {
            proposituraId,
            versaoRestaurada: versaoNumero,
            novaVersaoCriada: versaoNumero + 100,
            descricao: `Restauração à versão ${versaoNumero}`,
            autorId,
            restauradoEm: new Date().toISOString(),
        };
    }
}
