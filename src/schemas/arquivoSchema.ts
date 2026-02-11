import { z } from "zod";

export const ArquivoSchema = z.object({
    titulo: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
    tipoDocumentoId: z.string({ required_error: "Selecione o tipo documental." }),
    dataDocumento: z.date({ required_error: "Data do documento é obrigatória." }),
    localizacaoFisica: z.string().min(3, "Informe a localização (Ex: Armário A, Gaveta 2)."),
    caixa: z.string().optional(),
    status: z.enum(["ARQUIVADO", "EMPRESTADO", "EXTRAVIADO", "ELIMINADO"]).default("ARQUIVADO"),
    observacoes: z.string().optional(),
});

export type ArquivoFormValues = z.infer<typeof ArquivoSchema>;
