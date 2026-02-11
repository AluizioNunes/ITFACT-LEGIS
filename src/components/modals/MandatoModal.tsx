"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MandatoModal() {
    return (
        <GenericModal
            title="Novo Mandato"
            description="Registrar mandato parlamentar."
            trigger={<Button className="uppercase">Novo Mandato</Button>}
            footer={<Button type="submit" className="uppercase">Salvar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="parlamentar">Parlamentar</Label>
                    <Input id="parlamentar" placeholder="BUSCAR..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="periodo">Período</Label>
                    <Input id="periodo" placeholder="2025-2028..." />
                </div>
            </div>
        </GenericModal>
    );
}
