"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Key,
    Save,
    Camera,
    CheckCircle2,
    Calendar,
    Briefcase,
    Building2,
    Lock,
    ShieldCheck
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function PerfilPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                        Meu Perfil
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Gerencie suas informações pessoais e configurações de segurança.
                    </p>
                </div>
                <Button className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2 bg-blue-600 hover:bg-blue-700 h-11">
                    <Save className="h-4 w-4" /> Salvar Alterações
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Identity */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
                        <CardContent className="relative pt-0 flex flex-col items-center">
                            <div className="relative -mt-16 group">
                                <div className="h-32 w-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                    <User className="h-16 w-16 text-slate-300" />
                                </div>
                                <Button size="icon" className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-white border border-slate-200 text-blue-600 shadow-lg hover:bg-blue-50">
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="text-center mt-6">
                                <h2 className="text-xl font-black text-slate-900">Admin Itfact</h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Administrador do Sistema</p>

                                <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                                    <Shield className="h-3.5 w-3.5" /> Acesso Total Liberado
                                </div>
                            </div>

                            <div className="h-px bg-slate-100 w-full my-6" />

                            <div className="w-full space-y-4">
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    <span>Câmara Municipal de Exemplo</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    <span>Secretaria de Administração</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span>No time desde Jan 2024</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Profile Details Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-8 space-y-8"
                >
                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tighter">Informações Pessoais</CardTitle>
                            <CardDescription>Estes dados serão utilizados em documentos e relatórios do sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Nome Completo</Label>
                                    <Input defaultValue="Administrador Itfact" className="rounded-xl border-slate-100 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Institucional</Label>
                                    <Input defaultValue="admin@camara.gov.br" className="rounded-xl border-slate-100 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Telefone / Ramal</Label>
                                    <Input defaultValue="(11) 98765-4321" className="rounded-xl border-slate-100 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Localização / Mesa</Label>
                                    <Input defaultValue="Bloco A - Sala 204" className="rounded-xl border-slate-100 font-bold" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tighter">Segurança & Acesso</CardTitle>
                            </div>
                            <CardDescription>Mantenha sua senha segura e altere-a regularmente.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700">Senha</h4>
                                        <p className="text-xs text-slate-500">Última alteração há 45 dias</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-9 border-slate-200">
                                    Alterar Senha
                                </Button>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700">Autenticação de Dois Fatores</h4>
                                        <p className="text-xs text-slate-500">Ativa via App de Autenticação</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-3">PROTEGIDO</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
