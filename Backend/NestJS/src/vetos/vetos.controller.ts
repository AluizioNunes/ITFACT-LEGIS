import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { VetosService } from './vetos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Vetos')
@ApiBearerAuth()
@Controller('vetos')
export class VetosController {
    constructor(private readonly vetosService: VetosService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Registra veto do Prefeito (total ou parcial)' })
    create(@Body() body: { tipo: string; razoes: string; artigosVetados?: string; proposituraId: string }) {
        return this.vetosService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os vetos' })
    findAll() { return this.vetosService.findAll(); }

    @Get('pendentes')
    @ApiOperation({ summary: 'Lista vetos pendentes de votação' })
    findPendentes() { return this.vetosService.findPendentes(); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/votar')
    @ApiOperation({ summary: 'Registra resultado da votação do veto' })
    votar(@Param('id') id: string, @Body() body: { resultado: string }) {
        return this.vetosService.votarVeto(id, body.resultado);
    }
}
