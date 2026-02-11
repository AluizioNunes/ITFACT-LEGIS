"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ExpedicaoMinutaModal() {
    return (
        <GenericModal
            title="Expedir Minuta"
            description="Transformar minuta em documento oficial."
            trigger={<Button className="uppercase">Expedir</Button>}
            footer={<Button type="submit" className="uppercase">Expedir Documento</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="numero_doc">Número Gerado</Label>
                    <Input id="numero_doc" placeholder="AUTOMÁTICO..." disabled />
                </div>
            </div>
        </GenericModal>
    );
}
