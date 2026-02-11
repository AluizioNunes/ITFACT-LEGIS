import { Module } from '@nestjs/common';
import { PropositurasController } from './proposituras.controller';
import { PropositurasService } from './proposituras.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProtocolosModule } from '../protocolos/protocolos.module';

@Module({
    imports: [PrismaModule, ProtocolosModule],
    controllers: [PropositurasController],
    providers: [PropositurasService],
    exports: [PropositurasService],
})
export class PropositurasModule { }
