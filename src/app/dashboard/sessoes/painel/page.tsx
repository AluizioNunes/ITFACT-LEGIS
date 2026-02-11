"use client";

import { motion } from "framer-motion";
import { Users, Clock, Vote, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import React from "react";

export default function PainelVotacaoPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            {/* Header */}
            <header className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3 rounded-2xl">
                        <Vote className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Painel Eletrônico de Votação</h1>
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Câmara Legislativa de Manaus</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest uppercase">Tempo de Votação</p>
                        <div className="flex items-center gap-2 text-2xl font-mono font-black text-amber-500">
                            <Clock className="h-5 w-5" /> 02:45
                        </div>
                    </div>
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quórum</p>
                        <p className="text-2xl font-black text-emerald-400">32/41</p>
                    </div>
                </div>
            </header>

            {/* Matter Info */}
            <section className="bg-blue-900/40 border border-blue-500/20 rounded-3xl p-8 mb-8 backdrop-blur-md">
                <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                        <span className="bg-blue-600 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest mb-4 inline-block">Projeto de Lei nº 142/2026</span>
                        <h2 className="text-3xl font-black tracking-tight leading-tight">DISPÕE SOBRE A CRIAÇÃO DO PROGRAMA MUNICIPAL DE INCENTIVO ÀS STARTUPS E AO EMPREENDEDORISMO TECNOLÓGICO.</h2>
                        <p className="mt-4 text-white/60 text-lg uppercase font-semibold">Autor: Ver. João Silva (PR)</p>
                    </div>
                    <div className="w-80 space-y-4">
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                <span className="font-bold text-sm uppercase">Sim</span>
                            </div>
                            <span className="text-3xl font-black text-emerald-500">24</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-3">
                                <XCircle className="h-6 w-6 text-red-500" />
                                <span className="font-bold text-sm uppercase">Não</span>
                            </div>
                            <span className="text-3xl font-black text-red-500">06</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-3">
                                <MinusCircle className="h-6 w-6 text-amber-500" />
                                <span className="font-bold text-sm uppercase">Abstenção</span>
                            </div>
                            <span className="text-3xl font-black text-amber-500">02</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Voting Grid (Simulated) */}
            <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 41 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-xl border flex items-center gap-3 ${i % 7 === 0 ? "bg-emerald-500/10 border-emerald-500/20" :
                                i % 11 === 0 ? "bg-red-500/10 border-red-500/20" :
                                    "bg-white/5 border-white/10"
                            }`}
                    >
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${i % 7 === 0 ? "bg-emerald-500 text-white" :
                                i % 11 === 0 ? "bg-red-500 text-white" :
                                    "bg-slate-800 text-slate-400"
                            }`}>
                            {i + 1}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-white/90 truncate uppercase">VER. NOME {i + 1}</p>
                            <p className="text-[8px] font-bold text-blue-400 tracking-widest">PARTIDO</p>
                        </div>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}
