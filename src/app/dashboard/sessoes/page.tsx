"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, FileText, CheckCircle2 } from "lucide-react";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

type Sessao = {
    id: string;
    tipo: string;
    data: string;
    status: "AGENDADA" | "EM_ANDAMENTO" | "ENCERRADA" | "CANCELADA";
    legislatura: string;
};

const columns: ColumnDef<Sessao>[] = [
    {
        accessorKey: "data",
        header: "Data/Hora",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="font-bold text-blue-900">{row.original.data}</span>
            </div>
        ),
    },
    {
        accessorKey: "tipo",
        header: "Tipo de Sessão",
        cell: ({ row }) => <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{row.original.tipo}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const statusColors = {
                AGENDADA: "bg-blue-100 text-blue-700 border-blue-200",
                EM_ANDAMENTO: "bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse",
                ENCERRADA: "bg-slate-100 text-slate-700 border-slate-200",
                CANCELADA: "bg-red-100 text-red-700 border-red-200",
            };
            return (
                <Badge variant="outline" className={statusColors[row.original.status]}>
                    {row.original.status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 text-blue-600 font-bold uppercase text-[10px]">
                    <FileText className="h-3.5 w-3.5 mr-1" /> Pauta
                </Button>
                {row.original.status === "EM_ANDAMENTO" ? (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] gap-2">
                        <Play className="h-3.5 w-3.5" /> Acompanhar
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" className="hover:bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                        Ver Ata
                    </Button>
                )}
            </div>
        ),
    },
];

const mockSessoes: Sessao[] = [
    {
        id: "1",
        tipo: "ORDINÁRIA",
        data: "20/02/2026 - 14:00",
        status: "EM_ANDAMENTO",
        legislatura: "20ª Legislatura"
    },
    {
        id: "2",
        tipo: "SOLENE",
        data: "25/02/2026 - 19:00",
        status: "AGENDADA",
        legislatura: "20ª Legislatura"
    }
];

export default function SessoesPage() {
    return (
        <GenericListPage
            title="Sessões Plenárias"
            description="Calendário legislativo, pautas, atas e transmissão ao vivo."
            headerAction={
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl gap-2">
                    <Calendar className="h-4 w-4" />
                    Agendar Sessão
                </Button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <div className="md:col-span-2 space-y-6">
                    <DataTable columns={columns} data={mockSessoes} searchKey="tipo" />
                </div>
                <div className="space-y-6">
                    <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CheckCircle2 className="h-24 w-24" />
                        </div>
                        <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4">Resumo da Legislatura</h4>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-xs uppercase font-bold opacity-60 text-white">Sessões Realizadas</span>
                                <span className="text-2xl font-black">42</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-xs uppercase font-bold opacity-60 text-white">Frequência Média</span>
                                <span className="text-2xl font-black">94%</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xs uppercase font-bold opacity-60 text-white">Votos Registrados</span>
                                <span className="text-2xl font-black">1.284</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GenericListPage>
    );
}
