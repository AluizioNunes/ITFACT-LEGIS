import { Controller, Post, Get, Body, Param, Query, Delete } from '@nestjs/common';
import { PortalCidadaoService } from './portal-cidadao.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * Portal do Cidadão — endpoints públicos (sem autenticação).
 * Conforme Lei de Acesso à Informação (LAI) — Lei 12.527/2011.
 */
@ApiTags('Portal do Cidadão — Acesso Público')
@Controller('portal')
export class PortalCidadaoController {
    constructor(private readonly service: PortalCidadaoService) { }

    @Get('proposituras')
    @ApiOperation({ summary: 'Busca proposituras públicas' })
    async buscar(@Query('termo') termo?: string, @Query('tipo') tipo?: string, @Query('ano') ano?: string, @Query('pagina') pagina?: string) {
        return this.service.buscarProposituras({ termo, tipo, ano: ano ? Number(ano) : undefined, pagina: pagina ? Number(pagina) : 1 });
    }

    @Get('proposituras/:id')
    @ApiOperation({ summary: 'Detalhes públicos de propositura com tramitação' })
    async detalhes(@Param('id') id: string) { return this.service.detalhesPropositura(id); }

    @Post('acompanhar')
    @ApiOperation({ summary: 'Cidadão se inscreve para acompanhar propositura por e-mail' })
    async acompanhar(@Body() body: { proposituraId: string; email: string; nome: string }) {
        return this.service.registrarAcompanhamento(body.proposituraId, body.email, body.nome);
    }

    @Delete('acompanhar/:id')
    @ApiOperation({ summary: 'Cancela acompanhamento' })
    async cancelar(@Param('id') id: string, @Query('email') email: string) {
        return this.service.cancelarAcompanhamento(id, email);
    }

    @Get('estatisticas')
    @ApiOperation({ summary: 'Estatísticas públicas da Câmara Municipal' })
    async estatisticas() { return this.service.estatisticasPublicas(); }

    @Get('agenda')
    @ApiOperation({ summary: 'Agenda pública de sessões plenárias' })
    async agenda() { return this.service.agendaPublica(); }

    @Post('ouvidoria')
    @ApiOperation({ summary: 'Registra manifestação cidadã na Ouvidoria' })
    async ouvidoria(@Body() body: { tipo: string; assunto: string; descricao: string; cidadaoNome: string; cidadaoEmail: string }) {
        return this.service.registrarManifestacao(body.tipo, body.assunto, body.descricao, body.cidadaoNome, body.cidadaoEmail);
    }
}
