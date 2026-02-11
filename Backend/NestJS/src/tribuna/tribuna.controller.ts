import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TribunaService } from './tribuna.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tribuna e Expedientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tribuna')
export class TribunaController {
    constructor(private readonly service: TribunaService) { }

    @Post('popular/:sessaoId')
    async inscrever(@Param('sessaoId') sessaoId: string, @Body() body: { entidade: string; representante: string; tema: string }) {
        return this.service.inscreverEntidade(sessaoId, body.entidade, body.representante, body.tema);
    }

    @Get('popular/:sessaoId')
    async listarInscritos(@Param('sessaoId') sessaoId: string) { return this.service.listarInscritos(sessaoId); }

    @Post('fala/:inscricaoId')
    async fala(@Param('inscricaoId') id: string, @Body() body: { duracao: number; resumo: string }) {
        return this.service.registrarFala(id, body.duracao, body.resumo);
    }

    @Post('pequeno-expediente/:sessaoId')
    async pe(@Param('sessaoId') sessaoId: string, @Body() body: { vereadorId: string; assunto: string }) {
        return this.service.inscreverPequenoExpediente(sessaoId, body.vereadorId, body.assunto);
    }

    @Post('grande-expediente/:sessaoId')
    async ge(@Param('sessaoId') sessaoId: string, @Body() body: { vereadorId: string; assunto: string }) {
        return this.service.inscreverGrandeExpediente(sessaoId, body.vereadorId, body.assunto);
    }

    @Get('expedientes/:sessaoId')
    async listarExp(@Param('sessaoId') sessaoId: string, @Query('tipo') tipo?: string) {
        return this.service.listarExpedientes(sessaoId, tipo);
    }
}
