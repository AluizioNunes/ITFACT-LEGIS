import { Module } from '@nestjs/common';
import { VersioningService } from './versioning.service';
import { VersioningController } from './versioning.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [VersioningController],
    providers: [VersioningService],
    exports: [VersioningService],
})
export class VersioningModule { }
