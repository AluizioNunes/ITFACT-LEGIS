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
import { SessaoSchema, SessaoFormValues } from "@/schemas/sessaoSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

export function SessaoPlenariaModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<SessaoFormValues>({
        resolver: zodResolver(SessaoSchema),
        defaultValues: {
            numero: 1,
            tipo: "ORDINARIA",
            data: new Date(),
            hora: "19:00",
            local: "Plenário Principal",
            status: "AGENDADA",
            descricao: ""
        }
    });

    const onSubmit = (data: SessaoFormValues) => {
        console.log("Sessão Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase" onClick={() => setOpen(true)}>
                Nova Sessão
            </Button>
            <GenericModal
                title="Agendar Sessão Plenária"
                description="Crie uma nova sessão legislativa."
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
                                        <FormLabel>Número da Sessão</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Sessão</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ORDINARIA">Ordinária</SelectItem>
                                                <SelectItem value="EXTRAORDINARIA">Extraordinária</SelectItem>
                                                <SelectItem value="SOLENE">Solene</SelectItem>
                                                <SelectItem value="ESPECIAL">Especial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="data"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data</FormLabel>
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
                                name="hora"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Horário</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="local"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Local</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Local da sessão..." {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição de Pauta (Resumo)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tópicos principais da pauta..."
                                            className="resize-none h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto">Agendar Sessão</Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
