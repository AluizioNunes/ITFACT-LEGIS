"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoDocumentoSchema, TipoDocumentoFormValues } from "@/schemas/gerenciaSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useState } from "react";

export function TipoDocumentoModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<TipoDocumentoFormValues>({
        resolver: zodResolver(TipoDocumentoSchema),
        defaultValues: {
            nome: "",
            sigla: "",
            numeracaoAutomatica: true
        }
    });

    const onSubmit = (data: TipoDocumentoFormValues) => {
        console.log("Tipo Doc Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Novo Tipo
            </Button>
            <GenericModal
                title="Novo Tipo de Documento"
                description="Cadastrar tipo documental."
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Tipo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Ofício, Memorando, Projeto de Lei" {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sigla"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sigla (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: OF, MEMO, PL" {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="numeracaoAutomatica"
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
                                            Numeração Automática
                                        </FormLabel>
                                        <FormDescription>
                                            O sistema irá gerar números sequenciais anualizados para este tipo.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Salvar Tipo</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
