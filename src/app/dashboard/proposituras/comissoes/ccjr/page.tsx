"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Gavel,
    FileText,
    Users,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    PenTool
} from "lucide-react";

export default function CCJRDashboard() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
                        <Gavel className="h-8 w-8" /> CCJR - Const. e Justiça
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        Painel da Presidência • Comissão de Constituição, Justiça e Redação Técnica
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" /> Agendar Reunião
                    </Button>
                    <Button className="gap-2">
                        <FileText className="h-4 w-4" /> Gerar Pauta
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-orange-500/5 border-orange-200">
                    <CardHeader className="py-4">
                        <CardTitle className="text-xs uppercase text-orange-600 font-bold">Aguardando Relator</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-700">14</div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/5 border-blue-200">
                    <CardHeader className="py-4">
                        <CardTitle className="text-xs uppercase text-blue-600 font-bold">Em Análise</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">08</div>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/5 border-green-200">
                    <CardHeader className="py-4">
                        <CardTitle className="text-xs uppercase text-green-600 font-bold">Pareceres Concluídos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">122</div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-500/5 border-purple-200">
                    <CardHeader className="py-4">
                        <CardTitle className="text-xs uppercase text-purple-600 font-bold">Próxima Reunião</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold text-purple-700">15 Fev, 14:00</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* List of pending items */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-500" /> Proposituras para Distribuição
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-all group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">PL 04{i}/2026</Badge>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Entrada: 02/02/2026</span>
                                    </div>
                                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                                        Institui o Programa Municipal de Conservação de Áreas Verdes.
                                    </p>
                                </div>
                                <Button size="sm" className="gap-2">
                                    <Users className="h-3 w-3" /> Designar Relator
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Relatores Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PenTool className="h-5 w-5 text-blue-500" /> Carga dos Relatores
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {[
                                { name: "Ver. Mariana Costa", count: 4 },
                                { name: "Ver. Roberto Silva", count: 2 },
                                { name: "Ver. Eliana Rocha", count: 5 }
                            ].map((relator) => (
                                <div key={relator.name} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{relator.name}</span>
                                    <Badge variant="outline" className="border-blue-200 text-blue-700 font-bold">
                                        {relator.count} Processos
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
