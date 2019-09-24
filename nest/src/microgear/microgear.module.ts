import { ConfigModule } from '../config/config.module';
import { Module } from '@nestjs/common';
import { MicroGearService } from './microgear.service';

@Module({
  imports: [ConfigModule],
  providers: [MicroGearService],
  exports: [MicroGearService],
})
export class MicroGearModule {}