"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { ParlamentarModal } from "@/components/modals/ParlamentarModal";

export default function LegislativoParlamentaresPage() {
    return (
        <GenericListPage
            title="Parlamentares"
            description="Gestão de vereadores e dados parlamentares."
            headerAction={<ParlamentarModal />}
        />
    );
}
