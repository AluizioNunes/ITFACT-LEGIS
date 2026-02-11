"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PartidoModal() {
    return (
        <GenericModal
            title="Novo Partido"
            description="Cadastrar partido político."
            trigger={<Button className="uppercase">Novo Partido</Button>}
            footer={<Button type="submit" className="uppercase">Salvar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="nome_partido">Nome</Label>
                    <Input id="nome_partido" placeholder="NOME DO PARTIDO..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="sigla_partido">Sigla</Label>
                    <Input id="sigla_partido" placeholder="SIGLA..." />
                </div>
            </div>
        </GenericModal>
    );
}
