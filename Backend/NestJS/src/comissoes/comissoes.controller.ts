import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ComissoesService } from './comissoes.service';

@Controller('comissoes')
export class ComissoesController {
    constructor(private readonly comissoesService: ComissoesService) { }

    @Post()
    create(@Body() data: any) {
        return this.comissoesService.create(data);
    }

    @Get()
    findAll() {
        return this.comissoesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.comissoesService.findOne(id);
    }

    @Post(':id/membros')
    addMembro(@Param('id') id: string, @Body() data: any) {
        return this.comissoesService.addMembro(id, {
            ...data,
            inicio: data.inicio ? new Date(data.inicio) : undefined,
            fim: data.fim ? new Date(data.fim) : undefined,
        });
    }
}
