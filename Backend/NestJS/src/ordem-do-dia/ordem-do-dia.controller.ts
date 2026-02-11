import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrdemDoDiaService } from './ordem-do-dia.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Ordem do Dia')
@ApiBearerAuth()
@Controller('ordem-do-dia')
export class OrdemDoDiaController {
    constructor(private readonly service: OrdemDoDiaService) { }

    @UseGuards(JwtAuthGuard)
    @Post('montar/:sessaoId')
    @ApiOperation({ summary: 'Monta automaticamente a Ordem do Dia para uma sessão' })
    montar(@Param('sessaoId') sessaoId: string) { return this.service.montarAutomatica(sessaoId); }

    @Get('sessao/:sessaoId')
    @ApiOperation({ summary: 'Lista itens da Ordem do Dia de uma sessão' })
    findBySessao(@Param('sessaoId') sessaoId: string) { return this.service.findBySessao(sessaoId); }

    @UseGuards(JwtAuthGuard)
    @Patch('reordenar/:sessaoId')
    @ApiOperation({ summary: 'Reordena itens da Ordem do Dia' })
    reordenar(@Param('sessaoId') sessaoId: string, @Body() body: { items: { id: string; ordem: number }[] }) {
        return this.service.reordenar(sessaoId, body.items);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    @ApiOperation({ summary: 'Atualiza status de item da Ordem do Dia' })
    updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
        return this.service.updateStatus(id, body.status);
    }
}
