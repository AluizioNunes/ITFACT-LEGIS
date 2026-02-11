"use client";

import GenericListPage from "@/components/layout/GenericListPage";
import { UsuarioModal } from "@/components/modals/UsuarioModal";

export default function GerenciaUsuariosPage() {
    return (
        <GenericListPage
            title="Gerência de Usuários"
            description="Cadastro e controle de acesso de usuários."
            headerAction={<UsuarioModal />}
        />
    );
}
