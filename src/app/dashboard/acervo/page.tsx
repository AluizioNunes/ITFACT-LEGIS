"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { AcervoDocumentoModal } from "@/components/modals/AcervoDocumentoModal";

export default function AcervoPage() {
    return (
        <GenericListPage
            title="Acervo Documental"
            description="Catálogo de documentos históricos e legislativos."
            headerAction={<AcervoDocumentoModal />}
        />
    );
}
