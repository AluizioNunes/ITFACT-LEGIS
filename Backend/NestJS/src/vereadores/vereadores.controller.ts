import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VereadoresService } from './vereadores.service';

@Controller('vereadores')
export class VereadoresController {
    constructor(private readonly vereadoresService: VereadoresService) { }

    @Post()
    create(@Body() data: any) {
        return this.vereadoresService.create(data);
    }

    @Get()
    findAll() {
        return this.vereadoresService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vereadoresService.findOne(id);
    }

    @Post(':id/mandatos')
    addMandato(@Param('id') id: string, @Body() data: any) {
        return this.vereadoresService.addMandato(id, {
            ...data,
            inicio: new Date(data.inicio),
        });
    }
}
