import { z } from "zod";

export const CaixaSchema = z.object({
    numero: z.string({ required_error: "Número é obrigatório." }).min(1, "Número é obrigatório."),
    ano: z.number().default(new Date().getFullYear()),
    corredor: z.string().optional(),
    estante: z.string().optional(),
    prateleira: z.string().optional(),
    descricao: z.string().optional(),
});

export type CaixaFormValues = z.infer<typeof CaixaSchema>;
