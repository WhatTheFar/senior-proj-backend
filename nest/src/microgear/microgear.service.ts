import { ConfigService } from '../config/config.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as MicroGear from 'microgear';

// const NETPIE_CACHE_PATH = '/tmp/microgear-g1.cache';
// const NETPIE_CACHE_PATH = `${process.cwd()}/microgear-g1.cache`;

@Injectable()
export class MicroGearService implements OnModuleInit {
  private microgear?: MicroGear.Microgear;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.init();
  }
  private init(): Promise<MicroGear.Microgear> {
    const microgear = MicroGear.create({
      key: this.configService.netpieKey,
      secret: this.configService.netpieSecret,
      alias: 'nest',
    });
    // microgear.setCachePath(NETPIE_CACHE_PATH);

    this.microgear = microgear;

    return new Promise((resolve, reject) => {
      microgear.on('connected', () => {
        resolve(microgear);
      });

      microgear.on('error', err => {
        reject(err);
      });

      microgear.connect(this.configService.netpieAppID);
    });
  }

  reset(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.microgear.resetToken((result: any) => {
        resolve();
      });
    });
  }

  publish(topic: string, message: string) {
    this.microgear.publish(topic, message);
  }
}
