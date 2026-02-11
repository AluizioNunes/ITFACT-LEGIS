import { Controller, Get, Patch, Post, Param, Query } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Alertas de Prazo')
@Controller('alertas')
export class AlertasController {
    constructor(private readonly alertasService: AlertasService) { }

    @Get()
    @ApiOperation({ summary: 'Lista alertas de prazo' })
    findAll(@Query('vencido') vencido?: string) {
        return this.alertasService.findAll(vencido === 'true' ? true : vencido === 'false' ? false : undefined);
    }

    @Get('estatisticas')
    @ApiOperation({ summary: 'Estatísticas de alertas' })
    stats() { return this.alertasService.getEstatisticas(); }

    @Get('user/:id')
    @ApiOperation({ summary: 'Alertas de um usuário' })
    byUser(@Param('id') id: string) { return this.alertasService.findByDestinatario(id); }

    @Patch(':id/notificado')
    @ApiOperation({ summary: 'Marca alerta como notificado' })
    notificar(@Param('id') id: string) { return this.alertasService.marcarNotificado(id); }

    @Post('check-vencidos')
    @ApiOperation({ summary: 'Verifica e marca alertas vencidos' })
    check() { return this.alertasService.checkVencidos(); }
}
