'use client';

import React, { useState } from 'react';
import {
    Users, Calendar, MapPin, Clock, FileText, Mic, Plus,
    CheckCircle2, AlertTriangle, Search, Filter, Sparkles,
    Video, MessageSquare, ChevronRight, Eye
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    AGENDADA: { label: 'Agendada', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    EM_ANDAMENTO: { label: 'Em Andamento', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    REALIZADA: { label: 'Realizada', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    CANCELADA: { label: 'Cancelada', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
};

const mockAudiencias = [
    {
        id: '1', tema: 'Plano Diretor Municipal — Revisão 2026', comissao: 'Comissão de Urbanismo',
        data: '2026-02-15T14:00:00', local: 'Plenário da Câmara Municipal', status: 'AGENDADA',
        participantes: 12, inscritos: 45, proposituraRef: 'PL 22/2026',
    },
    {
        id: '2', tema: 'Impacto da Mineração na Bacia do Rio Verde', comissao: 'Comissão de Meio Ambiente',
        data: '2026-02-10T09:00:00', local: 'Auditório Público', status: 'REALIZADA',
        participantes: 78, inscritos: 120, proposituraRef: 'PL 08/2026', ata: true,
    },
    {
        id: '3', tema: 'Segurança Pública nos Bairros Periféricos', comissao: 'Comissão de Segurança',
        data: '2026-02-12T10:00:00', local: 'Escola Municipal Prof. Ana', status: 'EM_ANDAMENTO',
        participantes: 34, inscritos: 60, proposituraRef: null,
    },
    {
        id: '4', tema: 'Revisão do Código Tributário', comissao: 'Comissão de Finanças',
        data: '2026-01-28T15:00:00', local: 'Sala de Reuniões', status: 'CANCELADA',
        participantes: 0, inscritos: 15, proposituraRef: 'PLC 03/2026',
    },
];

const KPI_DATA = [
    { label: 'Total 2026', value: 18, icon: Calendar, color: 'text-blue-400' },
    { label: 'Realizadas', value: 12, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Agendadas', value: 4, icon: Clock, color: 'text-amber-400' },
    { label: 'Participantes', value: 534, icon: Users, color: 'text-violet-400' },
];

export default function AudienciasPage() {
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = mockAudiencias.filter(a => {
        if (filtroStatus !== 'TODOS' && a.status !== filtroStatus) return false;
        if (searchTerm && !a.tema.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6 p-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/20">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        Audiências Públicas
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Gestão de audiências públicas e participação popular</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-2">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <span className="text-sm text-teal-300">IA: Ata automática</span>
                    </div>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30">
                        <Plus className="w-4 h-4" />
                        Nova Audiência
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
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar por tema..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-teal-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['TODOS', 'AGENDADA', 'EM_ANDAMENTO', 'REALIZADA', 'CANCELADA'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFiltroStatus(status)}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${filtroStatus === status
                                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                                }`}
                        >
                            {status === 'TODOS' ? 'Todos' : STATUS_CONFIG[status]?.label || status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Audiências Cards */}
            <div className="grid grid-cols-2 gap-4">
                {filtered.map((aud) => {
                    const st = STATUS_CONFIG[aud.status];
                    const dataObj = new Date(aud.data);
                    return (
                        <div key={aud.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2.5 py-1 rounded-full border ${st.bg}`}>
                                                {st.label}
                                            </span>
                                            {aud.proposituraRef && (
                                                <span className="text-xs bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full">
                                                    {aud.proposituraRef}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-base font-semibold text-white group-hover:text-teal-300 transition-colors">
                                            {aud.tema}
                                        </h3>
                                        <p className="text-sm text-zinc-400 mt-1">{aud.comissao}</p>
                                    </div>
                                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                                        <Eye className="w-4 h-4 text-zinc-500" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-zinc-800/50">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-zinc-500" />
                                        <span className="text-xs text-zinc-400">
                                            {dataObj.toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        <span className="text-xs text-zinc-400">
                                            {dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-zinc-500" />
                                        <span className="text-xs text-zinc-400 truncate">{aud.local}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-teal-400" />
                                            <span className="text-sm text-white font-medium">{aud.participantes}</span>
                                            <span className="text-xs text-zinc-500">participantes</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm text-white font-medium">{aud.inscritos}</span>
                                            <span className="text-xs text-zinc-500">inscritos</span>
                                        </div>
                                    </div>
                                    {aud.ata && (
                                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full flex items-center gap-1">
                                            <FileText className="w-3 h-3" /> Ata disponível
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
