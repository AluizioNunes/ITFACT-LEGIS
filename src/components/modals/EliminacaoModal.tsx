"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EliminacaoModal() {
    return (
        <GenericModal
            title="Edital de Eliminação"
            description="Gerar lista de eliminação de documentos."
            trigger={<Button variant="destructive" className="uppercase">Nova Eliminação</Button>}
            footer={<Button type="submit" className="uppercase">Gerar Edital</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="lista">Lista de Documentos</Label>
                    <Input id="lista" placeholder="FILTRAR POR TEMPORALIDADE..." />
                </div>
            </div>
        </GenericModal>
    );
}
