import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { VotacoesService } from './votacoes.service';

@Controller('votacoes')
export class VotacoesController {
    constructor(private readonly votacoesService: VotacoesService) { }

    @Post()
    create(@Body() data: any) {
        return this.votacoesService.create(data);
    }

    @Post(':id/votos')
    registrarVoto(@Param('id') id: string, @Body() data: any) {
        return this.votacoesService.registrarVoto(id, data);
    }

    @Patch(':id/finalizar')
    finalizarVotacao(@Param('id') id: string, @Body('resultado') resultado: string) {
        return this.votacoesService.finalizarVotacao(id, resultado);
    }
}
