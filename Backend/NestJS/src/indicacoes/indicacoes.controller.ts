import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { IndicacoesService } from './indicacoes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Indicações e Contas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('indicacoes')
export class IndicacoesController {
    constructor(private readonly service: IndicacoesService) { }

    @Post()
    async criar(@Body() body: { autorId: string; tipo: string; descricao: string; valorEstimado?: number; bairro?: string }) {
        return this.service.criarIndicacao(body.autorId, body.tipo, body.descricao, body.valorEstimado, body.bairro);
    }

    @Get()
    async listar(@Query('tipo') tipo?: string, @Query('status') status?: string) {
        return this.service.listarIndicacoes({ tipo, status });
    }

    @Post(':id/executivo')
    async encaminhar(@Param('id') id: string) { return this.service.encaminharExecutivo(id); }

    @Post(':id/resposta')
    async resposta(@Param('id') id: string, @Body() body: { resposta: string; atendida: boolean }) {
        return this.service.registrarResposta(id, body.resposta, body.atendida);
    }

    @Post('contas-executivo')
    async contasExec(@Body() body: { exercicio: number; parecerTCE: string; documentos: string[] }) {
        return this.service.registrarContasExecutivo(body.exercicio, body.parecerTCE, body.documentos);
    }

    @Post('contas-executivo/:id/votar')
    async votarContas(@Param('id') id: string, @Body() body: { aprovadas: boolean; votosA: number; votosC: number }) {
        return this.service.votarContasExecutivo(id, body.aprovadas, body.votosA, body.votosC);
    }
}
