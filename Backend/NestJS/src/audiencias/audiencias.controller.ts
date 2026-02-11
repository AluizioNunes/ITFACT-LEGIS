import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AudienciasService } from './audiencias.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Audiências Públicas')
@ApiBearerAuth()
@Controller('audiencias')
export class AudienciasController {
    constructor(private readonly service: AudienciasService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Agenda audiência pública' })
    create(@Body() body: any) { return this.service.create(body); }

    @Get()
    @ApiOperation({ summary: 'Lista audiências públicas' })
    findAll() { return this.service.findAll(); }

    @Get('comissao/:id')
    @ApiOperation({ summary: 'Audiências de uma comissão' })
    findByComissao(@Param('id') id: string) { return this.service.findByComissao(id); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/ata')
    @ApiOperation({ summary: 'Registra ata de audiência' })
    registrarAta(@Param('id') id: string, @Body() body: { ata: string }) { return this.service.registrarAta(id, body.ata); }
}
