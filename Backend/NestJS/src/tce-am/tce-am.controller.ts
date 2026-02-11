import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TceAmService } from './tce-am.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('TCE-AM — Tribunal de Contas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tce-am')
export class TceAmController {
    constructor(private readonly service: TceAmService) { }

    @Get('importar/:exercicio')
    @ApiOperation({ summary: 'Importa parecer TCE-AM via API' })
    async importar(@Param('exercicio') exercicio: string) { return this.service.importarParecer(Number(exercicio)); }

    @Post('parecer')
    @ApiOperation({ summary: 'Registra parecer TCE manualmente' })
    async registrar(@Body() body: any) { return this.service.registrarParecerManual(body); }

    @Get('pareceres')
    @ApiOperation({ summary: 'Lista pareceres TCE importados' })
    async listar(@Query('ano') ano?: string) { return this.service.listarPareceres(ano ? Number(ano) : undefined); }

    @Get('situacao/:exercicio')
    @ApiOperation({ summary: 'Consulta situação da prestação de contas' })
    async situacao(@Param('exercicio') exercicio: string) { return this.service.consultarSituacao(Number(exercicio)); }
}
