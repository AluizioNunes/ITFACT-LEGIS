"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TramitacaoSchema, TramitacaoFormValues } from "@/schemas/tramitacaoSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useState } from "react";

export function TramitarDocumentoModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<TramitacaoFormValues>({
        resolver: zodResolver(TramitacaoSchema),
        defaultValues: {
            unidadeDestinoId: "",
            despacho: "",
            urgente: false
        }
    });

    const onSubmit = (data: TramitacaoFormValues) => {
        console.log("Tramitação Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button variant="outline" className="uppercase" onClick={() => setOpen(true)}>
                Tramitar
            </Button>
            <GenericModal
                title="Tramitar Documento"
                description="Envie este documento para outro setor ou órgão."
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="unidadeDestinoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unidade de Destino</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o setor..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="juridico">Departamento Jurídico</SelectItem>
                                            <SelectItem value="administrativo">Departamento Administrativo</SelectItem>
                                            <SelectItem value="plenario">Plenário</SelectItem>
                                            <SelectItem value="arquivo">Arquivo Geral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="despacho"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Despacho / Instrução</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Instruções para o destinatário..."
                                            className="resize-none h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="urgente"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Urgente
                                        </FormLabel>
                                        <FormDescription>
                                            Marque se este documento requer prioridade máxima.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Confirmar Tramitação</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
