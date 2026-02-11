import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SessoesService } from './sessoes.service';

@Controller('sessoes')
export class SessoesController {
    constructor(private readonly sessoesService: SessoesService) { }

    @Post()
    create(@Body() data: any) {
        return this.sessoesService.create({
            ...data,
            data: new Date(data.data),
        });
    }

    @Get()
    findAll() {
        return this.sessoesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sessoesService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.sessoesService.updateStatus(id, status);
    }
}
