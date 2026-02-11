import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LegislaturasService } from './legislaturas.service';

@Controller('legislaturas')
export class LegislaturasController {
    constructor(private readonly legislaturasService: LegislaturasService) { }

    @Post()
    create(@Body() data: { numero: number; inicio: string; fim: string }) {
        return this.legislaturasService.create({
            numero: data.numero,
            inicio: new Date(data.inicio),
            fim: new Date(data.fim),
        });
    }

    @Get()
    findAll() {
        return this.legislaturasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.legislaturasService.findOne(id);
    }
}
