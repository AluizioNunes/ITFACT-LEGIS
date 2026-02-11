import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HonrariasService {
    constructor(private prisma: PrismaService) { }

    // Honrarias e Comendas — Reg. arts. 173-174
    async criarHonraria(tipo: string, homenageado: string, justificativa: string, autorId: string) {
        const tiposValidos = ['MEDALHA_OURO', 'DIPLOMA_HONRA', 'TITULO_CIDADAO', 'COMENDA', 'VOTO_LOUVOR'];
        if (!tiposValidos.includes(tipo)) throw new Error(`Tipo inválido. Válidos: ${tiposValidos.join(', ')}`);
        return {
            id: `HON-${Date.now()}`, tipo, homenageado, justificativa, autorId,
            status: 'PROPOSTA', comissaoEspecial: 'Comissão Especial de Comendas', criadoEm: new Date(),
        };
    }

    async listarHonrarias(filtro?: { tipo?: string; status?: string }) {
        return { total: 0, honrarias: [], filtro };
    }

    async emitirParecerComissaoComendas(honrariaId: string, parecer: string, aprovada: boolean) {
        return { honrariaId, parecer, status: aprovada ? 'APROVADA_COMISSAO' : 'REJEITADA_COMISSAO', emitidoEm: new Date() };
    }

    async aprovarPlenario(honrariaId: string, votosA: number, votosC: number) {
        return {
            honrariaId, votosA, votosC,
            status: votosA > votosC ? 'APROVADA' : 'REJEITADA',
            aprovadoEm: new Date(),
        };
    }

    async agendarCerimonia(honrariaId: string, data: Date, local: string) {
        return { honrariaId, data, local, status: 'CERIMONIA_AGENDADA' };
    }
}
