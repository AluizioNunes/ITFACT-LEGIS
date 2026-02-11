import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ConvocacaoService } from './convocacao.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Convocação Prefeito/Secretários')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('convocacao')
export class ConvocacaoController {
    constructor(private readonly service: ConvocacaoService) { }

    @Post()
    async criar(@Body() body: { tipo: string; convocadoNome: string; convocadoCargo: string; assunto: string; dataComparecimento: string }) {
        return this.service.criarConvocacao(body.tipo, body.convocadoNome, body.convocadoCargo, body.assunto, new Date(body.dataComparecimento));
    }

    @Get()
    async listar(@Query('status') status?: string) { return this.service.listarConvocacoes(status); }

    @Post(':id/comparecimento')
    async comparecer(@Param('id') id: string, @Body() body: { compareceu: boolean; resumo?: string }) {
        return this.service.registrarComparecimento(id, body.compareceu, body.resumo);
    }

    @Post(':id/cancelar')
    async cancelar(@Param('id') id: string, @Body() body: { motivo: string }) {
        return this.service.cancelarConvocacao(id, body.motivo);
    }
}
