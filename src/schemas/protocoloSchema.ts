import { z } from "zod";

export const ProtocoloSchema = z.object({
    numero: z.string().optional(), // Gerado automaticamente
    ano: z.number().optional(),    // Gerado automaticamente
    data: z.date({
        required_error: "A data do protocolo é obrigatória.",
    }),
    hora: z.string().optional(),

    tipoDocumentoId: z.string({
        required_error: "Selecione o tipo de documento.",
    }),

    assunto: z.string().min(5, {
        message: "O assunto deve ter pelo menos 5 caracteres.",
    }).max(255, {
        message: "O assunto não pode ter mais de 255 caracteres.",
    }),

    resumo: z.string().optional(),

    origem: z.string().min(2, {
        message: "A origem/remetente é obrigatória.",
    }),

    termo: z.string().optional(), // Termo de recebimento

    numeroDocumentoOriginal: z.string().optional(),
    dataDocumentoOriginal: z.date().optional(),

    interessados: z.array(z.string()).optional(), // IDs dos interessados

    situacao: z.string().default("PROTOCOLADO"),
});

export type ProtocoloFormValues = z.infer<typeof ProtocoloSchema>;
