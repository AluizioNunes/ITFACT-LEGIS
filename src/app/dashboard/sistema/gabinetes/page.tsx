"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Briefcase,
    Users,
    TrendingUp,
    Plus,
    Building2,
    Building
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function GabinetesPage() {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase transition-all">
                        Gestão de Gabinetes
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Monitoramento e estrutura dos gabinetes parlamentares.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2 bg-blue-600 hover:bg-blue-700 h-11">
                        <Plus className="h-4 w-4" /> Novo Gabinete
                    </Button>
                </div>
            </motion.div>

            {/* KPI Section */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: "Total Gabinetes", value: "21", trend: "Ativos", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Servidores em Gabinete", value: "84", trend: "+4 este mês", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Taxa de Ocupação", value: "95%", trend: "Estável", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Processos Internos", value: "142", trend: "+12%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((kpi, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
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

            <Card className="border-none shadow-xl shadow-slate-200/50">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 px-6">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Lista de Gabinetes</CardTitle>
                        <CardDescription>Visualização da estrutura parlamentar</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0 text-center py-20">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                        <Building className="h-12 w-12 opacity-20" />
                        <p className="font-bold uppercase text-xs tracking-widest italic">Implementação técnica em andamento...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
