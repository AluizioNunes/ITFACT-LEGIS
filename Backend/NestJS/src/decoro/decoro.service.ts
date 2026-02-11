import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DecoroService {
    constructor(private prisma: PrismaService) { }

    async criarDenuncia(vereadorId: string, denunciante: string, descricao: string, fundamentacao: string) {
        return { id: `DEC-${Date.now()}`, vereadorId, denunciante, descricao, fundamentacao, status: 'RECEBIDA', criadoEm: new Date() };
    }

    async listarDenuncias(status?: string) {
        return { total: 0, denuncias: [], filtro: status || 'TODAS' };
    }

    async encaminharComissaoEtica(denunciaId: string) {
        return { denunciaId, status: 'EM_ANALISE', comissao: 'Comissão de Ética', encaminhadoEm: new Date() };
    }

    async instaurarProcesso(denunciaId: string, relatorId: string) {
        return { denunciaId, relatorId, status: 'COMISSAO_PROCESSANTE', tipo: 'Processo por Falta de Decoro', instauradoEm: new Date() };
    }

    async emitirParecer(processoId: string, parecer: string, voto: string) {
        return { processoId, parecer, voto, status: 'AGUARDANDO_PLENARIO', emitidoEm: new Date() };
    }

    async votarPlenario(processoId: string, resultado: string) {
        return { processoId, resultado, status: resultado === 'CASSACAO' ? 'CASSADO' : 'ABSOLVIDO', votadoEm: new Date() };
    }
}
