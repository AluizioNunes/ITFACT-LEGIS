import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LegislacaoParticipativaService } from './legislacao-participativa.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Legislação Participativa')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('legislacao-participativa')
export class LegislacaoParticipativaController {
    constructor(private readonly service: LegislacaoParticipativaService) { }

    @Post('sugestao')
    async registrar(@Body() body: { entidade: string; representante: string; assunto: string; texto: string }) {
        return this.service.registrarSugestao(body.entidade, body.representante, body.assunto, body.texto);
    }

    @Get('sugestoes')
    async listar(@Query('status') status?: string) { return this.service.listarSugestoes(status); }

    @Post('sugestao/:id/analisar')
    async analisar(@Param('id') id: string, @Body() body: { parecer: string; convertida: boolean }) {
        return this.service.analisarSugestao(id, body.parecer, body.convertida);
    }

    @Post('sugestao/:id/converter')
    async converter(@Param('id') id: string, @Body() body: { tipoPropositura: string }) {
        return this.service.converterEmPropositura(id, body.tipoPropositura);
    }
}
