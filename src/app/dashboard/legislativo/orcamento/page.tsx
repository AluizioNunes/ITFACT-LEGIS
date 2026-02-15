"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus,
    DollarSign,
    AlertCircle,
    TrendingUp
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

const performanceData = [
    { month: "Jan", executado: 4000, previsto: 4500 },
    { month: "Fev", executado: 3000, previsto: 3200 },
    { month: "Mar", executado: 6000, previsto: 5800 },
    { month: "Abr", executado: 2780, previsto: 3000 },
    { month: "Mai", executado: 1890, previsto: 2000 },
    { month: "Jun", executado: 2390, previsto: 2500 },
];

const distributionData = [
    { name: "Educação", value: 35, color: "#2563eb" },
    { name: "Saúde", value: 30, color: "#10b981" },
    { name: "Infraestrutura", value: 20, color: "#f59e0b" },
    { name: "Segurança", value: 15, color: "#ef4444" },
];

export default function OrcamentoDashboard() {
    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <DollarSign className="h-10 w-10 text-emerald-600" />
                        Gestão Orçamentária
                    </h1>
                    <p className="text-slate-500 font-medium">Controle de PPA, LDO, LOA e execução de emendas parlamentares.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600">
                        Exportar Relatório
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-emerald-200">
                        <Plus className="h-6 w-6" />
                        Nova Dotação
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-emerald-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Orçamento Previsto 2026</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">R$ 145.8M</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">Referência: LOA #234/2026</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Emendas Empenhadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">R$ 12.4M</div>
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] uppercase">
                            <TrendingUp className="h-3 w-3" /> 88% executado
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Saldo Disponível</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">R$ 4.2M</div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px] uppercase">
                            <AlertCircle className="h-3 w-3" /> Atenção ao cronograma
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white border-l-4 border-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Status LDO</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black text-emerald-600 uppercase italic">APROVADA</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold">Resolução #09/2026</p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" /> Evolução de Execução Orçamentária
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorEx" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="executado" stroke="#10b981" fillOpacity={1} fill="url(#colorEx)" />
                                <Area type="monotone" dataKey="previsto" stroke="#94a3b8" fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <PieChartIcon className="h-4 w-4 text-emerald-500" /> Distribuição por Área de Atuação
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Fixed import for icons
import { PieChart as PieChartIcon } from "lucide-react";
