import { MicroGearService } from './../microgear/microgear.service';
import { Injectable } from '@nestjs/common';

/**
 * Constants for NETPIE
 */
const NETPIE_IOT_SYNC_TOPIC = '/iot';

@Injectable()
export class IotService {
  constructor(private readonly microgearService: MicroGearService) {}

  publishTimeSyncronization(time: Date) {
    this.microgearService.publish(NETPIE_IOT_SYNC_TOPIC, time.toISOString());
  }
}
