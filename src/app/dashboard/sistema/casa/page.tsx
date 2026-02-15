"use client";

import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import {
    Users,
    UserCheck,
    Briefcase,
    Building2,
    Shield,
    History,
    Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CasaLegislativaModal } from "@/components/modals/CasaLegislativaModal";

// Mock Data for Admin Dashboard
const serverData = [
    { name: "Efetivos", value: 45, color: "#3b82f6" },
    { name: "Comissionados", value: 120, color: "#10b981" },
    { name: "Estagiários", value: 30, color: "#f59e0b" },
    { name: "Cedidos", value: 15, color: "#ef4444" },
];

const gabineteData = [
    { name: "GAB 01", servidores: 12, utilizacao: 80 },
    { name: "GAB 02", servidores: 15, utilizacao: 95 },
    { name: "GAB 03", servidores: 10, utilizacao: 60 },
    { name: "GAB 04", servidores: 14, utilizacao: 85 },
    { name: "GAB 05", servidores: 18, utilizacao: 100 },
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

export default function CasaPrincipalPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">Casa Principal</h1>
                    <p className="text-muted-foreground">Gestão Central do ITFACT LEGIS.</p>
                </div>
                <div className="flex gap-2">
                    <CasaLegislativaModal />
                </div>
            </div>

            {/* Admin KPI Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
                <motion.div variants={item}>
                    <Card className="border-l-4 border-l-blue-600">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider">Usuários</CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">245</div>
                            <p className="text-xs text-muted-foreground">Acessos ativos no sistema</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-l-4 border-l-green-600">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider">Parlamentares</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">41</div>
                            <p className="text-xs text-muted-foreground">Vereadores em mandato</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-l-4 border-l-amber-600">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider">Gabinetes</CardTitle>
                            <Briefcase className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">41</div>
                            <p className="text-xs text-muted-foreground">Estruturas administrativas</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-l-4 border-l-purple-600">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider">Servidores</CardTitle>
                            <Settings className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">512</div>
                            <p className="text-xs text-muted-foreground">Corpo técnico total</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-l-4 border-l-red-600">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider">Perfis</CardTitle>
                            <Shield className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">Níveis de permissão</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Main Admin Section */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <Card className="col-span-1 lg:col-span-4 shadow-sm">
                    <CardHeader className="border-b pb-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Distribuição de Servidores</CardTitle>
                                <CardDescription>Composição do quadro funcional por vínculo</CardDescription>
                            </div>
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serverData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {serverData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="hidden md:flex flex-col gap-4 ml-6">
                            {serverData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm font-medium">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-3 shadow-sm">
                    <CardHeader className="border-b pb-4 mb-4">
                        <CardTitle>Ocupação de Gabinetes</CardTitle>
                        <CardDescription>Principais gabinetes por volume de servidores</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={gabineteData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                />
                                <Bar dataKey="servidores" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="mt-6 space-y-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Alterações Recentes de Perfil
                            </h4>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold">User_{i}@cmm.am.gov.br</p>
                                                <p className="text-[10px] text-muted-foreground">Perfil alterado para GESTOR</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">há {i}h</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
