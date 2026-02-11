"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { EmprestimoModal } from "@/components/modals/EmprestimoModal";

export default function ArquivoEmprestimosPage() {
    return (
        <GenericListPage
            title="Empréstimos"
            description="Controle de empréstimos de documentos físicos."
            headerAction={<EmprestimoModal />}
        />
    );
}
