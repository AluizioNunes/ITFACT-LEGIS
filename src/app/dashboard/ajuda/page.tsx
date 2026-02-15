"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Book,
    Video,
    MessageSquare,
    Search,
    ExternalLink,
    Terminal,
    MessageCircle,
    ArrowRightCircle,
    LifeBuoy,
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

const categories = [
    { title: "Manual do Usuário", icon: Book, desc: "Guia completo com todos os módulos e funcionalidades.", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Vídeo Tutoriais", icon: Video, desc: "Aprenda na prática visualizando nossos passo-a-passo.", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Central de Chamados", icon: MessageSquare, desc: "Solicite suporte técnico ou reporte erros ao time.", color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Documentação API", icon: Terminal, desc: "Referência técnica para integrações e desenvolvedores.", color: "text-slate-600", bg: "bg-slate-50" },
];

const faqs = [
    { q: "Como recuperar minha senha de acesso?", a: "Você pode utilizar o link 'Esqueci minha senha' na tela de login ou solicitar o reset ao administrador do sistema." },
    { q: "Onde encontro o histórico de tramitação?", a: "No módulo de Proposituras, selecione a matéria desejada e clique na aba 'Histórico/Tramitação' para ver todo o log." },
    { q: "Como gerar relatórios em PDF?", a: "Acesse o módulo de Relatórios, escolha o filtro desejado e clique no botão 'Exportar' localizado no topo da página." },
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

export default function AjudaPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const handle = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(handle);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-center text-white overflow-hidden shadow-2xl shadow-blue-200"
            >
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <LifeBuoy className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Central de Conhecimento</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto font-medium text-lg mb-8">
                        Estamos aqui para ajudar com qualquer dúvida que você tenha sobre o sistema ITFACT-LEGIS.
                    </p>

                    <div className="max-w-xl mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Pesquise por manuais, erros ou funcionalidades..."
                            className="bg-white/10 border-white/20 h-14 pl-12 rounded-2xl text-white placeholder:text-blue-200 focus-visible:bg-white focus-visible:text-slate-900 transition-all font-bold"
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* Support Categories */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {categories.map((cat, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 hover:scale-[1.05] transition-all duration-300 h-full group">
                            <CardContent className="p-8 text-center flex flex-col h-full">
                                <div className={`h-16 w-16 mx-auto rounded-3xl ${cat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <cat.icon className={`h-8 w-8 ${cat.color}`} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-2">{cat.title}</h3>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 flex-grow">{cat.desc}</p>
                                <Button variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-100 mt-auto">
                                    Acessar <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* FAQ Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-8 bg-blue-600 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Perguntas Frequentes (FAQ)</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                            >
                                <Card className="border-none shadow-lg shadow-slate-200/40 hover:shadow-blue-100/50 transition-shadow overflow-hidden group">
                                    <CardHeader className="cursor-pointer group-hover:bg-slate-50/50 transition-colors">
                                        <div className="flex justify-between items-center w-full">
                                            <CardTitle className="text-sm font-black text-slate-800 pr-8">{faq.q}</CardTitle>
                                            <ArrowRightCircle className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="bg-slate-50/30">
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Direct Help */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Suporte Direto</h2>
                    </div>

                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500 opacity-20 blur-3xl" />
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-tighter">Fale com um Humano</CardTitle>
                            <CardDescription className="text-slate-400">Nossa equipe técnica está online.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2">
                                <MessageCircle className="h-4 w-4" /> Iniciar Chat Online
                            </Button>
                            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">
                                Horário: 08:00 às 18:00
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-tighter">Status do Sistema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Todos os serviços online</span>
                                </div>
                                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
