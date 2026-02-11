import { Module } from '@nestjs/common';
import { DoelmService } from './doelm.service';
import { DoelmController } from './doelm.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [DoelmController], providers: [DoelmService], exports: [DoelmService] })
export class DoelmModule { }
