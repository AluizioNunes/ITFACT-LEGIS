'use client';

import React, { useState } from 'react';
import { FileText, Plus, Eye, Sparkles } from 'lucide-react';

const TIPOS = ['SUPRESSIVA', 'SUBSTITUTIVA', 'ADITIVA', 'MODIFICATIVA'] as const;
const STATUS_COLORS = {
    APRESENTADA: 'bg-blue-500/20 text-blue-400',
    EM_ANALISE_COMISSAO: 'bg-amber-500/20 text-amber-400',
    APROVADA: 'bg-emerald-500/20 text-emerald-400',
    REJEITADA: 'bg-red-500/20 text-red-400',
};

const mockEmendas = [
    { id: '1', numero: 1, tipo: 'ADITIVA', propositura: 'PL 42/2026', autor: 'Ver. João Silva', fase: 'PRIMEIRA', status: 'APRESENTADA', texto: 'Acrescenta Art. 5-A para incluir programa de compostagem...', sugestaoIA: 'Impacto financeiro estimado: R$ 230.000/ano' },
    { id: '2', numero: 2, tipo: 'SUBSTITUTIVA', propositura: 'PL 42/2026', autor: 'Ver. Maria Souza', fase: 'PRIMEIRA', status: 'EM_ANALISE_COMISSAO', texto: 'Substitui o Art. 3º pela seguinte redação...', sugestaoIA: 'Redação mais clara que o original. Recomendação: favorável.' },
    { id: '3', numero: 3, tipo: 'SUPRESSIVA', propositura: 'PL 18/2026', autor: 'Ver. Pedro Costa', fase: 'SEGUNDA', status: 'APROVADA', texto: 'Suprime o § 2º do Art. 7º...', sugestaoIA: null },
    { id: '4', numero: 1, tipo: 'MODIFICATIVA', propositura: 'PL 18/2026', autor: 'Ver. Ana Lima', fase: 'PRIMEIRA', status: 'REJEITADA', texto: 'Modifica a redação do inciso II do Art. 2º...', sugestaoIA: 'Conflito com Art. 41 da LOMAN.' },
];

const TIPO_COLORS: Record<string, string> = {
    SUPRESSIVA: 'bg-red-500/20 text-red-400 border-red-500/30',
    SUBSTITUTIVA: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    ADITIVA: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    MODIFICATIVA: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function EmendasPage() {
    const [filter, setFilter] = useState<string>('ALL');

    const filtered = filter === 'ALL' ? mockEmendas : mockEmendas.filter(e => e.tipo === filter);

    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        Gestão de Emendas
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Emendas supressivas, substitutivas, aditivas e modificativas</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" /> Nova Emenda
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
                {TIPOS.map(tipo => (
                    <div key={tipo} className={`border rounded-xl p-4 cursor-pointer transition-all ${filter === tipo ? 'ring-2 ring-teal-500' : ''} ${TIPO_COLORS[tipo]}`}
                        onClick={() => setFilter(filter === tipo ? 'ALL' : tipo)}>
                        <p className="text-xs uppercase font-medium">{tipo}</p>
                        <p className="text-2xl font-bold mt-1">{mockEmendas.filter(e => e.tipo === tipo).length}</p>
                    </div>
                ))}
            </div>

            {/* Tabela */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left text-xs font-medium text-zinc-400 uppercase p-4">Nº</th>
                                <th className="text-left text-xs font-medium text-zinc-400 uppercase p-4">Tipo</th>
                                <th className="text-left text-xs font-medium text-zinc-400 uppercase p-4">Propositura</th>
                                <th className="text-left text-xs font-medium text-zinc-400 uppercase p-4">Autor</th>
                                <th className="text-left text-xs font-medium text-zinc-400 uppercase p-4">Fase</th>
                                <th className="text-left text-xs font-medium text-zinc-400 uppercase p-4">Status</th>
                                <th className="text-left text-xs font-medium text-zinc-400 uppercase p-4">IA</th>
                                <th className="text-left text-xs font-medium text-zinc-400 uppercase p-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {filtered.map((emenda) => (
                                <tr key={emenda.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4 text-sm text-white font-medium">{emenda.numero}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TIPO_COLORS[emenda.tipo]}`}>{emenda.tipo}</span>
                                    </td>
                                    <td className="p-4 text-sm text-zinc-300">{emenda.propositura}</td>
                                    <td className="p-4 text-sm text-zinc-300">{emenda.autor}</td>
                                    <td className="p-4 text-xs text-zinc-400">{emenda.fase}ª</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[emenda.status as keyof typeof STATUS_COLORS]}`}>
                                            {emenda.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {emenda.sugestaoIA ? (
                                            <span className="flex items-center gap-1 text-xs text-violet-400">
                                                <Sparkles className="w-3 h-3" /> Análise
                                            </span>
                                        ) : <span className="text-xs text-zinc-600">—</span>}
                                    </td>
                                    <td className="p-4">
                                        <button className="text-zinc-400 hover:text-white transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
