import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { DiscussoesService } from './discussoes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Discussões Plenárias')
@ApiBearerAuth()
@Controller('discussoes')
export class DiscussoesController {
    constructor(private readonly discussoesService: DiscussoesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Registra discussão (1ª ou 2ª) para propositura' })
    create(@Body() body: { proposituraId: string; sessaoId: string; fase: string; observacoes?: string }) {
        return this.discussoesService.registrarDiscussao(body);
    }

    @Get('propositura/:id')
    @ApiOperation({ summary: 'Discussões de uma propositura' })
    findByPropositura(@Param('id') id: string) {
        return this.discussoesService.findByPropositura(id);
    }

    @Get('sessao/:id')
    @ApiOperation({ summary: 'Discussões de uma sessão' })
    findBySessao(@Param('id') id: string) {
        return this.discussoesService.findBySessao(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/encerrar')
    @ApiOperation({ summary: 'Encerra discussão com resultado' })
    encerrar(@Param('id') id: string, @Body() body: { resultado: string }) {
        return this.discussoesService.encerrarDiscussao(id, body.resultado);
    }
}
