import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { LideresService } from './lideres.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Líderes e Blocos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lideres')
export class LideresController {
    constructor(private readonly service: LideresService) { }

    @Post()
    async registrar(@Body() body: { partidoId: string; vereadorId: string; tipo?: string }) {
        return this.service.registrarLider(body.partidoId, body.vereadorId, body.tipo);
    }

    @Get()
    async listar() { return this.service.listarLideres(); }

    @Post('blocos')
    async criarBloco(@Body() body: { nome: string; partidosIds: string[]; liderId: string }) {
        return this.service.criarBloco(body.nome, body.partidosIds, body.liderId);
    }

    @Get('blocos')
    async listarBlocos() { return this.service.listarBlocos(); }

    @Post('blocos/:id/dissolver')
    async dissolver(@Param('id') id: string) { return this.service.dissolverBloco(id); }
}
