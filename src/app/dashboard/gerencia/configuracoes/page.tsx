"use client";

import GenericListPage from "@/components/layout/GenericListPage";

export default function GerenciaConfiguracoesPage() {
    return (
        <GenericListPage
            title="Configurações Gerais"
            description="Parâmetros globais do sistema."
            actionLabel="Salvar Configurações"
        />
    );
}
