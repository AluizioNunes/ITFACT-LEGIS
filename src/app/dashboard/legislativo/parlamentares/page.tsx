"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, Parlamentar } from "./columns";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Users,
    TrendingUp,
    Calendar,
    Award,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend
} from "recharts";
import { ParlamentarModal } from "./ParlamentarModal";

const mockData: Parlamentar[] = [
    { id: "1", nomeParlamentar: "VER. JOÃO SILVA", partido: { nome: "Partido Renovador", sigla: "PR", logo: "" }, cargo: "VEREADOR", status: "ATIVO", foto: "" },
    { id: "2", nomeParlamentar: "VERA. MARIA SOUZA", partido: { nome: "Liderança Cidadã", sigla: "LC", logo: "" }, cargo: "1ª SECRETÁRIA", status: "ATIVO", foto: "" },
    { id: "3", nomeParlamentar: "VER. CARLOS LIMA", partido: { nome: "Partido Renovador", sigla: "PR", logo: "" }, cargo: "VEREADOR", status: "ATIVO", foto: "" },
    { id: "4", nomeParlamentar: "VER. RICARDO OLIVEIRA", partido: { nome: "Independentes", sigla: "IND", logo: "" }, cargo: "VEREADOR", status: "ATIVO", foto: "" },
    { id: "5", nomeParlamentar: "VERA. ANA SANTOS", partido: { nome: "Liderança Cidadã", sigla: "LC", logo: "" }, cargo: "VICE-PRESIDENTE", status: "ATIVO", foto: "" },
];

const chartData = [
    { name: "PR", value: 2, color: "#2563eb" },
    { name: "LC", value: 2, color: "#10b981" },
    { name: "IND", value: 1, color: "#f59e0b" },
];

const productivityData = [
    { name: "Joao Silva", proposituras: 12, presencas: 95 },
    { name: "Maria Souza", proposituras: 18, presencas: 100 },
    { name: "Carlos Lima", proposituras: 8, presencas: 88 },
    { name: "Ricardo Oliveira", proposituras: 15, presencas: 92 },
    { name: "Ana Santos", proposituras: 22, presencas: 98 },
];

export default function ParlamentaresPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header Analítico */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <Users className="h-10 w-10 text-blue-600" />
                        Parlamentares
                    </h1>
                    <p className="text-slate-500 font-medium">Gestão de mandatos, bancadas e análise de produtividade.</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-6 w-6" />
                    Novo Parlamentar
                </Button>
            </div>

            {/* Dashboards Cards - KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80 flex items-center gap-2">
                            <Users className="h-4 w-4" /> Total de Parlamentares
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">15</div>
                        <p className="text-[10px] mt-1 font-medium opacity-70 italic">Legislatura 24-28</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" /> Média de Presença
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">94.8%</div>
                        <p className="text-[10px] mt-1 font-medium text-green-500 font-bold uppercase tracking-widest">+2.4% este mês</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" /> Proposituras no Mês
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">86</div>
                        <p className="text-[10px] mt-1 font-medium text-slate-400 font-bold uppercase tracking-widest">Média 5.7 por parlamentar</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-500" /> Próxima Sessão
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black text-slate-900">12 FEV, 09:00</div>
                        <p className="text-[10px] mt-1 font-medium text-purple-500 font-bold uppercase tracking-widest">Ordinária #12</p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos Analíticos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <BarChartIcon className="h-4 w-4 text-blue-500" /> Top Produtividade (Proposituras)
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] min-h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productivityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="proposituras" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <PieChartIcon className="h-4 w-4 text-blue-500" /> Distribuição por Bancada
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] min-h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-black text-slate-900">03</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Partidos</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabela de Dados (Rodapé do Dashboard) */}
            <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-50 p-6">
                    <CardTitle className="text-lg font-bold text-slate-900 uppercase tracking-tighter">Listagem de Parlamentares</CardTitle>
                </CardHeader>
                <div className="p-4">
                    <DataTable columns={columns} data={mockData} searchKey="nomeParlamentar" />
                </div>
            </Card>

            {/* Modal de CRUD */}
            <ParlamentarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(data) => console.log("Salvar:", data)}
            />
        </div>
    );
}
