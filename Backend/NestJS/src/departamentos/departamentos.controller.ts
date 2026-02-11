import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Departamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departamentos')
export class DepartamentosController {
    constructor(private readonly departamentosService: DepartamentosService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo departamento' })
    create(@Body() data: { nome: string; sigla: string }) {
        return this.departamentosService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os departamentos' })
    findAll() {
        return this.departamentosService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar departamento por ID' })
    findOne(@Param('id') id: string) {
        return this.departamentosService.findOne(id);
    }
}
