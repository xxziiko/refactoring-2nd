import type { ProvinceData } from "./Province";

export interface ProducerData {
  name: string;
  cost: number;
  production: number;
}

export default class Producer {
  private _province: ProvinceData;
  private _name: string;
  private _cost: number;
  private _production: number;

  constructor(aProvince: ProvinceData, data: ProducerData) {
    this._province = aProvince;
    this._name = data.name;
    this._cost = data.cost;
    this._production = data.production;
  }

  get name() {
    return this._name;
  }

  get cost() {
    return this._cost;
  }

  set cost(arg: number) {
    this._cost = arg;
  }

  get production(): number {
    return this._production;
  }

  set production(amountStr: string) {
    const amount = Number.parseInt(amountStr);
    const newProduction = Number.isNaN(amount) ? 0 : amount;

    this._province.totalProduction += newProduction - this._production;
    this._production = newProduction;
  }
}
