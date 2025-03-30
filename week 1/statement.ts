type PlayMeta = { name: string; type: string };
export type PlayID = "hamlet" | "as-like" | "othello";
export type Performance = { playID: PlayID; audience: number };

type EnrichedPerformance = Performance & {
  play: PlayMeta;
  amount: number;
  volumeCredits: number;
};

type StatementData = {
  customer: string;
  performances: EnrichedPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
};
export interface Plays {
  [key: string]: PlayMeta;
}

export interface Invoice {
  performances: Performance[];
  customer: string;
}

export function statement(invoice: Invoice) {
  const statementData: StatementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
    totalAmount: 0,
    totalVolumeCredits: 0,
  };

  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return renderPlainText(statementData);
}

// object.assign 말고 스프레드 연산자 사용한 이유
export function enrichPerformance(
  aPerformance: Performance,
): EnrichedPerformance {
  return {
    ...aPerformance,
    play: playFor(aPerformance),
    amount: amountFor(aPerformance),
    volumeCredits: volumeCreditsFor(aPerformance),
  };
}

export function renderPlainText(statementData: StatementData) {
  let result = `청구내역 (고객명: ${statementData.customer})\n`;

  for (const perf of statementData.performances) {
    result += `${playFor(perf).name} : ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(totalAmount(statementData))}\n`;
  result += `적립 포인트: ${totalVolumeCredits(statementData)}점\n`;

  return result;
}

export function totalAmount(data: StatementData) {
  return data.performances.reduce((total, p) => total + p.amount, 0);
}

export function totalVolumeCredits(data: StatementData) {
  return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}

export function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

export function volumeCreditsFor(perf: Performance) {
  let result = 0;

  result += Math.max(perf.audience - 30, 0);

  if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);

  return result;
}

export function playFor(aPerfomance: Performance) {
  return plays[aPerfomance.playID];
}

export function amountFor(aPreformance: Performance) {
  let result = 0;
  const play = playFor(aPreformance);

  switch (play.type) {
    case "tragedy":
      result = 40000;
      if (aPreformance.audience > 30) {
        result += 1000 * (aPreformance.audience - 30);
      }
      break;

    case "comedy":
      result = 30000;
      if (aPreformance.audience > 20) {
        result += 10000 + 5000 * (aPreformance.audience - 20);
      }
      result += 300 * aPreformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }

  return result;
}

const plays: Plays = {
  hamlet: { name: "Hamlet", type: "tragedy" },
  "as-like": { name: "As You Like It", type: "comedy" },
  othello: { name: "Othello", type: "tragedy" },
};

const invoice: Invoice = {
  customer: "BigCo",
  performances: [
    { playID: "hamlet", audience: 55 },
    { playID: "othello", audience: 35 },
  ],
};

console.log(statement(invoice));
