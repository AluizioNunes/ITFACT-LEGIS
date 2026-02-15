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
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    Filter,
    Search,
    ArrowUpRight,
    TrendingUp,
    Gavel,
    ScrollText,
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
import { ProposituraModal } from "@/components/modals/ProposituraModal";

// --- Mock Data ---

const productionData = [
    { Month: "Jan", PL: 45, REQ: 20, IND: 15 },
    { Month: "Fev", PL: 52, REQ: 25, IND: 18 },
    { Month: "Mar", PL: 48, REQ: 30, IND: 22 },
    { Month: "Abr", PL: 61, REQ: 22, IND: 25 },
    { Month: "Mai", PL: 55, REQ: 28, IND: 20 },
    { Month: "Jun", PL: 72, REQ: 35, IND: 30 },
];

const typeDistribution = [
    { name: "Projetos de Lei", value: 400, color: "#3b82f6" },
    { name: "Requerimentos", value: 300, color: "#10b981" },
    { name: "Indicações", value: 200, color: "#f59e0b" },
    { name: "Moções", value: 100, color: "#ef4444" },
];

const recentProposituras = [
    { id: "PL 245/2026", autor: "Ver. Carlos Silva", ementa: "Dispõe sobre a criação do parque municipal...", status: "Em Análise", data: "10/02/2026" },
    { id: "REQ 112/2026", autor: "Ver. Ana Souza", ementa: "Requer informações sobre a iluminação pública...", status: "Aprovado", data: "09/02/2026" },
    { id: "IND 089/2026", autor: "Ver. Marcos Lima", ementa: "Indica a reforma da praça central do bairro...", status: "Pendente", data: "08/02/2026" },
    { id: "PL 244/2026", autor: "Mesa Diretora", ementa: "Altera o regime interno da casa legislativa...", status: "Tramitando", data: "07/02/2026" },
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

export default function PropositurasPage() {
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
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                        Gestão de Proposituras
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Controle analítico de Projetos de Lei, Requerimentos e Indicações.
                    </p>
                </div>
                <ProposituraModal />
            </motion.div>

            {/* KPI Section */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: "Total Proposituras", value: "1,245", trend: "+12%", icon: ScrollText, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Em Tramitação", value: "324", trend: "+5%", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Aprovadas 2026", value: "856", trend: "+18%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Vetadas/Arquivadas", value: "65", trend: "-2%", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
                ].map((kpi, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-transform duration-300">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                                        <TrendingUp className="h-3 w-3" />
                                        {kpi.trend}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.label}</h3>
                                    <p className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Production Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-8"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Produção Legislativa Mensal</CardTitle>
                            <CardDescription>Volume de matérias protocoladas por categoria</CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-[350px]">
                            {mounted && (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={productionData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="Month" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" stroke="#94a3b8" />
                                        <YAxis axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" stroke="#94a3b8" />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }} />
                                        <Bar dataKey="PL" name="Projetos de Lei" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="REQ" name="Requerimentos" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="IND" name="Indicações" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Type Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-4"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Mix de Matérias</CardTitle>
                            <CardDescription>Distribuição percentual por tipo</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                            {mounted && (
                                <ResponsiveContainer width="100%" height={300}>
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
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[10px] font-bold uppercase text-slate-500">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{item.value}</span>
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
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Matérias Recentes</CardTitle>
                            <CardDescription>Acompanhamento das últimas proposituras protocoladas</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Buscar por número ou autor..." className="pl-10 h-10 w-[300px] border-slate-100 rounded-xl" />
                            </div>
                            <Button variant="outline" className="h-10 rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest border-slate-100">
                                <Filter className="h-4 w-4" /> Filtros
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Autor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ementa</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProposituras.map((prop, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-blue-600">{prop.id}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{prop.data}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <Gavel className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{prop.autor}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-medium text-slate-600 max-w-[400px] truncate">{prop.ementa}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${prop.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-600' :
                                                    prop.status === 'Em Análise' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {prop.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
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
