"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { AtaModal } from "@/components/modals/AtaModal";

export default function SessoesAtasPage() {
    return (
        <GenericListPage
            title="Atas de Sessões"
            description="Gestão e publicação de atas."
            headerAction={<AtaModal />}
        />
    );
}
