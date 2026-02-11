"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";

export function VotacaoModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Nova Votação
            </Button>
            <GenericModal
                title="Registrar Votação"
                description="Lançar resultado de votação."
                isOpen={open}
                onOpenChange={setOpen}
                footer={<Button type="submit" className="uppercase" onClick={() => setOpen(false)}>Registrar</Button>}
            >
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="materia">Matéria</Label>
                        <Input id="materia" placeholder="BUSCAR MATÉRIA..." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="resultado">Resultado</Label>
                        <Input id="resultado" placeholder="APROVADO / REJEITADO..." />
                    </div>
                </div>
            </GenericModal>
        </>
    );
}
