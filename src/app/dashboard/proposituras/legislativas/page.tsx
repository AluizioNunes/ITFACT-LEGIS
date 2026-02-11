"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { ProposituraModal } from "@/components/modals/ProposituraModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, Propositura } from "./columns";

const data: Propositura[] = [
    {
        id: "1",
        numero: "001",
        ano: 2024,
        tipo: "PROJETO DE LEI",
        ementa: "Dispõe sobre aobrigatoriedade de instalação de câmeras nas escolas municipais.",
        autor: "VER. CARLOS SILVA",
        dataApresentacao: "10/01/2024",
        status: "EM_TRAMITACAO"
    },
    {
        id: "2",
        numero: "018",
        ano: 2024,
        tipo: "REQUERIMENTO",
        ementa: "Solicita informações sobre a pavimentação da Rua das Flores.",
        autor: "VER. MARIA OLIVEIRA",
        dataApresentacao: "12/01/2024",
        status: "APROVADO"
    }
]

export default function PropositurasLegislativasPage() {
    return (
        <GenericListPage
            title="Proposituras Legislativas"
            description="Gestão de Projetos de Lei, Requerimentos e Indicações."
            headerAction={<ProposituraModal />}
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} searchKey="ementa" />
            </div>
        </GenericListPage>
    );
}
