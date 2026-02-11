"use client";

import React, { useState } from "react";
import { Shield, FileSearch, AlertTriangle, CheckCircle, Clock, Download, ExternalLink, Calendar, ChevronRight } from "lucide-react";

const mockPareceres = [
    { exercicio: 2025, parecer: "COM_RESSALVAS", relator: "Cons. Ricardo Menezes", data: "15/11/2025", processo: "TCE-2025/00847", irregularidades: 3, recomendacoes: 8, status: "VOTADO_CAMARA" },
    { exercicio: 2024, parecer: "FAVORAVEL", relator: "Cons. Ana Claudia Santos", data: "20/10/2024", processo: "TCE-2024/00612", irregularidades: 0, recomendacoes: 4, status: "APROVADO" },
    { exercicio: 2023, parecer: "COM_RESSALVAS", relator: "Cons. Paulo Henrique", data: "12/09/2023", processo: "TCE-2023/00498", irregularidades: 5, recomendacoes: 12, status: "APROVADO" },
    { exercicio: 2022, parecer: "CONTRARIO", relator: "Cons. Maria Alice Farias", data: "08/08/2022", processo: "TCE-2022/00351", irregularidades: 11, recomendacoes: 15, status: "REJEITADO" },
];

const etapas = [
    { etapa: "1. Envio da Prestação de Contas", prazo: "31/03/2027", status: "PENDENTE" },
    { etapa: "2. Análise Técnica", prazo: "90 dias após recebimento", status: "PENDENTE" },
    { etapa: "3. Parecer do Relator", prazo: "60 dias após análise", status: "PENDENTE" },
    { etapa: "4. Julgamento em Plenário do TCE", prazo: "Calendário do TCE", status: "PENDENTE" },
    { etapa: "5. Envio à Câmara Municipal", prazo: "15 dias após julgamento", status: "PENDENTE" },
];

const parecerCor: Record<string, string> = {
    FAVORAVEL: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    COM_RESSALVAS: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    CONTRARIO: "bg-red-500/20 text-red-400 border-red-500/40",
};

const parecerLabel: Record<string, string> = {
    FAVORAVEL: "✅ Favorável",
    COM_RESSALVAS: "⚠️ Com Ressalvas",
    CONTRARIO: "❌ Contrário",
};

export default function TceAmPage() {
    const [exercicioAtual] = useState(2026);

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl"><Shield size={24} className="text-orange-400" /></div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">TCE-AM — Tribunal de Contas</h1>
                    <p className="text-zinc-500 text-sm">Pareceres sobre Contas do Executivo Municipal • LOMAN art. 23</p>
                </div>
            </div>

            {/* Exercício atual */}
            <div className="bg-zinc-900/80 border border-orange-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2"><Calendar size={18} className="text-orange-400" /> Exercício {exercicioAtual} — Prestação de Contas</h2>
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-medium">Em Andamento</span>
                </div>
                <div className="space-y-3">
                    {etapas.map((e, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${e.status === "CONCLUIDO" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>{i + 1}</div>
                            <div className="flex-1">
                                <div className="text-sm font-medium">{e.etapa}</div>
                                <div className="text-xs text-zinc-500">Prazo: {e.prazo}</div>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === "CONCLUIDO" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>{e.status === "CONCLUIDO" ? "✓" : "Pendente"}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Histórico de pareceres */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileSearch size={20} className="text-orange-400" /> Histórico de Pareceres TCE-AM</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPareceres.map((p, i) => (
                    <div key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-orange-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-zinc-300">Exercício {p.exercicio}</span>
                            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${parecerCor[p.parecer]}`}>{parecerLabel[p.parecer]}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-zinc-500">Relator:</span><span className="text-zinc-300">{p.relator}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-500">Data Julgamento:</span><span className="text-zinc-300">{p.data}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-500">Processo:</span><span className="text-zinc-300">{p.processo}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-500">Irregularidades:</span><span className={p.irregularidades > 5 ? "text-red-400 font-bold" : "text-zinc-300"}>{p.irregularidades}</span></div>
                            <div className="flex justify-between"><span className="text-zinc-500">Recomendações:</span><span className="text-zinc-300">{p.recomendacoes}</span></div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "APROVADO" ? "bg-emerald-500/20 text-emerald-400" : p.status === "REJEITADO" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>{p.status.replace("_", " ")}</span>
                            <button className="text-xs text-orange-400 flex items-center gap-1 hover:underline"><Download size={12} /> Baixar Parecer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
