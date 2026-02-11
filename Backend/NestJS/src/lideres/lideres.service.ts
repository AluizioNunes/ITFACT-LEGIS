import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LideresService {
    constructor(private prisma: PrismaService) { }

    // Líderes e Vice-Líderes — Reg. arts. 31-32
    async registrarLider(partidoId: string, vereadorId: string, tipo: string = 'LIDER') {
        return { id: `LID-${Date.now()}`, partidoId, vereadorId, tipo, status: 'ATIVO', registradoEm: new Date() };
    }

    async listarLideres() {
        return { total: 0, lideres: [] };
    }

    // Blocos Parlamentares
    async criarBloco(nome: string, partidosIds: string[], liderId: string) {
        return { id: `BL-${Date.now()}`, nome, partidosIds, liderId, status: 'ATIVO', criadoEm: new Date() };
    }

    async listarBlocos() {
        return { total: 0, blocos: [] };
    }

    async dissolverBloco(blocoId: string) {
        return { blocoId, status: 'DISSOLVIDO', dissolvidoEm: new Date() };
    }
}
