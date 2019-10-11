import { IsNumber, IsDateString, IsPositive, IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

// tslint:disable: max-classes-per-file

/*
  List of NodeMCU
    - Temperature,Humidity,Light : 4 nodes
    - CO2 : 1 node
*/

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
