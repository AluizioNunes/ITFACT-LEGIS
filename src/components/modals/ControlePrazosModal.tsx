"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ControlePrazosModal() {
    return (
        <GenericModal
            title="Definir Prazo"
            description="Configurar alerta de vencimento para processo."
            trigger={<Button className="uppercase">Novo Prazo</Button>}
            footer={<Button type="submit" className="uppercase">Salvar Prazo</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="processo">Processo</Label>
                    <Input id="processo" placeholder="BUSCAR PROCESSO..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="data_vencimento">Vencimento</Label>
                    <Input id="data_vencimento" type="date" />
                </div>
            </div>
        </GenericModal>
    );
}
