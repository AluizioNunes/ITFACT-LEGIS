import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AssinaturaDigitalService } from './assinatura-digital.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Assinatura Digital ICP-Brasil')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assinatura-digital')
export class AssinaturaDigitalController {
    constructor(private readonly service: AssinaturaDigitalService) { }

    @Post('assinar')
    @ApiOperation({ summary: 'Assina documento com certificado ICP-Brasil (PAdES/CAdES/XAdES)' })
    async assinar(@Body() body: {
        documentoId: string; signatarioId: string;
        certificado: { tipo: 'A1' | 'A3'; serialNumber: string };
        formato?: 'PAdES' | 'CAdES' | 'XAdES';
    }) {
        return this.service.assinarDocumento(body.documentoId, body.signatarioId, body.certificado, body.formato);
    }

    @Get('verificar/:id')
    @ApiOperation({ summary: 'Verifica validade de assinatura digital' })
    async verificar(@Param('id') id: string) {
        return this.service.verificarAssinatura(id);
    }

    @Post('co-assinar')
    @ApiOperation({ summary: 'Adiciona co-assinatura ao documento' })
    async coAssinar(@Body() body: {
        assinaturaId: string; coSignatarioId: string;
        certificado: { tipo: 'A1' | 'A3'; serialNumber: string };
    }) {
        return this.service.coAssinar(body.assinaturaId, body.coSignatarioId, body.certificado);
    }

    @Post('hash')
    @ApiOperation({ summary: 'Gera hash para assinatura offline (token A3)' })
    async hash(@Body() body: { documentoId: string; conteudo: string }) {
        return this.service.gerarHashParaAssinatura(body.documentoId, body.conteudo);
    }

    @Get('certificados')
    @ApiOperation({ summary: 'Lista provedores de certificados ICP-Brasil suportados' })
    async certificados() {
        return this.service.listarCertificados();
    }
}
