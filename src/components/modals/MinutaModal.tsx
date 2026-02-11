"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinutaSchema, MinutaFormValues } from "@/schemas/minutaSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

export function MinutaModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<MinutaFormValues>({
        resolver: zodResolver(MinutaSchema),
        defaultValues: {
            titulo: "",
            tipoDocumentoId: "",
            ementa: "",
            texto: "",
            nivelAcesso: "RESTRITO"
        }
    });

    const onSubmit = (data: MinutaFormValues) => {
        console.log("Minuta Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Nova Minuta
            </Button>
            <GenericModal
                title="Nova Minuta"
                description="Crie um novo documento para edição e elaboração."
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="tipoDocumentoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Documento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="projeto_lei">Projeto de Lei</SelectItem>
                                            <SelectItem value="requerimento">Requerimento</SelectItem>
                                            <SelectItem value="indicacao">Indicação</SelectItem>
                                            <SelectItem value="mocao">Moção</SelectItem>
                                            <SelectItem value="emenda">Emenda</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Dispõe sobre..." {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ementa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ementa</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Resumo do conteúdo do documento..."
                                            className="resize-none h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="texto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Texto Inicial (Rascunho)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Comece a escrever o texto aqui..."
                                            className="resize-none h-40 font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Criar Minuta</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
