"use client";

import { motion } from "framer-motion";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import {
    ArrowRightLeft,
    Clock,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    Building2,
    FileText,
    Timer,
    Zap
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
import { TramitarProposituraModal } from "@/components/modals/TramitarProposituraModal";

// --- Mock Data ---

const flowData = [
    { day: "Seg", recebidos: 45, concluidos: 38 },
    { day: "Ter", recebidos: 52, concluidos: 42 },
    { day: "Qua", recebidos: 61, concluidos: 55 },
    { day: "Qui", recebidos: 48, concluidos: 40 },
    { day: "Sex", recebidos: 55, concluidos: 50 },
];

const comissaoUsage = [
    { name: "CCJR", valor: 85, color: "#3b82f6" },
    { name: "Finanças", valor: 62, color: "#10b981" },
    { name: "Saúde", valor: 45, color: "#f59e0b" },
    { name: "Educação", valor: 38, color: "#8b5cf6" },
    { name: "Serviços", valor: 30, color: "#ef4444" },
];

const activeTramitations = [
    { id: "PL 045/2026", origem: "Gabinete 01", destino: "CCJR", tempo: "2 Dias", status: "Em Análise", prioridade: "Alta" },
    { id: "REQ 012/2026", origem: "Gabinete 15", destino: "Mesa Diretora", tempo: "4 Horas", status: "Aguardando Recebimento", prioridade: "Normal" },
    { id: "IND 005/2026", origem: "Gabinete 08", destino: "Secretaria Geral", tempo: "1 Dia", status: "Em Tramitação", prioridade: "Normal" },
    { id: "PL 042/2026", origem: "Gabinete 22", destino: "Com. Finanças", tempo: "5 Dias", status: "Atrasado", prioridade: "Crítica" },
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

export default function PropositurasTramitacaoPage() {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                        Tramitação Legislativa
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Monitoramento de fluxo e inteligência processual.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest gap-2">
                        <Calendar className="h-4 w-4" /> Período
                    </Button>
                    <TramitarProposituraModal />
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
                    { label: "Tempo Médio", value: "2.4 Dias", trend: "-15%", icon: Timer, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Processos em Fluxo", value: "148", trend: "+8%", icon: ArrowRightLeft, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Alertas de Atraso", value: "12", trend: "+2", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Concluídos Hoje", value: "24", trend: "+4", icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50" },
                ].map((kpi, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:scale-[1.02] transition-all">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-[10px] font-black ${kpi.trend.startsWith('-') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {kpi.trend} {kpi.trend.endsWith('%') ? 'Eficiência' : ''}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.label}</h3>
                                    <p className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</p>
                                </div>
                            </CardContent>
                            <div className={`absolute bottom-0 left-0 h-1 ${kpi.bg.replace('bg-', 'bg-').replace('-50', '-500')} w-full opacity-30`} />
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Flow Line Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-7"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Fluxo de Protocolos</CardTitle>
                                <CardDescription>Recebidos vs Concluídos por dia da semana</CardDescription>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Recebidos</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Concluídos</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={flowData}>
                                    <defs>
                                        <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorConc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={11} fontWeight="black" stroke="#94a3b8" />
                                    <YAxis axisLine={false} tickLine={false} fontSize={11} fontWeight="black" stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Area type="monotone" dataKey="recebidos" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" />
                                    <Area type="monotone" dataKey="concluidos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConc)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Commission Workload */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-5"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                Carga por Comissão
                            </CardTitle>
                            <CardDescription>Volume de processos em análise setorial</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {comissaoUsage.map((cm, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black text-slate-700 uppercase">{cm.name}</span>
                                            <span className="text-xs font-black text-slate-400">{cm.valor}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cm.valor}%` }}
                                                transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: cm.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-8 rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-600 py-6 border-t border-slate-50">
                                Detalhar Comissões
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Active Tramitations Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 px-6">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Tramitações Ativas</CardTitle>
                            <CardDescription>Acompanhamento granular do fluxo em tempo real</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Pesquisar fluxo..." className="pl-10 h-10 w-[260px] border-slate-100 rounded-xl" />
                            </div>
                            <Button variant="outline" className="h-10 rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest border-slate-100">
                                <Filter className="h-4 w-4" /> Filtros
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Matéria</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Fluxo (Origem → Destino)</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo Total</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prioridade</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTramitations.map((item, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-800">{item.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                    <span className="px-2 py-0.5 rounded bg-slate-100">{item.origem}</span>
                                                    <ArrowRightLeft className="h-3 w-3 text-slate-300" />
                                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600">{item.destino}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                    {item.tempo}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Zap className={`h-3 w-3 ${item.prioridade === 'Crítica' ? 'text-rose-500' : item.prioridade === 'Alta' ? 'text-amber-500' : 'text-slate-400'}`} />
                                                    <span className={`text-[10px] font-black uppercase ${item.prioridade === 'Crítica' ? 'text-rose-600' : item.prioridade === 'Alta' ? 'text-amber-600' : 'text-slate-500'}`}>
                                                        {item.prioridade}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${item.status === 'Atrasado' ? 'bg-rose-100 text-rose-600' :
                                                    item.status === 'Em Análise' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {item.status}
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
