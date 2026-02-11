import { Module } from '@nestjs/common';
import { OrdemDoDiaController } from './ordem-do-dia.controller';
import { OrdemDoDiaService } from './ordem-do-dia.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [OrdemDoDiaController], providers: [OrdemDoDiaService], exports: [OrdemDoDiaService] })
export class OrdemDoDiaModule { }
