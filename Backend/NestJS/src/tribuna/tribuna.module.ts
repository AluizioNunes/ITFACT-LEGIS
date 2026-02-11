import { Module } from '@nestjs/common';
import { TribunaService } from './tribuna.service';
import { TribunaController } from './tribuna.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [TribunaController], providers: [TribunaService], exports: [TribunaService] })
export class TribunaModule { }
