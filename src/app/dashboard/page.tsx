"use client";

import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    ComposedChart,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import {
    FileText,
    ArrowRightLeft,
    Clock,
    CheckCircle2,
    TrendingUp,
    Users,
    AlertCircle,
    FileCheck,
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    History
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

// --- Mock Data ---

const sparklineData = [
    { value: 400 }, { value: 300 }, { value: 500 }, { value: 450 }, { value: 600 }, { value: 550 }, { value: 700 }
];

const productivityData = [
    { Month: "Jan", Total: 120, Efficiency: 85 },
    { Month: "Fev", Total: 150, Efficiency: 78 },
    { Month: "Mar", Total: 180, Efficiency: 92 },
    { Month: "Abr", Total: 220, Efficiency: 88 },
    { Month: "Mai", Total: 190, Efficiency: 95 },
    { Month: "Jun", Total: 280, Efficiency: 90 },
];

const recentHistory = [
    { title: "Sessão Plenária Ordinária", type: "Legislativo", status: "Agendada", time: "Hoje, 14:00", icon: Calendar, color: "text-blue-600 bg-blue-50" },
    { title: "Parecer Técnico PL 202/2026", type: "Jurídico", status: "Concluído", time: "Hoje, 11:30", icon: FileCheck, color: "text-emerald-600 bg-emerald-50" },
    { title: "Novo Protocolo Administrativo", type: "Geral", status: "Pendente", time: "Hoje, 09:15", icon: History, color: "text-amber-600 bg-amber-50" },
    { title: "Assinatura Digital de Portaria", type: "Gabinete", status: "Urgente", time: "Ontem, 17:45", icon: Zap, color: "text-purple-600 bg-purple-50" },
];

const departmentEfficiency = [
    { name: "Secretaria", rate: 94, status: "Alta" },
    { name: "Legislativo", rate: 88, status: "Estável" },
    { name: "Jurídico", rate: 72, status: "Sobrecarregado" },
    { name: "RH", rate: 91, status: "Alta" },
];

// Tramitações Data (from previous)
const tramitacaoSetorData = [
    { name: "Jurídico", valor: 45, color: "#3b82f6" },
    { name: "Financeiro", valor: 32, color: "#10b981" },
    { name: "Legislativo", valor: 58, color: "#f59e0b" },
    { name: "RH", valor: 24, color: "#ef4444" },
    { name: "Gabinete", valor: 39, color: "#8b5cf6" },
];

const statusDocumentoData = [
    { name: "Em Análise", value: 400 },
    { name: "Aguardando Assinatura", value: 300 },
    { name: "Finalizado", value: 300 },
    { name: "Arquivado", value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Insights Estratégicos
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Monitoramento em tempo real do ecossistema ITFACT LEGIS.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border">
                        <Button variant="ghost" size="sm" className="rounded-lg h-8 px-3 text-xs font-bold">DIA</Button>
                        <Button variant="ghost" size="sm" className="rounded-lg h-8 px-3 text-xs font-bold bg-slate-100 dark:bg-slate-700">MÊS</Button>
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="geral" className="space-y-8">
                <TabsList className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border shadow-sm w-fit">
                    <TabsTrigger value="geral" className="rounded-xl px-8 py-2.5 font-extrabold uppercase text-[11px] tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300">
                        Visão Executiva
                    </TabsTrigger>
                    <TabsTrigger value="tramitacoes" className="rounded-xl px-8 py-2.5 font-extrabold uppercase text-[11px] tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300">
                        Tramitações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="geral" className="space-y-8 outline-none animate-in fade-in duration-700">
                    {/* KPI Sparkline Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Protocolos", value: "2,845", growth: "+14%", icon: FileText, color: "#3b82f6", bg: "bg-blue-500" },
                            { label: "Tramitações", value: "1,120", growth: "+8%", icon: ArrowRightLeft, color: "#10b981", bg: "bg-emerald-500" },
                            { label: "Assinaturas", value: "452", growth: "-3%", icon: FileCheck, color: "#8b5cf6", bg: "bg-purple-500" },
                            { label: "Urgências", value: "18", growth: "+2", icon: AlertCircle, color: "#ef4444", bg: "bg-red-500" },
                        ].map((kpi, idx) => (
                            <Card key={idx} className="border-none shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <CardHeader className="pb-2 space-y-0">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-2.5 rounded-xl ${kpi.bg}/10`}>
                                            <kpi.icon className={`h-5 w-5`} style={{ color: kpi.color }} />
                                        </div>
                                        <div className={`flex items-center text-[11px] font-bold ${kpi.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {kpi.growth.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                            {kpi.growth}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 pt-4">
                                        {kpi.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-0">
                                    <div className="text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                                    <div className="h-16 mt-2 -mx-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={sparklineData}>
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke={kpi.color}
                                                    fill={kpi.color}
                                                    fillOpacity={0.1}
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Productivity Composed Chart */}
                        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-8">
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Produtividade Sistêmica</CardTitle>
                                    <CardDescription className="text-sm font-medium">Relatório comparativo de documentos vs eficiência operacional</CardDescription>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-blue-600" />
                                        <span className="text-[10px] font-bold uppercase text-slate-400">Documentos</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-bold uppercase text-slate-400">Eficiência (%)</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-2">
                                <ResponsiveContainer width="100%" height={380}>
                                    <ComposedChart data={productivityData}>
                                        <XAxis dataKey="Month" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" stroke="#94a3b8" dy={10} />
                                        <YAxis axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" stroke="#94a3b8" />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                                padding: '12px'
                                            }}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <Bar dataKey="Total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                        <Line type="monotone" dataKey="Efficiency" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 3 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Control Timeline / Recent Activities */}
                        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/50 bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                                    Controle de Atividades
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                </CardTitle>
                                <CardDescription className="text-sm font-medium">Fluxo de eventos em tempo real</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative space-y-8 before:absolute before:inset-0 before:left-[19px] before:h-full before:w-0.5 before:bg-slate-100">
                                    {recentHistory.map((event, i) => (
                                        <div key={i} className="relative flex gap-6 items-start group">
                                            <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-all group-hover:scale-110 ${event.color}`}>
                                                <event.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col space-y-1 pt-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-slate-800 tracking-tight leading-none">{event.title}</span>
                                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">{event.status}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                                    <span>{event.type}</span>
                                                    <span>•</span>
                                                    <span className="text-slate-500">{event.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-8 rounded-xl font-extrabold text-blue-600 hover:bg-blue-50 text-[11px] uppercase tracking-widest py-6 border-t border-slate-50">
                                    Visualizar Log Histórico
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {departmentEfficiency.map((dept, i) => (
                            <Card key={i} className="border-none shadow-lg bg-white overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">{dept.name}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dept.status === 'Alta' ? 'bg-emerald-100 text-emerald-600' : dept.status === 'Estável' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {dept.status}
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-between mb-2">
                                        <div className="text-2xl font-black text-slate-900">{dept.rate}%</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Índice</div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${dept.rate}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full rounded-full ${dept.rate > 90 ? 'bg-emerald-500' : dept.rate > 80 ? 'bg-blue-500' : 'bg-rose-500'}`}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="tramitacoes" className="space-y-6 outline-none animate-in fade-in duration-500">
                    {/* Tramitacoes Content (Preserved and slightly improved) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-none shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Total em Fluxo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black tracking-tighter">1,248</div>
                                <div className="text-[10px] mt-2 font-bold bg-white/20 w-fit px-3 py-1 rounded-lg backdrop-blur-sm">+14 novos esta hora</div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Tempo Médio</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black tracking-tighter">3.2 Dias</div>
                                <div className="text-[10px] mt-2 font-bold bg-white/20 w-fit px-3 py-1 rounded-lg backdrop-blur-sm">Redução de 15%</div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl bg-white border border-slate-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Saída p/ Órgãos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black tracking-tighter text-slate-900">385</div>
                                <p className="text-[10px] text-slate-500 mt-2 font-bold flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3 text-emerald-500" /> Externo via Protocolo
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl bg-white border border-slate-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Taxa de Conclusão</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black tracking-tighter text-slate-900">92%</div>
                                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[92%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-none shadow-2xl bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Tramitacões por Setor</CardTitle>
                                <CardDescription className="font-medium text-sm">Distribuição volumétrica de documentos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={tramitacaoSetorData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} fontWeight="black" tickLine={false} axisLine={false} width={100} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
                                        <Bar dataKey="valor" radius={[0, 8, 8, 0]} barSize={24}>
                                            {tramitacaoSetorData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-2xl bg-white">
                            <CardHeader>
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Status de Fluxo</CardTitle>
                                <CardDescription className="font-medium text-sm">Distribuição por estado processual</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart>
                                        <Pie
                                            data={statusDocumentoData}
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {statusDocumentoData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
