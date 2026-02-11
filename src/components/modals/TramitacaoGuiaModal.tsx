"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TramitacaoGuiaModal() {
    return (
        <GenericModal
            title="Gerar Guia de Tramitação"
            description="Emitir guia para transporte físico de documentos."
            trigger={<Button className="uppercase">Nova Guia</Button>}
            footer={<Button type="submit" className="uppercase">Gerar Guia</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="destino">Destino</Label>
                    <Input id="destino" placeholder="SELECIONE O DESTINO..." />
                </div>
            </div>
        </GenericModal>
    );
}
