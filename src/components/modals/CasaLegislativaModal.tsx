"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CasaLegislativaSchema, CasaLegislativaFormValues } from "@/schemas/gerenciaSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Building2, Save } from "lucide-react";

export function CasaLegislativaModal() {
    const [open, setOpen] = useState(false);
    const form = useForm<CasaLegislativaFormValues>({
        resolver: zodResolver(CasaLegislativaSchema),
        defaultValues: {
            nome: "",
            cnpj: "",
            endereco: "",
            telefone: "",
            email: "",
            site: "",
        }
    });

    const onSubmit = (data: CasaLegislativaFormValues) => {
        console.log("Casa Legislativa Data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <>
            <Button className="uppercase flex gap-2" onClick={() => setOpen(true)}>
                <Building2 className="h-4 w-4" />
                Configurar Casa
            </Button>
            <GenericModal
                title="Cadastro da Casa Legislativa"
                description="Dados institucionais da Câmara Municipal."
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
                                    <FormLabel>Nome Oficial</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: CÂMARA MUNICIPAL DE MANAUS" {...field} className="uppercase" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="cnpj"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CNPJ</FormLabel>
                                        <FormControl>
                                            <Input placeholder="00.000.000/0000-00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telefone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="(92) 0000-0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="endereco"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endereço Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Av. Jalmar de Moraes, 1759 - Santo Antônio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail Institucional</FormLabel>
                                        <FormControl>
                                            <Input placeholder="contato@cmm.am.gov.br" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="site"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Site Oficial</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://www.cmm.am.gov.br" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="uppercase w-full md:w-auto flex gap-2">
                                <Save className="h-4 w-4" />
                                Salvar Configurações
                            </Button>
                        </div>
                    </form>
                </Form>
            </GenericModal>
        </>
    );
}
