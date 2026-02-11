import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MesaDiretoraService } from './mesa-diretora.service';

@Controller('mesa-diretora')
export class MesaDiretoraController {
    constructor(private readonly mesaDiretoraService: MesaDiretoraService) { }

    @Post()
    create(@Body() data: any) {
        return this.mesaDiretoraService.create({
            ...data,
            inicio: new Date(data.inicio),
            fim: new Date(data.fim),
        });
    }

    @Get('active')
    findActive() {
        return this.mesaDiretoraService.findActive();
    }

    @Post(':id/membros')
    addMembro(@Param('id') id: string, @Body() data: any) {
        return this.mesaDiretoraService.addMembro(id, data);
    }
}
