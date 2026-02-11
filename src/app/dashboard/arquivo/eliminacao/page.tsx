"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { EliminacaoModal } from "@/components/modals/EliminacaoModal";

export default function ArquivoEliminacaoPage() {
    return (
        <GenericListPage
            title="Eliminação de Documentos"
            description="Gestão de descarte e tabela de temporalidade."
            headerAction={<EliminacaoModal />}
        />
    );
}
