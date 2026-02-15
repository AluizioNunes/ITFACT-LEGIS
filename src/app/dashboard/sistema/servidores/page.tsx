"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Briefcase,
    ShieldCheck,
    UserCheck,
    TrendingUp,
    ArrowUpRight,
    Clock
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockServidores = [
    { id: "1", nome: "José Oliveira", cargo: "Assessor Legislativo", departamento: "Secretaria Geral", status: "Ativo", desde: "15/01/2022" },
    { id: "2", nome: "Maria Santos", cargo: "Analista de TI", departamento: "Informática", status: "Férias", desde: "10/05/2021" },
    { id: "3", nome: "Roberto Silva", cargo: "Agente Administrativo", departamento: "Recursos Humanos", status: "Ativo", desde: "20/03/2023" },
    { id: "4", nome: "Ana Paula", cargo: "Consultora Jurídica", departamento: "Jurídico", status: "Ativo", desde: "02/11/2020" },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function ServidoresPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const handle = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(handle);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase transition-all">
                        Gestão de Servidores
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Administração completa do quadro de funcionários e colaboradores.
                    </p>
                </div>
                <Button className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2 bg-blue-600 hover:bg-blue-700 h-11">
                    <UserPlus className="h-4 w-4" /> Novo Servidor
                </Button>
            </motion.div>

            {/* KPI Section */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: "Total Servidores", value: "124", trend: "+3", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Em Atividade", value: "115", trend: "92%", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Cedidos / Fora", value: "9", trend: "-1", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Acessos Hoje", value: "88", trend: "+12%", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
                ].map((kpi, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        {kpi.trend}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</h3>
                                    <p className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* List Table Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 px-6 bg-white">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Quadro de Pessoal</CardTitle>
                            <CardDescription>Visualização detalhada por cargo e departamento</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Buscar por nome..." className="pl-10 h-10 w-[250px] border-slate-100 rounded-xl" />
                            </div>
                            <Button variant="outline" className="h-10 rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest border-slate-100">
                                <Filter className="h-4 w-4" /> Filtros
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Servidor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo / Função</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Departamento</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Admissão</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockServidores.map((servidor, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                        {servidor.nome.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{servidor.nome}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-slate-600">{servidor.cargo}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-3 w-3 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-500">{servidor.departamento}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${servidor.status === 'Ativo' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {servidor.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-400">{servidor.desde}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
