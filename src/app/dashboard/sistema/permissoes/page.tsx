"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    ShieldAlert,
    ShieldCheck,
    Lock,
    Unlock,
    TrendingUp,
    Key,
    UserCircle,
    Copy,
    Settings
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockRoles = [
    { id: "1", nome: "Administrador", usuarios: 5, nivel: "Total", status: "Ativo" },
    { id: "2", nome: "Secretário", usuarios: 12, nivel: "Avançado", status: "Ativo" },
    { id: "3", nome: "Assessor", usuarios: 45, nivel: "Intermediário", status: "Ativo" },
    { id: "4", nome: "Consulta", usuarios: 150, nivel: "Básico", status: "Ativo" },
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

export default function PermissoesPage() {
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
                        Gestão de Permissões
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Configuração de níveis de acesso e perfis de segurança.
                    </p>
                </div>
                <Button className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2 bg-blue-600 hover:bg-blue-700 h-11">
                    <ShieldCheck className="h-4 w-4" /> Novo Perfil
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
                    { label: "Perfis Ativos", value: "8", trend: "Estável", icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Acessos Bloqueados", value: "0", trend: "0%", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Permissões Totais", value: "142", trend: "+12", icon: Key, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Usuários Atribuídos", value: "212", trend: "100%", icon: UserCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Roles Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-8"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden h-full">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 px-6 bg-white">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Perfis de Acesso</CardTitle>
                                <CardDescription>Defina o que cada grupo de usuários pode acessar</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Perfil</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível de Acesso</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuários</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockRoles.map((role, i) => (
                                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-black text-slate-700">{role.nome}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="rounded-md font-black text-[9px] tracking-widest uppercase">
                                                        {role.nivel}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-slate-500">{role.usuarios} vinculados</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                        {role.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                                            <Settings className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Security Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-4"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Segurança Ativa</CardTitle>
                            <CardDescription>Ações rápidas de controle</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-slate-700">Audit Log</h4>
                                        <p className="text-[10px] font-medium text-slate-500">Verificar todas as alterações</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Unlock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-slate-700">Zerar Senhas</h4>
                                        <p className="text-[10px] font-medium text-slate-500">Forçar troca no próximo acesso</p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest mt-4">
                                Configurações Avançadas
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
