import { Module } from '@nestjs/common';
import { HonrariasService } from './honrarias.service';
import { HonrariasController } from './honrarias.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [HonrariasController], providers: [HonrariasService], exports: [HonrariasService] })
export class HonrariasModule { }
