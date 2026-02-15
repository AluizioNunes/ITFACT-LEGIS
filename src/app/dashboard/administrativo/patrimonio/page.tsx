"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Package,
    HardDrive,
    Building,
    Plus,
    Search,
    AlertTriangle,
    CheckCircle
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

const assetValueData = [
    { name: "Móveis", value: 450000, color: "#3b82f6" },
    { name: "Imóveis", value: 1200000, color: "#10b981" },
    { name: "Veículos", value: 350000, color: "#f59e0b" },
    { name: "TI/Equip.", value: 280000, color: "#8b5cf6" },
];

const stateData = [
    { state: "Novo", total: 45 },
    { state: "Bom", total: 120 },
    { state: "Regular", total: 35 },
    { state: "Inservível", total: 12 },
];

export default function PatrimonioDashboard() {
    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <Package className="h-10 w-10 text-blue-500" />
                        Gestão de Patrimônio
                    </h1>
                    <p className="text-slate-500 font-medium">Controle de inventário, tombo, depreciação e movimentação de ativos da Casa.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600 gap-2">
                        <Search className="h-5 w-5" /> Localizar Tombo
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-blue-200">
                        <Plus className="h-6 w-6" />
                        Novo Ativo
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-blue-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Valor Total Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">R$ 2.28M</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">Depreciação anual: 8.5%</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Total de Itens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">212</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold uppercase tracking-widest">Registrados em 2026</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white border-l-4 border-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" /> Manutenção Pendente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">08</div>
                        <p className="text-[10px] mt-1 text-amber-500 font-bold uppercase tracking-widest">Prioridade Alta</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white border-l-4 border-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" /> Inventário 2026
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black text-emerald-600 uppercase italic">CONCLUÍDO</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold tracking-widest uppercase">98.5% Conciliado</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-500" /> Valor Residual por Categoria
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assetValueData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {assetValueData.map((entry, index) => (
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
                            <HardDrive className="h-4 w-4 text-blue-500" /> Estado de Conservação Geral
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stateData}>
                                <XAxis dataKey="state" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="total" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
