"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmprestimoModal() {
    return (
        <GenericModal
            title="Novo Empréstimo"
            description="Registrar saída temporária de documento."
            trigger={<Button className="uppercase">Emprestar</Button>}
            footer={<Button type="submit" className="uppercase">Registrar Saída</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="solicitante">Solicitante</Label>
                    <Input id="solicitante" placeholder="NOME..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="documento">Documento</Label>
                    <Input id="documento" placeholder="IDENTIFICADOR..." />
                </div>
            </div>
        </GenericModal>
    );
}
