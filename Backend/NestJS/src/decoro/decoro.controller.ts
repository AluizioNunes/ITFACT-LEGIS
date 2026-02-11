import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { DecoroService } from './decoro.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Decoro Parlamentar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('decoro')
export class DecoroController {
    constructor(private readonly service: DecoroService) { }

    @Post('denuncia')
    async criar(@Body() body: { vereadorId: string; denunciante: string; descricao: string; fundamentacao: string }) {
        return this.service.criarDenuncia(body.vereadorId, body.denunciante, body.descricao, body.fundamentacao);
    }

    @Get('denuncias')
    async listar() { return this.service.listarDenuncias(); }

    @Post(':id/comissao-etica')
    async encaminhar(@Param('id') id: string) { return this.service.encaminharComissaoEtica(id); }

    @Post(':id/processo')
    async instaurar(@Param('id') id: string, @Body() body: { relatorId: string }) {
        return this.service.instaurarProcesso(id, body.relatorId);
    }

    @Post(':id/parecer')
    async parecer(@Param('id') id: string, @Body() body: { parecer: string; voto: string }) {
        return this.service.emitirParecer(id, body.parecer, body.voto);
    }

    @Post(':id/plenario')
    async votar(@Param('id') id: string, @Body() body: { resultado: string }) {
        return this.service.votarPlenario(id, body.resultado);
    }
}
