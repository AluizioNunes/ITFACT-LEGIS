import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VersioningService } from './versioning.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Versioning — Git de Leis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('versioning')
export class VersioningController {
    constructor(private readonly service: VersioningService) { }

    @Post(':proposituraId')
    @ApiOperation({ summary: 'Cria nova versão do texto legislativo' })
    async criarVersao(@Param('proposituraId') pid: string, @Body() body: { texto: string; autorId: string; descricao: string }) {
        return this.service.criarVersao(pid, body.texto, body.autorId, body.descricao);
    }

    @Get(':proposituraId')
    @ApiOperation({ summary: 'Lista histórico de versões' })
    async listarVersoes(@Param('proposituraId') pid: string) {
        return this.service.listarVersoes(pid);
    }

    @Get(':proposituraId/diff')
    @ApiOperation({ summary: 'Compara duas versões e retorna diff' })
    async comparar(@Param('proposituraId') pid: string, @Query('a') a: string, @Query('b') b: string) {
        return this.service.compararVersoes(pid, Number(a), Number(b));
    }

    @Post(':proposituraId/restaurar')
    @ApiOperation({ summary: 'Restaura propositura para versão anterior' })
    async restaurar(@Param('proposituraId') pid: string, @Body() body: { versao: number; autorId: string }) {
        return this.service.restaurarVersao(pid, body.versao, body.autorId);
    }
}
