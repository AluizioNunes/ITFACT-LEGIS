import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PresencaService } from './presenca.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Presença Eletrônica')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('presenca')
export class PresencaController {
    constructor(private readonly service: PresencaService) { }

    @Post(':sessaoId/registrar')
    @ApiOperation({ summary: 'Registra presença de vereador em sessão' })
    async registrar(@Param('sessaoId') sessaoId: string, @Body() body: { vereadorId: string; tipo?: string }) {
        return this.service.registrarPresenca(sessaoId, body.vereadorId, body.tipo);
    }

    @Post(':sessaoId/lote')
    @ApiOperation({ summary: 'Registra presença em lote' })
    async registrarLote(@Param('sessaoId') sessaoId: string, @Body() body: { presencas: { vereadorId: string; tipo: string }[] }) {
        return this.service.registrarPresencaEmLote(sessaoId, body.presencas);
    }

    @Get(':sessaoId')
    @ApiOperation({ summary: 'Lista presenças de uma sessão' })
    async listar(@Param('sessaoId') sessaoId: string) {
        return this.service.listarPresencasSessao(sessaoId);
    }

    @Get('relatorio/:vereadorId')
    @ApiOperation({ summary: 'Relatório de presença para subsídios' })
    async relatorio(@Param('vereadorId') vereadorId: string, @Query('mesAno') mesAno?: string) {
        return this.service.relatorioPresencaVereador(vereadorId, mesAno);
    }
}
