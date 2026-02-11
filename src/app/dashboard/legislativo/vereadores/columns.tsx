"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Vereador = {
    id: string;
    nomeParlamentar: string;
    partido: {
        nome: string;
        sigla: string;
    };
    cargo: string;
    status: string;
};

export const columns: ColumnDef<Vereador>[] = [
    {
        accessorKey: "nomeParlamentar",
        header: "Nome Parlamentar",
        cell: ({ row }) => <span className="font-bold text-blue-900 uppercase">{row.original.nomeParlamentar}</span>,
    },
    {
        accessorKey: "partido.sigla",
        header: "Partido",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-bold border-blue-200 text-blue-700">
                {row.original.partido.sigla}
            </Badge>
        ),
    },
    {
        accessorKey: "cargo",
        header: "Cargo",
        cell: ({ row }) => <span className="text-[10px] font-bold uppercase text-slate-500">{row.original.cargo}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge className={row.original.status === "ATIVO" ? "bg-emerald-500" : "bg-amber-500"}>
                {row.original.status}
            </Badge>
        ),
    },
];
