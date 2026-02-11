"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, AlertCircle, CheckCircle2 } from "lucide-react"
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

export type Tramitacao = {
    id: string
    protocolo: {
        numero: string
        ano: number
        assunto: string
    }
    origem: string
    destino: string
    dataEnvio: string
    dataRecebimento?: string
    status: "ENVIADO" | "RECEBIDO" | "DEVOLVIDO" | "RECUSADO"
    urgente: boolean
}

export const columns: ColumnDef<Tramitacao>[] = [
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
        accessorKey: "protocolo",
        header: "Protocolo",
        cell: ({ row }) => {
            const proto = row.original.protocolo;
            return <div className="font-medium uppercase">{proto.numero}/{proto.ano}</div>
        },
    },
    {
        accessorKey: "assunto",
        header: "Assunto",
        cell: ({ row }) => <div className="uppercase truncate max-w-[200px]">{row.original.protocolo.assunto}</div>,
    },
    {
        accessorKey: "origem",
        header: "Origem",
        cell: ({ row }) => <div className="uppercase text-xs">{row.getValue("origem")}</div>,
    },
    {
        accessorKey: "destino",
        header: "Destino",
        cell: ({ row }) => <div className="uppercase text-xs font-bold">{row.getValue("destino")}</div>,
    },
    {
        accessorKey: "urgente",
        header: "Prioridade",
        cell: ({ row }) => {
            return row.original.urgente ?
                <Badge variant="destructive" className="uppercase text-[10px]">Urgente</Badge> :
                <Badge variant="outline" className="uppercase text-[10px]">Normal</Badge>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <div className="flex items-center gap-2">
                    {status === "ENVIADO" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    {status === "RECEBIDO" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    <span className="uppercase text-xs font-medium">{status}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "dataEnvio",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="uppercase"
                >
                    Enviado em
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("dataEnvio")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const tramitacao = row.original

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tramitacao.id)} className="uppercase">
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="uppercase">Ver Despacho</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase">Histórico</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
