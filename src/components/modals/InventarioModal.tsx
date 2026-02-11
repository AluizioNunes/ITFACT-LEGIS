"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InventarioModal() {
    return (
        <GenericModal
            title="Novo Inventário"
            description="Iniciar processo de inventário."
            trigger={<Button className="uppercase">Novo Inventário</Button>}
            footer={<Button type="submit" className="uppercase">Iniciar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="ano">Ano Referência</Label>
                    <Input id="ano" placeholder="2025..." />
                </div>
            </div>
        </GenericModal>
    );
}
