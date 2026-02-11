"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { LegislaturaModal } from "@/components/modals/LegislaturaModal";

export default function LegislativoLegislaturasPage() {
    return (
        <GenericListPage
            title="Legislaturas"
            description="Gestão de legislaturas e períodos legislativos."
            headerAction={<LegislaturaModal />}
        />
    );
}
