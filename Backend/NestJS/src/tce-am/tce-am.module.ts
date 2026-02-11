import { Module } from '@nestjs/common';
import { TceAmService } from './tce-am.service';
import { TceAmController } from './tce-am.controller';

@Module({
    controllers: [TceAmController],
    providers: [TceAmService],
    exports: [TceAmService],
})
export class TceAmModule { }
