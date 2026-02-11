"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrgaoSchema, OrgaoFormValues } from "@/schemas/gerenciaSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

export function OrgaoModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<OrgaoFormValues>({
        resolver: zodResolver(OrgaoSchema),
        defaultValues: {
            nome: "",
            sigla: "",
            tipo: "INTERNO",
            ativo: true
        }
    });

    const onSubmit = (data: OrgaoFormValues) => {
        console.log("Órgão Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Novo Órgão
            </Button>
            <GenericModal
                title="Novo Órgão"
                description="Cadastrar departamento ou secretaria."
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
                                    <FormLabel>Nome do Órgão</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Secretaria Legislativa" {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sigla"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sigla</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: SECLEG" {...field} className="uppercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="INTERNO">Interno</SelectItem>
                                                <SelectItem value="EXTERNO">Externo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Salvar Órgão</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
