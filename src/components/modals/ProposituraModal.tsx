"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProposituraSchema, ProposituraFormValues } from "@/schemas/proposituraSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

export function ProposituraModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<ProposituraFormValues>({
        resolver: zodResolver(ProposituraSchema),
        defaultValues: {
            tipoId: "",
            numero: "001",
            ano: 2024,
            autorId: "",
            ementa: "",
            texto: "",
            status: "APRESENTADO",
            regimeTramitacao: "ORDINARIO"
        }
    });

    const onSubmit = (data: ProposituraFormValues) => {
        console.log("Propositura Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Nova Propositura
            </Button>
            <GenericModal
                title="Nova Propositura"
                description="Cadastre um novo Projeto de Lei, Requerimento ou Indicação."
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="tipoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Propositura</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pl">Projeto de Lei</SelectItem>
                                                <SelectItem value="req">Requerimento</SelectItem>
                                                <SelectItem value="ind">Indicação</SelectItem>
                                                <SelectItem value="moc">Moção</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="regimeTramitacao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Regime de Tramitação</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ORDINARIO">Ordinário</SelectItem>
                                                <SelectItem value="URGENCIA">Urgência</SelectItem>
                                                <SelectItem value="ESPECIAL">Especial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="autorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Autor</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o parlamentar..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ver_silva">Ver. Carlos Silva</SelectItem>
                                            <SelectItem value="ver_maria">Ver. Maria Oliveira</SelectItem>
                                            <SelectItem value="mesa">Mesa Diretora</SelectItem>
                                            <SelectItem value="prefeito">Poder Executivo</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                            placeholder="Resumo do conteúdo da matéria..."
                                            className="resize-none h-24"
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
                                    <FormLabel>Texto (Justificativa)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Texto completo ou justificativa da propositura..."
                                            className="resize-none h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Salvar Propositura</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
