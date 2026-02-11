"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ParecerModal() {
    return (
        <GenericModal
            title="Emitir Parecer"
            description="Registrar parecer de comissão."
            trigger={<Button className="uppercase">Novo Parecer</Button>}
            footer={<Button type="submit" className="uppercase">Salvar Parecer</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="relator">Relator</Label>
                    <Input id="relator" placeholder="NOME DO RELATOR..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="voto">Voto</Label>
                    <Input id="voto" placeholder="FAVORÁVEL / CONTRÁRIO..." />
                </div>
            </div>
        </GenericModal>
    );
}
