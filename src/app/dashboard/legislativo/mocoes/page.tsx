'use client';

import React, { useState } from 'react';
import { Heart, Plus, Users } from 'lucide-react';

const TIPO_COLORS: Record<string, { label: string; emoji: string; color: string }> = {
    SOLIDARIEDADE: { label: 'Solidariedade', emoji: '🤝', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    PROTESTO: { label: 'Protesto', emoji: '✊', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
    DESAGRAVO: { label: 'Desagravo', emoji: '⚖️', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    PARABENIZACAO: { label: 'Parabenização', emoji: '🎉', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    REPUDIO: { label: 'Repúdio', emoji: '🚫', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
    PESAR: { label: 'Pesar', emoji: '🕊️', color: 'bg-zinc-600/20 text-zinc-300 border-zinc-600' },
};

const mockMocoes = [
    { id: '1', tipo: 'SOLIDARIEDADE', autor: 'Ver. Maria Oliveira', destinatario: 'Hospital Municipal', texto: 'Moção de solidariedade aos profissionais de saúde...', status: 'APROVADA', data: '2026-02-05' },
    { id: '2', tipo: 'PARABENIZACAO', autor: 'Ver. Carlos H. Silva', destinatario: 'Escola Municipal Prof. Ana', texto: 'Moção de parabenização pelo 1º lugar na Olimpíada de Matemática...', status: 'APROVADA', data: '2026-02-08' },
    { id: '3', tipo: 'REPUDIO', autor: 'Ver. José A. Neto', destinatario: 'Governo Federal', texto: 'Moção de repúdio aos cortes no orçamento da educação...', status: 'PROTOCOLADA', data: '2026-02-10' },
    { id: '4', tipo: 'PESAR', autor: 'Mesa Diretora', destinatario: 'Família do Ex-Ver. Alberto', texto: 'Moção de pesar pelo falecimento do Ex-Vereador Alberto Mendes...', status: 'APROVADA', data: '2026-02-01' },
];

import { formatDate } from '@/lib/utils';

export default function MocoesPage() {
    const [filtro, setFiltro] = useState('TODOS');
    const filtered = mockMocoes.filter(m => filtro === 'TODOS' || m.tipo === filtro);

    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        Moções
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Solidariedade, protesto, desagravo, parabenização, repúdio e pesar — Art. 169</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg">
                    <Plus className="w-4 h-4" /> Nova Moção
                </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {['TODOS', ...Object.keys(TIPO_COLORS)].map(t => (
                    <button key={t} onClick={() => setFiltro(t)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all ${filtro === t ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'}`}>
                        {t === 'TODOS' ? 'Todas' : `${TIPO_COLORS[t]?.emoji} ${TIPO_COLORS[t]?.label}`}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filtered.map(m => {
                    const tc = TIPO_COLORS[m.tipo];
                    return (
                        <div key={m.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${tc?.color}`}>
                                            {tc?.emoji} {tc?.label}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${m.status === 'APROVADA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}>
                                            {m.status === 'APROVADA' ? '✓ Aprovada' : '● Protocolada'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-300">{m.texto}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{m.autor}</span>
                                        <span>Para: <span className="text-zinc-300">{m.destinatario}</span></span>
                                        <span>{formatDate(m.data)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
