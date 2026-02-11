import { Module } from '@nestjs/common';
import { PareceresController } from './pareceres.controller';
import { PareceresService } from './pareceres.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PareceresController],
    providers: [PareceresService],
    exports: [PareceresService],
})
export class PareceresModule { }
