"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UsuarioExternoModal() {
    return (
        <GenericModal
            title="Novo Usuário Externo"
            description="Cadastrar cidadão ou entidade externa."
            trigger={<Button className="uppercase">Novo Usuário Externo</Button>}
            footer={<Button type="submit" className="uppercase">Cadastrar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="nome_ext">Nome</Label>
                    <Input id="nome_ext" placeholder="NOME..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="doc_ext">CPF/CNPJ</Label>
                    <Input id="doc_ext" placeholder="DOCUMENTO..." />
                </div>
            </div>
        </GenericModal>
    );
}
