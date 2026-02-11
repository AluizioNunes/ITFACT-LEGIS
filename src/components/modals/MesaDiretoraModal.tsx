"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MesaDiretoraModal() {
    return (
        <GenericModal
            title="Editar Mesa Diretora"
            description="Definir composição da mesa."
            trigger={<Button className="uppercase">Nova Composição</Button>}
            footer={<Button type="submit" className="uppercase">Salvar Composição</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="presidente">Presidente</Label>
                    <Input id="presidente" placeholder="PARLAMENTAR..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="vice">Vice-Presidente</Label>
                    <Input id="vice" placeholder="PARLAMENTAR..." />
                </div>
            </div>
        </GenericModal>
    );
}
