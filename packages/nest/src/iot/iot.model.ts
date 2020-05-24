import * as mongoose from 'mongoose';

export const IOT_MODEL = 'iot';
export const IOT_COLLECTION = 'sensors';

export const IotSchema = new mongoose.Schema({
	date: { type: Date, required: true },
	people: {
		type: {
			actualDate: { type: Date, required: true },
			people: { type: Number, required: true }
		},
		required: false
	},
	co2: [
		{
			actualDate: { type: Date, required: true },
			device: { type: Number, required: true },
			co2: { type: Number, required: true }
		}
	],
	multi: [
		{
			actualDate: { type: Date, required: true },
			device: { type: Number, required: true },
			temp: { type: Number, required: true },
			hum: { type: Number, required: true },
			light: { type: Number, required: true }
		}
	]
});

export interface CO2Sensor {
	actualDate: Date;
	device: number;
	co2: number;
}

export interface MultiSensor {
	actualDate: Date;
	device: number;
	temp: number;
	hum: number;
	light: number;
}

export interface PeopleData {
	actualDate: Date;
	people: number;
}

export interface IIot {
	date: Date;
	people?: PeopleData;
	co2: CO2Sensor[];
	multi: MultiSensor[];
}

export interface IIotDoc extends mongoose.Document, IIot {}
