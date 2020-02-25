export interface People {
  actualDate: Date;
  people: number;
}

export interface Co2 {
  _id: string;
  actualDate: Date;
  device: number;
  co2: number;
}

export interface Multi {
  _id: string;
  actualDate: Date;
  device: number;
  temp: number;
  hum: number;
  light: number;
}

export interface SensorInfo {
  _id: string;
  date: Date;
  people: People;
  co2: Co2[];
  multi: Multi[];
  __v: number;
}
