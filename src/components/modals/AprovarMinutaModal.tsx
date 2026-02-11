"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AprovarMinutaModal() {
    return (
        <GenericModal
            title="Aprovar Minuta"
            description="Revisar e aprovar documento."
            trigger={<Button className="uppercase">Revisar Minuta</Button>}
            footer={<Button type="submit" className="uppercase">Confirmar Aprovação</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="minuta">Minuta</Label>
                    <Input id="minuta" placeholder="SELECIONE A MINUTA..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="parecer">Parecer</Label>
                    <Input id="parecer" placeholder="OBSERVAÇÕES..." />
                </div>
            </div>
        </GenericModal>
    );
}
