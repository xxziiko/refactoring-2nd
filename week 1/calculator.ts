import type { Performance, PlayMeta } from "./types";

class PerformanceCalculator {
  constructor(
    public performance: Performance,
    public play: PlayMeta,
  ) {}

  get amount(): number {
    throw new Error("서브클래스에서 처리하도록 설계되었습니다.");
  }

  get volumeCredits(): number {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

export function createPerformanceCalculator(
  perf: Performance,
  play: PlayMeta,
): PerformanceCalculator {
  switch (play.type) {
    case "tragedy":
      return new TragedyCalculator(perf, play);
    case "comedy":
      return new ComedyCalculator(perf, play);
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }
}
