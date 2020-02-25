import {
  IsNumber,
  IsDateString,
  IsPositive,
  IsInt,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

// tslint:disable: max-classes-per-file

/*
  List of NodeMCU
    - Temperature,Humidity,Light : 4 nodes
    - CO2 : 1 node
*/

export class GetAllSensorsQuery {
  @IsNumberString()
  @ApiModelProperty({ example: 0, required: false, default: 0 })
  offset: string;

  @IsNumberString()
  @ApiModelProperty({ example: 5, required: false, default: 10 })
  limit: string;
}

export class GetAllSensorsByDateQuery {
  @IsDateString()
  @ApiModelProperty({
    example: '2020-01-01T09:00:00.000Z',
    required: false,
    default: '2020-01-01T09:00:00.000Z',
  })
  start: string;

  @IsDateString()
  @ApiModelProperty({
    example: '2020-01-02T09:00:00.000Z',
    required: false,
    default: '2020-01-02T09:00:00.000Z',
  })
  end: string;

  @IsBooleanString()
  @ApiModelProperty({
    example: 'true',
    required: false,
    default: 'true',
  })
  skip: string;
}

export class PutCountDto {
  @IsInt()
  @ApiModelProperty()
  people: number;
}

export class PeopleDto {
  @IsDateString()
  @ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
  date: string;

  @IsDateString()
  @ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
  actualDate: string;

  @IsInt()
  @ApiModelProperty()
  people: number;
}

export class CO2SensorDto {
  @IsDateString()
  @ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
  date: string;

  @IsDateString()
  @ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
  actualDate: string;

  @IsNumber()
  @IsPositive()
  @ApiModelProperty({ example: 1 })
  device: number;

  @IsNumber()
  @ApiModelProperty()
  co2: number;
}

export class MultiSensorsParams {}

export class MultiSensorsDto {
  @IsNumber()
  @IsPositive()
  @ApiModelProperty({ example: 1 })
  device: number;

  @IsDateString()
  @ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
  actualDate: string;

  @IsDateString()
  @ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
  date: string;

  @IsNumber()
  @ApiModelProperty()
  temp: number;

  @IsNumber()
  @ApiModelProperty()
  hum: number;

  @IsNumber()
  @ApiModelProperty()
  light: number;
}

export class IotDto {
  @ApiModelProperty({ type: String, example: '2019-10-01T00:00:00.000Z' })
  date: Date;

  @ApiModelProperty({ type: PeopleDto })
  @Type(() => PeopleDto)
  people?: PeopleDto;

  @ApiModelProperty({ type: CO2SensorDto, isArray: true })
  @Type(() => CO2SensorDto)
  co2: CO2SensorDto[];

  @ApiModelProperty({ type: MultiSensorsDto, isArray: true })
  @Type(() => MultiSensorsDto)
  multi: MultiSensorsDto[];
}
