"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecebimentoSchema, RecebimentoFormValues } from "@/schemas/tramitacaoSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export function RecebimentoModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<RecebimentoFormValues>({
        resolver: zodResolver(RecebimentoSchema),
        defaultValues: {
            tramitacaoId: "temp-id", // Deveria vir via props
            dataRecebimento: new Date(),
            status: "RECEBIDO"
        }
    });

    const onSubmit = (data: RecebimentoFormValues) => {
        console.log("Recebimento Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Receber em Lote
            </Button>
            <GenericModal
                title="Recebimento de Documentos"
                description="Confirme o recebimento dos documentos tramitados para seu setor."
                isOpen={open}
                onOpenChange={setOpen}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="dataRecebimento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data do Recebimento</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="observacoes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Alguma ressalva sobre o documento?"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="submit" className="uppercase">Confirmar Recebimento</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
