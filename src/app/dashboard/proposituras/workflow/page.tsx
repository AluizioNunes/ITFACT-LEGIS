'use client';

import React, { useState } from 'react';
import {
    GitBranch, ArrowRight, Clock, AlertTriangle, CheckCircle2, XCircle,
    FileText, Users, Gavel, BookOpen, Send, Shield, Sparkles, ChevronRight,
    Play, Pause, SkipForward
} from 'lucide-react';

// Estado visual de cada fase do workflow
const FASES = [
    { id: 'PROTOCOLO', label: 'Protocolo', icon: FileText, color: 'from-slate-500 to-slate-600' },
    { id: 'DELIBERACAO', label: 'Deliberação', icon: Users, color: 'from-blue-500 to-blue-600' },
    { id: 'COMISSAO_CCJ', label: 'CCJ', icon: Shield, color: 'from-purple-500 to-purple-600' },
    { id: 'COMISSAO_MERITO', label: 'Comissão Mérito', icon: BookOpen, color: 'from-indigo-500 to-indigo-600' },
    { id: 'COMISSAO_FINANCAS', label: 'Finanças', icon: FileText, color: 'from-cyan-500 to-cyan-600' },
    { id: 'PRIMEIRA_DISCUSSAO', label: '1ª Discussão', icon: Gavel, color: 'from-amber-500 to-amber-600' },
    { id: 'SEGUNDA_DISCUSSAO', label: '2ª Discussão', icon: Gavel, color: 'from-orange-500 to-orange-600' },
    { id: 'REDACAO_FINAL', label: 'Redação Final', icon: FileText, color: 'from-teal-500 to-teal-600' },
    { id: 'ENVIADO_PREFEITO', label: 'Prefeito', icon: Send, color: 'from-rose-500 to-rose-600' },
    { id: 'PROMULGADO', label: 'Promulgado', icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
    { id: 'PUBLICADO', label: 'Publicado', icon: CheckCircle2, color: 'from-green-500 to-green-600' },
];

// Mock proposituras demonstrando diferentes fases
const mockProposituras = [
    { id: '1', numero: 42, ano: 2026, tipo: 'PL', ementa: 'Programa de reciclagem seletiva nas escolas municipais', faseAtual: 'COMISSAO_MERITO', regime: 'ORDINARIO', urgente: false, alertas: 1 },
    { id: '2', numero: 18, ano: 2026, tipo: 'PLC', ementa: 'Alteração do Código Tributário Municipal', faseAtual: 'PRIMEIRA_DISCUSSAO', regime: 'URGENCIA', urgente: true, alertas: 0 },
    { id: '3', numero: 7, ano: 2026, tipo: 'PR', ementa: 'Criação da Comissão Especial de Educação Digital', faseAtual: 'REDACAO_FINAL', regime: 'ORDINARIO', urgente: false, alertas: 0 },
    { id: '4', numero: 91, ano: 2025, tipo: 'PL', ementa: 'Desconto no IPTU para imóveis com energia solar', faseAtual: 'ENVIADO_PREFEITO', regime: 'ORDINARIO', urgente: false, alertas: 2 },
    { id: '5', numero: 33, ano: 2026, tipo: 'PL', ementa: 'Regulamentação do transporte por aplicativo', faseAtual: 'PROTOCOLO', regime: 'PRAZO_FATAL', urgente: false, alertas: 0 },
];

const KPI_DATA = [
    { label: 'Em Tramitação', value: 23, icon: GitBranch, color: 'text-blue-400' },
    { label: 'Em Comissões', value: 8, icon: Users, color: 'text-purple-400' },
    { label: 'Urgência', value: 3, icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'Promulgadas', value: 45, icon: CheckCircle2, color: 'text-emerald-400' },
];

export default function WorkflowPage() {
    const [selectedProp, setSelectedProp] = useState(mockProposituras[0]);

    const faseIndex = FASES.findIndex(f => f.id === selectedProp.faseAtual);

    return (
        <div className="space-y-6 p-1">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                            <GitBranch className="w-6 h-6 text-white" />
                        </div>
                        Workflow Legislativo
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Motor de estados para ciclo de vida das proposituras</p>
                </div>
                <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span className="text-sm text-violet-300">IA ativa: classificação automática</span>
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

            {/* Workflow Pipeline Visual */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Pipeline: {selectedProp.tipo} {selectedProp.numero}/{selectedProp.ano}</h2>
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                    {FASES.map((fase, i) => {
                        const isCompleted = i < faseIndex;
                        const isCurrent = i === faseIndex;
                        const Icon = fase.icon;

                        return (
                            <React.Fragment key={fase.id}>
                                <div className={`flex-shrink-0 flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all duration-300 min-w-[100px]
                                    ${isCurrent ? `bg-gradient-to-br ${fase.color} border-transparent shadow-lg scale-105` :
                                        isCompleted ? 'bg-emerald-500/10 border-emerald-500/30' :
                                            'bg-zinc-800/40 border-zinc-700/50 opacity-50'}`}>
                                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-zinc-500'}`} />
                                    <span className={`text-xs font-medium text-center ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                        {fase.label}
                                    </span>
                                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                    {isCurrent && <Play className="w-3 h-3 text-white animate-pulse" />}
                                </div>
                                {i < FASES.length - 1 && (
                                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${i < faseIndex ? 'text-emerald-400' : 'text-zinc-600'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Lista de Proposituras */}
                <div className="col-span-1 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                    <div className="p-4 border-b border-zinc-800">
                        <h3 className="text-base font-semibold text-white">Proposituras Ativas</h3>
                    </div>
                    <div className="divide-y divide-zinc-800">
                        {mockProposituras.map((prop) => (
                            <button
                                key={prop.id}
                                onClick={() => setSelectedProp(prop)}
                                className={`w-full text-left p-4 hover:bg-zinc-800/50 transition-colors ${selectedProp.id === prop.id ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-white">{prop.tipo} {prop.numero}/{prop.ano}</span>
                                    <div className="flex items-center gap-1">
                                        {prop.urgente && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                                        {prop.alertas > 0 && (
                                            <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">{prop.alertas}</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{prop.ementa}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${prop.regime === 'URGENCIA' ? 'bg-amber-500/20 text-amber-400' :
                                            prop.regime === 'PRAZO_FATAL' ? 'bg-red-500/20 text-red-400' :
                                                'bg-zinc-700 text-zinc-400'
                                        }`}>
                                        {prop.regime}
                                    </span>
                                    <span className="text-xs text-zinc-500">{prop.faseAtual.replace(/_/g, ' ')}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detalhes + Ações */}
                <div className="col-span-2 space-y-4">
                    {/* Detalhes da Propositura */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                                {selectedProp.tipo} {selectedProp.numero}/{selectedProp.ano}
                            </h3>
                            <div className="flex items-center gap-2">
                                {selectedProp.urgente && (
                                    <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> URGÊNCIA
                                    </span>
                                )}
                                <span className="bg-violet-500/20 text-violet-300 text-xs px-3 py-1 rounded-full">
                                    {selectedProp.faseAtual.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>
                        <p className="text-zinc-300">{selectedProp.ementa}</p>

                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-800">
                            <div>
                                <span className="text-xs text-zinc-500 uppercase">Regime</span>
                                <p className="text-sm text-white mt-1">{selectedProp.regime.replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <span className="text-xs text-zinc-500 uppercase">Fase Atual</span>
                                <p className="text-sm text-white mt-1">{selectedProp.faseAtual.replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <span className="text-xs text-zinc-500 uppercase">Alertas</span>
                                <p className="text-sm text-white mt-1">{selectedProp.alertas} pendente(s)</p>
                            </div>
                        </div>
                    </div>

                    {/* Ações do Workflow */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                            <SkipForward className="w-4 h-4 text-violet-400" />
                            Transições Disponíveis
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['Avançar para próxima fase', 'Enviar para comissão', 'Iniciar discussão', 'Solicitar urgência'].map((action) => (
                                <button key={action} className="flex items-center gap-3 p-3 bg-zinc-800/60 hover:bg-violet-500/10 border border-zinc-700 hover:border-violet-500/30 rounded-xl transition-all group">
                                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{action}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* IA Insights */}
                    <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                            Análise IA
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                                <p className="text-sm text-zinc-300">Classificação: <span className="text-white font-medium">{selectedProp.tipo}</span> (confiança: 92%)</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                                <p className="text-sm text-zinc-300">Atenção: possível impacto orçamentário — verificar fonte de custeio</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
                                <p className="text-sm text-zinc-300">Tempo estimado até promulgação: <span className="text-white font-medium">45 dias</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
