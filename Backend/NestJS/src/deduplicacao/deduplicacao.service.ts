import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeduplicacaoService {
    private readonly FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

    constructor(private prisma: PrismaService) { }

    /**
     * Verifica duplicatas semânticas antes de criar uma minuta/propositura.
     * Chama o FastAPI /semantic/check-duplicate com cross-encoder.
     */
    async verificarDuplicatas(titulo: string, conteudo: string, origem: string, tipo: string = 'MINUTA') {
        try {
            const response = await fetch(`${this.FASTAPI_URL}/semantic/check-duplicate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo,
                    conteudo,
                    origem,
                    documento_tipo: tipo,
                    threshold: 0.75,
                }),
            });

            if (!response.ok) {
                throw new Error(`FastAPI error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na verificação semântica:', error);
            // Falha graceful — não impede a criação
            return {
                has_duplicates: false,
                total_candidatos: 0,
                resultados: [],
                recomendacao: 'SERVICO_INDISPONIVEL',
                error: error.message,
            };
        }
    }

    /**
     * Indexa um documento no motor semântico após criação.
     * Chamado automaticamente ao criar minutas/proposituras.
     */
    async indexarDocumento(documentoId: string, tipo: string, origem: string, titulo: string, conteudo: string, metadata?: Record<string, any>) {
        try {
            const response = await fetch(`${this.FASTAPI_URL}/semantic/index`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documento_id: documentoId,
                    documento_tipo: tipo,
                    origem,
                    titulo,
                    conteudo,
                    metadata: metadata || {},
                }),
            });

            if (!response.ok) {
                throw new Error(`FastAPI error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao indexar documento:', error);
            return { status: 'error', error: error.message };
        }
    }

    /**
     * Busca semântica por texto livre.
     */
    async buscarSimilares(texto: string, limite: number = 5, threshold: number = 0.80) {
        try {
            const response = await fetch(`${this.FASTAPI_URL}/semantic/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto, limite, threshold }),
            });

            if (!response.ok) {
                throw new Error(`FastAPI error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            return { total_encontrados: 0, resultados: [], error: error.message };
        }
    }

    /**
     * Estatísticas do motor semântico.
     */
    async obterEstatisticas() {
        try {
            const response = await fetch(`${this.FASTAPI_URL}/semantic/stats`);
            return await response.json();
        } catch (error) {
            return { total_documentos_indexados: 0, error: error.message };
        }
    }
}
