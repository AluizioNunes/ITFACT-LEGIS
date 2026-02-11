import { z } from "zod";

export const OrgaoSchema = z.object({
    nome: z.string().min(3, "O nome do órgão deve ter no mínimo 3 caracteres.").max(100),
    sigla: z.string().min(2, "A sigla deve ter no mínimo 2 caracteres.").max(10).toUpperCase(),
    tipo: z.enum(["INTERNO", "EXTERNO"]).default("INTERNO"),
    ativo: z.boolean().default(true),
});

export const TipoDocumentoSchema = z.object({
    nome: z.string().min(3, "Nome do tipo é obrigatório.").max(50),
    sigla: z.string().optional(),
    numeracaoAutomatica: z.boolean().default(true),
    modeloPadraoId: z.string().optional(),
});

export const CasaLegislativaSchema = z.object({
    nome: z.string().min(5, "Nome oficial é obrigatório.").max(200).toUpperCase(),
    cnpj: z.string().length(14, "CNPJ inválido.").optional(),
    endereco: z.string().min(10, "Endereço completo é necessário.").optional(),
    telefone: z.string().optional(),
    email: z.string().email("Email inválido.").optional(),
    site: z.string().url("URL inválida.").optional(),
    logo: z.string().optional(),
});

export type OrgaoFormValues = z.infer<typeof OrgaoSchema>;
export type TipoDocumentoFormValues = z.infer<typeof TipoDocumentoSchema>;
export type CasaLegislativaFormValues = z.infer<typeof CasaLegislativaSchema>;
