"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { InventarioModal } from "@/components/modals/InventarioModal";

export default function ArquivoInventarioPage() {
    return (
        <GenericListPage
            title="Inventário"
            description="Controle de inventário do acervo físico."
            headerAction={<InventarioModal />}
        />
    );
}
