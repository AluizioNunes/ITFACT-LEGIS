"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    Gavel,
    Search,
    Plus,
    Scale,
    AlertCircle,
    CheckCircle2,
    Clock
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts";

const processData = [
    { name: "Sindicâncias", total: 5, color: "#3b82f6" },
    { name: "PAD", total: 2, color: "#ef4444" },
    { name: "Investigação Ética", total: 3, color: "#f59e0b" },
];

const timelineData = [
    { period: "Jan/26", processos: 2 },
    { period: "Fev/26", processos: 3 },
    { period: "Mar/26", processos: 1 },
    { period: "Abr/26", processos: 4 },
];

export default function CorregedoriaDashboard() {
    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <ShieldCheck className="h-10 w-10 text-red-600" />
                        Corregedoria
                    </h1>
                    <p className="text-slate-500 font-medium">Controle de ética, processos disciplinares, sindicâncias e penalidades.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600 gap-2">
                        <Search className="h-5 w-5" /> Pesquisar Processo
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-red-200">
                        <Plus className="h-6 w-6" />
                        Novo Processo
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-red-600 text-white shadow-xl shadow-red-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Processos Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">10</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">4 Em fase de instrução</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" /> Fora do Prazo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">01</div>
                        <p className="text-[10px] mt-1 text-red-500 font-bold uppercase tracking-widest">Processo #45/2026</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Concluídos (Este Ano)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">12</div>
                        <p className="text-[10px] mt-1 text-emerald-500 font-bold uppercase tracking-widest">Média 1.5 por mês</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Gavel className="h-4 w-4 text-slate-500" /> Penalidades Aplicadas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">03</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold tracking-widest uppercase italic">Advertência / Suspensão</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <Scale className="h-4 w-4 text-red-500" /> Natureza dos Processos
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={processData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="total"
                                >
                                    {processData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" /> Fluxo de Abertura de Investigações
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timelineData}>
                                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#fef2f2' }} />
                                <Bar dataKey="processos" fill="#dc2626" radius={[10, 10, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
