'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    AlertTriangle, Copy, ExternalLink, X, Sparkles, Search,
    FileText, Building2, ArrowRight, Shield, Loader2, CheckCircle2, XCircle
} from 'lucide-react';

interface SimilarDocument {
    documento_id: string;
    documento_tipo: string;
    origem: string;
    titulo: string;
    conteudo_resumo: string | null;
    similarity_score: number;
    cross_encoder_score: number;
    is_duplicate: boolean;
    metadata: Record<string, any>;
}

interface DuplicateCheckResult {
    has_duplicates: boolean;
    total_candidatos: number;
    recomendacao: string;
    resultados: SimilarDocument[];
}

interface SimilarityAlertProps {
    titulo: string;
    conteudo: string;
    origem: string;
    tipo?: string;
    onDuplicateFound?: (result: DuplicateCheckResult) => void;
    onClear?: () => void;
    debounceMs?: number;
    apiUrl?: string;
}

export default function SimilarityAlert({
    titulo,
    conteudo,
    origem,
    tipo = 'MINUTA',
    onDuplicateFound,
    onClear,
    debounceMs = 2000,
    apiUrl = process.env.NEXT_PUBLIC_NESTJS_URL || 'http://localhost:3001',
}: SimilarityAlertProps) {
    const [result, setResult] = useState<DuplicateCheckResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkDuplicates = useCallback(async () => {
        if (!titulo || titulo.length < 10 || !conteudo || conteudo.length < 20) {
            setResult(null);
            onClear?.();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/deduplicacao/verificar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, conteudo, origem, tipo }),
            });

            if (!response.ok) throw new Error('Serviço indisponível');

            const data: DuplicateCheckResult = await response.json();
            setResult(data);
            setDismissed(false);

            if (data.has_duplicates) {
                onDuplicateFound?.(data);
            } else {
                onClear?.();
            }
        } catch (err) {
            setError('Motor semântico indisponível');
            setResult(null);
        } finally {
            setLoading(false);
        }
    }, [titulo, conteudo, origem, tipo, apiUrl, onDuplicateFound, onClear]);

    // Debounced check
    useEffect(() => {
        const timer = setTimeout(checkDuplicates, debounceMs);
        return () => clearTimeout(timer);
    }, [titulo, conteudo, checkDuplicates, debounceMs]);

    if (dismissed || (!result && !loading && !error)) return null;

    // Score color helper
    const getScoreColor = (score: number) => {
        if (score >= 0.85) return 'text-red-400';
        if (score >= 0.70) return 'text-amber-400';
        return 'text-emerald-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 0.85) return 'bg-red-500/10 border-red-500/30';
        if (score >= 0.70) return 'bg-amber-500/10 border-amber-500/30';
        return 'bg-emerald-500/10 border-emerald-500/30';
    };

    return (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
            {/* Loading State */}
            {loading && (
                <div className="flex items-center gap-3 bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
                    <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                    <div>
                        <p className="text-sm text-violet-300 font-medium">Analisando similaridade semântica...</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Verificando {tipo.toLowerCase()} contra documentos de 41 origens</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                    <XCircle className="w-5 h-5 text-zinc-500" />
                    <p className="text-sm text-zinc-400">{error}</p>
                </div>
            )}

            {/* Results */}
            {result && !loading && (
                <div className={`rounded-xl border overflow-hidden ${result.has_duplicates
                        ? 'bg-red-500/5 border-red-500/30'
                        : result.total_candidatos > 0
                            ? 'bg-amber-500/5 border-amber-500/30'
                            : 'bg-emerald-500/5 border-emerald-500/30'
                    }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
                        <div className="flex items-center gap-3">
                            {result.has_duplicates ? (
                                <div className="p-2 rounded-lg bg-red-500/20">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                            ) : result.total_candidatos > 0 ? (
                                <div className="p-2 rounded-lg bg-amber-500/20">
                                    <Search className="w-5 h-5 text-amber-400" />
                                </div>
                            ) : (
                                <div className="p-2 rounded-lg bg-emerald-500/20">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-sm font-semibold text-white">
                                    {result.has_duplicates
                                        ? `⚠️ DUPLICATA DETECTADA — ${result.total_candidatos} documento(s) similar(es)`
                                        : result.total_candidatos > 0
                                            ? `${result.total_candidatos} documento(s) possivelmente relacionado(s)`
                                            : 'Nenhum documento similar encontrado'
                                    }
                                </h4>
                                <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Motor IA: Embeddings + Cross-Encoder
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDismissed(true)}
                            className="p-1.5 hover:bg-zinc-700/50 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-zinc-500" />
                        </button>
                    </div>

                    {/* Similar Documents */}
                    {result.resultados.length > 0 && (
                        <div className="divide-y divide-zinc-800/50">
                            {result.resultados.map((doc, idx) => (
                                <div key={doc.documento_id} className={`p-4 hover:bg-zinc-800/20 transition-colors ${doc.is_duplicate ? 'bg-red-500/5' : ''}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getScoreBg(doc.cross_encoder_score)}`}>
                                                    {doc.is_duplicate ? '🔴 DUPLICATA' : '🟡 SIMILAR'}
                                                </span>
                                                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {doc.origem}
                                                </span>
                                                <span className="text-xs bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full">
                                                    {doc.documento_tipo}
                                                </span>
                                            </div>
                                            <h5 className="text-sm font-medium text-white truncate">{doc.titulo}</h5>
                                            {doc.conteudo_resumo && (
                                                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{doc.conteudo_resumo}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="text-right">
                                                <p className={`text-lg font-bold ${getScoreColor(doc.cross_encoder_score)}`}>
                                                    {Math.round(doc.cross_encoder_score * 100)}%
                                                </p>
                                                <p className="text-xs text-zinc-500">Relevância IA</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-zinc-400">
                                                    Cosine: {Math.round(doc.similarity_score * 100)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {doc.is_duplicate && (
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800/50">
                                            <button className="flex items-center gap-2 text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 px-3 py-1.5 rounded-lg transition-colors">
                                                <Copy className="w-3 h-3" />
                                                Apensar a este
                                            </button>
                                            <button className="flex items-center gap-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                                                <ExternalLink className="w-3 h-3" />
                                                Ver documento
                                            </button>
                                            <button className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                                                <ArrowRight className="w-3 h-3" />
                                                Ignorar e prosseguir
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    {result.has_duplicates && (
                        <div className="p-3 bg-red-500/5 border-t border-red-500/20 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-red-400" />
                            <p className="text-xs text-red-300">
                                Recomendação: verificar os documentos acima antes de prosseguir. Documentos de origens diferentes podem tratar do mesmo assunto.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
