import { ConfigService } from './config/config.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IotModule } from './iot/iot.module';
import { MicroGearModule } from './microgear/microgear.module';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    IotModule,
    MicroGearModule,
    ConfigModule,
    MongooseModule.forRootAsync({
      useClass: ConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
