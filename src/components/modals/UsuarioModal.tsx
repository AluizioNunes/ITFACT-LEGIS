"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UsuarioModal() {
    return (
        <GenericModal
            title="Novo Usuário"
            description="Cadastrar usuário do sistema."
            trigger={<Button className="uppercase">Novo Usuário</Button>}
            footer={<Button type="submit" className="uppercase">Salvar Usuário</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="nome_usuario">Nome</Label>
                    <Input id="nome_usuario" placeholder="NOME COMPLETO..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="EMAIL@EXEMPLO.COM" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="perfil">Perfil</Label>
                    <Input id="perfil" placeholder="ADMINISTRADOR, OPERADOR..." />
                </div>
            </div>
        </GenericModal>
    );
}
