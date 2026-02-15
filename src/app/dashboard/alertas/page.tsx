'use client';

import React, { useState } from 'react';
import {
    Bell, Clock, AlertTriangle, CheckCircle2, XCircle, Calendar,
    Sparkles, Shield, RefreshCcw,
    Timer, Eye, BellOff
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const PRIORIDADE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    CRITICA: { label: 'Crítica', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/40' },
    ALTA: { label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
    MEDIA: { label: 'Média', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    BAIXA: { label: 'Baixa', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
};

const mockAlertas = [
    {
        id: '1', tipo: 'PRAZO_COMISSAO', propositura: 'PL 42/2026',
        descricao: 'Prazo para parecer da CCJ vence em 3 dias',
        prazo: '2026-02-14', prioridade: 'CRITICA', notificado: false,
        diasRestantes: 3, comissao: 'CCJ',
    },
    {
        id: '2', tipo: 'PRAZO_VETO', propositura: 'PL 91/2025',
        descricao: 'Deliberação do veto parcial — 8 dias para expirar',
        prazo: '2026-02-19', prioridade: 'ALTA', notificado: false,
        diasRestantes: 8, comissao: null,
    },
    {
        id: '3', tipo: 'PRAZO_REDACAO', propositura: 'PR 07/2026',
        descricao: 'Redação final aguarda revisão há 5 dias',
        prazo: '2026-02-17', prioridade: 'MEDIA', notificado: true,
        diasRestantes: 6, comissao: 'CCJ',
    },
    {
        id: '4', tipo: 'PRAZO_COMISSAO', propositura: 'PLC 18/2026',
        descricao: 'Prazo para parecer da Comissão de Finanças vence em 12 dias',
        prazo: '2026-02-23', prioridade: 'BAIXA', notificado: true,
        diasRestantes: 12, comissao: 'Comissão de Finanças',
    },
    {
        id: '5', tipo: 'PRAZO_VETO_VENCIDO', propositura: 'PL 85/2025',
        descricao: 'PRAZO VENCIDO — Veto total não deliberado — promulgação automática aplicável',
        prazo: '2026-02-01', prioridade: 'CRITICA', notificado: true,
        diasRestantes: -10, comissao: null,
    },
    {
        id: '6', tipo: 'PRAZO_SESSAO', propositura: 'PL 33/2026',
        descricao: 'Propositura em regime de urgência — deve entrar em pauta na próxima sessão',
        prazo: '2026-02-15', prioridade: 'ALTA', notificado: false,
        diasRestantes: 4, comissao: null,
    },
];

const KPI_DATA = [
    { label: 'Alertas Ativos', value: 6, icon: Bell, color: 'text-red-400' },
    { label: 'Vencidos', value: 1, icon: XCircle, color: 'text-red-500' },
    { label: 'Até 5 dias', value: 2, icon: Timer, color: 'text-amber-400' },
    { label: 'Notificados', value: 3, icon: CheckCircle2, color: 'text-emerald-400' },
];

export default function AlertasPage() {
    const [filtro, setFiltro] = useState('TODOS');
    const [apenasNaoNotificados, setApenasNaoNotificados] = useState(false);

    const filtered = mockAlertas.filter(a => {
        if (filtro !== 'TODOS' && a.prioridade !== filtro) return false;
        if (apenasNaoNotificados && a.notificado) return false;
        return true;
    });

    return (
        <div className="space-y-6 p-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        Alertas de Prazo
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Monitoramento automático de prazos regimentais e legais</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                        <Sparkles className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-300">IA: Detecção automática</span>
                    </div>
                    <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all border border-zinc-700">
                        <RefreshCcw className="w-4 h-4" />
                        Verificar Prazos
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {['TODOS', 'CRITICA', 'ALTA', 'MEDIA', 'BAIXA'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setFiltro(p)}
                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${filtro === p
                                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                        >
                            {p === 'TODOS' ? 'Todos' : PRIORIDADE_CONFIG[p]?.label || p}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setApenasNaoNotificados(!apenasNaoNotificados)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-all ${apenasNaoNotificados ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                        }`}
                >
                    <BellOff className="w-3.5 h-3.5" />
                    Apenas não notificados
                </button>
            </div>

            {/* Alertas List */}
            <div className="space-y-3">
                {filtered.map((alerta) => {
                    const prioConf = PRIORIDADE_CONFIG[alerta.prioridade];
                    const vencido = alerta.diasRestantes < 0;
                    return (
                        <div key={alerta.id} className={`bg-zinc-900/60 border rounded-xl p-5 transition-all hover:border-zinc-700 ${vencido ? 'border-red-500/40 bg-red-500/5' :
                            alerta.prioridade === 'CRITICA' ? 'border-red-500/20' : 'border-zinc-800'
                            }`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-2.5 rounded-xl ${vencido ? 'bg-red-500/20' : 'bg-zinc-800'}`}>
                                        {vencido ? (
                                            <XCircle className="w-5 h-5 text-red-400" />
                                        ) : alerta.prioridade === 'CRITICA' ? (
                                            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-amber-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-white">{alerta.propositura}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${prioConf?.bg}`}>
                                                {prioConf?.label}
                                            </span>
                                            {alerta.notificado && (
                                                <span className="text-xs text-emerald-500 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Notificado
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm ${vencido ? 'text-red-300 font-medium' : 'text-zinc-300'}`}>
                                            {alerta.descricao}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Prazo: {formatDate(alerta.prazo)}
                                            </span>
                                            {alerta.comissao && (
                                                <span className="flex items-center gap-1">
                                                    <Shield className="w-3.5 h-3.5" />
                                                    {alerta.comissao}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={`text-2xl font-bold ${vencido ? 'text-red-400' :
                                        alerta.diasRestantes <= 3 ? 'text-red-400' :
                                            alerta.diasRestantes <= 7 ? 'text-amber-400' : 'text-emerald-400'
                                        }`}>
                                        {vencido ? `${Math.abs(alerta.diasRestantes)}d` : `${alerta.diasRestantes}d`}
                                    </p>
                                    <p className="text-xs text-zinc-500">{vencido ? 'Vencido há' : 'Restantes'}</p>
                                </div>
                            </div>

                            {!alerta.notificado && (
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800/50">
                                    <button className="flex items-center gap-2 text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 px-3 py-1.5 rounded-lg transition-colors">
                                        <Bell className="w-3 h-3" />
                                        Marcar como notificado
                                    </button>
                                    <button className="flex items-center gap-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                                        <Eye className="w-3 h-3" />
                                        Ver propositura
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
