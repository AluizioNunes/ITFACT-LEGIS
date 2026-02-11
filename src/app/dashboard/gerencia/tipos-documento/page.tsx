"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { TipoDocumentoModal } from "@/components/modals/TipoDocumentoModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, TipoDocumento } from "./columns";

const data: TipoDocumento[] = [
    {
        id: "1",
        nome: "PROJETO DE LEI",
        sigla: "PL",
        numeracaoAutomatica: true
    },
    {
        id: "2",
        nome: "REQUERIMENTO",
        sigla: "REQ",
        numeracaoAutomatica: true
    },
    {
        id: "3",
        nome: "OFÍCIO",
        sigla: "OF",
        numeracaoAutomatica: false
    }
]

export default function GerenciaTiposDocumentoPage() {
    return (
        <GenericListPage
            title="Tipos de Documento"
            description="Configuração de tipos de documentos e processos."
            headerAction={<TipoDocumentoModal />}
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} searchKey="nome" />
            </div>
        </GenericListPage>
    );
}
