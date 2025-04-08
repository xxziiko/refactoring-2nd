import type { ProducerData } from "./Producer";
import Producer from "./Producer";

interface SampleProvinceDataType {
  name: string;
  producers: ProducerData[];
  demand: number;
  price: number;
}

export function sampleProvinceData(): SampleProvinceDataType {
  return {
    name: "Asia",
    producers: [
      { name: "Byzantium", cost: 10, production: 9 },
      { name: "Attalia", cost: 12, production: 10 },
      { name: "Sinope", cost: 10, production: 6 },
    ],
    demand: 30,
    price: 20,
  };
}

export interface ProvinceData extends SampleProvinceDataType {
  totalProduction: number;
}

export class Province {
  private _producers: ProducerData[];
  private _name: string;
  private _totalProduction: number;
  private _demand: number;
  private _price: number;

  constructor(doc: SampleProvinceDataType) {
    this._producers = [];
    this._name = doc.name;
    this._totalProduction = 0;
    this._demand = doc.demand;
    this._price = doc.price;

    for (const d of doc.producers) {
      this.addProducer(new Producer(this, d));
    }
  }

  get name() {
    return this._name;
  }

  get totalProduction() {
    return this._totalProduction;
  }

  get producers() {
    return this._producers.slice();
  }

  set totalProduction(arg: number) {
    this._totalProduction = arg;
  }

  get demand() {
    return this._demand;
  }

  set demand(arg: number) {
    this._demand = arg;
  }

  get price() {
    return this._price;
  }

  set price(arg: number) {
    this._price = arg;
  }

  get shortfall() {
    return this._demand - this._totalProduction;
  }

  get demandValue() {
    return this.satisfiedDemand * this._price;
  }

  get satisfiedDemand() {
    return Math.min(this._demand, this._totalProduction);
  }

  get demandCost() {
    let remainingDemand = this._demand;
    let result = 0;

    this.producers
      .sort((a, b) => a.cost - b.cost)
      .forEach((p) => {
        const contribution = Math.min(remainingDemand, p.production);
        remainingDemand -= contribution;
        result += contribution * p.cost;
      });
    return result;
  }

  get profit() {
    return this.demandValue - this.demandCost;
  }

  addProducer(arg: Producer) {
    this._producers.push(arg);
    this._totalProduction += arg.production;
  }
}
