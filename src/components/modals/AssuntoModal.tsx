"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AssuntoModal() {
    return (
        <GenericModal
            title="Novo Assunto"
            description="Cadastrar assunto para classificação."
            trigger={<Button className="uppercase">Novo Assunto</Button>}
            footer={<Button type="submit" className="uppercase">Salvar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="descricao_assunto">Descrição</Label>
                    <Input id="descricao_assunto" placeholder="DESCRIÇÃO..." />
                </div>
            </div>
        </GenericModal>
    );
}
