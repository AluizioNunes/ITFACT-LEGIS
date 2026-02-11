"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SobrestarModal() {
    return (
        <GenericModal
            title="Sobrestar Processo"
            description="Suspender temporariamente a tramitação."
            trigger={<Button variant="destructive" className="uppercase">Sobrestar</Button>}
            footer={<Button type="submit" className="uppercase">Confirmar Sobrestamento</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="motivo">Motivo</Label>
                    <Input id="motivo" placeholder="JUSTIFICATIVA..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="prazo">Prazo (Dias)</Label>
                    <Input id="prazo" type="number" placeholder="0" />
                </div>
            </div>
        </GenericModal>
    );
}
