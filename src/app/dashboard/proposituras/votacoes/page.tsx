"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { VotacaoModal } from "@/components/modals/VotacaoModal";

export default function PropositurasVotacoesPage() {
    return (
        <GenericListPage
            title="Votações"
            description="Painel de votações e registro de resultados."
            headerAction={<VotacaoModal />}
        />
    );
}
