import { z } from "zod";

export const ProposituraSchema = z.object({
    tipoId: z.string({ required_error: "Selecione o tipo de propositura." }),
    numero: z.string().optional(), // Gerado ou manual
    ano: z.number().default(new Date().getFullYear()),
    autorId: z.string({ required_error: "Selecione o autor." }),
    ementa: z.string().min(10, "A ementa deve ter pelo menos 10 caracteres."),
    texto: z.string().min(50, "O texto deve ter pelo menos 50 caracteres."), // Rich text content usually
    dataApresentacao: z.date().default(new Date()),
    status: z.enum(["APRESENTADO", "EM_TRAMITACAO", "APROVADO", "REJEITADO", "ARQUIVADO"]).default("APRESENTADO"),
    regimeTramitacao: z.enum(["ORDINARIO", "URGENCIA", "ESPECIAL"]).default("ORDINARIO"),
});

export type ProposituraFormValues = z.infer<typeof ProposituraSchema>;
