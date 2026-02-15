"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Gavel,
    Clock,
    TrendingUp,
    Plus,
    BookOpen,
    Filter
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
    Pie,
    Legend
} from "recharts";

const commissionData = [
    { name: "Projetos em Relatoria", value: 35, color: "#2563eb" },
    { name: "Pareceres Emitidos", value: 45, color: "#10b981" },
    { name: "Aguardando Prazo", value: 20, color: "#f59e0b" },
];

const productivityData = [
    { name: "CCJR", pareceres: 24, fill: "#2563eb" },
    { name: "CFO", pareceres: 18, fill: "#3b82f6" },
    { name: "CVP", pareceres: 12, fill: "#60a5fa" },
    { name: "COURS", pareceres: 8, fill: "#93c5fd" },
];

export default function ComissoesDashboard() {
    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <Gavel className="h-10 w-10 text-blue-600" />
                        Comissões Técnicas
                    </h1>
                    <p className="text-slate-500 font-medium">Análise de produtividade legislativa, tramitação de pareceres e quórum das comissões permanentes.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600 gap-2">
                        <Filter className="h-5 w-5" /> Ver Todas as Atas
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-blue-200">
                        <Plus className="h-6 w-6" />
                        Criar Parecer
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-blue-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Matérias em Tramitação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">42</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">CCJR: 15 matérias pendentes</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Tempo Médio Parecer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">8.4 dias</div>
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] uppercase">
                            <TrendingUp className="h-3 w-3" /> Eficiência +15%
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white border-l-4 border-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" /> Prazos Críticos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">03</div>
                        <p className="text-[10px] mt-1 text-amber-500 font-bold uppercase tracking-widest">Matérias c/ prazo {"<"} 48h</p>

                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white shadow-xl shadow-blue-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Comissões Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">07</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold tracking-widest uppercase">Legislatura 24-28</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" /> Funil de Pareceres Legislativos
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={commissionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {commissionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" /> Produtividade por Comissão (Dotação)
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productivityData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="pareceres" fill="#2563eb" radius={[0, 10, 10, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
