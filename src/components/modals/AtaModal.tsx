"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AtaModal() {
    return (
        <GenericModal
            title="Nova Ata"
            description="Registrar ata de sessão."
            trigger={<Button className="uppercase">Nova Ata</Button>}
            footer={<Button type="submit" className="uppercase">Salvar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="texto_ata">Conteúdo</Label>
                    <Input id="texto_ata" placeholder="TEXTO DA ATA..." />
                </div>
            </div>
        </GenericModal>
    );
}
