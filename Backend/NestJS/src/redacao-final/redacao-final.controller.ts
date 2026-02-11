import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { RedacaoFinalService } from './redacao-final.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Redação Final')
@ApiBearerAuth()
@Controller('redacao-final')
export class RedacaoFinalController {
    constructor(private readonly service: RedacaoFinalService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Cria redação final para propositura' })
    create(@Body() body: { proposituraId: string; comissaoId: string; texto: string }) {
        return this.service.create(body);
    }

    @Get('propositura/:id')
    @ApiOperation({ summary: 'Busca redação final de propositura' })
    findByPropositura(@Param('id') id: string) { return this.service.findByPropositura(id); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/aprovar')
    @ApiOperation({ summary: 'Aprova redação final' })
    aprovar(@Param('id') id: string) { return this.service.aprovar(id); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/texto')
    @ApiOperation({ summary: 'Atualiza texto da redação final' })
    updateTexto(@Param('id') id: string, @Body() body: { texto: string }) {
        return this.service.updateTexto(id, body.texto);
    }
}
