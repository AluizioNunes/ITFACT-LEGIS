"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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

export type TipoDocumento = {
    id: string
    nome: string
    sigla: string
    numeracaoAutomatica: boolean
}

export const columns: ColumnDef<TipoDocumento>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nome",
        header: "Nome do Tipo",
        cell: ({ row }) => <div className="font-medium uppercase">{row.getValue("nome")}</div>,
    },
    {
        accessorKey: "sigla",
        header: "Sigla",
        cell: ({ row }) => <div className="font-bold uppercase">{row.getValue("sigla")}</div>,
    },
    {
        accessorKey: "numeracaoAutomatica",
        header: "Numeração",
        cell: ({ row }) => {
            const auto = row.original.numeracaoAutomatica;
            return (
                <Badge variant={auto ? "secondary" : "outline"} className="uppercase text-[10px]">
                    {auto ? "AUTOMÁTICA" : "MANUAL"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const doc = row.original

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(doc.id)} className="uppercase">
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="uppercase">Editar</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
