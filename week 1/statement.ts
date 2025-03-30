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

export function statement(invoice: Invoice, plays: Plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

export function htmlStatement(invoice: Invoice, plays: Plays) {
  return renderHtml(createStatementData(invoice, plays));
}

export function renderHtml(data: StatementData): string {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += `<table>\n`;
  result += `<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>\n`;

  for (const perf of data.performances) {
    result += `  <tr><td>${perf.play.name}</td><td>${perf.audience}석</td><td>${usd(perf.amount)}</td></tr>\n`;
  }

  result += `</table>\n`;
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`;

  return result;
}

export function createStatementData(invoice: Invoice, plays: Plays) {
  const result: StatementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
    totalAmount: 0,
    totalVolumeCredits: 0,
  };

  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);

  return result;

  function enrichPerformance(aPerformance: Performance): EnrichedPerformance {
    return {
      ...aPerformance,
      play: playFor(aPerformance, plays),
      amount: amountFor(aPerformance),
      volumeCredits: volumeCreditsFor(aPerformance, plays),
    };
  }

  function playFor(aPerfomance: Performance, plays: Plays) {
    return plays[aPerfomance.playID];
  }

  function totalAmount(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function volumeCreditsFor(perf: Performance, plays: Plays) {
    let result = 0;

    result += Math.max(perf.audience - 30, 0);

    if ("comedy" === playFor(perf, plays).type)
      result += Math.floor(perf.audience / 5);

    return result;
  }

  function amountFor(aPreformance: Performance) {
    let result = 0;
    const play = playFor(aPreformance, plays);

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
}

export function renderPlainText(data: StatementData) {
  let result = `청구내역 (고객명: ${data.customer})\n`;

  for (const perf of data.performances) {
    result += `${perf.play.name} : ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;

  return result;
}

export function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

console.log(statement(invoice, plays));
