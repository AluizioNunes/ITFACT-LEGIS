'use client';

import React from 'react';
import {
    CheckCircle2, Clock, DollarSign, UserCheck
} from 'lucide-react';

const mockPresencas = [
    { id: '1', nome: 'Carlos Henrique Silva', partido: 'PSD', sessoes: 12, presencas: 11, ausenciasJust: 1, ausencias: 0, subsidio: 'Integral' },
    { id: '2', nome: 'Maria Oliveira', partido: 'PT', sessoes: 12, presencas: 10, ausenciasJust: 1, ausencias: 1, subsidio: '-1/12' },
    { id: '3', nome: 'José Antônio Neto', partido: 'MDB', sessoes: 12, presencas: 8, ausenciasJust: 2, ausencias: 2, subsidio: '-2/12' },
    { id: '4', nome: 'Patricia Fernandes', partido: 'PSDB', sessoes: 12, presencas: 12, ausenciasJust: 0, ausencias: 0, subsidio: 'Integral' },
    { id: '5', nome: 'Roberto Campos', partido: 'PP', sessoes: 12, presencas: 9, ausenciasJust: 0, ausencias: 3, subsidio: '-3/12' },
    { id: '6', nome: 'Ana Carla Souza', partido: 'PSOL', sessoes: 12, presencas: 12, ausenciasJust: 0, ausencias: 0, subsidio: 'Integral' },
];

const KPI_DATA = [
    { label: 'Sessões no Mês', value: 12, icon: Clock, color: 'text-blue-400' },
    { label: 'Presença Média', value: '87%', icon: UserCheck, color: 'text-emerald-400' },
    { label: 'Com Desconto', value: 2, icon: DollarSign, color: 'text-red-400' },
    { label: '100% Presença', value: 3, icon: CheckCircle2, color: 'text-violet-400' },
];

export default function PresencaPage() {
    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
                            <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        Presença Eletrônica
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Registro de presença com impacto em subsídios — Regimento arts. 116, 136</p>
                </div>
            </div>

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

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Vereador</th>
                            <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Sessões</th>
                            <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Presenças</th>
                            <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Aus. Just.</th>
                            <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Faltas</th>
                            <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500 uppercase">%</th>
                            <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Subsídio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {mockPresencas.map((v) => {
                            const pct = Math.round((v.presencas / v.sessoes) * 100);
                            return (
                                <tr key={v.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-medium text-white">{v.nome}</p>
                                        <p className="text-xs text-zinc-500">{v.partido}</p>
                                    </td>
                                    <td className="text-center px-5 py-4 text-sm text-zinc-300">{v.sessoes}</td>
                                    <td className="text-center px-5 py-4">
                                        <span className="text-sm font-medium text-emerald-400">{v.presencas}</span>
                                    </td>
                                    <td className="text-center px-5 py-4">
                                        <span className="text-sm text-amber-400">{v.ausenciasJust}</span>
                                    </td>
                                    <td className="text-center px-5 py-4">
                                        <span className={`text-sm font-medium ${v.ausencias > 0 ? 'text-red-400' : 'text-zinc-500'}`}>{v.ausencias}</span>
                                    </td>
                                    <td className="text-center px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-xs text-zinc-400">{pct}%</span>
                                        </div>
                                    </td>
                                    <td className="text-center px-5 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${v.ausencias === 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                                            {v.subsidio}
                                        </span>
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
