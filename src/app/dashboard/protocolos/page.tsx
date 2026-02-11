"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import {
    Search,
    FileText,
    Calendar,
    ArrowRightLeft,
    Hash,
    Filter,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    Inbox,
    Send
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- Mock Data ---

const volumeData = [
    { month: "Jan", entrada: 120, saida: 85 },
    { month: "Fev", entrada: 150, saida: 110 },
    { month: "Mar", entrada: 180, saida: 140 },
    { month: "Abr", entrada: 210, saida: 165 },
    { month: "Mai", entrada: 195, saida: 150 },
    { month: "Jun", entrada: 240, saida: 190 },
];

const distributionData = [
    { name: "Interno", value: 450, color: "#3b82f6" },
    { name: "Externo (Entrada)", value: 300, color: "#10b981" },
    { name: "Externo (Saída)", value: 150, color: "#f59e0b" },
];

const mockProtocolos = [
    { id: "1", numero: "PROT-2026-0001", tipo: "INTERNO", assunto: "Requerimento de Manutenção", status: "Finalizado", user: "Administrador", data: new Date().toISOString() },
    { id: "2", numero: "PROT-2026-0002", tipo: "ENTRADA", assunto: "Projeto de Lei Complementar", status: "Em Tramitação", user: "Secretaria Geral", data: new Date().toISOString() },
    { id: "3", numero: "PROT-2026-0003", tipo: "SAIDA", assunto: "Ofício para Secretaria de Saúde", status: "Enviado", user: "Gabinete 01", data: new Date().toISOString() },
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

export default function ProtocolosPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                        Gestão de Protocolos
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Central de inteligência e acompanhamento de numeração única.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest gap-2 h-11">
                        <Calendar className="h-4 w-4" /> Filtro por Ano
                    </Button>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2 bg-blue-600 hover:bg-blue-700 h-11">
                        <FileText className="h-4 w-4" /> Novo Protocolo Manual
                    </Button>
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
                    { label: "Total Geral", value: "2,845", trend: "+15%", icon: Hash, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Protocolos Entrada", value: "842", trend: "+12%", icon: Inbox, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Protocolos Saída", value: "324", trend: "+5%", icon: Send, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Pendentes Digitais", value: "45", trend: "-8%", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
                ].map((kpi, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 opacity-80 group-hover:opacity-100">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        {kpi.trend}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</h3>
                                    <p className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</p>
                                </div>
                            </CardContent>
                            <div className={`absolute bottom-0 left-0 h-1 ease-in-out transition-all duration-500 w-0 group-hover:w-full ${kpi.bg.replace('bg-', 'bg-').replace('-50', '-500')}`} />
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Volume Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-8"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Fluxo Documental</CardTitle>
                                <CardDescription>Comparativo de Entrada vs Saída mensal</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="min-h-[350px]">
                            {mounted && (
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={volumeData}>
                                        <defs>
                                            <linearGradient id="colorEnt" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorSai" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" fontWeight="bold" />
                                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" fontWeight="bold" />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', paddingTop: '20px' }} />
                                        <Area type="monotone" dataKey="entrada" name="Entrada" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEnt)" />
                                        <Area type="monotone" dataKey="saida" name="Saída" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSai)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-4"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Mix de Origem</CardTitle>
                            <CardDescription>Distribuição por tipo de trâmite</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center min-h-[280px]">
                            {mounted && (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={distributionData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            <div className="w-full space-y-3 mt-6">
                                {distributionData.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[10px] font-black uppercase text-slate-500">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{item.value} unid.</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Table Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 px-6">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Últimos Registros</CardTitle>
                            <CardDescription>Acompanhamento de registros oficiais em tempo real</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Buscar código ou assunto..."
                                    className="pl-10 h-10 w-[300px] border-slate-100 rounded-xl"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-10 rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest border-slate-100">
                                <Filter className="h-4 w-4" /> Filtros
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Código Único</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assunto / Ementa</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data/Hora</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockProtocolos.map((p, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{p.numero}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={p.tipo === 'ENTRADA' ? 'default' : 'outline'} className="rounded-md font-black text-[9px] tracking-widest">
                                                    {p.tipo}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-700 max-w-[300px] truncate">{p.assunto}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                        {p.user.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{p.user}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-400 uppercase">
                                                    {format(new Date(p.data), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
