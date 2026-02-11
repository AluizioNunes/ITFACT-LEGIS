import { Module } from '@nestjs/common';
import { VotacoesService } from './votacoes.service';
import { VotacoesController } from './votacoes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [VotacoesController],
    providers: [VotacoesService],
    exports: [VotacoesService],
})
export class VotacoesModule { }
