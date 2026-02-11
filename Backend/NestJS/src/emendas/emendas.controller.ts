import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EmendasService } from './emendas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Emendas')
@ApiBearerAuth()
@Controller('emendas')
export class EmendasController {
    constructor(private readonly emendasService: EmendasService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Cria uma emenda (supressiva, substitutiva, aditiva, modificativa)' })
    create(@Request() req, @Body() body: {
        proposituraId: string;
        numero: number;
        tipo: string;
        texto: string;
        justificativa?: string;
    }) {
        return this.emendasService.create({ ...body, autorId: req.user.id });
    }

    @Get('propositura/:proposituraId')
    @ApiOperation({ summary: 'Lista emendas de uma propositura' })
    findByPropositura(@Param('proposituraId') proposituraId: string) {
        return this.emendasService.findByPropositura(proposituraId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Detalhes de uma emenda' })
    findOne(@Param('id') id: string) {
        return this.emendasService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    @ApiOperation({ summary: 'Atualiza status de uma emenda' })
    updateStatus(@Param('id') id: string, @Body() body: { status: string; parecerComissao?: string }) {
        return this.emendasService.updateStatus(id, body.status, body.parecerComissao);
    }
}
