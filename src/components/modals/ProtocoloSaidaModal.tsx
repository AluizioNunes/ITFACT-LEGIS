"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProtocoloSaidaModal() {
    return (
        <GenericModal
            title="Novo Protocolo de Saída"
            description="Cadastre um novo documento para envio."
            trigger={<Button className="uppercase">Nova Saída</Button>}
            footer={<Button type="submit" className="uppercase">Registrar Saída</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="destinatario">Destinatário</Label>
                    <Input id="destinatario" placeholder="DIGITE O DESTINATÁRIO..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="assunto">Assunto</Label>
                    <Input id="assunto" placeholder="DIGITE O ASSUNTO..." />
                </div>
            </div>
        </GenericModal>
    );
}
