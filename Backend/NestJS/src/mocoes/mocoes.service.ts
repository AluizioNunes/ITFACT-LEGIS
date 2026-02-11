import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MocoesService {
    constructor(private prisma: PrismaService) { }

    async criarMocao(autorId: string, tipo: string, destinatario: string, texto: string) {
        const tiposValidos = ['SOLIDARIEDADE', 'PROTESTO', 'DESAGRAVO', 'PARABENIZACAO', 'REPUDIO', 'PESAR'];
        if (!tiposValidos.includes(tipo)) throw new Error(`Tipo inválido. Válidos: ${tiposValidos.join(', ')}`);
        return { id: `MOC-${Date.now()}`, autorId, tipo, destinatario, texto, status: 'PROTOCOLADA', criadoEm: new Date() };
    }

    async listarMocoes(filtro?: { tipo?: string; status?: string }) {
        return { total: 0, mocoes: [], filtro };
    }

    async aprovarMocao(mocaoId: string) {
        return { mocaoId, status: 'APROVADA', aprovadaEm: new Date() };
    }

    async rejeitarMocao(mocaoId: string) {
        return { mocaoId, status: 'REJEITADA', rejeitadaEm: new Date() };
    }
}
