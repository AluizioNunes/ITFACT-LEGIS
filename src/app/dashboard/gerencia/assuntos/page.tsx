"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { AssuntoModal } from "@/components/modals/AssuntoModal";

export default function GerenciaAssuntosPage() {
    return (
        <GenericListPage
            title="Assuntos"
            description="Gestão de tabela de assuntos e classificação."
            headerAction={<AssuntoModal />}
        />
    );
}
