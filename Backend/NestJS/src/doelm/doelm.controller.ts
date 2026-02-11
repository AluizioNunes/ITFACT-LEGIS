import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DoelmService } from './doelm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('DOELM - Diário Oficial')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('doelm')
export class DoelmController {
    constructor(private readonly service: DoelmService) { }

    @Post('publicar')
    async publicar(@Body() body: { tipo: string; titulo: string; conteudo: string; proposituraId?: string }) {
        return this.service.publicar(body.tipo, body.titulo, body.conteudo, body.proposituraId);
    }

    @Get()
    async listar(@Query('tipo') tipo?: string, @Query('ano') ano?: string) {
        return this.service.listarPublicacoes({ tipo, ano: ano ? Number(ano) : undefined });
    }

    @Post('edicao')
    async gerar(@Body() body: { data: string }) { return this.service.gerarEdicao(new Date(body.data)); }

    @Get(':id')
    async buscar(@Param('id') id: string) { return this.service.buscarPublicacao(id); }
}
