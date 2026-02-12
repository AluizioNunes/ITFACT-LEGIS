/*
  Warnings:

  - The `tipo` column on the `proposituras` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[vetoId]` on the table `proposituras` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipo` to the `comissoes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CargoMesa" AS ENUM ('PRESIDENTE', 'VICE_PRESIDENTE_1', 'VICE_PRESIDENTE_2', 'VICE_PRESIDENTE_3', 'SECRETARIO_GERAL', 'SECRETARIO_1', 'SECRETARIO_2', 'SECRETARIO_3', 'CORREGEDOR', 'OUVIDOR_GERAL');

-- CreateEnum
CREATE TYPE "TipoPropositura" AS ENUM ('PL', 'PLC', 'PR', 'PDL', 'EMENDA_LOMAN', 'INDICACAO', 'REQUERIMENTO', 'MOCAO');

-- CreateEnum
CREATE TYPE "FasePropositura" AS ENUM ('PROTOCOLO', 'DELIBERACAO', 'COMISSAO_CCJ', 'COMISSAO_MERITO', 'COMISSAO_FINANCAS', 'PRIMEIRA_DISCUSSAO', 'EMENDAS_COMISSAO', 'SEGUNDA_DISCUSSAO', 'REDACAO_FINAL', 'ENVIADO_PREFEITO', 'SANCIONADO', 'VETADO', 'VETO_EM_VOTACAO', 'PROMULGADO', 'PUBLICADO', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "RegimeTramitacao" AS ENUM ('ORDINARIO', 'URGENCIA', 'PRAZO_FATAL');

-- CreateEnum
CREATE TYPE "TipoEmenda" AS ENUM ('SUPRESSIVA', 'SUBSTITUTIVA', 'ADITIVA', 'MODIFICATIVA');

-- CreateEnum
CREATE TYPE "StatusEmenda" AS ENUM ('APRESENTADA', 'EM_ANALISE_COMISSAO', 'APROVADA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "TipoParecer" AS ENUM ('CONSTITUCIONALIDADE', 'MERITO', 'FINANCEIRO', 'REDACAO_FINAL');

-- CreateEnum
CREATE TYPE "VotoParecer" AS ENUM ('PENDENTE', 'FAVORAVEL', 'FAVORAVEL_COM_EMENDAS', 'CONTRARIO', 'PELA_INCOMPETENCIA');

-- CreateEnum
CREATE TYPE "StatusParecer" AS ENUM ('AGUARDANDO_RELATOR', 'COM_RELATOR', 'PARECER_EMITIDO', 'APROVADO_COMISSAO', 'REJEITADO_COMISSAO', 'PRAZO_VENCIDO');

-- CreateEnum
CREATE TYPE "FaseDiscussao" AS ENUM ('PRIMEIRA', 'SEGUNDA');

-- CreateEnum
CREATE TYPE "TipoVeto" AS ENUM ('TOTAL', 'PARCIAL');

-- CreateEnum
CREATE TYPE "ResultadoVeto" AS ENUM ('PENDENTE', 'MANTIDO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('PRAZO_COMISSAO', 'PRAZO_VETO', 'PRAZO_PREFEITO', 'PRAZO_URGENCIA', 'PRAZO_PROMULGACAO', 'PRAZO_PUBLICACAO');

-- CreateEnum
CREATE TYPE "TipoLicenca" AS ENUM ('SAUDE', 'INTERESSE_PARTICULAR', 'MATERNIDADE', 'PATERNIDADE');

-- CreateEnum
CREATE TYPE "TipoHonraria" AS ENUM ('CIDADAO_BENEMERITO', 'MERITO_CIDADE_MANAUS', 'CIDADAO_DE_MANAUS', 'MEDALHA_OURO', 'MEDALHA_ADRIANO_JORGE', 'MEDALHA_PAULO_NASSER');

-- CreateEnum
CREATE TYPE "TipoMocao" AS ENUM ('SOLIDARIEDADE', 'PARABENIZACAO', 'PROTESTO', 'REPUDIO', 'DESAGRAVO');

-- CreateEnum
CREATE TYPE "PrioridadeOrdemDia" AS ENUM ('URGENCIA', 'VETO', 'PROJETO_LEI', 'PARECER', 'REQUERIMENTO', 'INDICACAO', 'NORMAL');

-- CreateEnum
CREATE TYPE "StatusMinuta" AS ENUM ('RASCUNHO', 'AGUARDANDO_APROVACAO', 'APROVADA', 'REJEITADA', 'EXPEDIDA');

-- DropForeignKey
ALTER TABLE "departamentos" DROP CONSTRAINT "departamentos_orgaoId_fkey";

-- AlterTable
ALTER TABLE "comissoes" ADD COLUMN     "artigoRegimento" TEXT,
ADD COLUMN     "competencias" TEXT,
ADD COLUMN     "tipo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "departamentos" ALTER COLUMN "orgaoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "arquivoId" TEXT;

-- AlterTable
ALTER TABLE "proposituras" ADD COLUMN     "analiseIA" TEXT,
ADD COLUMN     "classificacaoIA" TEXT,
ADD COLUMN     "data1aDiscussao" TIMESTAMP(3),
ADD COLUMN     "data2aDiscussao" TIMESTAMP(3),
ADD COLUMN     "dataDeliberacao" TIMESTAMP(3),
ADD COLUMN     "dataPromulgacao" TIMESTAMP(3),
ADD COLUMN     "dataPublicacao" TIMESTAMP(3),
ADD COLUMN     "dataRedacaoFinal" TIMESTAMP(3),
ADD COLUMN     "dataSancao" TIMESTAMP(3),
ADD COLUMN     "faseAtual" "FasePropositura" NOT NULL DEFAULT 'PROTOCOLO',
ADD COLUMN     "justificativa" TEXT,
ADD COLUMN     "prazoFatal" TIMESTAMP(3),
ADD COLUMN     "regime" "RegimeTramitacao" NOT NULL DEFAULT 'ORDINARIO',
ADD COLUMN     "sugestaoEmentaIA" TEXT,
ADD COLUMN     "urgente" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vetoId" TEXT,
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoPropositura" NOT NULL DEFAULT 'PL';

-- AlterTable
ALTER TABLE "protocolos" ADD COLUMN     "arquivoId" TEXT;

-- CreateTable
CREATE TABLE "vereadores" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "nomeCompleto" TEXT NOT NULL,
    "nomeParlamentar" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT,
    "biografia" TEXT,
    "partidoId" TEXT NOT NULL,

    CONSTRAINT "vereadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emendas" (
    "id" TEXT NOT NULL,
    "proposituraId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "tipo" "TipoEmenda" NOT NULL,
    "texto" TEXT NOT NULL,
    "justificativa" TEXT,
    "autorId" TEXT NOT NULL,
    "fase" "FaseDiscussao" NOT NULL DEFAULT 'PRIMEIRA',
    "status" "StatusEmenda" NOT NULL DEFAULT 'APRESENTADA',
    "parecerComissao" TEXT,
    "sugestaoIA" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "substitutivos" (
    "id" TEXT NOT NULL,
    "proposituraId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "justificativa" TEXT,
    "autorId" TEXT NOT NULL,
    "signatarios" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'APRESENTADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "substitutivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pareceres_comissao" (
    "id" TEXT NOT NULL,
    "proposituraId" TEXT NOT NULL,
    "comissaoId" TEXT NOT NULL,
    "relatorId" TEXT,
    "tipo" "TipoParecer" NOT NULL DEFAULT 'MERITO',
    "texto" TEXT,
    "voto" "VotoParecer" NOT NULL DEFAULT 'PENDENTE',
    "prazoLimite" TIMESTAMP(3),
    "dataEmissao" TIMESTAMP(3),
    "status" "StatusParecer" NOT NULL DEFAULT 'AGUARDANDO_RELATOR',
    "sugestaoIA" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pareceres_comissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussoes_plenarias" (
    "id" TEXT NOT NULL,
    "proposituraId" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "fase" "FaseDiscussao" NOT NULL,
    "resultado" TEXT,
    "observacoes" TEXT,
    "dataDiscussao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussoes_plenarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redacoes_finais" (
    "id" TEXT NOT NULL,
    "proposituraId" TEXT NOT NULL,
    "comissaoId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "aprovada" BOOLEAN NOT NULL DEFAULT false,
    "dataElaboracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sugestaoIA" TEXT,

    CONSTRAINT "redacoes_finais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vetos" (
    "id" TEXT NOT NULL,
    "tipo" "TipoVeto" NOT NULL,
    "razoes" TEXT NOT NULL,
    "artigosVetados" TEXT,
    "dataRecebimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prazo30dias" TIMESTAMP(3) NOT NULL,
    "resultado" "ResultadoVeto" NOT NULL DEFAULT 'PENDENTE',
    "dataVotacao" TIMESTAMP(3),
    "sugestaoIA" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas_prazo" (
    "id" TEXT NOT NULL,
    "proposituraId" TEXT,
    "tipo" "TipoAlerta" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "prazoLimite" TIMESTAMP(3) NOT NULL,
    "notificado" BOOLEAN NOT NULL DEFAULT false,
    "vencido" BOOLEAN NOT NULL DEFAULT false,
    "destinatarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alertas_prazo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audiencias_publicas" (
    "id" TEXT NOT NULL,
    "comissaoId" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT,
    "ata" TEXT,
    "convidados" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AGENDADA',
    "sugestaoTemaIA" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audiencias_publicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licencas_vereadores" (
    "id" TEXT NOT NULL,
    "vereadorId" TEXT NOT NULL,
    "tipo" "TipoLicenca" NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3),
    "laudoMedico" TEXT,
    "suplenteId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licencas_vereadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "honrarias" (
    "id" TEXT NOT NULL,
    "tipo" "TipoHonraria" NOT NULL,
    "homenageadoNome" TEXT NOT NULL,
    "biografia" TEXT,
    "certidaoAntecedentes" TEXT,
    "anuenciaHomenageado" BOOLEAN NOT NULL DEFAULT false,
    "projetoNumero" INTEGER,
    "projetoAno" INTEGER,
    "vereadorPrincipalId" TEXT,
    "area" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EM_ANALISE',
    "dataEntrega" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "honrarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tribuna_popular" (
    "id" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "orador" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "tempoMinutos" INTEGER NOT NULL DEFAULT 5,
    "dataInscricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'INSCRITO',

    CONSTRAINT "tribuna_popular_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mocoes" (
    "id" TEXT NOT NULL,
    "tipo" "TipoMocao" NOT NULL,
    "assunto" TEXT NOT NULL,
    "texto" TEXT,
    "autorId" TEXT NOT NULL,
    "aprovada" BOOLEAN,
    "sessaoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mocoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicacoes_orcamento" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'VEREADOR',
    "autorId" TEXT,
    "entidade" TEXT,
    "descricao" TEXT NOT NULL,
    "valorEstimado" DECIMAL(65,30),
    "status" TEXT NOT NULL DEFAULT 'APRESENTADA',
    "exercicioAlvo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indicacoes_orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "minutas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "status" "StatusMinuta" NOT NULL DEFAULT 'RASCUNHO',
    "aprovadorId" TEXT,
    "dataAprovacao" TIMESTAMP(3),
    "expedida" BOOLEAN NOT NULL DEFAULT false,
    "dataExpedicao" TIMESTAMP(3),
    "sugestaoIA" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "minutas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinaturas_digitais" (
    "id" TEXT NOT NULL,
    "minutaId" TEXT,
    "documentoId" TEXT,
    "assinanteId" TEXT NOT NULL,
    "hashDocumento" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valida" BOOLEAN NOT NULL DEFAULT true,
    "codigoVerificacao" TEXT NOT NULL,

    CONSTRAINT "assinaturas_digitais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legislaturas" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legislaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partidos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "partidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mandatos_vereador" (
    "id" TEXT NOT NULL,
    "vereadorId" TEXT NOT NULL,
    "legislaturaId" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "mandatos_vereador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesas_diretoras" (
    "id" TEXT NOT NULL,
    "legislaturaId" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mesas_diretoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membros_mesa" (
    "id" TEXT NOT NULL,
    "mesaId" TEXT NOT NULL,
    "vereadorId" TEXT NOT NULL,
    "cargo" "CargoMesa" NOT NULL,

    CONSTRAINT "membros_mesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membros_comissao" (
    "id" TEXT NOT NULL,
    "comissaoId" TEXT NOT NULL,
    "vereadorId" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fim" TIMESTAMP(3),

    CONSTRAINT "membros_comissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancadas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "partidoId" TEXT,
    "liderId" TEXT,
    "viceLiderId" TEXT,
    "legislaturaId" TEXT NOT NULL,

    CONSTRAINT "bancadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id" TEXT NOT NULL,
    "legislaturaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADA',
    "ata" TEXT,
    "ataGeradaIA" TEXT,
    "videoUrl" TEXT,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presencas" (
    "id" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "vereadorId" TEXT NOT NULL,
    "momento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "impactoSubsidio" BOOLEAN NOT NULL DEFAULT false,
    "descontoValor" DECIMAL(65,30),

    CONSTRAINT "presencas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscricoes_orador" (
    "id" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "vereadorId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "tempoGasto" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "inscricoes_orador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordens_do_dia" (
    "id" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "proposituraId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "prioridade" "PrioridadeOrdemDia" NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL,

    CONSTRAINT "ordens_do_dia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votacoes" (
    "id" TEXT NOT NULL,
    "sessaoId" TEXT NOT NULL,
    "proposituraId" TEXT,
    "tipo" TEXT NOT NULL,
    "objetivo" TEXT,
    "quorumMinimo" INTEGER NOT NULL,
    "resultado" TEXT,

    CONSTRAINT "votacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votos" (
    "id" TEXT NOT NULL,
    "votacaoId" TEXT NOT NULL,
    "vereadorId" TEXT NOT NULL,
    "escolha" TEXT NOT NULL,

    CONSTRAINT "votos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orcamentos" (
    "id" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "orcamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emendas_orcamentarias" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "emendas_orcamentarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicacoes" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autenticidade" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "publicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arquivos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ouvidoria" (
    "id" TEXT NOT NULL,
    "protocolo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "manifestante" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ABERTO',
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataResposta" TIMESTAMP(3),
    "resposta" TEXT,
    "anexo" TEXT,

    CONSTRAINT "ouvidoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servidores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,
    "salario" DECIMAL(65,30) NOT NULL,
    "dataAdmissao" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "servidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrimonios" (
    "id" TEXT NOT NULL,
    "tombo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "dataAquisicao" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "localizacaoId" TEXT NOT NULL,

    CONSTRAINT "patrimonios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corregedoria_processos" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "assunto" TEXT NOT NULL,
    "envolvidoId" TEXT,
    "instauracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prazoConclusao" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "resultado" TEXT,

    CONSTRAINT "corregedoria_processos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vereadores_userId_key" ON "vereadores"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vereadores_cpf_key" ON "vereadores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "redacoes_finais_proposituraId_key" ON "redacoes_finais"("proposituraId");

-- CreateIndex
CREATE UNIQUE INDEX "assinaturas_digitais_codigoVerificacao_key" ON "assinaturas_digitais"("codigoVerificacao");

-- CreateIndex
CREATE UNIQUE INDEX "legislaturas_numero_key" ON "legislaturas"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "partidos_sigla_key" ON "partidos"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "publicacoes_autenticidade_key" ON "publicacoes"("autenticidade");

-- CreateIndex
CREATE UNIQUE INDEX "arquivos_codigo_key" ON "arquivos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ouvidoria_protocolo_key" ON "ouvidoria"("protocolo");

-- CreateIndex
CREATE UNIQUE INDEX "servidores_matricula_key" ON "servidores"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "patrimonios_tombo_key" ON "patrimonios"("tombo");

-- CreateIndex
CREATE UNIQUE INDEX "corregedoria_processos_numero_key" ON "corregedoria_processos"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "proposituras_vetoId_key" ON "proposituras"("vetoId");

-- AddForeignKey
ALTER TABLE "vereadores" ADD CONSTRAINT "vereadores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vereadores" ADD CONSTRAINT "vereadores_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departamentos" ADD CONSTRAINT "departamentos_orgaoId_fkey" FOREIGN KEY ("orgaoId") REFERENCES "orgaos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocolos" ADD CONSTRAINT "protocolos_arquivoId_fkey" FOREIGN KEY ("arquivoId") REFERENCES "arquivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_arquivoId_fkey" FOREIGN KEY ("arquivoId") REFERENCES "arquivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposituras" ADD CONSTRAINT "proposituras_vetoId_fkey" FOREIGN KEY ("vetoId") REFERENCES "vetos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emendas" ADD CONSTRAINT "emendas_proposituraId_fkey" FOREIGN KEY ("proposituraId") REFERENCES "proposituras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitutivos" ADD CONSTRAINT "substitutivos_proposituraId_fkey" FOREIGN KEY ("proposituraId") REFERENCES "proposituras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pareceres_comissao" ADD CONSTRAINT "pareceres_comissao_proposituraId_fkey" FOREIGN KEY ("proposituraId") REFERENCES "proposituras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pareceres_comissao" ADD CONSTRAINT "pareceres_comissao_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "comissoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussoes_plenarias" ADD CONSTRAINT "discussoes_plenarias_proposituraId_fkey" FOREIGN KEY ("proposituraId") REFERENCES "proposituras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussoes_plenarias" ADD CONSTRAINT "discussoes_plenarias_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redacoes_finais" ADD CONSTRAINT "redacoes_finais_proposituraId_fkey" FOREIGN KEY ("proposituraId") REFERENCES "proposituras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_prazo" ADD CONSTRAINT "alertas_prazo_proposituraId_fkey" FOREIGN KEY ("proposituraId") REFERENCES "proposituras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiencias_publicas" ADD CONSTRAINT "audiencias_publicas_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "comissoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licencas_vereadores" ADD CONSTRAINT "licencas_vereadores_vereadorId_fkey" FOREIGN KEY ("vereadorId") REFERENCES "vereadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinaturas_digitais" ADD CONSTRAINT "assinaturas_digitais_minutaId_fkey" FOREIGN KEY ("minutaId") REFERENCES "minutas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandatos_vereador" ADD CONSTRAINT "mandatos_vereador_vereadorId_fkey" FOREIGN KEY ("vereadorId") REFERENCES "vereadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandatos_vereador" ADD CONSTRAINT "mandatos_vereador_legislaturaId_fkey" FOREIGN KEY ("legislaturaId") REFERENCES "legislaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesas_diretoras" ADD CONSTRAINT "mesas_diretoras_legislaturaId_fkey" FOREIGN KEY ("legislaturaId") REFERENCES "legislaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_mesa" ADD CONSTRAINT "membros_mesa_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "mesas_diretoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_mesa" ADD CONSTRAINT "membros_mesa_vereadorId_fkey" FOREIGN KEY ("vereadorId") REFERENCES "vereadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_comissao" ADD CONSTRAINT "membros_comissao_comissaoId_fkey" FOREIGN KEY ("comissaoId") REFERENCES "comissoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_comissao" ADD CONSTRAINT "membros_comissao_vereadorId_fkey" FOREIGN KEY ("vereadorId") REFERENCES "vereadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bancadas" ADD CONSTRAINT "bancadas_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bancadas" ADD CONSTRAINT "bancadas_liderId_fkey" FOREIGN KEY ("liderId") REFERENCES "vereadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bancadas" ADD CONSTRAINT "bancadas_viceLiderId_fkey" FOREIGN KEY ("viceLiderId") REFERENCES "vereadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_legislaturaId_fkey" FOREIGN KEY ("legislaturaId") REFERENCES "legislaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_vereadorId_fkey" FOREIGN KEY ("vereadorId") REFERENCES "vereadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricoes_orador" ADD CONSTRAINT "inscricoes_orador_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricoes_orador" ADD CONSTRAINT "inscricoes_orador_vereadorId_fkey" FOREIGN KEY ("vereadorId") REFERENCES "vereadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordens_do_dia" ADD CONSTRAINT "ordens_do_dia_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordens_do_dia" ADD CONSTRAINT "ordens_do_dia_proposituraId_fkey" FOREIGN KEY ("proposituraId") REFERENCES "proposituras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votacoes" ADD CONSTRAINT "votacoes_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votacoes" ADD CONSTRAINT "votacoes_proposituraId_fkey" FOREIGN KEY ("proposituraId") REFERENCES "proposituras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votos" ADD CONSTRAINT "votos_votacaoId_fkey" FOREIGN KEY ("votacaoId") REFERENCES "votacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votos" ADD CONSTRAINT "votos_vereadorId_fkey" FOREIGN KEY ("vereadorId") REFERENCES "vereadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emendas_orcamentarias" ADD CONSTRAINT "emendas_orcamentarias_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emendas_orcamentarias" ADD CONSTRAINT "emendas_orcamentarias_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "vereadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patrimonios" ADD CONSTRAINT "patrimonios_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
