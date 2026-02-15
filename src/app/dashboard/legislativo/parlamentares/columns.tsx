"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Parlamentar = {
    id: string;
    nomeParlamentar: string;
    partido: {
        nome: string;
        sigla: string;
        logo: string;
    };
    cargo: string;
    status: "ATIVO" | "LICENCIADO" | "AFASTADO";
    foto: string;
};

export const columns: ColumnDef<Parlamentar>[] = [
    {
        accessorKey: "nomeParlamentar",
        header: "Parlamentar",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={row.original.foto} alt={row.original.nomeParlamentar} />
                    <AvatarFallback>{row.original.nomeParlamentar.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-bold text-slate-900 uppercase">{row.original.nomeParlamentar}</div>
                    <div className="text-xs text-slate-500">Legislatura 24-28</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "partido.sigla",
        header: "Partido",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-bold border-blue-200 text-blue-700 bg-blue-50">
                    {row.original.partido.sigla}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "cargo",
        header: "Cargo / Função",
        cell: ({ row }) => (
            <div className="font-medium text-xs uppercase tracking-wide text-slate-600">
                {row.original.cargo}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge className={
                    status === "ATIVO" ? "bg-green-500" :
                        status === "LICENCIADO" ? "bg-yellow-500" : "bg-red-500"
                }>
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const parlamentar = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(parlamentar.id)}>
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Ver Perfil Completo</DropdownMenuItem>
                        <DropdownMenuItem>Gerenciar Mandatos</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Exonerar / Afastar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
