'use client';

import React, { useState } from 'react';
import {
    MessageCircle, Gavel, Users, FileText, CheckCircle2, XCircle,
    Clock, ArrowRight, ChevronDown, Filter, Search, Sparkles,
    ThumbsUp, ThumbsDown, AlertTriangle, Plus
} from 'lucide-react';

const mockDiscussoes = [
    {
        id: '1', propositura: 'PL 42/2026', ementa: 'Programa de reciclagem seletiva nas escolas municipais',
        tipo: 'PRIMEIRA_DISCUSSAO', sessao: 'Sessão Ordinária #12/2026', data: '2026-02-08',
        status: 'APROVADA', votosA: 15, votosC: 4, abstencoes: 2, oradores: 6,
    },
    {
        id: '2', propositura: 'PLC 18/2026', ementa: 'Alteração do Código Tributário Municipal',
        tipo: 'PRIMEIRA_DISCUSSAO', sessao: 'Sessão Extraordinária #3/2026', data: '2026-02-10',
        status: 'EM_DISCUSSAO', votosA: 0, votosC: 0, abstencoes: 0, oradores: 3,
    },
    {
        id: '3', propositura: 'PL 07/2026', ementa: 'Criação da Comissão Especial de Educação Digital',
        tipo: 'SEGUNDA_DISCUSSAO', sessao: 'Sessão Ordinária #14/2026', data: '2026-02-12',
        status: 'APROVADA', votosA: 18, votosC: 1, abstencoes: 2, oradores: 8,
    },
    {
        id: '4', propositura: 'PL 33/2026', ementa: 'Regulamentação do transporte por aplicativo',
        tipo: 'PRIMEIRA_DISCUSSAO', sessao: 'Sessão Ordinária #15/2026', data: '2026-02-14',
        status: 'AGENDADA', votosA: 0, votosC: 0, abstencoes: 0, oradores: 0,
    },
    {
        id: '5', propositura: 'PR 15/2025', ementa: 'Moção de repúdio à violência escolar',
        tipo: 'DISCUSSAO_UNICA', sessao: 'Sessão Ordinária #11/2026', data: '2026-02-06',
        status: 'REJEITADA', votosA: 5, votosC: 14, abstencoes: 2, oradores: 10,
    },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    AGENDADA: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', label: 'Agendada' },
    EM_DISCUSSAO: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', label: 'Em Discussão' },
    APROVADA: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', label: 'Aprovada' },
    REJEITADA: { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400', label: 'Rejeitada' },
};

const TIPO_LABELS: Record<string, string> = {
    PRIMEIRA_DISCUSSAO: '1ª Discussão',
    SEGUNDA_DISCUSSAO: '2ª Discussão',
    DISCUSSAO_UNICA: 'Discussão Única',
};

const KPI_DATA = [
    { label: 'Em Discussão', value: 1, icon: MessageCircle, color: 'text-amber-400' },
    { label: 'Aprovadas', value: 2, icon: ThumbsUp, color: 'text-emerald-400' },
    { label: 'Rejeitadas', value: 1, icon: ThumbsDown, color: 'text-red-400' },
    { label: 'Agendadas', value: 1, icon: Clock, color: 'text-blue-400' },
];

export default function DiscussoesPage() {
    const [filter, setFilter] = useState('TODOS');

    const filtered = mockDiscussoes.filter(d => filter === 'TODOS' || d.status === filter);

    return (
        <div className="space-y-6 p-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        Discussões Plenárias
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">1ª e 2ª discussão de proposituras em plenário</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all">
                    <Plus className="w-4 h-4" />
                    Nova Discussão
                </button>
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
                {['TODOS', 'AGENDADA', 'EM_DISCUSSAO', 'APROVADA', 'REJEITADA'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all ${filter === s
                                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                    >
                        {s === 'TODOS' ? 'Todas' : STATUS_COLORS[s]?.label || s}
                    </button>
                ))}
            </div>

            {/* Discussion Cards */}
            <div className="space-y-3">
                {filtered.map((disc) => {
                    const statusConf = STATUS_COLORS[disc.status];
                    const totalVotos = disc.votosA + disc.votosC + disc.abstencoes;
                    return (
                        <div key={disc.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-white">{disc.propositura}</span>
                                        <span className="text-xs bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full">
                                            {TIPO_LABELS[disc.tipo] || disc.tipo}
                                        </span>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${statusConf?.bg}`}>
                                            {statusConf?.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-300">{disc.ementa}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1"><Gavel className="w-3.5 h-3.5" />{disc.sessao}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(disc.data).toLocaleDateString('pt-BR')}</span>
                                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{disc.oradores} oradores</span>
                                    </div>
                                </div>

                                {/* Voting Result */}
                                {totalVotos > 0 && (
                                    <div className="ml-4 flex items-center gap-3 bg-zinc-800/50 rounded-xl px-4 py-3">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-emerald-400">{disc.votosA}</p>
                                            <p className="text-xs text-zinc-500">A favor</p>
                                        </div>
                                        <div className="w-px h-8 bg-zinc-700"></div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-red-400">{disc.votosC}</p>
                                            <p className="text-xs text-zinc-500">Contra</p>
                                        </div>
                                        <div className="w-px h-8 bg-zinc-700"></div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-zinc-400">{disc.abstencoes}</p>
                                            <p className="text-xs text-zinc-500">Abst.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Progress bar for voting */}
                            {totalVotos > 0 && (
                                <div className="mt-3 pt-3 border-t border-zinc-800/50">
                                    <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
                                        <div className="bg-emerald-500 transition-all" style={{ width: `${(disc.votosA / totalVotos) * 100}%` }} />
                                        <div className="bg-red-500 transition-all" style={{ width: `${(disc.votosC / totalVotos) * 100}%` }} />
                                        <div className="bg-zinc-600 transition-all" style={{ width: `${(disc.abstencoes / totalVotos) * 100}%` }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
