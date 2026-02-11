"use client";

import React, { useState, useEffect } from "react";
import { Radio, Users, Vote, Play, Pause, Clock, Eye, Mic, CheckCircle, XCircle, MinusCircle, Wifi } from "lucide-react";

const mockSessao = {
    id: "SESSAO-2026-015",
    tipo: "Sessão Ordinária",
    data: "11/02/2026 — 14:00",
    presidente: "Ver. Carlos Alberto Souza",
    status: "EM_ANDAMENTO",
    itemAtual: "PL 012/2026 — Política Municipal de Saneamento",
    espectadores: 142,
    presentes: [
        { nome: "Carlos Alberto Souza", partido: "MDB", presente: true },
        { nome: "Maria das Graças Lima", partido: "PT", presente: true },
        { nome: "José Antônio Ferreira", partido: "PL", presente: true },
        { nome: "Ana Paula Costa", partido: "PSDB", presente: true },
        { nome: "Roberto Silva Neto", partido: "PP", presente: true },
        { nome: "Francisca Oliveira", partido: "PSB", presente: false },
        { nome: "Paulo Henrique Ramos", partido: "PDT", presente: true },
        { nome: "Luciana Batista", partido: "PODE", presente: true },
    ],
    votacaoAtiva: true,
    placar: { sim: 12, nao: 4, abstencao: 1, total: 17 },
    historico: [
        { item: "Expediente Leitura", resultado: "CONCLUÍDO", hora: "14:05" },
        { item: "Tribuna Popular — Assoc. Moradores", resultado: "CONCLUÍDO", hora: "14:20" },
        { item: "PL 010/2026 — Nom. Via Pública", resultado: "APROVADO — 18×2", hora: "14:35" },
        { item: "PL 011/2026 — Crédito Especial", resultado: "APROVADO — 15×5", hora: "14:50" },
    ],
    oradorAtivo: { nome: "José Antônio Ferreira", tipo: "Discussão", inicio: "15:02" },
};

export default function PainelAoVivoPage() {
    const [sessao] = useState(mockSessao);
    const [pulso, setPulso] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => setPulso(p => !p), 1500);
        return () => clearInterval(interval);
    }, []);

    const percentSim = sessao.placar.total > 0 ? (sessao.placar.sim / sessao.placar.total) * 100 : 0;
    const percentNao = sessao.placar.total > 0 ? (sessao.placar.nao / sessao.placar.total) * 100 : 0;

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8">
            {/* Header ao vivo */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-red-500 ${pulso ? "animate-pulse" : ""}`} />
                    <span className="text-red-400 font-bold text-sm uppercase tracking-wider">AO VIVO</span>
                    <h1 className="text-2xl md:text-3xl font-bold">{sessao.tipo}</h1>
                </div>
                <div className="flex items-center gap-4 text-zinc-400 text-sm">
                    <span className="flex items-center gap-1"><Eye size={14} /> {sessao.espectadores} assistindo</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {sessao.data}</span>
                    <span className="flex items-center gap-1"><Wifi size={14} className="text-green-400" /> Conectado</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna principal — votação */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Item atual */}
                    <div className="bg-zinc-900/80 border border-red-500/30 rounded-2xl p-6">
                        <div className="text-xs text-red-400 uppercase tracking-wider mb-2">Item em Discussão</div>
                        <h2 className="text-xl font-bold mb-3">{sessao.itemAtual}</h2>
                        {sessao.oradorAtivo && (
                            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                                <Mic size={18} className="text-amber-400" />
                                <span className="text-amber-300 font-medium">{sessao.oradorAtivo.nome}</span>
                                <span className="text-zinc-500 text-sm">— {sessao.oradorAtivo.tipo} desde {sessao.oradorAtivo.inicio}</span>
                            </div>
                        )}
                    </div>

                    {/* Painel de votação */}
                    {sessao.votacaoAtiva && (
                        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Vote size={20} className="text-indigo-400" /> Votação em Andamento</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4 text-center">
                                    <CheckCircle size={24} className="mx-auto text-emerald-400 mb-2" />
                                    <div className="text-3xl font-bold text-emerald-400">{sessao.placar.sim}</div>
                                    <div className="text-xs text-emerald-300">A FAVOR</div>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-center">
                                    <XCircle size={24} className="mx-auto text-red-400 mb-2" />
                                    <div className="text-3xl font-bold text-red-400">{sessao.placar.nao}</div>
                                    <div className="text-xs text-red-300">CONTRA</div>
                                </div>
                                <div className="bg-zinc-500/10 border border-zinc-500/40 rounded-xl p-4 text-center">
                                    <MinusCircle size={24} className="mx-auto text-zinc-400 mb-2" />
                                    <div className="text-3xl font-bold text-zinc-400">{sessao.placar.abstencao}</div>
                                    <div className="text-xs text-zinc-300">ABSTENÇÃO</div>
                                </div>
                            </div>
                            {/* Barra de progresso */}
                            <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden flex">
                                <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${percentSim}%` }} />
                                <div className="bg-red-500 h-full transition-all duration-700" style={{ width: `${percentNao}%` }} />
                                <div className="bg-zinc-600 h-full transition-all duration-700" style={{ width: `${100 - percentSim - percentNao}%` }} />
                            </div>
                            <div className="text-center text-sm text-zinc-500 mt-2">{sessao.placar.total} votos registrados</div>
                        </div>
                    )}

                    {/* Histórico */}
                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Histórico da Sessão</h3>
                        <div className="space-y-3">
                            {sessao.historico.map((h, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                    <div>
                                        <div className="font-medium text-sm">{h.item}</div>
                                        <div className="text-xs text-zinc-500">{h.hora}</div>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${h.resultado.includes("APROVADO") ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-300"}`}>{h.resultado}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna lateral — presença */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-blue-400" /> Presença ({sessao.presentes.filter(p => p.presente).length}/{sessao.presentes.length})</h3>
                        <div className="space-y-2">
                            {sessao.presentes.map((v, i) => (
                                <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${v.presente ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${v.presente ? "bg-emerald-400" : "bg-red-400"}`} />
                                        <span className="text-sm font-medium">{v.nome}</span>
                                    </div>
                                    <span className="text-xs text-zinc-500">{v.partido}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controles (admin) */}
                    <div className="bg-zinc-900/80 border border-indigo-500/30 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-indigo-400 mb-4">Controles da Mesa</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl transition-colors"><Play size={16} /> Iniciar Votação</button>
                            <button className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-xl transition-colors"><Pause size={16} /> Encerrar Votação</button>
                            <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition-colors"><Radio size={16} /> Encerrar Sessão</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
