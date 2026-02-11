"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { TramitarDocumentoModal } from "@/components/modals/TramitarDocumentoModal";
import { DataTable } from "@/components/ui/data-table";
import { columns, Tramitacao } from "../columns";

const data: Tramitacao[] = [
    {
        id: "3",
        protocolo: { numero: "001", ano: 2024, assunto: "MEMORANDO INTERNO - FERIAS" },
        origem: "SECRETARIA LEGISLATIVA",
        destino: "RECURSOS HUMANOS",
        dataEnvio: "01/02/2024",
        dataRecebimento: "02/02/2024",
        status: "RECEBIDO",
        urgente: false
    },
    {
        id: "4",
        protocolo: { numero: "015", ano: 2024, assunto: "ENVIO DE AUTÓGRAFO DE LEI" },
        origem: "SECRETARIA LEGISLATIVA",
        destino: "GABINETE DO PREFEITO",
        dataEnvio: "07/02/2024",
        status: "ENVIADO",
        urgente: true
    }
]

export default function TramitacaoEnviadaPage() {
    return (
        <GenericListPage
            title="Tramitação: Enviada"
            description="Histórico de documentos enviados para outros setores."
            headerAction={<TramitarDocumentoModal />}
        >
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} searchKey="protocolo" />
            </div>
        </GenericListPage>
    );
}
