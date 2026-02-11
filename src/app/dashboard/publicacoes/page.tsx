"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Globe,
    ShieldCheck,
    Plus,
    Search,
    FileText,
    History,
    CheckCircle
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from "recharts";

const statsData = [
    { day: "01/02", docs: 12 },
    { day: "02/02", docs: 15 },
    { day: "03/02", docs: 8 },
    { day: "04/02", docs: 22 },
    { day: "05/02", docs: 31 },
    { day: "06/02", docs: 19 },
    { day: "07/02", docs: 25 },
];

const typeData = [
    { name: "Leis", value: 40, color: "#3b82f6" },
    { name: "Decretos", value: 30, color: "#10b981" },
    { name: "Portarias", value: 20, color: "#f59e0b" },
    { name: "Editais", value: 10, color: "#ef4444" },
];

export default function PublicacoesDashboard() {
    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        <BookOpen className="h-10 w-10 text-indigo-500" />
                        Diário Oficial (e-DOLM)
                    </h1>
                    <p className="text-slate-500 font-medium">Gestão de edições, publicações eletrônicas, autenticidade e arquivo digital oficial.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-bold text-slate-600 gap-2">
                        <History className="h-5 w-5" /> Edições Anteriores
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-indigo-200 transition-transform hover:scale-105">
                        <Plus className="h-6 w-6" />
                        Nova Edição
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-indigo-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase opacity-80">Edições Publicadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">1.142</div>
                        <p className="text-[10px] mt-1 opacity-70 italic">Série histórica digital</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" /> Atos em Fila
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">24</div>
                        <p className="text-[10px] mt-1 text-blue-500 font-bold uppercase tracking-widest">Próxima Edição: Amanhã</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white border-l-4 border-indigo-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-emerald-500" /> Alcance Médio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">4.5k</div>
                        <p className="text-[10px] mt-1 text-emerald-500 font-bold uppercase tracking-widest">Acessos únicos/dia</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-slate-500" /> Integridade Blockchain
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black text-slate-900 uppercase italic">VERIFICADO</div>
                        <CheckCircle className="h-4 w-4 text-emerald-500 inline ml-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <Search className="h-4 w-4 text-indigo-500" /> Volume de Documentos por Edição
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={statsData}>
                                <defs>
                                    <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} hide />
                                <Tooltip />
                                <Area type="monotone" dataKey="docs" stroke="#6366f1" fillOpacity={1} fill="url(#colorDocs)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-indigo-500" /> Tipos de Atos Publicados
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
