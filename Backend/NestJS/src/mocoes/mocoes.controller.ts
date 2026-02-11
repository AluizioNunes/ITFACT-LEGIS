import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MocoesService } from './mocoes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Moções')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mocoes')
export class MocoesController {
    constructor(private readonly service: MocoesService) { }

    @Post()
    async criar(@Body() body: { autorId: string; tipo: string; destinatario: string; texto: string }) {
        return this.service.criarMocao(body.autorId, body.tipo, body.destinatario, body.texto);
    }

    @Get()
    async listar(@Query('tipo') tipo?: string, @Query('status') status?: string) {
        return this.service.listarMocoes({ tipo, status });
    }

    @Post(':id/aprovar')
    async aprovar(@Param('id') id: string) { return this.service.aprovarMocao(id); }

    @Post(':id/rejeitar')
    async rejeitar(@Param('id') id: string) { return this.service.rejeitarMocao(id); }
}
