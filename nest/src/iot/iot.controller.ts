import {
  MultiSensorsDto,
  CO2SensorDto,
  DateParams,
  MultiSensorsParams,
} from './iot.dto';
import { Controller, Post, Body, Param, HttpCode } from '@nestjs/common';

@Controller('iot')
export class IotController {
  @Post('sensor/co2')
  @HttpCode(200)
  postCO2Sensor(@Body() body: CO2SensorDto): string {
    return 'This action returns all cats';
  }

  @Post('sensor/multi')
  @HttpCode(200)
  postMultiSensors(@Body() body: MultiSensorsDto): string {
    return 'This action returns all cats';
  }
}
