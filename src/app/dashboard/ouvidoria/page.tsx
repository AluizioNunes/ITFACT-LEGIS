"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Activity,
    Clock,
    Plus
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis
} from "recharts";

const sentimentData = [
    { name: "Elogios", value: 40, color: "#10b981" },
    { name: "Sugestões", value: 35, color: "#3b82f6" },
    { name: "Reclamações", value: 15, color: "#f59e0b" },
    { name: "Denúncias", value: 10, color: "#ef4444" },
];

const topicData = [
    { name: "Saúde", total: 45 },
    { name: "Educação", total: 32 },
    { name: "Infra", total: 28 },
    { name: "Iluminação", total: 24 },
    { name: "Social", total: 18 },
];

export default function OuvidoriaDashboard() {
    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <MessageSquare className="h-10 w-10 text-orange-500" />
                        Ouvidoria & Participação
                    </h1>
                    <p className="text-slate-500 font-medium">Gestão de manifestações, tribuna popular e canais de transparência social.</p>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-orange-200">
                    <Plus className="h-6 w-6" />
                    Nova Manifestação
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-orange-500 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Total de Manifestações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">426</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">Ano base: 2026</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Tempo Médio Resposta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">4.2 dias</div>
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] uppercase">
                            <Clock className="h-3 w-3" /> Meta: 5 dias
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Taxa de Resolução</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">92.4%</div>
                        <p className="text-[10px] mt-1 text-emerald-500 font-bold uppercase tracking-widest">+5% este semestre</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Pessoas Ouvidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">388</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold uppercase tracking-widest">Cidadãos únicos</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-orange-500" /> Termômetro de Satisfação (Sentimento)
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {sentimentData.map((entry, index) => (
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
                            <BarChartIcon className="h-4 w-4 text-orange-500" /> Temas Mais Relevantes
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topicData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                <Tooltip />
                                <Bar dataKey="total" fill="#f97316" radius={[0, 10, 10, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}

import { BarChart as BarChartIcon } from "lucide-react";
