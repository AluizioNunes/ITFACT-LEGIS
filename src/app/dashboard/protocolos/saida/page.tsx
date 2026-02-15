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
    Cell
} from "recharts";
import {
    Send,
    TrendingUp,
    CheckCircle2,
    Clock,
    Calendar,
    ExternalLink,
    MapPin
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtocoloSaidaModal } from "@/components/modals/ProtocoloSaidaModal";

// --- Mock Data ---

const outgoingData = [
    { destination: "Pref. Municipal", count: 45, color: "#3b82f6" },
    { destination: "Sec. Saúde", count: 28, color: "#10b981" },
    { destination: "Tribunal Contas", count: 12, color: "#f59e0b" },
    { destination: "Câmara Federal", count: 8, color: "#8b5cf6" },
    { destination: "Outros", count: 15, color: "#94a3b8" },
];

const mockSaidas = [
    { id: "1", numero: "OUT-2026-0042", destino: "Prefeitura Municipal de Itfact", assunto: "Envio de Autógrafo de Lei nº 123", data: "09/02/2026", status: "ENVIADO" },
    { id: "2", numero: "OUT-2026-0043", destino: "Secretaria de Obras", assunto: "Ofício de Solicitação de Pavimentação", data: "08/02/2026", status: "EM_PREPARO" },
    { id: "3", numero: "OUT-2026-0044", destino: "Câmara de Vereadores (Vizinha)", assunto: "Convite para Sessão Solene", data: "07/02/2026", status: "RECEBIDO" },
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

export default function ProtocolosSaidaPage() {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                        Protocolos de Saída
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Controle e monitoramento de expedição documental externa.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest gap-2 h-11">
                        <Calendar className="h-4 w-4" /> Relatório
                    </Button>
                    <ProtocoloSaidaModal />
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
                    { label: "Enviados (Mês)", value: "108", trend: "+12%", icon: Send, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Taxa de Entrega", value: "98.5%", trend: "Confirmados", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Em Preparação", value: "14", trend: "Urgente", icon: Clock, color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
                    { label: "Destinos Ativos", value: "24", trend: "Órgãos", icon: MapPin, color: "text-blue-600", bg: "bg-blue-50" },
                ].map((kpi, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        {kpi.trend}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</h3>
                                    <p className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</p>
                                </div>
                            </CardContent>
                            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full bg-indigo-500`} />
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Destination Analytics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-5"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Principais Destinos</CardTitle>
                            <CardDescription>Distribuição de fluxos de saída</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={outgoingData} layout="vertical" margin={{ left: -20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="destination"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        fontSize={10}
                                        fontWeight="black"
                                        width={100}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                        {outgoingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-3">
                                {outgoingData.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-500 uppercase">{item.destination}</span>
                                        <Badge variant="outline" className="font-black border-slate-100">{item.count} doc.</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Outgoing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-7"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Expedições Recentes</CardTitle>
                                <CardDescription>Status real de saída documental</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destinatário</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockSaidas.map((item, i) => (
                                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-indigo-600">{item.numero}</span>
                                                        <span className="text-[10px] font-bold text-slate-400">{item.data}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700">{item.destino}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 truncate max-w-[200px]">{item.assunto}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={
                                                        item.status === 'ENVIADO' ? 'bg-indigo-50 text-indigo-700' :
                                                            item.status === 'RECEBIDO' ? 'bg-emerald-50 text-emerald-700' :
                                                                'bg-amber-50 text-amber-700'
                                                    }>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Button variant="ghost" className="w-full h-12 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors">
                                Exibir Todos os Registros
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
