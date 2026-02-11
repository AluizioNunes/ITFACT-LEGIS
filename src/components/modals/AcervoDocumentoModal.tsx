"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AcervoDocumentoModal() {
    return (
        <GenericModal
            title="Catalogar Documento"
            description="Adicionar documento ao acervo histórico."
            trigger={<Button className="uppercase">Catalogar</Button>}
            footer={<Button type="submit" className="uppercase">Salvar</Button>}
        >
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="titulo_historico">Título Histórico</Label>
                    <Input id="titulo_historico" placeholder="TITULO ORIGINAL..." />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="data_doc">Data</Label>
                    <Input id="data_doc" type="date" />
                </div>
            </div>
        </GenericModal>
    );
}
