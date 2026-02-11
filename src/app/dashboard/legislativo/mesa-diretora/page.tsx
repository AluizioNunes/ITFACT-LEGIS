"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Gavel,
    Calendar,
    Award,
    Plus,
    Scale,
    Activity,
    History
} from "lucide-react";
import {
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis
} from "recharts";

const compositionData = [
    { name: "Cargos Ocupados", count: 7, fill: "#2563eb" },
    { name: "Cargos Vagos", count: 3, fill: "#e2e8f0" },
];

const activityData = [
    { name: "Reuniões", total: 12 },
    { day: "Seg", total: 4 },
    { day: "Ter", total: 6 },
    { day: "Qua", total: 2 },
    { day: "Qui", total: 8 },
    { day: "Sex", total: 3 },
];

export default function MesaDiretoraDashboard() {
    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <Award className="h-10 w-10 text-blue-800" />
                        Mesa Diretora
                    </h1>
                    <p className="text-slate-500 font-medium">Gestão de liderança, biênios, composição administrativa e atos de presidência.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600 gap-2">
                        <History className="h-5 w-5" /> Histórico de Mesas
                    </Button>
                    <Button className="bg-blue-800 hover:bg-blue-900 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-blue-200">
                        <Plus className="h-6 w-6" />
                        Nova Eleição
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-blue-800 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Gestão Atual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">2026-2028</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">Biênio B - Legislatura 24-28</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Total de Membros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">10</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold uppercase tracking-widest">Cargos Proporcionais</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" /> Reuniões da Mesa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">24</div>
                        <p className="text-[10px] mt-1 text-blue-500 font-bold uppercase tracking-widest">Realizadas em 2026</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Scale className="h-4 w-4 text-slate-500" /> Atos de Mesa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">156</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold uppercase tracking-widest">Assinados Eletronicamente</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-800" /> Ocupação de Cargos
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="30%"
                                outerRadius="100%"
                                barSize={20}
                                data={compositionData}
                            >
                                <RadialBar
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    dataKey="count"
                                    cornerRadius={10}
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-800" /> Volume de Atos da Presidência
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="total" fill="#1e3a8a" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
