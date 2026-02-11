'use client';

import React from 'react';
import {
    BarChart3, TrendingUp, Clock, Users, FileText, CheckCircle2,
    XCircle, Gavel, ArrowUpRight, ArrowDownRight, Sparkles, Activity
} from 'lucide-react';

const metricas = {
    tempoMedioTramitacao: 42,
    taxaAprovacao: 68,
    totalProposituras2026: 56,
    sessoesRealizadas: 14,
    produtividade: [
        { nome: 'Carlos H. Silva', partido: 'PSD', proposituras: 12, aprovadas: 9 },
        { nome: 'Maria Oliveira', partido: 'PT', proposituras: 10, aprovadas: 8 },
        { nome: 'José A. Neto', partido: 'MDB', proposituras: 8, aprovadas: 5 },
        { nome: 'Patricia Fernandes', partido: 'PSDB', proposituras: 7, aprovadas: 6 },
        { nome: 'Roberto Campos', partido: 'PP', proposituras: 6, aprovadas: 3 },
        { nome: 'Ana C. Souza', partido: 'PSOL', proposituras: 5, aprovadas: 4 },
    ],
    porTipo: [
        { tipo: 'Projeto de Lei', total: 24, aprovados: 16 },
        { tipo: 'Lei Complementar', total: 4, aprovados: 2 },
        { tipo: 'Resolução', total: 8, aprovados: 7 },
        { tipo: 'Decreto Legislativo', total: 6, aprovados: 5 },
        { tipo: 'Requerimento', total: 14, aprovados: 12 },
    ],
};

const KPI_DATA = [
    { label: 'Tempo Médio Tramitação', value: `${metricas.tempoMedioTramitacao}d`, icon: Clock, color: 'text-blue-400', delta: '-5d', positive: true },
    { label: 'Taxa de Aprovação', value: `${metricas.taxaAprovacao}%`, icon: CheckCircle2, color: 'text-emerald-400', delta: '+3%', positive: true },
    { label: 'Proposituras 2026', value: metricas.totalProposituras2026, icon: FileText, color: 'text-violet-400', delta: '+12', positive: true },
    { label: 'Sessões Realizadas', value: metricas.sessoesRealizadas, icon: Gavel, color: 'text-amber-400', delta: null, positive: true },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        Analytics Legislativo
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Métricas de desempenho, produtividade e tramitação</p>
                </div>
                <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span className="text-sm text-violet-300">IA: Insights automáticos</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
                {KPI_DATA.map((kpi) => (
                    <div key={kpi.label} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">{kpi.label}</span>
                            <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                        </div>
                        <div className="flex items-end gap-2 mt-2">
                            <p className="text-2xl font-bold text-white">{kpi.value}</p>
                            {kpi.delta && (
                                <span className={`text-xs flex items-center gap-0.5 ${kpi.positive ? 'text-emerald-400' : 'text-red-400'} mb-1`}>
                                    {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {kpi.delta}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Produtividade por Vereador */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-violet-400" /> Produtividade por Vereador
                    </h3>
                    <div className="space-y-3">
                        {metricas.produtividade.map((v, i) => {
                            const taxa = Math.round((v.aprovadas / v.proposituras) * 100);
                            return (
                                <div key={v.nome} className="flex items-center gap-3">
                                    <span className="text-xs text-zinc-500 w-4">{i + 1}.</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-white truncate">{v.nome}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-zinc-400">{v.aprovadas}/{v.proposituras}</span>
                                                <span className={`text-xs font-medium ${taxa >= 75 ? 'text-emerald-400' : taxa >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{taxa}%</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${taxa >= 75 ? 'bg-emerald-500' : taxa >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${taxa}%` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Por Tipo de Propositura */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" /> Por Tipo de Proposição
                    </h3>
                    <div className="space-y-3">
                        {metricas.porTipo.map(t => {
                            const taxa = Math.round((t.aprovados / t.total) * 100);
                            return (
                                <div key={t.tipo} className="flex items-center justify-between bg-zinc-800/30 rounded-lg p-3">
                                    <div>
                                        <p className="text-sm text-white">{t.tipo}</p>
                                        <p className="text-xs text-zinc-500">{t.aprovados} aprovados de {t.total}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${taxa}%` }} />
                                        </div>
                                        <span className="text-sm font-medium text-violet-400 w-10 text-right">{taxa}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 border border-violet-500/20 rounded-xl p-5">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/20">
                        <Sparkles className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-violet-300">Insight IA</h4>
                        <p className="text-sm text-zinc-400 mt-1">
                            O tempo médio de tramitação caiu 5 dias em relação ao mês anterior, impulsionado pelo uso do regime de urgência em 3 proposituras.
                            A taxa de aprovação subiu para 68%, com destaque para Resoluções (87.5%). Recomendação: proposituras de Lei Complementar
                            têm taxa de apenas 50% — considere análise prévia da CCJ antes da distribuição formal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
