import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AtasIaService } from './atas-ia.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Atas IA — Geração Automática')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('atas-ia')
export class AtasIaController {
    constructor(private readonly service: AtasIaService) { }

    @Post('gerar')
    @ApiOperation({ summary: 'Gera ata de sessão automaticamente com IA' })
    async gerar(@Body() body: any) {
        return this.service.gerarAta(body.sessaoId, body);
    }

    @Post('transcrever')
    @ApiOperation({ summary: 'Transcreve áudio de sessão plenária' })
    async transcrever(@Body() body: { sessaoId: string; audioUrl: string }) {
        return this.service.transcreverAudio(body.sessaoId, body.audioUrl);
    }

    @Post('refinar')
    @ApiOperation({ summary: 'Refina ata rascunho com IA' })
    async refinar(@Body() body: { ataId: string; textoRascunho: string }) {
        return this.service.refinarAta(body.ataId, body.textoRascunho);
    }
}
