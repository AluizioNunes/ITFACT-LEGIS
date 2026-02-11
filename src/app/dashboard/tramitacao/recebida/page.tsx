"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { RecebimentoModal } from "@/components/modals/RecebimentoModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, Tramitacao } from "../columns";

const data: Tramitacao[] = [
    {
        id: "1",
        protocolo: { numero: "005", ano: 2024, assunto: "PROJETO DE LEI 10/2024 - SAÚDE" },
        origem: "GABINETE DO PREFEITO",
        destino: "SECRETARIA LEGISLATIVA",
        dataEnvio: "05/02/2024",
        status: "ENVIADO",
        urgente: true
    },
    {
        id: "2",
        protocolo: { numero: "008", ano: 2024, assunto: "SOLICITAÇÃO DE PARECER JURÍDICO" },
        origem: "COMISSÃO DE JUSTIÇA",
        destino: "SECRETARIA LEGISLATIVA",
        dataEnvio: "06/02/2024",
        status: "ENVIADO",
        urgente: false
    }
]

export default function TramitacaoRecebidaPage() {
    return (
        <GenericListPage
            title="Tramitação: Recebida"
            description="Documentos recebidos aguardando conferência ou processamento."
            headerAction={<RecebimentoModal />}
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} searchKey="protocolo" />
            </div>
        </GenericListPage>
    );
}
