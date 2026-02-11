"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    ArrowRight,
    User,
    Building2,
    FileText,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Timer,
    ArrowRightLeft
} from "lucide-react";
import { format, formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data reflecting the new Prisma schema
const mockHistory = [
    {
        id: "1",
        propositura: {
            id: "p1",
            tipo: "Projeto de Lei",
            numero: 123,
            ano: 2026,
            ementa: "Dispõe sobre a criação de áreas verdes no setor central.",
            autor: { name: "Vereador João Mendes" },
            createdAt: "2026-02-01T10:00:00Z"
        },
        origem: { nome: "Gabinete 03", sigla: "GAB03" },
        destino: { nome: "Protocolo Geral", sigla: "PROT" },
        remetente: { name: "Ana Silva" },
        destinatario: { name: "Carlos Oliveira" },
        dataEnvio: "2026-02-09T08:00:00Z",
        dataRecebimento: "2026-02-09T08:15:00Z",
        dataSaida: "2026-02-09T14:30:00Z",
        duracaoSegundos: 22500, // ~6.25 hours
        status: "CONCLUIDO (ENCAMINHADO)",
        observacao: "Documentação conferida e carimbada."
    },
    {
        id: "2",
        propositura: { id: "p1", tipo: "PL", numero: 123, ano: 2026 },
        origem: { nome: "Protocolo Geral", sigla: "PROT" },
        destino: { nome: "Comissão de Justiça", sigla: "CCJR" },
        remetente: { name: "Carlos Oliveira" },
        destinatario: null,
        dataEnvio: "2026-02-09T14:30:00Z",
        dataRecebimento: null,
        dataSaida: null,
        duracaoSegundos: null,
        status: "ENVIADO",
        observacao: "Encaminhado para parecer técnico."
    }
];

export default function TramitacaoHistoricoPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Histórico de Tramitação</h1>
                <p className="text-muted-foreground italic">Rastreamento completo e métricas de permanência por departamento.</p>
            </div>

            <div className="grid gap-6">
                {mockHistory.map((item, index) => (
                    <Card key={item.id} className="relative overflow-hidden border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                            {item.propositura?.tipo} {item.propositura?.numero}/{item.propositura?.ano}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Criado em {item.propositura?.createdAt ? format(new Date(item.propositura.createdAt as string), "dd/MM/yyyy") : "---"}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base line-clamp-1">{item.propositura?.ementa}</CardTitle>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                        <User className="h-3 w-3" /> Autor: {item.propositura?.autor?.name || "N/A"}
                                    </p>
                                </div>
                                <Badge className={item.status.includes("CONCLUIDO") ? "bg-green-500/10 text-green-600 border-green-200" : "bg-blue-500/10 text-blue-600 border-blue-200"}>
                                    {item.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid md:grid-cols-3 gap-8 relative">
                                {/* Flow visualization */}
                                <div className="col-span-1 border-r pr-6 space-y-4">
                                    <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                                        <ArrowRightLeft className="h-4 w-4" /> Movimentação
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-full">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Origem</p>
                                                <p className="text-sm font-semibold">{item.origem.nome} ({item.origem.sigla})</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center py-1">
                                            <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-full">
                                                <Building2 className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Destino</p>
                                                <p className="text-sm font-semibold">{item.destino.nome} ({item.destino.sigla})</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timestamps and Users */}
                                <div className="col-span-1 border-r pr-6 space-y-4">
                                    <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                                        <Clock className="h-4 w-4" /> Registro de Tempo
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-muted-foreground">Enviado por:</span>
                                            <span className="font-bold">{item.remetente.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs pb-1 border-b">
                                            <span className="text-muted-foreground">Data/Hora:</span>
                                            <span className="font-medium">{format(new Date(item.dataEnvio), "dd/MM/yyyy HH:mm")}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-muted-foreground">Recebido por:</span>
                                            <span className="font-bold">{item.destinatario?.name || "Pendente"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs pb-1 border-b">
                                            <span className="text-muted-foreground">Data/Hora:</span>
                                            <span className="font-medium">
                                                {item.dataRecebimento ? format(new Date(item.dataRecebimento), "dd/MM/yyyy HH:mm") : "---"}
                                            </span>
                                        </div>

                                        {item.dataSaida && (
                                            <>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-muted-foreground">Saída em:</span>
                                                    <span className="font-medium">{format(new Date(item.dataSaida), "dd/MM/yyyy HH:mm")}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Metrics and Observations */}
                                <div className="col-span-1 space-y-4">
                                    <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                                        <Timer className="h-4 w-4" /> Permanência
                                    </h3>
                                    {item.duracaoSegundos ? (
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                                <Timer className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Tempo no Setor</p>
                                                <p className="text-xl font-bold text-primary">
                                                    {Math.floor(item.duracaoSegundos / 3600)}h {Math.floor((item.duracaoSegundos % 3600) / 60)}m
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-muted/50 rounded-xl border border-dashed flex items-center gap-4">
                                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground italic">Cálculo pendente (em tramitação)</p>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Observações</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                                            "{item.observacao || "Nenhuma observação registrada."}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
