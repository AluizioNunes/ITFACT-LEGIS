import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ProporcionalidadeService } from './proporcionalidade.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Proporcionalidade Partidária')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('proporcionalidade')
export class ProporcionalidadeController {
    constructor(private readonly service: ProporcionalidadeService) { }

    @Get(':legislaturaId')
    async calcular(@Param('legislaturaId') id: string) { return this.service.calcularProporcionalidade(id); }

    @Post(':legislaturaId/comissao/:comissaoId')
    async distribuir(@Param('legislaturaId') lid: string, @Param('comissaoId') cid: string) {
        return this.service.distribuirVagas(lid, cid);
    }
}
