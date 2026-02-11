"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Calendar, Clock, MapPin } from "lucide-react"
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

export type Sessao = {
    id: string
    numero: number
    ano: number
    tipo: "ORDINARIA" | "EXTRAORDINARIA" | "SOLENE" | "ESPECIAL"
    data: string
    hora: string
    local: string
    status: "AGENDADA" | "ABERTA" | "ENCERRADA" | "CANCELADA"
}

export const columns: ColumnDef<Sessao>[] = [
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
        header: "Sessão",
        cell: ({ row }) => <div className="font-medium uppercase">{row.original.numero}ª SESSÃO {row.original.ano}</div>,
    },
    {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) => <Badge variant="outline" className="uppercase">{row.getValue("tipo")}</Badge>,
    },
    {
        accessorKey: "data",
        header: "Data / Hora",
        cell: ({ row }) => (
            <div className="flex flex-col text-sm">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {row.original.data}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {row.original.hora}</span>
            </div>
        ),
    },
    {
        accessorKey: "local",
        header: "Local",
        cell: ({ row }) => (
            <div className="flex items-center gap-1 uppercase text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {row.getValue("local")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge variant={status === "ABERTA" ? "default" : status === "ENCERRADA" ? "secondary" : "outline"} className="uppercase text-[10px]">
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const sessao = row.original

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sessao.id)} className="uppercase">
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="uppercase">Visualizar Pauta</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase">Gerar Ata</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase text-red-600">Cancelar Sessão</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
