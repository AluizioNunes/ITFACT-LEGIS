"use client";

import { motion } from "framer-motion";
import {
    Search,
    Filter,
    FileText,
    Calendar,
    ArrowRight,
    History,
    Zap,
    Mic,
    ScanLine,
    Database,
    FileCheck2,
    Clock3
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const recentSearches = [
    "Projeto de Lei Orçamentária 2026",
    "Ofício Secretaria de Saúde Pavimentação",
    "Requerimento Manutenção Praça Central",
    "Contrato 042/2025 Limpeza Urbana",
];

const stats = [
    { label: "Documentos Indexados", value: "45.8k", icon: Database, color: "text-blue-600" },
    { label: "Buscas Realizadas/Dia", value: "1.2k", icon: Zap, color: "text-amber-500" },
    { label: "Tempo Médio Busca", value: "45ms", icon: Clock3, color: "text-emerald-500" },
    { label: "Taxa de Precisão", value: "99.8%", icon: FileCheck2, color: "text-indigo-600" },
];

export default function ProtocolosPesquisaPage() {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-8">
            {/* Search Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    <ScanLine className="h-3.5 w-3.5" />
                    Motor de Busca Inteligente v4.0
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase transition-all">
                    Pesquisa Centralizada
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                    Localize qualquer documento protocolado na instituição utilizando metadados,
                    texto integral ou filtros categoriais avançados.
                </p>
            </motion.div>

            {/* Search Bar Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative"
            >
                <div className={`
                    relative bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl transition-all duration-500 p-2
                    ${isFocused ? 'ring-4 ring-blue-100 shadow-blue-200/50' : 'shadow-slate-200/50'}
                `}>
                    <div className="flex items-center gap-3 px-6 py-4">
                        <Search className={`h-6 w-6 transition-colors ${isFocused ? 'text-blue-600' : 'text-slate-400'}`} />
                        <Input
                            placeholder="Digite número, assunto, interessado ou termos-chave..."
                            className="border-none bg-transparent text-lg focus-visible:ring-0 placeholder:text-slate-400 h-10 w-full"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 h-10 w-10">
                                <Mic className="h-5 w-5 text-slate-400" />
                            </Button>
                            <div className="h-8 w-px bg-slate-100" />
                            <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 h-12 font-black uppercase text-xs tracking-widest gap-2">
                                Buscar
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {['Todos', 'Pela Numeração', 'Pelo Assunto', 'Pela Data', 'Pela Origem'].map((f, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            className="rounded-full border-slate-200 text-[10px] font-black uppercase tracking-widest px-6 h-9 hover:bg-slate-50 hover:text-blue-600 transition-all"
                        >
                            {f}
                        </Button>
                    ))}
                    <Button variant="ghost" className="rounded-full text-[10px] font-black uppercase tracking-widest px-4 h-9 text-slate-400 hover:text-slate-900">
                        <Filter className="h-3.5 w-3.5 mr-2" />
                        Filtros Avançados
                    </Button>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                {/* Statistics Cards */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-4">
                        <Zap className="h-3.5 w-3.5" />
                        Insights da Base
                    </h3>
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                        >
                            <Card className="border-none shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all group overflow-hidden">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform`}>
                                            <s.icon className={`h-5 w-5 ${s.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                            <p className="text-xl font-black text-slate-900">{s.value}</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${s.color.split('-')[1]}-500 w-2/3`} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* History and Trends */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-4">
                        <History className="h-3.5 w-3.5" />
                        Buscas Recentes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentSearches.map((search, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="border-none shadow-md shadow-slate-100/50 cursor-pointer hover:bg-blue-50/50 transition-colors border-l-4 border-l-slate-200 hover:border-l-blue-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-700">{search}</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[8px] font-black tracking-tighter h-4 px-1">2026</Badge>
                                                    <span className="text-[9px] text-slate-400 font-medium italic">Há 2 horas</span>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Help Card */}
                    <Card className="border-none bg-slate-900 text-white shadow-2xl overflow-hidden mt-8 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16" />
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                    <FileText className="h-8 w-8 text-blue-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-black uppercase tracking-tighter">Dica de Busca Avançada</h4>
                                    <p className="text-slate-400 text-sm font-medium">
                                        Utilize aspas para buscar termos exatos ou o caractere asterisco (*) para completar palavras.
                                        Exemplo: <span className="text-blue-400 font-mono">"Secretaria de Saúde" * 2026</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
