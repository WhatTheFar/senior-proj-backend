import { IotService } from './iot.service';
import {
  MultiSensorsDto,
  CO2SensorDto,
  DateParams,
  MultiSensorsParams,
} from './iot.dto';
import { Controller, Post, Body, Param, HttpCode } from '@nestjs/common';

@Controller('iot')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Post('sensor/co2')
  @HttpCode(200)
  async postCO2Sensor(@Body() body: CO2SensorDto): Promise<string> {
    await this.iotService.saveCO2(new Date(body.date), body.co2);
    return 'OK';
  }

  @Post('sensor/multi')
  @HttpCode(200)
  async postMultiSensors(@Body() body: MultiSensorsDto): Promise<string> {
    const { date, device, temp, hum, light } = body;
    await this.iotService.saveMultiSensors(new Date(date), {
      device,
      temp,
      hum,
      light,
    });
    return 'OK';
  }
}
