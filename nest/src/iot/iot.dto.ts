import {
  IsNumber,
  Min,
  IsDateString,
  IsPositive,
  IsNumberString,
} from 'class-validator';

// tslint:disable: max-classes-per-file

/*
  List of NodeMCU
    - Temperature,Humidity,Light : 4 nodes
    - CO2 : 1 node
*/

export class DateParams {
  @IsDateString()
  date: string;
}

export class CO2SensorDto {
  @IsDateString()
  date: string;

  @IsNumber()
  co2: number;
}

export class MultiSensorsParams {}

export class MultiSensorsDto {
  @IsNumber()
  @IsPositive()
  device: number;

  @IsDateString()
  date: string;

  @IsNumber()
  temp: number;

  @IsNumber()
  hum: number;

  @IsNumber()
  light: number;
}
