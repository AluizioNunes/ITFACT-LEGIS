"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ParlamentarModal() {
    return (
        <GenericModal
            title="Novo Parlamentar"
            description="Cadastrar vereador/deputado."
            trigger={<Button className="uppercase">Novo Parlamentar</Button>}
            footer={<Button type="submit" className="uppercase">Salvar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="nome_parlamentar">Nome Completo</Label>
                    <Input id="nome_parlamentar" placeholder="NOME..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="nome_urna">Nome de Urna</Label>
                    <Input id="nome_urna" placeholder="NOME CONHECIDO..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="partido">Partido</Label>
                    <Input id="partido" placeholder="SIGLA..." />
                </div>
            </div>
        </GenericModal>
    );
}
