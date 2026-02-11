"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, MapPin, Archive, Folder } from "lucide-react"
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

export type Arquivo = {
    id: string
    titulo: string
    tipo: string
    dataDocumento: string
    localizacao: string
    caixa?: string
    status: "ARQUIVADO" | "EMPRESTADO" | "EXTRAVIADO" | "ELIMINADO"
}

export const columns: ColumnDef<Arquivo>[] = [
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
        accessorKey: "titulo",
        header: "Documento",
        cell: ({ row }) => <div className="font-medium uppercase truncate max-w-[250px]" title={row.getValue("titulo")}>{row.getValue("titulo")}</div>,
    },
    {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) => <Badge variant="outline" className="uppercase">{row.getValue("tipo")}</Badge>,
    },
    {
        accessorKey: "localizacao",
        header: "Localização",
        cell: ({ row }) => (
            <div className="flex items-center gap-1 uppercase text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {row.getValue("localizacao")}
            </div>
        ),
    },
    {
        accessorKey: "caixa",
        header: "Caixa",
        cell: ({ row }) => {
            const caixa = row.original.caixa;
            return caixa ? (
                <div className="flex items-center gap-1 uppercase text-xs text-muted-foreground">
                    <Archive className="h-3 w-3" />
                    {caixa}
                </div>
            ) : <span className="text-xs text-muted-foreground">-</span>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge variant={status === "ARQUIVADO" ? "default" : status === "EMPRESTADO" ? "secondary" : "destructive"} className="uppercase text-[10px]">
                    {status}
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
                        <DropdownMenuItem className="uppercase">Editar Local</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase">Registrar Empréstimo</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase text-red-600">Desarquivar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
