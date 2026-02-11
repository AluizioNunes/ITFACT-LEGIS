import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MinutasService } from './minutas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Minutas & Assinaturas')
@ApiBearerAuth()
@Controller('minutas')
export class MinutasController {
    constructor(private readonly service: MinutasService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Cria minuta' })
    create(@Request() req, @Body() body: { titulo: string; tipo: string; conteudo: string }) {
        return this.service.create({ ...body, autorId: req.user.id });
    }

    @Get()
    findAll() { return this.service.findAll(); }

    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/submeter')
    @ApiOperation({ summary: 'Submete minuta para aprovação' })
    submeter(@Param('id') id: string) { return this.service.submeterAprovacao(id); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/aprovar')
    @ApiOperation({ summary: 'Aprova minuta' })
    aprovar(@Param('id') id: string, @Request() req) { return this.service.aprovar(id, req.user.id); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/rejeitar')
    rejeitar(@Param('id') id: string) { return this.service.rejeitar(id); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/expedir')
    expedir(@Param('id') id: string) { return this.service.expedir(id); }

    @UseGuards(JwtAuthGuard)
    @Post(':id/assinar')
    @ApiOperation({ summary: 'Assina digitalmente a minuta' })
    assinar(@Param('id') id: string, @Request() req) { return this.service.assinar(id, req.user.id); }

    @Get('verificar/:codigo')
    @ApiOperation({ summary: 'Verifica assinatura digital por código' })
    verificar(@Param('codigo') codigo: string) { return this.service.verificarAssinatura(codigo); }
}
