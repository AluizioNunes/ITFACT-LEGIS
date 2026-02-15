'use client';

import React, { useState } from 'react';
import {
    FileText, CheckCircle2, Clock, Edit3, Eye, Shield, Sparkles,
    AlertTriangle, Users, Download, Plus
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const mockRedacoes = [
    {
        id: '1', propositura: 'PL 42/2026', ementa: 'Programa de reciclagem seletiva nas escolas municipais',
        comissao: 'CCJ', relator: 'Dr. Paulo Menezes', status: 'APROVADA',
        dataCriacao: '2026-02-09', dataAprovacao: '2026-02-11', versao: 3,
    },
    {
        id: '2', propositura: 'PLC 18/2026', ementa: 'Alteração do Código Tributário Municipal',
        comissao: 'CCJ', relator: 'Dra. Fernanda Costa', status: 'EM_REVISAO',
        dataCriacao: '2026-02-10', dataAprovacao: null, versao: 2,
    },
    {
        id: '3', propositura: 'PR 07/2026', ementa: 'Criação da Comissão Especial de Educação Digital',
        comissao: 'CCJ', relator: 'Prof. Marcos Lima', status: 'RASCUNHO',
        dataCriacao: '2026-02-12', dataAprovacao: null, versao: 1,
    },
    {
        id: '4', propositura: 'PL 91/2025', ementa: 'Desconto no IPTU para imóveis com energia solar',
        comissao: 'CCJ', relator: 'Eng. Ricardo Alves', status: 'APROVADA',
        dataCriacao: '2025-12-15', dataAprovacao: '2025-12-20', versao: 4,
    },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    RASCUNHO: { label: 'Rascunho', color: 'bg-zinc-700 text-zinc-400 border-zinc-600', icon: Edit3 },
    EM_REVISAO: { label: 'Em Revisão', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Eye },
    APROVADA: { label: 'Aprovada', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
    REJEITADA: { label: 'Rejeitada', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: AlertTriangle },
};

const KPI_DATA = [
    { label: 'Redações Finais', value: 12, icon: FileText, color: 'text-blue-400' },
    { label: 'Aprovadas', value: 8, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Em Revisão', value: 3, icon: Eye, color: 'text-amber-400' },
    { label: 'Rascunhos', value: 1, icon: Edit3, color: 'text-zinc-400' },
];

export default function RedacaoFinalPage() {
    const [filter, setFilter] = useState('TODOS');

    const filtered = mockRedacoes.filter(r => filter === 'TODOS' || r.status === filter);

    return (
        <div className="space-y-6 p-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        Redação Final
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Texto definitivo consolidado pela CCJ para votação plenária</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-indigo-300">IA: Revisão automática</span>
                    </div>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        <Plus className="w-4 h-4" />
                        Nova Redação
                    </button>
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
                        <p className="text-2xl font-bold text-white mt-2">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                {['TODOS', 'RASCUNHO', 'EM_REVISAO', 'APROVADA'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all ${filter === s
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                    >
                        {s === 'TODOS' ? 'Todas' : STATUS_MAP[s]?.label || s}
                    </button>
                ))}
            </div>

            {/* Redação Cards */}
            <div className="space-y-3">
                {filtered.map((red) => {
                    const statusConf = STATUS_MAP[red.status];
                    const StatusIcon = statusConf?.icon || FileText;
                    return (
                        <div key={red.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-white">{red.propositura}</span>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusConf?.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusConf?.label}
                                        </span>
                                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                                            v{red.versao}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-300">{red.ementa}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" />{red.comissao}</span>
                                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Relator: {red.relator}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(red.dataCriacao)}</span>
                                        {red.dataAprovacao && (
                                            <span className="flex items-center gap-1 text-emerald-500">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Aprovada em {formatDate(red.dataAprovacao)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors" title="Visualizar">
                                        <Eye className="w-4 h-4 text-zinc-400" />
                                    </button>
                                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors" title="Download PDF">
                                        <Download className="w-4 h-4 text-zinc-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
