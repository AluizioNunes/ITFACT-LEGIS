"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ComissaoModal() {
    return (
        <GenericModal
            title="Nova Comissão"
            description="Cadastre uma comissão permanente ou temporária."
            trigger={<Button className="uppercase">Nova Comissão</Button>}
            footer={<Button type="submit" className="uppercase">Criar Comissão</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="nome">Nome da Comissão</Label>
                    <Input id="nome" placeholder="EX: COMISSÃO DE JUSTIÇA..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="sigla">Sigla</Label>
                    <Input id="sigla" placeholder="CCJ..." />
                </div>
            </div>
        </GenericModal>
    );
}
