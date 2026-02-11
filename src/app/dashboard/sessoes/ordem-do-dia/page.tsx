'use client';

import React from 'react';
import { ListOrdered, Sparkles, Clock, AlertTriangle, CheckCircle2, GripVertical, Play, Pause } from 'lucide-react';

const PRIORIDADE_CONFIG: Record<string, { label: string; color: string; order: number }> = {
    URGENCIA: { label: 'Urgência', color: 'bg-red-500/20 text-red-400 border-red-500/30', order: 1 },
    VETO: { label: 'Veto', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', order: 2 },
    PROJETO_LEI: { label: 'Projeto de Lei', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', order: 3 },
    REQUERIMENTO: { label: 'Requerimento', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', order: 5 },
    INDICACAO: { label: 'Indicação', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', order: 6 },
};

const mockOrdemDoDia = [
    { id: '1', ordem: 1, propositura: 'PL 18/2026', ementa: 'Alteração do Código Tributário Municipal', prioridade: 'URGENCIA', status: 'EM_DISCUSSAO', tipo: 'PLC', regime: 'URGENCIA' },
    { id: '2', ordem: 2, propositura: 'PL 55/2025', ementa: 'Deliberação sobre veto total do Executivo', prioridade: 'VETO', status: 'PENDENTE', tipo: 'VETO', regime: 'PRAZO_FATAL' },
    { id: '3', ordem: 3, propositura: 'PL 42/2026', ementa: 'Programa de reciclagem seletiva nas escolas', prioridade: 'PROJETO_LEI', status: 'PENDENTE', tipo: 'PL', regime: 'ORDINARIO' },
    { id: '4', ordem: 4, propositura: 'PR 7/2026', ementa: 'Criação da Comissão Especial de Educação Digital', prioridade: 'PROJETO_LEI', status: 'PENDENTE', tipo: 'PR', regime: 'ORDINARIO' },
    { id: '5', ordem: 5, propositura: 'REQ 12/2026', ementa: 'Informações sobre obras na Zona Leste', prioridade: 'REQUERIMENTO', status: 'PENDENTE', tipo: 'REQUERIMENTO', regime: 'ORDINARIO' },
    { id: '6', ordem: 6, propositura: 'IND 8/2026', ementa: 'Implantação de semáforos na Av. Brasil', prioridade: 'INDICACAO', status: 'PENDENTE', tipo: 'INDICACAO', regime: 'ORDINARIO' },
];

const STATUS_ICON: Record<string, React.ReactNode> = {
    PENDENTE: <Clock className="w-4 h-4 text-zinc-400" />,
    EM_DISCUSSAO: <Play className="w-4 h-4 text-emerald-400 animate-pulse" />,
    VOTADO: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    ADIADO: <Pause className="w-4 h-4 text-amber-400" />,
};

export default function OrdemDoDiaPage() {
    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                            <ListOrdered className="w-6 h-6 text-white" />
                        </div>
                        Ordem do Dia
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Montagem automática da pauta conforme prioridades regimentais (Art. 135)</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                        <Sparkles className="w-4 h-4" /> Montar Automática
                    </button>
                </div>
            </div>

            {/* Legenda de Prioridades */}
            <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(PRIORIDADE_CONFIG).map(([key, config]) => (
                    <div key={key} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${config.color}`}>
                        <span className="font-medium">{config.order}º</span>
                        <span>{config.label}</span>
                    </div>
                ))}
            </div>

            {/* Itens da Ordem do Dia */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">Sessão Ordinária — 11/02/2026</h2>
                    <span className="text-xs text-zinc-400">{mockOrdemDoDia.length} itens na pauta</span>
                </div>

                <div className="divide-y divide-zinc-800">
                    {mockOrdemDoDia.map((item) => {
                        const prioConfig = PRIORIDADE_CONFIG[item.prioridade] || PRIORIDADE_CONFIG.INDICACAO;
                        return (
                            <div key={item.id} className={`flex items-center gap-4 p-4 hover:bg-zinc-800/30 transition-colors ${item.status === 'EM_DISCUSSAO' ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500' : ''
                                }`}>
                                {/* Griphandle */}
                                <div className="text-zinc-600 cursor-grab">
                                    <GripVertical className="w-4 h-4" />
                                </div>

                                {/* Ordem */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${prioConfig.color}`}>
                                    {item.ordem}
                                </div>

                                {/* Status */}
                                <div className="flex-shrink-0">
                                    {STATUS_ICON[item.status]}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-white">{item.propositura}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${prioConfig.color}`}>
                                            {prioConfig.label}
                                        </span>
                                        {item.regime === 'URGENCIA' && (
                                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-0.5 truncate">{item.ementa}</p>
                                </div>

                                {/* Status Text */}
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.status === 'EM_DISCUSSAO' ? 'bg-emerald-500/20 text-emerald-400' :
                                        item.status === 'VOTADO' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-zinc-700/50 text-zinc-400'
                                    }`}>
                                    {item.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* IA Note */}
            <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-5">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-white">Montagem Inteligente da Pauta</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            A IA organiza automaticamente a Ordem do Dia seguindo as prioridades do Regimento:
                            1º Urgência → 2º Vetos → 3º PLs/PRs/PDLs → 4º Pareceres → 5º Requerimentos → 6º Indicações/Moções.
                            Projetos com prazo fatal são destacados para evitar sobrestamento da pauta.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
