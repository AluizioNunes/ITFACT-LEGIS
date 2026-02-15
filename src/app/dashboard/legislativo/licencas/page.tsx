'use client';

import React, { useState } from 'react';
import {
    UserMinus, Calendar, Clock, CheckCircle2, Plus,
    ArrowLeftRight, XCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const TIPO_CONFIG: Record<string, { label: string; color: string }> = {
    TRATAMENTO_SAUDE: { label: 'Saúde', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
    INTERESSE_PARTICULAR: { label: 'Particular', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    MISSAO_REPRESENTACAO: { label: 'Missão', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    MATERNIDADE: { label: 'Maternidade', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
    MANDATO_ELETIVO: { label: 'Mandato Eletivo', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
};

const mockLicencas = [
    {
        id: '1', vereador: 'Carlos Henrique Silva', partido: 'PSD', tipo: 'TRATAMENTO_SAUDE',
        inicio: '2026-01-15', fim: '2026-02-14', dias: 30, status: 'ATIVA',
        suplente: 'João Marcos Pereira', remunerada: true,
    },
    {
        id: '2', vereador: 'Maria Oliveira', partido: 'PT', tipo: 'MISSAO_REPRESENTACAO',
        inicio: '2026-02-01', fim: '2026-02-05', dias: 5, status: 'ATIVA',
        suplente: null, remunerada: true,
    },
    {
        id: '3', vereador: 'José Antônio Neto', partido: 'MDB', tipo: 'INTERESSE_PARTICULAR',
        inicio: '2026-01-10', fim: '2026-01-20', dias: 10, status: 'ENCERRADA',
        suplente: 'Ana Carla Souza', remunerada: false,
    },
    {
        id: '4', vereador: 'Patricia Fernandes', partido: 'PSDB', tipo: 'MATERNIDADE',
        inicio: '2026-01-01', fim: '2026-04-01', dias: 90, status: 'ATIVA',
        suplente: 'Roberto Campos', remunerada: true,
    },
];

const KPI_DATA = [
    { label: 'Licenças Ativas', value: 3, icon: UserMinus, color: 'text-amber-400' },
    { label: 'Suplentes Empossados', value: 2, icon: ArrowLeftRight, color: 'text-violet-400' },
    { label: 'Este Ano', value: 8, icon: Calendar, color: 'text-blue-400' },
    { label: 'Dias Totais', value: 135, icon: Clock, color: 'text-teal-400' },
];

export default function LicencasPage() {
    const [filterStatus, setFilterStatus] = useState('TODOS');

    const filtered = mockLicencas.filter(l => {
        if (filterStatus === 'TODOS') return true;
        return l.status === filterStatus;
    });

    const getStatusBadge = (status: string) => {
        if (status === 'ATIVA') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        if (status === 'ENCERRADA') return 'bg-zinc-700 text-zinc-400 border-zinc-600';
        return 'bg-red-500/10 text-red-400 border-red-500/30';
    };

    return (
        <div className="space-y-6 p-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                            <UserMinus className="w-6 h-6 text-white" />
                        </div>
                        Licenças de Vereadores
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Controle de licenças, afastamentos e gestão de suplentes</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-amber-500/20">
                    <Plus className="w-4 h-4" />
                    Registrar Licença
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
            <div className="flex items-center gap-3">
                {['TODOS', 'ATIVA', 'ENCERRADA'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all ${filterStatus === status
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                            }`}
                    >
                        {status === 'TODOS' ? 'Todas' : status === 'ATIVA' ? 'Ativas' : 'Encerradas'}
                    </button>
                ))}
            </div>

            {/* Licenças Table */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Vereador</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Tipo</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Período</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Dias</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Suplente</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Remun.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {filtered.map((lic) => {
                            const tipo = TIPO_CONFIG[lic.tipo];
                            return (
                                <tr key={lic.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">{lic.vereador}</p>
                                            <p className="text-xs text-zinc-500">{lic.partido}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${tipo?.color || 'bg-zinc-700 text-zinc-400'}`}>
                                            {tipo?.label || lic.tipo}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(lic.inicio)} — {formatDate(lic.fim)}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-medium text-white">{lic.dias}d</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {lic.suplente ? (
                                            <div className="flex items-center gap-1.5">
                                                <ArrowLeftRight className="w-3.5 h-3.5 text-violet-400" />
                                                <span className="text-sm text-white">{lic.suplente}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-zinc-600">—</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusBadge(lic.status)}`}>
                                            {lic.status === 'ATIVA' ? '● Ativa' : '○ Encerrada'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {lic.remunerada ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-zinc-600" />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
