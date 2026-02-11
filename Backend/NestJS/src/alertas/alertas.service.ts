import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertasService {
    constructor(private prisma: PrismaService) { }

    async findAll(vencido?: boolean) {
        return this.prisma.alertaPrazo.findMany({
            where: vencido !== undefined ? { vencido } : undefined,
            include: { propositura: true },
            orderBy: { prazoLimite: 'asc' },
        });
    }

    async findByDestinatario(destinatarioId: string) {
        return this.prisma.alertaPrazo.findMany({
            where: { destinatarioId, notificado: false },
            include: { propositura: true },
            orderBy: { prazoLimite: 'asc' },
        });
    }

    async marcarNotificado(id: string) {
        return this.prisma.alertaPrazo.update({
            where: { id },
            data: { notificado: true },
        });
    }

    async checkVencidos() {
        const now = new Date();
        const alertas = await this.prisma.alertaPrazo.findMany({
            where: { vencido: false, prazoLimite: { lt: now } },
        });

        for (const alerta of alertas) {
            await this.prisma.alertaPrazo.update({
                where: { id: alerta.id },
                data: { vencido: true },
            });
        }

        return { vencidos: alertas.length };
    }

    async getEstatisticas() {
        const total = await this.prisma.alertaPrazo.count();
        const pendentes = await this.prisma.alertaPrazo.count({ where: { vencido: false, notificado: false } });
        const vencidos = await this.prisma.alertaPrazo.count({ where: { vencido: true } });
        return { total, pendentes, vencidos };
    }
}
