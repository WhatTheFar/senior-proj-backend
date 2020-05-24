import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBooleanString,
	IsDateString,
	IsInt,
	IsNumber,
	IsNumberString,
	IsPositive
} from 'class-validator';

// tslint:disable: max-classes-per-file

/*
  List of NodeMCU
    - Temperature,Humidity,Light : 4 nodes
    - CO2 : 1 node
*/

export class GetAllSensorsQuery {
	@IsNumberString()
	@ApiModelProperty({ example: 0, required: false, default: 0 })
	public offset: string;

	@IsNumberString()
	@ApiModelProperty({ example: 5, required: false, default: 10 })
	public limit: string;
}

export class GetAllSensorsByDateQuery {
	@IsDateString()
	@ApiModelProperty({
		example: '2020-01-01T09:00:00.000Z',
		required: false,
		default: '2020-01-01T09:00:00.000Z'
	})
	public start: string;

	@IsDateString()
	@ApiModelProperty({
		example: '2020-01-02T09:00:00.000Z',
		required: false,
		default: '2020-01-02T09:00:00.000Z'
	})
	public end: string;

	@IsBooleanString()
	@ApiModelProperty({
		example: 'true',
		required: false,
		default: 'true'
	})
	public skip: string;
}

export class PutCountDto {
	@IsInt()
	@ApiModelProperty()
	public people: number;
}

export class PeopleDto {
	@IsDateString()
	@ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
	public date: string;

	@IsDateString()
	@ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
	public actualDate: string;

	@IsInt()
	@ApiModelProperty()
	public people: number;
}

export class CO2SensorDto {
	@IsDateString()
	@ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
	public date: string;

	@IsDateString()
	@ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
	public actualDate: string;

	@IsNumber()
	@IsPositive()
	@ApiModelProperty({ example: 1 })
	public device: number;

	@IsNumber()
	@ApiModelProperty()
	public co2: number;
}

export class MultiSensorsParams {}

export class MultiSensorsDto {
	@IsNumber()
	@IsPositive()
	@ApiModelProperty({ example: 1 })
	public device: number;

	@IsDateString()
	@ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
	public actualDate: string;

	@IsDateString()
	@ApiModelProperty({ example: '2019-10-01T00:00:00.000Z' })
	public date: string;

	@IsNumber()
	@ApiModelProperty()
	public temp: number;

	@IsNumber()
	@ApiModelProperty()
	public hum: number;

	@IsNumber()
	@ApiModelProperty()
	public light: number;
}

export class IotDto {
	@ApiModelProperty({ type: String, example: '2019-10-01T00:00:00.000Z' })
	public date: Date;

	@ApiModelProperty({ type: PeopleDto })
	@Type(() => PeopleDto)
	public people?: PeopleDto;

	@ApiModelProperty({ type: CO2SensorDto, isArray: true })
	@Type(() => CO2SensorDto)
	public co2: CO2SensorDto[];

	@ApiModelProperty({ type: MultiSensorsDto, isArray: true })
	@Type(() => MultiSensorsDto)
	public multi: MultiSensorsDto[];
}
