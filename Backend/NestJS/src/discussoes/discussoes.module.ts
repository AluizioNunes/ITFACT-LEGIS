import { Module } from '@nestjs/common';
import { DiscussoesController } from './discussoes.controller';
import { DiscussoesService } from './discussoes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DiscussoesController],
    providers: [DiscussoesService],
    exports: [DiscussoesService],
})
export class DiscussoesModule { }
