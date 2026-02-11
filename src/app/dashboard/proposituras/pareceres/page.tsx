'use client';

import React from 'react';
import { BookOpen, Clock, CheckCircle2, AlertTriangle, Users, Sparkles, FileCheck, XCircle } from 'lucide-react';

const mockPareceres = [
    { id: '1', propositura: 'PL 42/2026', comissao: 'CCJ', tipo: 'CONSTITUCIONALIDADE', relator: 'Ver. João Silva', status: 'COM_RELATOR', prazo: '15/03/2026', diasRestantes: 12, sugestaoIA: true },
    { id: '2', propositura: 'PL 42/2026', comissao: 'C. Educação', tipo: 'MERITO', relator: null, status: 'AGUARDANDO_RELATOR', prazo: '20/03/2026', diasRestantes: 17, sugestaoIA: false },
    { id: '3', propositura: 'PL 18/2026', comissao: 'CCJ', tipo: 'CONSTITUCIONALIDADE', relator: 'Ver. Maria Souza', status: 'PARECER_EMITIDO', prazo: '05/03/2026', diasRestantes: 0, sugestaoIA: true },
    { id: '4', propositura: 'PLC 7/2026', comissao: 'C. Finanças', tipo: 'FINANCEIRO', relator: 'Ver. Pedro Costa', status: 'APROVADO_COMISSAO', prazo: '01/03/2026', diasRestantes: -2, sugestaoIA: false },
    { id: '5', propositura: 'PL 91/2025', comissao: 'C. Meio Ambiente', tipo: 'MERITO', relator: null, status: 'PRAZO_VENCIDO', prazo: '01/02/2026', diasRestantes: -30, sugestaoIA: true },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    AGUARDANDO_RELATOR: { label: 'Aguardando Relator', color: 'bg-zinc-500/20 text-zinc-400', icon: Clock },
    COM_RELATOR: { label: 'Com Relator', color: 'bg-blue-500/20 text-blue-400', icon: Users },
    PARECER_EMITIDO: { label: 'Parecer Emitido', color: 'bg-amber-500/20 text-amber-400', icon: FileCheck },
    APROVADO_COMISSAO: { label: 'Aprovado', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
    REJEITADO_COMISSAO: { label: 'Rejeitado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
    PRAZO_VENCIDO: { label: 'Prazo Vencido', color: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
};

export default function PareceresPage() {
    const pendentes = mockPareceres.filter(p => ['AGUARDANDO_RELATOR', 'COM_RELATOR'].includes(p.status)).length;
    const emitidos = mockPareceres.filter(p => p.status === 'PARECER_EMITIDO').length;
    const vencidos = mockPareceres.filter(p => p.status === 'PRAZO_VENCIDO').length;

    return (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        Pareceres de Comissão
                    </h1>
                    <p className="text-zinc-400 mt-1 ml-14">Acompanhamento de pareceres com prazos automáticos</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <span className="text-sm text-zinc-400">Total</span>
                    <p className="text-2xl font-bold text-white mt-1">{mockPareceres.length}</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <span className="text-sm text-zinc-400">Pendentes</span>
                    <p className="text-2xl font-bold text-blue-400 mt-1">{pendentes}</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <span className="text-sm text-zinc-400">Emitidos</span>
                    <p className="text-2xl font-bold text-amber-400 mt-1">{emitidos}</p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <span className="text-sm text-zinc-400">Prazos Vencidos</span>
                    <p className="text-2xl font-bold text-red-400 mt-1">{vencidos}</p>
                </div>
            </div>

            {/* Lista de Pareceres */}
            <div className="space-y-3">
                {mockPareceres.map((parecer) => {
                    const config = STATUS_CONFIG[parecer.status] || STATUS_CONFIG.AGUARDANDO_RELATOR;
                    const StatusIcon = config.icon;

                    return (
                        <div key={parecer.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-indigo-500/30 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${config.color}`}>
                                        <StatusIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">{parecer.propositura}</h3>
                                        <p className="text-xs text-zinc-400 mt-0.5">{parecer.comissao} — {parecer.tipo.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {parecer.sugestaoIA && (
                                        <div className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-1">
                                            <Sparkles className="w-3 h-3 text-violet-400" />
                                            <span className="text-xs text-violet-300">Sugestão IA</span>
                                        </div>
                                    )}
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${config.color}`}>{config.label}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="text-xs text-zinc-500 uppercase">Relator</span>
                                        <p className="text-sm text-white mt-0.5">{parecer.relator || 'A designar'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-zinc-500 uppercase">Prazo</span>
                                        <p className={`text-sm mt-0.5 ${parecer.diasRestantes < 0 ? 'text-red-400' : parecer.diasRestantes < 5 ? 'text-amber-400' : 'text-white'}`}>
                                            {parecer.prazo}
                                            {parecer.diasRestantes > 0 && ` (${parecer.diasRestantes} dias)`}
                                            {parecer.diasRestantes < 0 && ` (vencido ${Math.abs(parecer.diasRestantes)}d)`}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                                    Ver detalhes →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
