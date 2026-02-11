import { z } from "zod";

export const MinutaSchema = z.object({
    titulo: z.string().min(5, "O título é obrigatório e deve ter ao menos 5 caracteres."),

    tipoDocumentoId: z.string({
        required_error: "Selecione o tipo de documento.",
    }),

    ementa: z.string().min(10, "A ementa deve ser detalhada (mínimo 10 caracteres)."),

    texto: z.string().min(1, "O texto da minuta não pode estar vazio."),

    modeloId: z.string().optional(), // Baseado em modelo existente

    nivelAcesso: z.enum(["PUBLICO", "RESTRITO", "SIGILOSO"]).default("RESTRITO"),
});

export type MinutaFormValues = z.infer<typeof MinutaSchema>;
