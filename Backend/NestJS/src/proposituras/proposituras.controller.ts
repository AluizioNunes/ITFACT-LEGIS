import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PropositurasService } from './proposituras.service';
import { CreateProposituraDto } from './dto/create-propositura.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Proposituras')
@ApiBearerAuth()
@Controller('proposituras')
export class PropositurasController {
    constructor(private readonly propositurasService: PropositurasService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Cria uma nova propositura (Projeto de Lei, etc)' })
    create(@Request() req, @Body() createProposituraDto: CreateProposituraDto) {
        return this.propositurasService.create(req.user.id, createProposituraDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todas as proposituras' })
    findAll() {
        return this.propositurasService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca detalhes de uma propositura específica' })
    findOne(@Param('id') id: string) {
        return this.propositurasService.findOne(id);
    }
}
