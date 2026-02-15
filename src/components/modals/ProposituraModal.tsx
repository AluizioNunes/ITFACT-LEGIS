"use client";

import { GenericModal } from "./GenericModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProposituraSchema, ProposituraFormValues } from "@/schemas/proposituraSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelectCreatable } from "@/components/ui/multi-select-creatable";
import { useState, useRef } from "react";
import { FileUp, Sparkles, Download, FileText, Check, AlertCircle, Loader2, Wand2 } from "lucide-react";


const parlamentaresOptions = [
    { value: "ver_silva", label: "VER. CARLOS SILVA" },
    { value: "ver_maria", label: "VER. MARIA OLIVEIRA" },
    { value: "mesa", label: "MESA DIRETORA" },
    { value: "prefeito", label: "PODER EXECUTIVO" },
];

export function ProposituraModal() {
    const [open, setOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ corrected: string, suggestions: string[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProposituraFormValues>({
        resolver: zodResolver(ProposituraSchema),
        defaultValues: {
            tipoId: "",
            numero: "001",
            ano: new Date().getFullYear(),
            autorId: "",
            ementa: "",
            texto: "",
            status: "MINUTA",
            regimeTramitacao: "ORDINARIO",
            participantes: []
        }
    });

    const onSubmit = (data: ProposituraFormValues) => {
        console.log("Propositura Data:", data);
        setOpen(false);
        form.reset();
        setAnalysisResult(null);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000/api/python";
            const res = await fetch(`${apiUrl}/editor/extract-text`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Falha ao extrair texto do arquivo.");

            const data = await res.json();
            form.setValue("texto", data.text, { shouldValidate: true });
            // toast.success(`Texto extraído de ${file.filename}`);
        } catch (error: any) {
            console.error(error);
            // toast.error(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAIAnalysis = async () => {
        const currentText = form.getValues("texto");
        if (!currentText || currentText.length < 10) {
            alert("INSIRA UM TEXTO MÍNIMO PARA ANÁLISE.");
            return;
        }

        setIsAnalyzing(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000/api/python";
            const res = await fetch(`${apiUrl}/editor/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: currentText }),
            });

            if (!res.ok) throw new Error("Falha na análise da IA.");

            const data = await res.json();
            setAnalysisResult(data);
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const applyCorrection = () => {
        if (analysisResult) {
            form.setValue("texto", analysisResult.corrected, { shouldValidate: true });
            setAnalysisResult(null);
        }
    };

    const handleExport = async (format: 'pdf' | 'docx') => {
        const currentText = form.getValues("texto");
        if (!currentText) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000/api/python";
            const res = await fetch(`${apiUrl}/editor/export/${format}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: currentText }),
            });

            if (!res.ok) throw new Error("Falha ao exportar documento.");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `propositura.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button className="uppercase font-bold tracking-wider" onClick={() => setOpen(true)}>
                Nova Propositura
            </Button>
            <GenericModal
                title="SISTEMA LEGISLATIVO - NOVA PROPOSITURA (MINUTA)"
                description="EDITOR PROFISSIONAL COM ANÁLISE IA"
                isOpen={open}
                onOpenChange={setOpen}
                headerColor="#0f172a"
                size="full"
            >
                <div className="flex h-full gap-0 overflow-hidden -m-6">
                    {/* PARTE ESQUERDA: FORMULÁRIO */}
                    <div className="w-1/2 p-6 border-r overflow-y-auto scrollbar-thin bg-slate-50/50">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <section>
                                    <h3 className="text-sm font-bold border-b pb-2 mb-4 text-slate-500 uppercase tracking-tighter">DADOS BÁSICOS</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="tipoId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold text-slate-400">TIPO DE PROPOSITURA</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="rounded-none border-slate-300">
                                                                <SelectValue placeholder="SELECIONE..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-none">
                                                            <SelectItem value="req">REQUERIMENTO (REQ)</SelectItem>
                                                            <SelectItem value="ind">INDICAÇÃO (IND)</SelectItem>
                                                            <SelectItem value="moc">MOÇÃO (MOC)</SelectItem>
                                                            <SelectItem value="pl">PROJETO DE LEI (PL)</SelectItem>
                                                            <SelectItem value="plc">PROJETO DE LEI COMPLEMENTAR (PLC)</SelectItem>
                                                            <SelectItem value="pelo">PROJETO DE EMENDA À LEI ORGÂNICA (PELO)</SelectItem>
                                                            <SelectItem value="pdl">PROJETO DE DECRETO LEGISLATIVO (PDL)</SelectItem>
                                                            <SelectItem value="pr">PROJETO DE RESOLUÇÃO (PR)</SelectItem>
                                                            <SelectItem value="sub">PROJETO SUBSTITUTO (SUB)</SelectItem>
                                                            <SelectItem value="eme">EMENDA (EME)</SelectItem>
                                                            <SelectItem value="vet">VETO (VET)</SelectItem>
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
                                                    <FormLabel className="text-[10px] font-bold text-slate-400">REGIME DE TRAMITAÇÃO</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="rounded-none border-slate-300">
                                                                <SelectValue placeholder="SELECIONE..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-none">
                                                            <SelectItem value="ORDINARIO">ORDINÁRIO</SelectItem>
                                                            <SelectItem value="URGENCIA">URGÊNCIA</SelectItem>
                                                            <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-bold border-b pb-2 mb-4 text-slate-500 uppercase tracking-tighter">AUTORIA</h3>
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="autorId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold text-slate-400">AUTOR PRINCIPAL</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="rounded-none border-slate-300">
                                                                <SelectValue placeholder="SELECIONE O AUTOR..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-none">
                                                            {parlamentaresOptions.map(opt => (
                                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="participantes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-bold text-slate-400">CO-AUTORES / PARTICIPANTES</FormLabel>
                                                    <FormControl>
                                                        <MultiSelectCreatable
                                                            options={parlamentaresOptions}
                                                            selected={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="BUSCAR OU DIGITAR NOME..."
                                                            className="rounded-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-sm font-bold border-b pb-2 mb-4 text-slate-500 uppercase tracking-tighter">CONTEÚDO</h3>
                                    <FormField
                                        control={form.control}
                                        name="ementa"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold text-slate-400">EMENTA (RESUMO)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="DIGITE A EMENTA AQUI..."
                                                        className="resize-none h-24 rounded-none border-slate-300 uppercase text-xs"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-between items-center mb-1">
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase">TEXTO / JUSTIFICATIVA</Label>
                                        <div className="flex gap-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept=".doc,.docx,.pdf,.txt,.odt,.rtf,.html,.json"
                                                onChange={handleFileUpload}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="xs"
                                                className="h-7 text-[9px] rounded-none border-dashed"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <FileUp className="h-3 w-3 mr-1" />}
                                                IMPORTE ARQUIVO
                                            </Button>
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="texto"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="TEXTO INTEGRAL DA MATÉRIA..."
                                                        className="resize-none h-[300px] rounded-none border-slate-300 uppercase text-sm leading-relaxed"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </section>

                                <div className="flex justify-end pt-4 gap-2">
                                    <Button type="button" variant="outline" className="rounded-none uppercase text-xs border-slate-300" onClick={() => setOpen(false)}>Cancelar</Button>
                                    <Button type="submit" className="uppercase text-xs rounded-none bg-slate-900 hover:bg-slate-800">Salvar Propositura</Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                    {/* PARTE DIREITA: VISUALIZADOR E IA */}
                    <div className="w-1/2 flex flex-col bg-white overflow-hidden">
                        {/* Header do Visualizador */}
                        <div className="flex items-center justify-between p-4 border-b bg-slate-100/50">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-slate-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Visualizador & IA</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="xs"
                                    className="h-8 rounded-none bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold"
                                    onClick={handleAIAnalysis}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1 text-yellow-300" />}
                                    ANALISAR COM IA
                                </Button>
                                <div className="h-8 w-px bg-slate-300 mx-1" />
                                <Button size="xs" variant="outline" className="h-8 rounded-none text-[9px]" onClick={() => handleExport('pdf')}>
                                    <Download className="h-3 w-3 mr-1" /> PDF
                                </Button>
                                <Button size="xs" variant="outline" className="h-8 rounded-none text-[9px]" onClick={() => handleExport('docx')}>
                                    <Download className="h-3 w-3 mr-1" /> DOCX
                                </Button>
                            </div>
                        </div>

                        {/* Área de Preview / Resultados da IA */}
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 font-serif relative">
                            {analysisResult ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-yellow-800 font-bold text-xs uppercase">
                                            <AlertCircle className="h-4 w-4" />
                                            Sugestões de Melhoria
                                        </div>
                                        <ul className="text-[11px] space-y-2 text-yellow-900/80 leading-relaxed font-sans">
                                            {analysisResult.suggestions.map((s, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="text-yellow-500">•</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            size="sm"
                                            className="mt-4 w-full rounded-none bg-yellow-600 hover:bg-yellow-700 text-[10px] font-bold h-7"
                                            onClick={applyCorrection}
                                        >
                                            <Wand2 className="h-3 w-3 mr-1" /> APLICAR CORREÇÕES AUTOMATICAMENTE
                                        </Button>
                                    </div>

                                    <div className="bg-white p-6 shadow-md border rounded-sm">
                                        <div className="flex items-center gap-2 mb-4 text-indigo-800 font-bold text-xs uppercase border-b pb-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            Versão Corrigida (Sugestão IA)
                                        </div>
                                        <div className="text-sm leading-8 text-slate-700 whitespace-pre-wrap">
                                            {analysisResult.corrected}
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="w-full text-slate-400 text-[9px] uppercase hover:text-slate-600"
                                        onClick={() => setAnalysisResult(null)}
                                    >
                                        DESCARTAR ANÁLISE E VOLTAR AO ORIGINAL
                                    </Button>
                                </div>
                            ) : (
                                <div className="max-w-[100%] mx-auto">
                                    <div className="text-center mb-10 opacity-40">
                                        <div className="h-px bg-slate-300 w-full mb-4" />
                                        <span className="text-[10px] tracking-[0.3em] font-bold text-slate-500">VISUALIZAÇÃO DE DOCUMENTO</span>
                                        <div className="h-px bg-slate-300 w-full mt-4" />
                                    </div>

                                    <div className="prose prose-sm max-w-none">
                                        {form.watch("ementa") && (
                                            <div className="font-bold text-right italic mb-8 border-b-2 border-slate-100 pb-4 pr-4">
                                                {form.watch("ementa")}
                                            </div>
                                        )}
                                        <div className="text-sm leading-8 text-slate-800 whitespace-pre-wrap select-all">
                                            {form.watch("texto") || (
                                                <div className="h-[400px] flex items-center justify-center text-slate-300 text-xs italic font-sans uppercase">
                                                    NENHUM CONTEÚDO PARA EXIBIR
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </GenericModal>
        </>
    );
}
