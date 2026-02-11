import { Module } from '@nestjs/common';
import { LicencasController } from './licencas.controller';
import { LicencasService } from './licencas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ imports: [PrismaModule], controllers: [LicencasController], providers: [LicencasService], exports: [LicencasService] })
export class LicencasModule { }
