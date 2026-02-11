"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

type Partido = {
    id: string;
    nome: string;
    sigla: string;
    vereadoresCount: number;
};

const columns: ColumnDef<Partido>[] = [
    {
        accessorKey: "sigla",
        header: "Sigla",
        cell: ({ row }) => (
            <Badge className="bg-blue-600 font-bold px-3 py-1">
                {row.original.sigla}
            </Badge>
        ),
    },
    {
        accessorKey: "nome",
        header: "Nome do Partido",
        cell: ({ row }) => <span className="font-bold text-blue-900 uppercase">{row.original.nome}</span>,
    },
    {
        accessorKey: "vereadoresCount",
        header: "Bancada",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-700">{row.original.vereadoresCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vereadores</span>
            </div>
        ),
    },
];

const mockPartidos: Partido[] = [
    { id: "1", nome: "PARTIDO RENOVADOR", sigla: "PR", vereadoresCount: 12 },
    { id: "2", nome: "LIDERANÇA CIDADÃ", sigla: "LC", vereadoresCount: 8 },
    { id: "3", nome: "MOVIMENTO PROGRESSISTA", sigla: "MP", vereadoresCount: 7 },
];

export default function PartidosPage() {
    return (
        <GenericListPage
            title="Partidos Políticos"
            description="Distribuição partidária na câmara legislativa."
            headerAction={
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Partido
                </Button>
            }
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={mockPartidos} searchKey="nome" />
            </div>
        </GenericListPage>
    );
}
