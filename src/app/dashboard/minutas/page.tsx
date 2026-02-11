"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { MinutaModal } from "@/components/modals/MinutaModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, Minuta } from "./columns";

const data: Minuta[] = [
    {
        id: "1",
        titulo: "DISPÕE SOBRE A COLETA SELETIVA NO MUNICÍPIO",
        tipo: "PROJETO DE LEI",
        autor: "VEREADOR CARLOS SILVA",
        dataCriacao: "10/02/2024",
        status: "RASCUNHO",
        nivelAcesso: "RESTRITO"
    },
    {
        id: "2",
        titulo: "REQUER INFORMAÇÕES SOBRE OBRAS DA PRAÇA CENTRAL",
        tipo: "REQUERIMENTO",
        autor: "VEREADORA MARIA OLIVEIRA",
        dataCriacao: "11/02/2024",
        status: "REVISAO",
        nivelAcesso: "PUBLICO"
    },
    {
        id: "3",
        titulo: "CONCEDE TÍTULO DE CIDADÃO HONORÁRIO A...",
        tipo: "DECRETO LEGISLATIVO",
        autor: "MESA DIRETORA",
        dataCriacao: "12/02/2024",
        status: "FINALIZADO",
        nivelAcesso: "SIGILOSO"
    }
]

export default function MinutasPage() {
    return (
        <GenericListPage
            title="Minutas"
            description="Elaboração e revisão de textos legislativos e administrativos."
            headerAction={<MinutaModal />}
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} searchKey="titulo" />
            </div>
        </GenericListPage>
    );
}
