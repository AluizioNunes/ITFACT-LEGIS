import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async saveMessage(
        content: string,
        senderId: string,
        scope: 'DEPARTAMENTO' | 'ORGAO' | 'GLOBAL',
        orgaoId?: string,
        departamentoId?: string
    ) {
        return this.prisma.message.create({
            data: {
                content,
                senderId,
                scope,
                orgaoId,
                departamentoId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    async getHistory(
        scope: 'DEPARTAMENTO' | 'ORGAO' | 'GLOBAL',
        orgaoId?: string,
        departamentoId?: string,
        limit = 50
    ) {
        return this.prisma.message.findMany({
            where: {
                scope,
                orgaoId: scope === 'ORGAO' ? orgaoId : undefined,
                departamentoId: scope === 'DEPARTAMENTO' ? departamentoId : undefined,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: { createdAt: 'asc' },
            take: limit,
        });
    }
}
