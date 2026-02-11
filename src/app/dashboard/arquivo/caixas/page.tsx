"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { CaixaModal } from "@/components/modals/CaixaModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, Caixa } from "./columns";

const data: Caixa[] = [
    {
        id: "1",
        numero: "001",
        ano: 2024,
        corredor: "A",
        estante: "1",
        prateleira: "1",
        descricao: "PROCESSOS ADM 2024 (JAN-MAR)"
    },
    {
        id: "2",
        numero: "002",
        ano: 2024,
        corredor: "A",
        estante: "1",
        prateleira: "2",
        descricao: "LEIS AUTÓGRAFAS 2023"
    }
]

export default function ArquivoCaixasPage() {
    return (
        <GenericListPage
            title="Caixas de Arquivo"
            description="Gestão de caixas e endereçamento."
            headerAction={<CaixaModal />}
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} searchKey="descricao" />
            </div>
        </GenericListPage>
    );
}
