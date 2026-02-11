"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Scale,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Plus
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const legislationStats = [
    { name: "Jan", sancionadas: 15, vetadas: 2 },
    { name: "Fev", sancionadas: 22, vetadas: 4 },
    { name: "Mar", sancionadas: 18, vetadas: 1 },
    { name: "Abr", sancionadas: 25, vetadas: 5 },
    { name: "Mai", sancionadas: 12, vetadas: 0 },
];

export default function LegislacaoDashboard() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <Scale className="h-10 w-10 text-indigo-600" />
                        Repositório Legal
                    </h1>
                    <p className="text-slate-500 font-medium">Controle de Leis Sancionadas, Vetos Executivos e Promulgações.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600 gap-2">
                        <Search className="h-5 w-5" /> Pesquisa Avançada
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-indigo-200">
                        <Plus className="h-6 w-6" /> Novo Ato Legal
                    </Button>
                </div>
            </div>

            {/* Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-indigo-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Leis Sancionadas (2026)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">92</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">+12% em relação a 2025</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Vetos Recebidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">12</div>
                        <div className="flex items-center gap-1 text-red-500 font-bold text-[10px] uppercase">
                            8 Totais | 4 Parciais
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Vetos Derrubados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">03</div>
                        <div className="flex items-center gap-1 text-indigo-500 font-bold text-[10px] uppercase">
                            25% Taxa de Reversão
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400">Tempo Médio P/ Sancão</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">14d</div>
                        <p className="text-[10px] mt-1 text-slate-400 font-bold uppercase tracking-widest">Dentro do fluxo legal</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-8">
                    <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-500" /> Comparativo: Atos Sancionados vs Vetados
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[400px] w-full mt-6 min-h-[400px]">
                        {mounted && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={legislationStats}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />

                                    <Legend />
                                    <Bar dataKey="sancionadas" fill="#4f46e5" radius={[10, 10, 0, 0]} name="Sancionadas" barSize={50} />
                                    <Bar dataKey="vetadas" fill="#f87171" radius={[10, 10, 0, 0]} name="Vetadas" barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
