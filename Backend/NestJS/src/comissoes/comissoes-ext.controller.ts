import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ComissoesTemporariasService, TipoComissaoTemporaria } from './comissoes-temporarias.service';
import { ComissoesSeedService } from './comissoes-seed.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Comissões — Permanentes e Temporárias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comissoes')
export class ComissoesExtController {
    constructor(
        private readonly temporariasService: ComissoesTemporariasService,
        private readonly seedService: ComissoesSeedService,
    ) { }

    // ========== PERMANENTES (25 tipadas) ==========

    @Get('permanentes/tipadas')
    @ApiOperation({ summary: 'Retorna as 25 comissões permanentes tipadas com competências (Reg. arts. 35-57D)' })
    async listarPermanentesTipadas() {
        return {
            total: 25,
            comissoes: this.seedService.getComissoesPermanentes(),
        };
    }

    // ========== TEMPORÁRIAS (dinâmicas) ==========

    @Post('temporarias')
    @ApiOperation({ summary: 'Cria comissão temporária (Especial, CPI, Processante, Mista, Representativa)' })
    async criarTemporaria(@Body() body: {
        tipo: TipoComissaoTemporaria;
        objetivo: string;
        membrosIds: string[];
        presidenteId: string;
        relatorId: string;
        prazo: number;
    }) {
        return this.temporariasService.criarComissaoTemporaria(
            body.tipo, body.objetivo, body.membrosIds, body.presidenteId, body.relatorId, body.prazo,
        );
    }

    @Get('temporarias')
    @ApiOperation({ summary: 'Lista comissões temporárias ativas' })
    async listarTemporarias(
        @Query('tipo') tipo?: TipoComissaoTemporaria,
        @Query('status') status?: string,
    ) {
        return this.temporariasService.listarComissoesTemporarias(tipo, status);
    }

    @Post('temporarias/:id/prorrogar')
    @ApiOperation({ summary: 'Prorroga prazo de comissão temporária' })
    async prorrogar(@Param('id') id: string, @Body() body: { diasExtras: number; justificativa: string }) {
        return this.temporariasService.prorrogarPrazo(id, body.diasExtras, body.justificativa);
    }

    @Post('temporarias/:id/encerrar')
    @ApiOperation({ summary: 'Encerra comissão temporária com relatório final' })
    async encerrar(@Param('id') id: string, @Body() body: { relatorioFinal: string }) {
        return this.temporariasService.encerrarComissao(id, body.relatorioFinal);
    }

    @Post('cpi')
    @ApiOperation({ summary: 'Cria CPI com validação de quórum (1/3 dos membros — Reg. art. 68)' })
    async criarCPI(@Body() body: {
        fato: string;
        prazo: number;
        requerentesIds: string[];
        fundamentacao: string;
    }) {
        return this.temporariasService.criarCPI(body.fato, body.prazo, body.requerentesIds, body.fundamentacao);
    }
}
