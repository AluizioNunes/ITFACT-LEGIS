"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, FileText, User } from "lucide-react"
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

export type Propositura = {
    id: string
    numero: string
    ano: number
    tipo: string
    ementa: string
    autor: string
    dataApresentacao: string
    status: "APRESENTADO" | "EM_TRAMITACAO" | "APROVADO" | "REJEITADO" | "ARQUIVADO"
}

export const columns: ColumnDef<Propositura>[] = [
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
        header: "Propositura",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold uppercase">{row.original.tipo} {row.original.numero}/{row.original.ano}</span>
            </div>
        ),
    },
    {
        accessorKey: "ementa",
        header: "Ementa",
        cell: ({ row }) => <div className="uppercase truncate max-w-[300px]" title={row.getValue("ementa")}>{row.getValue("ementa")}</div>,
    },
    {
        accessorKey: "autor",
        header: "Autor",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 uppercase text-xs">
                <User className="h-3 w-3" />
                {row.getValue("autor")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge variant={status === "APROVADO" ? "default" : status === "REJEITADO" ? "destructive" : "secondary"} className="uppercase text-[10px]">
                    {status.replace("_", " ")}
                </Badge>
            )
        },
    },
    {
        accessorKey: "dataApresentacao",
        header: "Data",
        cell: ({ row }) => <div className="text-xs">{row.getValue("dataApresentacao")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const prop = row.original

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(prop.id)} className="uppercase">
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="uppercase">
                            <FileText className="mr-2 h-4 w-4" /> Ver Texto Integral
                        </DropdownMenuItem>
                        <DropdownMenuItem className="uppercase">Histórico de Tramitação</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase text-blue-600">Votação</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
