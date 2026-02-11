import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProtocolosService } from './protocolos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Protocolos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('protocolos')
export class ProtocolosController {
    constructor(private readonly protocolosService: ProtocolosService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo protocolo' })
    async create(@Body() createProtocoloDto: any, @Request() req: any) {
        return this.protocolosService.createProtocolo({
            ...createProtocoloDto,
            userId: req.user.userId,
            orgaoId: req.user.orgaoId,
        });
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os protocolos' })
    async findAll(@Request() req: any) {
        return this.protocolosService.findAll(req.user.orgaoId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter detalhes de um protocolo' })
    async findOne(@Param('id') id: string) {
        return this.protocolosService.findOne(id);
    }
}
