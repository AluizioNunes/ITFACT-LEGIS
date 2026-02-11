"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { MandatoModal } from "@/components/modals/MandatoModal";

export default function LegislativoMandatosPage() {
    return (
        <GenericListPage
            title="Mandatos"
            description="Controle de mandatos e suplências."
            headerAction={<MandatoModal />}
        />
    );
}
