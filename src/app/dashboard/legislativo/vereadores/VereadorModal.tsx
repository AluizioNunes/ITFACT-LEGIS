"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    nomeCompleto: z.string().min(3, "Nome muito curto"),
    nomeParlamentar: z.string().min(3, "Nome muito curto"),
    partidoId: z.string().min(1, "Selecione um partido"),
    cpf: z.string().min(11, "CPF inválido"),
    email: z.string().email("Email inválido"),
});

interface VereadorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function VereadorModal({ isOpen, onClose, onSubmit }: VereadorModalProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nomeCompleto: "",
            nomeParlamentar: "",
            partidoId: "",
            cpf: "",
            email: "",
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        onSubmit(data);
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] border-none shadow-2xl bg-white/95 backdrop-blur-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-900 uppercase tracking-tighter">
                        Registro de Parlamentar
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nomeCompleto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-slate-500">Nome Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: João da Silva Santos" {...field} className="h-11 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nomeParlamentar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-slate-500">Nome Parlamentar</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Ver. João Silva" {...field} className="h-11 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-500">E-mail Institucional</FormLabel>
                                    <FormControl>
                                        <Input placeholder="parlamentar@cmm.am.gov.br" {...field} className="h-11 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-slate-500">CPF</FormLabel>
                                        <FormControl>
                                            <Input placeholder="000.000.000-00" {...field} className="h-11 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="partidoId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-slate-500">Partido / Bancada</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-xl">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Partido Renovador (PR)</SelectItem>
                                                <SelectItem value="2">Liderança Cidadã (LC)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-6">
                            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-11 px-8 font-bold text-slate-500">
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 font-bold shadow-lg shadow-blue-200">
                                Salvar Cadastro
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
