"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users2,
    Briefcase,
    ShieldCheck,
    ArrowUpRight,
    Search,
    Plus,
    UserCircle
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid
} from "recharts";

const staffGrowth = [
    { month: "Jan", efetivos: 45, comissionados: 20 },
    { month: "Fev", efetivos: 46, comissionados: 22 },
    { month: "Mar", efetivos: 48, comissionados: 21 },
    { month: "Abr", efetivos: 48, comissionados: 25 },
    { month: "Mai", efetivos: 50, comissionados: 28 },
];

export default function RHDashboard() {
    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <UserCircle className="h-10 w-10 text-cyan-500" />
                        Recursos Humanos
                    </h1>
                    <p className="text-slate-500 font-medium">Gestão funcional de servidores, estagiários e cargos em comissão.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600 gap-2">
                        <Search className="h-5 w-5" /> Buscar Servidor
                    </Button>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-cyan-100">
                        <Plus className="h-6 w-6" /> Novo Cadastro
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-cyan-500 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Quadro de Pessoal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">78</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">Servidores Ativos</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> Efetivos vs Comissionados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">50 / 28</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold uppercase tracking-widest">Proporção 1.7x</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Em Adicional de Tempo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">12</div>
                        <div className="flex items-center gap-1 text-cyan-500 font-bold text-[10px] uppercase">
                            <ArrowUpRight className="h-3 w-3" /> Processos em curso
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Folha de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900">R$ 645.2K</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold uppercase tracking-widest">Previsão Competência FEV</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-8">
                    <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <Users2 className="h-5 w-5 text-cyan-500" /> Crescimento e Estabilidade do Quadro
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[400px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={staffGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="efetivos" stroke="#06b6d4" strokeWidth={4} dot={{ r: 6, fill: '#06b6d4' }} name="Efetivos" />
                                <Line type="monotone" dataKey="comissionados" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Comissionados" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
