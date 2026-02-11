"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { ArquivarModal } from "@/components/modals/ArquivarModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, Arquivo } from "./columns";

const data: Arquivo[] = [
    {
        id: "1",
        titulo: "PROCESSO ADM 001/2023 - AQUISIÇÃO DE MATERIAIS",
        tipo: "PROCESSO ADM",
        dataDocumento: "10/02/2023",
        localizacao: "ARMÁRIO A, PRATELEIRA 2",
        caixa: "CX-2023-01",
        status: "ARQUIVADO"
    },
    {
        id: "2",
        titulo: "LIVRO DE ATAS 2022",
        tipo: "ATA",
        dataDocumento: "31/12/2022",
        localizacao: "ESTANTE 1, CORREDOR B",
        status: "ARQUIVADO"
    },
    {
        id: "3",
        titulo: "LEI ORGÂNICA ORIGINAL",
        tipo: "LEGISLACAO",
        dataDocumento: "01/01/1990",
        localizacao: "COFRE",
        status: "EMPRESTADO"
    }
]

export default function ArquivoPage() {
    return (
        <GenericListPage
            title="Arquivo Geral"
            description="Gestão do arquivo físico e digital."
            headerAction={<ArquivarModal />}
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} searchKey="titulo" />
            </div>
        </GenericListPage>
    );
}
