import { Module } from '@nestjs/common';
import { LideresService } from './lideres.service';
import { LideresController } from './lideres.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [LideresController], providers: [LideresService], exports: [LideresService] })
export class LideresModule { }
