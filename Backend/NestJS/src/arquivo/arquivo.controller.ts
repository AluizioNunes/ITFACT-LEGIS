import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Arquivo Geral')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('arquivo')
export class ArquivoController {
    constructor(private readonly service: ArquivoService) { }

    @Post()
    async registrar(@Body() body: { titulo: string; tipo: string; origem: string; caixa: string; localizacao: string }) {
        return this.service.registrarDocumento(body.titulo, body.tipo, body.origem, body.caixa, body.localizacao);
    }

    @Get('buscar')
    async buscar(@Query('titulo') titulo?: string, @Query('tipo') tipo?: string, @Query('caixa') caixa?: string) {
        return this.service.buscarDocumento({ titulo, tipo, caixa });
    }

    @Post('emprestimo')
    async emprestar(@Body() body: { documentoId: string; solicitanteId: string; prazoDevolver: string }) {
        return this.service.registrarEmprestimo(body.documentoId, body.solicitanteId, new Date(body.prazoDevolver));
    }

    @Post('emprestimo/:id/devolver')
    async devolver(@Param('id') id: string) { return this.service.devolverDocumento(id); }

    @Get('caixas')
    async caixas() { return this.service.listarCaixas(); }

    @Get('inventario')
    async inventario(@Query('ano') ano?: string) { return this.service.inventario(ano ? Number(ano) : undefined); }

    @Post('eliminacao')
    async eliminar(@Body() body: { documentoIds: string[]; justificativa: string; dataEliminacao: string }) {
        return this.service.agendarEliminacao(body.documentoIds, body.justificativa, new Date(body.dataEliminacao));
    }
}
