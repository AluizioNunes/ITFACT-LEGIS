"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmendaModal() {
    return (
        <GenericModal
            title="Nova Emenda"
            description="Criar emenda para propositura."
            trigger={<Button className="uppercase">Nova Emenda</Button>}
            footer={<Button type="submit" className="uppercase">Salvar Emenda</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="propositura_alvo">Propositura Alvo</Label>
                    <Input id="propositura_alvo" placeholder="BUSCAR PROJETO..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="tipo_emenda">Tipo</Label>
                    <Input id="tipo_emenda" placeholder="MODIFICATIVA, SUPRESSIVA..." />
                </div>
            </div>
        </GenericModal>
    );
}
