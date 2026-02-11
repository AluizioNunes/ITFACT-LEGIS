import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { PareceresService } from './pareceres.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Pareceres de Comissão')
@ApiBearerAuth()
@Controller('pareceres')
export class PareceresController {
    constructor(private readonly pareceresService: PareceresService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Cria solicitação de parecer para uma comissão' })
    create(@Body() body: { proposituraId: string; comissaoId: string; relatorId?: string; tipo: string; prazoLimite?: Date }) {
        return this.pareceresService.create(body);
    }

    @Get('pendentes')
    @ApiOperation({ summary: 'Lista pareceres pendentes de todas as comissões' })
    findPendentes() {
        return this.pareceresService.findPendentes();
    }

    @Get('propositura/:id')
    @ApiOperation({ summary: 'Pareceres de uma propositura' })
    findByPropositura(@Param('id') id: string) {
        return this.pareceresService.findByPropositura(id);
    }

    @Get('comissao/:id')
    @ApiOperation({ summary: 'Pareceres de uma comissão' })
    findByComissao(@Param('id') id: string) {
        return this.pareceresService.findByComissao(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/relator')
    @ApiOperation({ summary: 'Designa relator para parecer' })
    designarRelator(@Param('id') id: string, @Body() body: { relatorId: string }) {
        return this.pareceresService.designarRelator(id, body.relatorId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/emitir')
    @ApiOperation({ summary: 'Emite parecer com texto e voto' })
    emitirParecer(@Param('id') id: string, @Body() body: { texto: string; voto: string }) {
        return this.pareceresService.emitirParecer(id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/aprovar')
    @ApiOperation({ summary: 'Aprova ou rejeita parecer na comissão' })
    aprovarParecer(@Param('id') id: string, @Body() body: { aprovado: boolean }) {
        return this.pareceresService.aprovarParecer(id, body.aprovado);
    }

    @Post('check-prazos')
    @ApiOperation({ summary: 'Verifica e marca prazos vencidos' })
    checkPrazos() {
        return this.pareceresService.checkPrazosVencidos();
    }
}
