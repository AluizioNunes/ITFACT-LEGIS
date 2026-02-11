import { Module } from '@nestjs/common';
import { MinutasController } from './minutas.controller';
import { MinutasService } from './minutas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [MinutasController], providers: [MinutasService], exports: [MinutasService] })
export class MinutasModule { }
