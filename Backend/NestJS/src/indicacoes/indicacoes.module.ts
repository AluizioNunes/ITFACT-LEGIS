import { Module } from '@nestjs/common';
import { IndicacoesService } from './indicacoes.service';
import { IndicacoesController } from './indicacoes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [IndicacoesController], providers: [IndicacoesService], exports: [IndicacoesService] })
export class IndicacoesModule { }
