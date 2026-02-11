import { Module } from '@nestjs/common';
import { MocoesService } from './mocoes.service';
import { MocoesController } from './mocoes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [MocoesController], providers: [MocoesService], exports: [MocoesService] })
export class MocoesModule { }
