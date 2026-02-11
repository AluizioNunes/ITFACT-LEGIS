import { Module } from '@nestjs/common';
import { DecoroService } from './decoro.service';
import { DecoroController } from './decoro.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [DecoroController], providers: [DecoroService], exports: [DecoroService] })
export class DecoroModule { }
