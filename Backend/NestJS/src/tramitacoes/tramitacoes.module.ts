import { Module } from '@nestjs/common';
import { TramitacoesController } from './tramitacoes.controller';
import { TramitacoesService } from './tramitacoes.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PropositurasModule } from '../proposituras/proposituras.module';

@Module({
    imports: [PrismaModule, PropositurasModule],
    controllers: [TramitacoesController],
    providers: [TramitacoesService],
})
export class TramitacoesModule { }
