"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaixaSchema, CaixaFormValues } from "@/schemas/caixaSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

export function CaixaModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<CaixaFormValues>({
        resolver: zodResolver(CaixaSchema),
        defaultValues: {
            numero: "",
            ano: new Date().getFullYear(),
            corredor: "",
            estante: "",
            prateleira: "",
            descricao: ""
        }
    });

    const onSubmit = (data: CaixaFormValues) => {
        console.log("Caixa Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Nova Caixa
            </Button>
            <GenericModal
                title="Nova Caixa de Arquivo"
                description="Cadastrar nova caixa para armazenamento de documentos."
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="numero"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input placeholder="001" {...field} className="uppercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ano"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ano</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="corredor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Corredor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="A" {...field} className="uppercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="estante"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estante</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1" {...field} className="uppercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="prateleira"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prateleira</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1" {...field} className="uppercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição / Conteúdo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Processos Administrativos 2024..." {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Salvar Caixa</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
