'use client';

import React from 'react';
import { Mic, Users, Plus, MessageSquare, Timer } from 'lucide-react';

const mockTribuna = [
    { id: '1', sessao: 'SO #14/2026', entidade: 'Assoc. Moradores do Centro', representante: 'João Lima', tema: 'Pavimentação da Rua XV de Novembro', tempo: 10, status: 'CONCLUIDO' },
    { id: '2', sessao: 'SO #14/2026', entidade: 'OAB-AM Subseção', representante: 'Dra. Fátima Reis', tema: 'Regulamentação do Plano Diretor', tempo: 10, status: 'INSCRITO' },
    { id: '3', sessao: 'SO #14/2026', entidade: 'Sindicato dos Professores', representante: 'Prof. Miguel Castro', tema: 'Reajuste salarial dos docentes municipais', tempo: 10, status: 'INSCRITO' },
];

const mockExpedientes = [
    { id: '1', tipo: 'PEQUENO', vereador: 'Carlos H. Silva', assunto: 'Homenagem ao Dia do Professor', tempo: 5 },
    { id: '2', tipo: 'GRANDE', vereador: 'Maria Oliveira', assunto: 'Debate sobre segurança no transporte público', tempo: 15 },
    { id: '3', tipo: 'PEQUENO', vereador: 'José A. Neto', assunto: 'Obras inacabadas no bairro Flores', tempo: 5 },
];

export default function TribunaPage() {
    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        Tribuna Popular & Expedientes
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Participação popular e oratória regimental — Arts. 131-134</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg">
                    <Plus className="w-4 h-4" /> Nova Inscrição
                </button>
            </div>

            {/* Tribuna Popular */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" /> Tribuna Popular
                </h2>
                <div className="space-y-3">
                    {mockTribuna.map(t => (
                        <div key={t.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">{t.sessao}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${t.status === 'CONCLUIDO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}>
                                            {t.status === 'CONCLUIDO' ? '✓ Concluído' : '● Inscrito'}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-medium text-white">{t.tema}</h3>
                                    <p className="text-xs text-zinc-400 mt-1">{t.entidade} — {t.representante}</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded-lg">
                                    <Timer className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm font-medium text-white">{t.tempo} min</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expedientes */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-violet-400" /> Expedientes
                </h2>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Tipo</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Vereador</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Assunto</th>
                                <th className="text-center px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Tempo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {mockExpedientes.map(e => (
                                <tr key={e.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${e.tipo === 'PEQUENO' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-violet-500/10 text-violet-400 border-violet-500/30'}`}>
                                            {e.tipo === 'PEQUENO' ? 'Pequeno' : 'Grande'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-white">{e.vereador}</td>
                                    <td className="px-5 py-4 text-sm text-zinc-300">{e.assunto}</td>
                                    <td className="text-center px-5 py-4 text-sm text-zinc-400">{e.tempo} min</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
