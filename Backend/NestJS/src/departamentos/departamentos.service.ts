import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartamentosService {
    constructor(private prisma: PrismaService) { }

    async create(data: { nome: string; sigla: string }) {
        return this.prisma.departamento.create({
            data: {
                nome: data.nome,
                sigla: data.sigla
            },
        });
    }

    async findAll() {
        return this.prisma.departamento.findMany();
    }

    async findOne(id: string) {
        return this.prisma.departamento.findUnique({
            where: { id },
            include: { usuarios: true },
        });
    }
}
