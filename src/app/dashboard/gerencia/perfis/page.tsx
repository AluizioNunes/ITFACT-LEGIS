"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { PerfilModal } from "@/components/modals/PerfilModal";

export default function GerenciaPerfisPage() {
    return (
        <GenericListPage
            title="Perfis de Acesso"
            description="Gestão de perfis e permissões."
            headerAction={<PerfilModal />}
        />
    );
}
