import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { TramitacoesService } from './tramitacoes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tramitacoes')
@ApiBearerAuth()
@Controller('tramitacoes')
export class TramitacoesController {
    constructor(private readonly tramitacoesService: TramitacoesService) { }

    @UseGuards(JwtAuthGuard)
    @Post('forward/:proposituraId')
    @ApiOperation({ summary: 'Encaminha uma propositura para outro setor/comissão' })
    forward(
        @Param('proposituraId') proposituraId: string,
        @Body() body: { origem: string; destino: string; observacao?: string },
    ) {
        return this.tramitacoesService.forward(proposituraId, body.origem, body.destino, body.observacao);
    }

    @UseGuards(JwtAuthGuard)
    @Post('receive/:id')
    @ApiOperation({ summary: 'Confirma o recebimento de uma tramitação' })
    receive(@Param('id') id: string, @Body() body: { destinatarioId: string }) {
        return this.tramitacoesService.receive(id, body.destinatarioId);
    }

    @Get('propositura/:proposituraId')
    @ApiOperation({ summary: 'Lista o histórico de tramitações de uma propositura' })
    findByPropositura(@Param('proposituraId') proposituraId: string) {
        return this.tramitacoesService.findByPropositura(proposituraId);
    }
}
