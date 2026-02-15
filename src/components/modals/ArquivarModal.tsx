"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArquivoSchema, ArquivoFormValues } from "@/schemas/arquivoSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

export function ArquivarModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<ArquivoFormValues>({
        resolver: zodResolver(ArquivoSchema),
        defaultValues: {
            titulo: "",
            tipoDocumentoId: "",
            dataDocumento: new Date(),
            localizacaoFisica: "",
            caixa: "",
            status: "ARQUIVADO",
            observacoes: ""
        }
    });

    const onSubmit = (data: ArquivoFormValues) => {
        console.log("Arquivo Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Novo Arquivamento
            </Button>
            <GenericModal
                title="Arquivar Documento"
                description="Registrar documento no acervo físico/digital."
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título / Assunto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Resumo do documento..." {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="tipoDocumentoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo Documental</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="proc_adm">Processo Adm.</SelectItem>
                                                <SelectItem value="lei">Lei Autógrafa</SelectItem>
                                                <SelectItem value="ata">Ata de Sessão</SelectItem>
                                                <SelectItem value="outro">Outros</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dataDocumento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data do Documento</FormLabel>
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="localizacaoFisica"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Localização</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Armário A..." {...field} className="uppercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="caixa"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Caixa (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: CX-2024-01" {...field} className="uppercase" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="observacoes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detalhes adicionais..."
                                            className="resize-none h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Confirmar Arquivamento</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
