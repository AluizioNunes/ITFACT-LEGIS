"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LegislaturaModal() {
    return (
        <GenericModal
            title="Nova Legislatura"
            description="Cadastrar período legislativo."
            trigger={<Button className="uppercase">Nova Legislatura</Button>}
            footer={<Button type="submit" className="uppercase">Salvar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="numero_leg">Número</Label>
                    <Input id="numero_leg" placeholder="18ª..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="inicio">Início</Label>
                    <Input id="inicio" type="date" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="fim">Fim</Label>
                    <Input id="fim" type="date" />
                </div>
            </div>
        </GenericModal>
    );
}
