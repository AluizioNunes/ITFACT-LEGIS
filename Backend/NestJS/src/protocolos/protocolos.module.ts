import { Module } from '@nestjs/common';
import { ProtocolosService } from './protocolos.service';
import { ProtocolosController } from './protocolos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ProtocolosController],
    providers: [ProtocolosService],
    exports: [ProtocolosService],
})
export class ProtocolosModule { }
