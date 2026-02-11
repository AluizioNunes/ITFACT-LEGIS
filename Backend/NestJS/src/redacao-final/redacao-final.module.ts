import { Module } from '@nestjs/common';
import { RedacaoFinalController } from './redacao-final.controller';
import { RedacaoFinalService } from './redacao-final.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [RedacaoFinalController], providers: [RedacaoFinalService], exports: [RedacaoFinalService] })
export class RedacaoFinalModule { }
