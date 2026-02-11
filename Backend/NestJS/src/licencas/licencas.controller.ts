import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { LicencasService } from './licencas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Licenças de Vereadores')
@ApiBearerAuth()
@Controller('licencas')
export class LicencasController {
    constructor(private readonly service: LicencasService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Registra licença de vereador (saúde, interesse particular, etc.)' })
    create(@Body() body: any) { return this.service.create(body); }

    @Get()
    @ApiOperation({ summary: 'Lista todas as licenças' })
    findAll() { return this.service.findAll(); }

    @Get('ativas')
    @ApiOperation({ summary: 'Lista licenças ativas' })
    findAtivas() { return this.service.findAtivas(); }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/encerrar')
    @ApiOperation({ summary: 'Encerra licença e reativa mandato' })
    encerrar(@Param('id') id: string) { return this.service.encerrar(id); }
}
