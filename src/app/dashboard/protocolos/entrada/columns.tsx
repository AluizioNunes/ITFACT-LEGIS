"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
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

export type Protocolo = {
    id: string
    numero: string
    ano: number
    data: string
    tipo: string
    origem: string
    assunto: string
    situacao: "PROTOCOLADO" | "EM_TRAMITACAO" | "ARQUIVADO" | "CANCELADO"
}

export const columns: ColumnDef<Protocolo>[] = [
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
        accessorKey: "numero",
        header: "Número",
        cell: ({ row }) => <div className="font-medium uppercase">{row.getValue("numero")}/{row.original.ano}</div>,
    },
    {
        accessorKey: "data",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="uppercase"
                >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("data")}</div>,
    },
    {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) => <div className="uppercase">{row.getValue("tipo")}</div>,
    },
    {
        accessorKey: "origem",
        header: "Origem",
        cell: ({ row }) => <div className="uppercase">{row.getValue("origem")}</div>,
    },
    {
        accessorKey: "assunto",
        header: "Assunto",
        cell: ({ row }) => <div className="uppercase truncate max-w-[200px]" title={row.getValue("assunto")}>{row.getValue("assunto")}</div>,
    },
    {
        accessorKey: "situacao",
        header: "Situação",
        cell: ({ row }) => (
            <div className="uppercase font-bold text-xs">
                {row.getValue("situacao")}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const protocolo = row.original

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(protocolo.id)} className="uppercase">
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="uppercase">Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase">Tramitar</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase">Gerar Etiqueta</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
