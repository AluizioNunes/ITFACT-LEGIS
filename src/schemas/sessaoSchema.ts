import { z } from "zod";

export const SessaoSchema = z.object({
    numero: z.number({
        required_error: "O número da sessão é obrigatório.",
        invalid_type_error: "O número deve ser um valor numérico.",
    }).min(1, "O número deve ser maior que 0."),

    tipo: z.enum(["ORDINARIA", "EXTRAORDINARIA", "SOLENE", "ESPECIAL"], {
        required_error: "Selecione o tipo de sessão.",
    }),

    data: z.date({
        required_error: "A data da sessão é obrigatória.",
    }),

    hora: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)."),

    local: z.string().min(3, "Local deve ser informado.").default("Plenário Principal"),

    status: z.enum(["AGENDADA", "ABERTA", "ENCERRADA", "CANCELADA"]).default("AGENDADA"),

    descricao: z.string().optional(), // Descrição da pauta ou observações
});

export type SessaoFormValues = z.infer<typeof SessaoSchema>;
