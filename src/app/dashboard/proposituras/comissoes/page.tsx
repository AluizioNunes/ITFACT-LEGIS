"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { ComissaoModal } from "@/components/modals/ComissaoModal";

export default function PropositurasComissoesPage() {
    return (
        <GenericListPage
            title="Comissões"
            description="Gestão de comissões permanentes e temporárias."
            headerAction={<ComissaoModal />}
        />
    );
}
