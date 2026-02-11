"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { UsuarioExternoModal } from "@/components/modals/UsuarioExternoModal";

export default function PortalUsuariosPage() {
    return (
        <GenericListPage
            title="Usuários Externos"
            description="Gestão de acesso para cidadãos e entidades externas."
            headerAction={<UsuarioExternoModal />}
        />
    );
}
