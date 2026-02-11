"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Archive } from "lucide-react"
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

export type Caixa = {
    id: string
    numero: string
    ano: number
    corredor: string
    estante: string
    prateleira: string
    descricao: string
}

export const columns: ColumnDef<Caixa>[] = [
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
        accessorKey: "numero",
        header: "Caixa",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 font-medium uppercase">
                <Archive className="h-4 w-4 text-muted-foreground" />
                CX-{row.original.numero}/{row.original.ano}
            </div>
        ),
    },
    {
        accessorKey: "localizacao",
        header: "Localização",
        cell: ({ row }) => (
            <div className="uppercase text-xs text-muted-foreground">
                CORREDOR {row.original.corredor} | ESTANTE {row.original.estante} | PRAT. {row.original.prateleira}
            </div>
        ),
    },
    {
        accessorKey: "descricao",
        header: "Conteúdo",
        cell: ({ row }) => <div className="uppercase text-xs truncate max-w-[300px]" title={row.getValue("descricao")}>{row.getValue("descricao")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const caixa = row.original

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(caixa.id)} className="uppercase">
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="uppercase">Editar Etiqueta</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase">Ver Documentos</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase text-red-600">Baixar Caixa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
