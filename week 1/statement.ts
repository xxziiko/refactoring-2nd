type PlayMeta = { name: string; type: string };
type PlayID = "hamlet" | "as-like" | "othello";
type Perfomance = { playID: PlayID; audience: number };

export interface Plays {
  [key: string]: PlayMeta;
}

export interface Invoice {
  performances: Perfomance[];
  customer: string;
}

function statement(invoice: Invoice) {
  return renderPlainText(invoice);
}

function renderPlainText(invoice: Invoice) {
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  for (const perf of invoice.performances) {
    result += `${playFor(perf).name} : ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;

  return result;
}

function totalAmount() {
  let result = 0;
  for (const perf of invoice.performances) {
    result += amountFor(perf);
  }

  return result;
}

function totalVolumeCredits() {
  let result = 0;
  for (const perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }

  return result;
}

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function volumeCreditsFor(perf: Perfomance) {
  let result = 0;

  result += Math.max(perf.audience - 30, 0);

  if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);

  return result;
}

function playFor(aPerfomance: Perfomance) {
  return plays[aPerfomance.playID];
}

function amountFor(aPreformance: Perfomance) {
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

export default statement;
