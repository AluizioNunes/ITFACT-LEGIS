"use client";

import React, { useState } from "react";
import { GitBranch, GitMerge, History, ArrowLeftRight, RotateCcw } from "lucide-react";

const mockVersoes = [
    { numero: 4, descricao: "Aprovação em 2ª Discussão — texto final", autor: "CCJ / Ver. Maria Lima", data: "10/02/2026 16:30", linhasAdd: 2, linhasRem: 5, status: "ATUAL" },
    { numero: 3, descricao: "Emenda Substitutiva nº 002 — Art. 5º reescrito", autor: "Ver. José Antônio", data: "05/02/2026 14:15", linhasAdd: 12, linhasRem: 8, status: "SUPERSEDED" },
    { numero: 2, descricao: "Emenda Aditiva nº 001 — novo Art. 7º", autor: "Ver. Ana Paula Costa", data: "28/01/2026 09:40", linhasAdd: 15, linhasRem: 0, status: "SUPERSEDED" },
    { numero: 1, descricao: "Versão original — texto do autor", autor: "Ver. Carlos Alberto", data: "20/01/2026 08:00", linhasAdd: 48, linhasRem: 0, status: "ORIGINAL" },
];

const mockDiff = `--- Versão 3 (05/02/2026)
+++ Versão 4 (10/02/2026)

 Art. 1º — Esta Lei institui a Política Municipal de Saneamento Básico.

-Art. 5º — O Plano Municipal de Saneamento será revisado a cada 5 (cinco) anos.
+Art. 5º — O Plano Municipal de Saneamento será revisado a cada 4 (quatro) anos, com audiência pública obrigatória.

 Art. 6º — Fica criado o Fundo Municipal de Saneamento.

-Art. 8º — As tarifas serão definidas pelo Executivo.
+Art. 8º — As tarifas serão definidas pelo Conselho Municipal de Saneamento, com participação da sociedade civil.
-Art. 8º §1 — (sem parágrafo)
+Art. 8º §1 — O Conselho será composto por representantes do poder público, empresas concessionárias e sociedade civil organizada.`;

export default function VersioningPage() {
    const [versaoA, setVersaoA] = useState(3);
    const [versaoB, setVersaoB] = useState(4);

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-teal-500/20 to-green-500/20 border border-teal-500/30 rounded-xl"><GitBranch size={24} className="text-teal-400" /></div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">Versioning — Git de Leis</h1>
                    <p className="text-zinc-500 text-sm">Controle de versão de textos legislativos • PL 012/2026</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline de versões */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2"><History size={18} className="text-teal-400" /> Histórico de Versões</h2>
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800" />
                        {mockVersoes.map((v, i) => (
                            <div key={i} className="relative pl-10 pb-6">
                                <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${v.status === "ATUAL" ? "bg-teal-400 border-teal-400" : "bg-zinc-800 border-zinc-600"}`} />
                                <div className={`bg-zinc-900/80 border rounded-xl p-4 cursor-pointer transition-colors ${v.status === "ATUAL" ? "border-teal-500/40 bg-teal-500/5" : "border-zinc-800 hover:border-zinc-600"}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold text-teal-400">v{v.numero}</span>
                                        {v.status === "ATUAL" && <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full">ATUAL</span>}
                                        {v.status === "ORIGINAL" && <span className="text-[10px] bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">ORIGINAL</span>}
                                    </div>
                                    <div className="text-sm font-medium mb-1">{v.descricao}</div>
                                    <div className="text-xs text-zinc-500">{v.autor}</div>
                                    <div className="text-xs text-zinc-600 mt-1">{v.data}</div>
                                    <div className="flex items-center gap-3 mt-2 text-xs">
                                        <span className="text-emerald-400">+{v.linhasAdd} linhas</span>
                                        {v.linhasRem > 0 && <span className="text-red-400">-{v.linhasRem} linhas</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors"><RotateCcw size={14} /> Restaurar Versão Anterior</button>
                </div>

                {/* Diff viewer */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2"><ArrowLeftRight size={18} className="text-teal-400" /> Comparar Versões</h2>
                        <div className="flex items-center gap-2 text-sm">
                            <select value={versaoA} onChange={e => setVersaoA(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-white outline-none">
                                {mockVersoes.map(v => <option key={v.numero} value={v.numero}>v{v.numero}</option>)}
                            </select>
                            <span className="text-zinc-500">→</span>
                            <select value={versaoB} onChange={e => setVersaoB(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-white outline-none">
                                {mockVersoes.map(v => <option key={v.numero} value={v.numero}>v{v.numero}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
                        <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                            <span className="text-sm font-medium">Diff: v{versaoA} → v{versaoB}</span>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="text-emerald-400">+3 adições</span>
                                <span className="text-red-400">-3 remoções</span>
                            </div>
                        </div>
                        <pre className="p-4 text-sm font-mono overflow-x-auto leading-6">
                            {mockDiff.split('\n').map((line, i) => {
                                let cls = "text-zinc-400";
                                if (line.startsWith('+')) cls = "text-emerald-400 bg-emerald-500/10";
                                if (line.startsWith('-')) cls = "text-red-400 bg-red-500/10";
                                if (line.startsWith('@@') || line.startsWith('---') || line.startsWith('+++')) cls = "text-blue-400";
                                return <div key={i} className={`px-2 ${cls}`}>{line || ' '}</div>;
                            })}
                        </pre>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
                        <h3 className="text-sm font-bold mb-2 flex items-center gap-2"><GitMerge size={14} className="text-teal-400" /> Resumo das Alterações</h3>
                        <p className="text-xs text-zinc-400">
                            Na versão 4, a revisão do Plano Municipal foi reduzida de 5 para 4 anos com audiência pública obrigatória.
                            A definição de tarifas foi transferida do Executivo para o Conselho Municipal de Saneamento com participação social.
                            Adicionado §1 ao Art. 8º definindo composição do Conselho.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
