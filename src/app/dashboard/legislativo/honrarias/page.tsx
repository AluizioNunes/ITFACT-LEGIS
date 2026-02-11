'use client';

import React from 'react';
import { Award, Plus, CheckCircle2, Calendar, Users, Star, Medal, Trophy } from 'lucide-react';

const TIPO_HONRARIA: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    MEDALHA_OURO: { label: 'Medalha de Ouro', icon: Medal, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    DIPLOMA_HONRA: { label: 'Diploma de Honra', icon: Award, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    TITULO_CIDADAO: { label: 'Título de Cidadão', icon: Star, color: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
    COMENDA: { label: 'Comenda', icon: Trophy, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    VOTO_LOUVOR: { label: 'Voto de Louvor', icon: CheckCircle2, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
};

const mockHonrarias = [
    { id: '1', tipo: 'MEDALHA_OURO', homenageado: 'Dr. Roberto Almeida', justificativa: '30 anos de serviços médicos voluntários à comunidade', autor: 'Ver. Maria Oliveira', status: 'APROVADA', data: '2026-01-15', cerimonia: '2026-03-01' },
    { id: '2', tipo: 'TITULO_CIDADAO', homenageado: 'Prof. Yolanda Nakamura', justificativa: 'Contribuição excepcional à educação pública municipal', autor: 'Ver. Carlos Silva', status: 'APROVADA_COMISSAO', data: '2026-02-01', cerimonia: null },
    { id: '3', tipo: 'DIPLOMA_HONRA', homenageado: 'Associação dos Bombeiros', justificativa: 'Trabalho heróico durante as enchentes de 2025', autor: 'Mesa Diretora', status: 'PROPOSTA', data: '2026-02-10', cerimonia: null },
    { id: '4', tipo: 'VOTO_LOUVOR', homenageado: 'Escola Municipal Norte', justificativa: 'Melhor IDEB do Estado por 3 anos consecutivos', autor: 'Ver. José A. Neto', status: 'APROVADA', data: '2025-12-10', cerimonia: '2026-01-20' },
];

export default function HonrariasPage() {
    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/20">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        Honrarias & Comendas
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Medalhas, diplomas, títulos e comendas — Regimento arts. 173-174</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg">
                    <Plus className="w-4 h-4" /> Nova Honraria
                </button>
            </div>

            <div className="grid grid-cols-5 gap-3">
                {Object.entries(TIPO_HONRARIA).map(([key, val]) => (
                    <div key={key} className={`bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center hover:border-zinc-700 transition-all cursor-pointer`}>
                        <val.icon className={`w-6 h-6 mx-auto mb-1 ${val.color.split(' ')[1]}`} />
                        <p className="text-xs text-zinc-300">{val.label}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {mockHonrarias.map(h => {
                    const tc = TIPO_HONRARIA[h.tipo];
                    const TIcon = tc?.icon || Award;
                    return (
                        <div key={h.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-xl ${tc?.color.split(' ')[0]} border ${tc?.color.split(' ')[2]}`}>
                                        <TIcon className={`w-6 h-6 ${tc?.color.split(' ')[1]}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs px-2.5 py-1 rounded-full border ${tc?.color}`}>{tc?.label}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${h.status === 'APROVADA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : h.status === 'APROVADA_COMISSAO' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}>
                                                {h.status === 'APROVADA' ? '✓ Aprovada' : h.status === 'APROVADA_COMISSAO' ? '● Comissão OK' : '○ Proposta'}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-semibold text-white">{h.homenageado}</h3>
                                        <p className="text-sm text-zinc-400 mt-1">{h.justificativa}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{h.autor}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(h.data).toLocaleDateString('pt-BR')}</span>
                                            {h.cerimonia && (
                                                <span className="flex items-center gap-1 text-amber-400">
                                                    <Star className="w-3.5 h-3.5" />
                                                    Cerimônia: {new Date(h.cerimonia).toLocaleDateString('pt-BR')}
                                                </span>
                                            )}
                                        </div>
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
