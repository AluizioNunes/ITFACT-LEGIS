"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { ControlePrazosModal } from "@/components/modals/ControlePrazosModal";

export default function TramitacaoPrazosPage() {
    return (
        <GenericListPage
            title="Controle de Prazos"
            description="Monitoramento de vencimentos e alertas de processos."
            headerAction={<ControlePrazosModal />}
        />
    );
}
