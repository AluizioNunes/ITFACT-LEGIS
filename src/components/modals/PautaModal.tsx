"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PautaModal() {
    return (
        <GenericModal
            title="Nova Pauta"
            description="Criar pauta para sessão."
            trigger={<Button className="uppercase">Nova Pauta</Button>}
            footer={<Button type="submit" className="uppercase">Criar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="sessao_alvo">Sessão Alvo</Label>
                    <Input id="sessao_alvo" placeholder="BUSCAR SESSÃO..." />
                </div>
            </div>
        </GenericModal>
    );
}
