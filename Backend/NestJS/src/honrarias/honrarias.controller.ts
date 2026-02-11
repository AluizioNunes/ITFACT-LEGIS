import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HonrariasService } from './honrarias.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Honrarias e Comendas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('honrarias')
export class HonrariasController {
    constructor(private readonly service: HonrariasService) { }

    @Post()
    async criar(@Body() body: { tipo: string; homenageado: string; justificativa: string; autorId: string }) {
        return this.service.criarHonraria(body.tipo, body.homenageado, body.justificativa, body.autorId);
    }

    @Get()
    async listar(@Query('tipo') tipo?: string, @Query('status') status?: string) {
        return this.service.listarHonrarias({ tipo, status });
    }

    @Post(':id/parecer-comissao')
    async parecer(@Param('id') id: string, @Body() body: { parecer: string; aprovada: boolean }) {
        return this.service.emitirParecerComissaoComendas(id, body.parecer, body.aprovada);
    }

    @Post(':id/plenario')
    async plenario(@Param('id') id: string, @Body() body: { votosA: number; votosC: number }) {
        return this.service.aprovarPlenario(id, body.votosA, body.votosC);
    }

    @Post(':id/cerimonia')
    async cerimonia(@Param('id') id: string, @Body() body: { data: string; local: string }) {
        return this.service.agendarCerimonia(id, new Date(body.data), body.local);
    }
}
