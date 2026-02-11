"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { PautaModal } from "@/components/modals/PautaModal";

export default function SessoesPautasPage() {
    return (
        <GenericListPage
            title="Pautas e Ordem do Dia"
            description="Gestão de pautas para sessões."
            headerAction={<PautaModal />}
        />
    );
}
