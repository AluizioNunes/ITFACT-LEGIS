"use client";

import React, { useState } from "react";
import { Search, FileText, Bell, Calendar, Users, ChevronRight, ExternalLink, BarChart2, MessageCircle, Mail, CheckCircle } from "lucide-react";

const mockProposituras = [
    { id: "PL-001/2026", titulo: "Política Municipal de Saneamento Básico", autor: "Ver. Carlos Alberto", tipo: "Projeto de Lei", status: "Em Votação", data: "05/02/2026", acompanhantes: 237 },
    { id: "PL-002/2026", titulo: "Crédito Especial para Infraestrutura Viária", autor: "Ver. Maria das Graças", tipo: "Projeto de Lei", status: "Em Comissão", data: "03/02/2026", acompanhantes: 89 },
    { id: "PLC-001/2026", titulo: "Plano Diretor Participativo — Revisão 2026", autor: "Executivo Municipal", tipo: "Lei Complementar", status: "1ª Discussão", data: "28/01/2026", acompanhantes: 1204 },
    { id: "RES-005/2026", titulo: "Instituição do Parlamento Jovem Municipal", autor: "Ver. Ana Paula Costa", tipo: "Resolução", status: "Aprovada", data: "20/01/2026", acompanhantes: 456 },
    { id: "PL-003/2026", titulo: "Programa Escola Segura nas Zonas Rurais", autor: "Ver. José Antônio", tipo: "Projeto de Lei", status: "Em Tramitação", data: "15/01/2026", acompanhantes: 320 },
];

const mockEstatisticas = { totalProposituras: 847, aprovadas: 312, emTramitacao: 89, sessoesRealizadas: 42, vereadores: 21, comissoes: 25 };

const mockAgenda = [
    { data: "13/02/2026", tipo: "Sessão Ordinária", hora: "14:00", pauta: "4 itens na Ordem do Dia" },
    { data: "18/02/2026", tipo: "Audiência Pública", hora: "09:00", pauta: "Revisão do Plano Diretor" },
    { data: "20/02/2026", tipo: "Sessão Ordinária", hora: "14:00", pauta: "6 itens na Ordem do Dia" },
];

export default function PortalCidadaoPage() {
    const [busca, setBusca] = useState("");
    const [emailInscricao, setEmailInscricao] = useState("");
    const [inscritoEm, setInscritoEm] = useState<string | null>(null);

    const filtradas = mockProposituras.filter(p =>
        p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        p.id.toLowerCase().includes(busca.toLowerCase()) ||
        p.autor.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-sky-900/50 via-cyan-900/30 to-[#09090b] pt-10 pb-16 px-4 md:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 border border-sky-500/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                        <Users size={14} /> Portal de Transparência
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-3">Câmara Municipal de Manaus</h1>
                    <p className="text-zinc-400 text-lg mb-8">Acompanhe proposições, sessões e participe da vida legislativa do seu município</p>
                    <div className="max-w-2xl mx-auto relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar proposituras, projetos de lei, autores..." className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                {/* Estatísticas */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
                    {[
                        { label: "Proposituras", valor: mockEstatisticas.totalProposituras, icon: FileText, cor: "text-sky-400" },
                        { label: "Aprovadas", valor: mockEstatisticas.aprovadas, icon: CheckCircle, cor: "text-emerald-400" },
                        { label: "Em Trâmite", valor: mockEstatisticas.emTramitacao, icon: ChevronRight, cor: "text-amber-400" },
                        { label: "Sessões", valor: mockEstatisticas.sessoesRealizadas, icon: Calendar, cor: "text-purple-400" },
                        { label: "Vereadores", valor: mockEstatisticas.vereadores, icon: Users, cor: "text-blue-400" },
                        { label: "Comissões", valor: mockEstatisticas.comissoes, icon: BarChart2, cor: "text-rose-400" },
                    ].map((s, i) => (
                        <div key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-center">
                            <s.icon size={18} className={`mx-auto ${s.cor} mb-1`} />
                            <div className="text-xl font-bold">{s.valor}</div>
                            <div className="text-xs text-zinc-500">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Proposituras */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2"><FileText size={20} className="text-sky-400" /> Proposituras Recentes</h2>
                        {filtradas.map((p, i) => (
                            <div key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 hover:border-sky-500/40 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-medium">{p.id}</span>
                                            <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">{p.tipo}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "Aprovada" ? "bg-emerald-500/20 text-emerald-400" : p.status.includes("Votação") ? "bg-amber-500/20 text-amber-400" : "bg-zinc-700 text-zinc-300"}`}>{p.status}</span>
                                        </div>
                                        <h3 className="font-medium text-sm">{p.titulo}</h3>
                                        <div className="text-xs text-zinc-500 mt-1">{p.autor} • {p.data}</div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-zinc-500"><Bell size={12} /> {p.acompanhantes}</div>
                                </div>
                                {/* Inscrição por e-mail */}
                                {inscritoEm === p.id ? (
                                    <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle size={14} /> Você será notificado por e-mail sobre esta propositura.</div>
                                ) : (
                                    <div className="mt-3 flex gap-2">
                                        <input type="email" value={emailInscricao} onChange={e => setEmailInscricao(e.target.value)} placeholder="seu@email.com" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-sky-500" />
                                        <button onClick={() => { if (emailInscricao) setInscritoEm(p.id); }} className="bg-sky-600 hover:bg-sky-700 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><Mail size={14} /> Acompanhar</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Lateral — Agenda + Ouvidoria */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
                            <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar size={18} className="text-purple-400" /> Próximas Sessões</h3>
                            {mockAgenda.map((a, i) => (
                                <div key={i} className="border-b border-zinc-800 last:border-0 py-3">
                                    <div className="font-medium text-sm">{a.tipo}</div>
                                    <div className="text-xs text-zinc-500">{a.data} às {a.hora}</div>
                                    <div className="text-xs text-zinc-400 mt-1">{a.pauta}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-zinc-900/80 border border-cyan-500/30 rounded-xl p-5">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><MessageCircle size={18} className="text-cyan-400" /> Ouvidoria Cidadã</h3>
                            <p className="text-xs text-zinc-400 mb-4">Envie sugestões, reclamações ou elogios. Prazo de resposta: 30 dias úteis (LAI).</p>
                            <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"><ExternalLink size={14} /> Registrar Manifestação</button>
                        </div>

                        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 text-center">
                            <p className="text-xs text-zinc-500">Dados públicos conforme</p>
                            <p className="text-xs text-sky-400 font-medium">Lei de Acesso à Informação (LAI)</p>
                            <p className="text-xs text-zinc-500">Lei 12.527/2011</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
