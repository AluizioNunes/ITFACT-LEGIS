"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";

export function TramitarProposituraModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Tramitar
            </Button>
            <GenericModal
                title="Tramitar Propositura"
                description="Enviar propositura para comissão ou plenário."
                isOpen={open}
                onOpenChange={setOpen}
                footer={<Button type="submit" className="uppercase" onClick={() => setOpen(false)}>Enviar</Button>}
            >
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="destino_prop">Destino</Label>
                        <Input id="destino_prop" placeholder="COMISSÃO OU PLENÁRIO..." />
                    </div>
                </div>
            </GenericModal>
        </>
    );
}
