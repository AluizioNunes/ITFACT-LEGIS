import { z } from "zod";

export const TramitacaoSchema = z.object({
    documentoId: z.string().optional(), // ID do documento sendo tramitado

    unidadeDestinoId: z.string({
        required_error: "Selecione o setor/órgão de destino.",
    }),

    despacho: z.string().min(5, {
        message: "O despacho deve ter no mínimo 5 caracteres.",
    }),

    urgente: z.boolean().default(false),

    prazo: z.date().optional(),

    responsavelDestinoId: z.string().optional(), // Usuário específico (opcional)
});

export const RecebimentoSchema = z.object({
    tramitacaoId: z.string(),
    dataRecebimento: z.date(),
    observacoes: z.string().optional(),
    status: z.enum(["RECEBIDO", "DEVOLVIDO", "RECUSADO"]).default("RECEBIDO"),
});

export type TramitacaoFormValues = z.infer<typeof TramitacaoSchema>;
export type RecebimentoFormValues = z.infer<typeof RecebimentoSchema>;
