"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { OrgaoModal } from "@/components/modals/OrgaoModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, Orgao } from "./columns";

const data: Orgao[] = [
    {
        id: "1",
        nome: "GABINETE DO PREFEITO",
        sigla: "GABPREF",
        tipo: "EXTERNO",
        ativo: true
    },
    {
        id: "2",
        nome: "SECRETARIA LEGISLATIVA",
        sigla: "SECLEG",
        tipo: "INTERNO",
        ativo: true
    },
    {
        id: "3",
        nome: "DEPARTAMENTO JURÍDICO",
        sigla: "JURIDICO",
        tipo: "INTERNO",
        ativo: true
    }
]

export default function GerenciaOrgaosPage() {
    return (
        <GenericListPage
            title="Órgãos e Setores"
            description="Estrutura organizacional da casa legislativa."
            headerAction={<OrgaoModal />}
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} searchKey="nome" />
            </div>
        </GenericListPage>
    );
}
