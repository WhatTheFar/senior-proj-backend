import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IotModule } from './iot/iot.module';
import { MicroGearModule } from './micro-gear/micro-gear.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [IotModule, MicroGearModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
