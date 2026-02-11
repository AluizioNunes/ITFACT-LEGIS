"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProtocoloSchema, ProtocoloFormValues } from "@/schemas/protocoloSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

export function ProtocoloEntradaModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<ProtocoloFormValues>({
        resolver: zodResolver(ProtocoloSchema),
        defaultValues: {
            assunto: "",
            origem: "",
            tipoDocumentoId: "",
            resumo: "",
            situacao: "PROTOCOLADO"
        }
    });

    const onSubmit = (data: ProtocoloFormValues) => {
        console.log("Protocolo Data:", data);
        // TODO: Implement API call
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Novo Protocolo
            </Button>
            <GenericModal
                title="Novo Protocolo de Entrada"
                description="Preencha os dados abaixo para protocolar um documento recebido."
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
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
                                                <SelectItem value="oficio">Ofício</SelectItem>
                                                <SelectItem value="requerimento">Requerimento</SelectItem>
                                                <SelectItem value="processo">Processo Administrativo</SelectItem>
                                                <SelectItem value="carta">Carta</SelectItem>
                                                <SelectItem value="notificacao">Notificação</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="data"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Recebimento</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                date={field.value}
                                                setDate={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="origem"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Origem / Remetente</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Prefeitura Municipal..." {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="assunto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assunto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Resumo do assunto..." {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="numeroDocumentoOriginal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nº Documento Original</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Opcional" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dataDocumentoOriginal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data do Documento</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                date={field.value}
                                                setDate={field.onChange}
                                                label="Data Original"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="resumo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mencionar / Detalhes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descrição detalhada do conteúdo do documento..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Protocolar Documento</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
