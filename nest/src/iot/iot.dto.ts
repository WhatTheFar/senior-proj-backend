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

export class CO2SensorDto {
  @IsDateString()
  date: string;

  @IsDateString()
  actualDate: string;

  @IsNumber()
  @IsPositive()
  device: number;

  @IsNumber()
  co2: number;
}

export class MultiSensorsParams {}

export class MultiSensorsDto {
  @IsNumber()
  @IsPositive()
  device: number;

  @IsDateString()
  actualDate: string;

  @IsDateString()
  date: string;

  @IsNumber()
  temp: number;

  @IsNumber()
  hum: number;

  @IsNumber()
  light: number;
}
