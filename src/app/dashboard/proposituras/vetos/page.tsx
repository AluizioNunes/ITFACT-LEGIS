'use client';

import React from 'react';
import { ShieldAlert, Clock, CheckCircle2, XCircle, Gavel, AlertTriangle, Sparkles, Calendar } from 'lucide-react';

const mockVetos = [
    { id: '1', propositura: 'PL 91/2025', tipo: 'PARCIAL', razoes: 'Incompatibilidade com o orçamento municipal para o exercício de 2026, conforme parecer da Secretaria de Finanças.', artigosVetados: 'Art. 3º, Art. 5º §2º', dataRecebimento: '01/02/2026', prazo30dias: '03/03/2026', diasRestantes: 8, resultado: 'PENDENTE', analiseIA: 'O veto parcial tem fundamentos orçamentários. Artigos vetados representam ~40% do impacto financeiro.' },
    { id: '2', propositura: 'PL 55/2025', tipo: 'TOTAL', razoes: 'Vício de iniciativa — matéria de competência exclusiva do Poder Executivo nos termos do Art. 53 §1 da LOMAN.', artigosVetados: null, dataRecebimento: '15/01/2026', prazo30dias: '14/02/2026', diasRestantes: -8, resultado: 'PENDENTE', analiseIA: 'Veto fundamentado em vício de iniciativa. Jurisprudência majoritária apoia a tese do Executivo.' },
    { id: '3', propositura: 'PL 23/2025', tipo: 'TOTAL', razoes: 'Contrariedade ao interesse público.', artigosVetados: null, dataRecebimento: '01/12/2025', prazo30dias: '31/12/2025', diasRestantes: 0, resultado: 'REJEITADO', analiseIA: null },
    { id: '4', propositura: 'PL 12/2025', tipo: 'PARCIAL', razoes: 'Inadequação técnica de dispositivos.', artigosVetados: 'Art. 8º', dataRecebimento: '10/11/2025', prazo30dias: '10/12/2025', diasRestantes: 0, resultado: 'MANTIDO', analiseIA: null },
];

export default function VetosPage() {
    const pendentes = mockVetos.filter(v => v.resultado === 'PENDENTE').length;
    const vencidos = mockVetos.filter(v => v.resultado === 'PENDENTE' && v.diasRestantes < 0).length;

    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        Vetos do Executivo
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Fluxo de veto, deliberação e promulgação (Arts. 223-230)</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <span className="text-sm text-zinc-400">Total</span>
                    <p className="text-2xl font-bold text-white mt-1">{mockVetos.length}</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <span className="text-sm text-zinc-400">Pendentes</span>
                    <p className="text-2xl font-bold text-amber-400 mt-1">{pendentes}</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <span className="text-sm text-zinc-400">Prazo Vencido</span>
                    <p className="text-2xl font-bold text-red-400 mt-1">{vencidos}</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <span className="text-sm text-zinc-400">Rejeitados</span>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{mockVetos.filter(v => v.resultado === 'REJEITADO').length}</p>
                </div>
            </div>

            {/* Vetos List */}
            <div className="space-y-4">
                {mockVetos.map((veto) => (
                    <div key={veto.id} className={`bg-zinc-900/60 border rounded-xl p-6 transition-all ${veto.resultado === 'PENDENTE' && veto.diasRestantes < 0
                            ? 'border-red-500/40 bg-red-500/5'
                            : veto.resultado === 'PENDENTE'
                                ? 'border-amber-500/30'
                                : 'border-zinc-800'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${veto.resultado === 'PENDENTE' ? 'bg-amber-500/20' :
                                        veto.resultado === 'REJEITADO' ? 'bg-emerald-500/20' : 'bg-zinc-500/20'
                                    }`}>
                                    {veto.tipo === 'TOTAL' ? <XCircle className={`w-5 h-5 ${veto.resultado === 'PENDENTE' ? 'text-amber-400' : veto.resultado === 'REJEITADO' ? 'text-emerald-400' : 'text-zinc-400'
                                        }`} /> : <ShieldAlert className={`w-5 h-5 ${veto.resultado === 'PENDENTE' ? 'text-amber-400' : veto.resultado === 'REJEITADO' ? 'text-emerald-400' : 'text-zinc-400'
                                            }`} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-semibold text-white">{veto.propositura}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${veto.tipo === 'TOTAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                                            }`}>{veto.tipo}</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 mt-1 max-w-xl line-clamp-2">{veto.razoes}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${veto.resultado === 'PENDENTE' ? 'bg-amber-500/20 text-amber-400' :
                                        veto.resultado === 'REJEITADO' ? 'bg-emerald-500/20 text-emerald-400' :
                                            'bg-zinc-500/20 text-zinc-400'
                                    }`}>{veto.resultado}</span>
                                {veto.resultado === 'PENDENTE' && (
                                    <span className={`text-xs ${veto.diasRestantes < 0 ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
                                        {veto.diasRestantes > 0 ? `${veto.diasRestantes} dias restantes` : `Vencido há ${Math.abs(veto.diasRestantes)} dias`}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Detalhes */}
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-800">
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <Calendar className="w-3.5 h-3.5" /> Recebido: {veto.dataRecebimento}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <Clock className="w-3.5 h-3.5" /> Prazo: {veto.prazo30dias}
                            </div>
                            {veto.artigosVetados && (
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <AlertTriangle className="w-3.5 h-3.5" /> Vetados: {veto.artigosVetados}
                                </div>
                            )}
                        </div>

                        {/* IA Insight */}
                        {veto.analiseIA && (
                            <div className="mt-3 bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-violet-300">{veto.analiseIA}</p>
                            </div>
                        )}

                        {/* Ações */}
                        {veto.resultado === 'PENDENTE' && (
                            <div className="flex items-center gap-3 mt-4">
                                <button className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-sm transition-colors">
                                    <Gavel className="w-4 h-4" /> Rejeitar Veto (Maioria Absoluta)
                                </button>
                                <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors">
                                    Manter Veto
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
