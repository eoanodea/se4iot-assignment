export interface IBulb {
  id: number;
  ip: string;
  state: string;
}

export interface IInfluxDBData {
  data: DataPoint[];
}

export interface DataPoint {
  result: string;
  table: number;
  _start: string;
  _stop: string;
  _time: string;
  _value: string;
  _field: Field;
  _measurement: string;
  bulb_ip: string;
}

export enum Field {
  State = "state",
}

export enum Value {
  Off = "OFF",
  On = "ON",
}
