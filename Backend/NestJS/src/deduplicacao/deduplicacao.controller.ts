import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { DeduplicacaoService } from './deduplicacao.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Deduplicação Semântica')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deduplicacao')
export class DeduplicacaoController {
    constructor(private readonly service: DeduplicacaoService) { }

    @Post('verificar')
    @ApiOperation({ summary: 'Verifica duplicatas semânticas antes de criar documento' })
    async verificar(
        @Body() body: { titulo: string; conteudo: string; origem: string; tipo?: string },
    ) {
        return this.service.verificarDuplicatas(
            body.titulo,
            body.conteudo,
            body.origem,
            body.tipo || 'MINUTA',
        );
    }

    @Post('indexar')
    @ApiOperation({ summary: 'Indexa documento no motor semântico' })
    async indexar(
        @Body() body: {
            documentoId: string;
            tipo: string;
            origem: string;
            titulo: string;
            conteudo: string;
            metadata?: Record<string, any>;
        },
    ) {
        return this.service.indexarDocumento(
            body.documentoId,
            body.tipo,
            body.origem,
            body.titulo,
            body.conteudo,
            body.metadata,
        );
    }

    @Post('buscar')
    @ApiOperation({ summary: 'Busca semântica por texto livre' })
    async buscar(
        @Body() body: { texto: string; limite?: number; threshold?: number },
    ) {
        return this.service.buscarSimilares(body.texto, body.limite, body.threshold);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Estatísticas do motor semântico' })
    async stats() {
        return this.service.obterEstatisticas();
    }
}
