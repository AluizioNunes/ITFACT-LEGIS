"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, FileText, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export type Minuta = {
    id: string
    titulo: string
    tipo: string
    autor: string
    dataCriacao: string
    status: "RASCUNHO" | "REVISAO" | "FINALIZADO"
    nivelAcesso: "PUBLICO" | "RESTRITO" | "SIGILOSO"
}

export const columns: ColumnDef<Minuta>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "titulo",
        header: "Título / Ementa",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium uppercase">{row.getValue("titulo")}</span>
                <span className="text-xs text-muted-foreground uppercase">{row.original.tipo}</span>
            </div>
        ),
    },
    {
        accessorKey: "autor",
        header: "Autor",
        cell: ({ row }) => <div className="uppercase text-xs">{row.getValue("autor")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge variant={status === "RASCUNHO" ? "secondary" : "default"} className="uppercase text-[10px]">
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "nivelAcesso",
        header: "Acesso",
        cell: ({ row }) => {
            const acesso = row.original.nivelAcesso;
            return (
                <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase">
                    {acesso === "PUBLICO" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {acesso}
                </div>
            )
        },
    },
    {
        accessorKey: "dataCriacao",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="uppercase"
                >
                    Criado em
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("dataCriacao")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const minuta = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="uppercase">Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(minuta.id)} className="uppercase">
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="uppercase">
                            <FileText className="mr-2 h-4 w-4" /> Editar Texto
                        </DropdownMenuItem>
                        <DropdownMenuItem className="uppercase">Gerar PDF</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
