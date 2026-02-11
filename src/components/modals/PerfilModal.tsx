"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PerfilModal() {
    return (
        <GenericModal
            title="Novo Perfil"
            description="Criar grupo de permissões."
            trigger={<Button className="uppercase">Novo Perfil</Button>}
            footer={<Button type="submit" className="uppercase">Salvar Perfil</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="nome_perfil">Nome do Perfil</Label>
                    <Input id="nome_perfil" placeholder="EX: TÉCNICO LEGISLATIVO..." />
                </div>
            </div>
        </GenericModal>
    );
}
