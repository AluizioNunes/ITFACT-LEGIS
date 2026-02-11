import { Module } from '@nestjs/common';
import { PortalCidadaoService } from './portal-cidadao.service';
import { PortalCidadaoController } from './portal-cidadao.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PortalCidadaoController],
    providers: [PortalCidadaoService],
    exports: [PortalCidadaoService],
})
export class PortalCidadaoModule { }
