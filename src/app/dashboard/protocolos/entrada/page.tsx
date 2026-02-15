"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts";
import {
    Inbox,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    Building2,
    FileText,
    Search,
    Filter,
    Calendar
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
import { ProtocoloEntradaModal } from "@/components/modals/ProtocoloEntradaModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, Protocolo } from "./columns";

// --- Mock Data ---

const data: Protocolo[] = [
    {
        id: "1",
        numero: "001",
        ano: 2026,
        data: "01/02/2026",
        tipo: "OFÍCIO",
        origem: "PREFEITURA MUNICIPAL",
        assunto: "ENCAMINHA PROJETO DE LEI DO ORÇAMENTO",
        situacao: "EM_TRAMITACAO"
    },
    {
        id: "2",
        numero: "002",
        ano: 2026,
        data: "02/02/2026",
        tipo: "REQUERIMENTO",
        origem: "ASSOCIAÇÃO DE MORADORES",
        assunto: "SOLICITA LIMPEZA DE TERRENO BALDIO",
        situacao: "PROTOCOLADO"
    },
    {
        id: "3",
        numero: "003",
        ano: 2026,
        data: "03/02/2026",
        tipo: "CARTA",
        origem: "CIDADÃO: JOÃO DA SILVA",
        assunto: "RECLAMAÇÃO SOBRE ILUMINAÇÃO PÚBLICA",
        situacao: "ARQUIVADO"
    },
];

const typeDistribution = [
    { name: "Ofícios", value: 45, color: "#3b82f6" },
    { name: "Requerimentos", value: 30, color: "#10b981" },
    { name: "Contratos", value: 15, color: "#f59e0b" },
    { name: "Outros", value: 10, color: "#94a3b8" },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function ProtocolosEntradaPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const handle = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(handle);
    }, []);

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase transition-all">
                        Protocolos de Entrada
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Gestão e triagem analítica de documentos externos recebidos.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest gap-2 h-11">
                        <Calendar className="h-4 w-4" /> Período
                    </Button>
                    <ProtocoloEntradaModal />
                </div>
            </motion.div>

            {/* KPI Section */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: "Recebidos (Mês)", value: "154", trend: "+22%", icon: Inbox, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Origem Externa", value: "82%", trend: "Prefeitura", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Aguardando Triagem", value: "12", trend: "-5", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Triagem Efetuada", value: "142", trend: "95%", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
                ].map((kpi, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                        Clique para detalhes
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</p>
                                        <span className={`text-[10px] font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                                            {kpi.trend}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50" />
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main List Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-8"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 px-6 bg-white">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Registros de Entrada
                                </CardTitle>
                                <CardDescription>Acompanhamento granular de protocolos externos</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Filtrar assunto..." className="pl-10 h-10 w-[200px] border-slate-100 rounded-xl" />
                                </div>
                                <Button variant="outline" size="icon" className="h-10 w-10 border-slate-100 rounded-xl">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable columns={columns} data={data} searchKey="assunto" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Side Analytics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-4 space-y-8"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Tipos de Documento</CardTitle>
                            <CardDescription>Mix de recebimento atual</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center min-h-[250px]">
                            {mounted && (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={typeDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {typeDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            <div className="w-full space-y-2 mt-4">
                                {typeDistribution.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] font-black border-b border-slate-50 pb-2 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="uppercase text-slate-500">{item.name}</span>
                                        </div>
                                        <span className="text-slate-900">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest opacity-80">Previsão Mensal</h4>
                                    <p className="text-2xl font-black">450 <span className="text-sm font-medium opacity-60">unid.</span></p>
                                </div>
                            </div>
                            <p className="mt-4 text-[10px] font-bold leading-relaxed opacity-80">
                                Com base no volume atual, a projeção indica um aumento de 15% em relação ao mês anterior.
                            </p>
                            <Button className="w-full mt-6 bg-white text-blue-600 hover:bg-blue-50 font-black text-[10px] uppercase h-11 rounded-xl">
                                Ver Relatório Detalhado
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
