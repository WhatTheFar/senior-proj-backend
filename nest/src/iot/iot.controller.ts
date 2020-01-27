import { Response } from 'express';
import { IotService } from './iot.service';
import {
  MultiSensorsDto,
  CO2SensorDto,
  PeopleDto,
  PutCountDto,
  GetAllSensorsQuery,
  IotDto,
  GetAllSensorsByDateQuery,
} from './iot.dto';
import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  Put,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { ApiUseTags, ApiOkResponse } from '@nestjs/swagger';
import { Readable } from 'stream';

@ApiUseTags('iot')
@Controller('iot')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Get('sensor')
  @ApiOkResponse({ type: IotDto, isArray: true })
  async getAllSensors(@Query() query: GetAllSensorsQuery): Promise<IotDto[]> {
    const { offset, limit } = query;
    return await this.iotService.getAllSensors({
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });
  }

  @Get('sensor-csv')
  @ApiOkResponse({ type: String })
  async getAllSensorsCSV(
    @Query() query: GetAllSensorsByDateQuery,
    @Res() res: Response,
  ) {
    const { start, end } = query;
    const csvStringStream = this.iotService.getAllSensorsCSV({
      start: new Date(start),
      end: new Date(end),
    });
    res.set('Content-Disposition', 'attachment; filename="sensors.csv"');
    res.contentType('application/csv');
    Readable.from(csvStringStream).pipe(res);
  }

  @Put('sensor/people/count')
  async putPeopleCount(@Body() body: PutCountDto): Promise<string> {
    const { people } = body;
    await this.iotService.setPeopleCount(people);
    return 'OK';
  }

  @Put('sensor/people/bg')
  async resetCoutnerBackground(): Promise<string> {
    await this.iotService.resetCounterBackground();
    return 'OK';
  }

  @Post('sensor/people')
  async post(@Body() body: PeopleDto): Promise<string> {
    const { date: dateString, actualDate: actualDateStirng, people } = body;
    const date = new Date(dateString);
    const actualDate = new Date(actualDateStirng);
    const payload = {
      actualDate,
      people,
    };
    await this.iotService.savePeopleNumber(date, payload);
    return 'OK';
  }

  @Post('sensor/co2')
  @HttpCode(200)
  async postCO2Sensor(@Body() body: CO2SensorDto): Promise<string> {
    const {
      date: dateString,
      actualDate: actualDateStirng,
      device,
      co2,
    } = body;
    const date = new Date(dateString);
    const actualDate = new Date(actualDateStirng);
    const payload = {
      actualDate,
      device,
      co2,
    };
    await this.iotService.saveCO2(date, payload);
    return 'OK';
  }

  @Post('sensor/multi')
  @HttpCode(200)
  async postMultiSensors(@Body() body: MultiSensorsDto): Promise<string> {
    const {
      date: dateString,
      actualDate: actualDateStirng,
      device,
      temp,
      hum,
      light,
    } = body;
    const date = new Date(dateString);
    const actualDate = new Date(actualDateStirng);
    const payload = {
      actualDate,
      device,
      temp,
      hum,
      light,
    };
    await this.iotService.saveMultiSensors(date, payload);
    return 'OK';
  }
}
