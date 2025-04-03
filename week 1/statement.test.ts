import { statement } from "./statement";
import type { Invoice, Plays } from "./types";

describe("statement()", () => {
  it("고객 이름과 각 공연, 총액, 포인트를 포함한 청구서 문자열을 반환해야 함", () => {
    const invoice: Invoice = {
      customer: "BigCo",
      performances: [
        { playID: "hamlet", audience: 55 },
        { playID: "othello", audience: 35 },
      ],
    };
    const plays: Plays = {
      hamlet: { name: "Hamlet", type: "tragedy" },
      "as-like": { name: "As You Like It", type: "comedy" },
      othello: { name: "Othello", type: "tragedy" },
    };

    const result = statement(invoice, plays);
    const expectedLines = [
      "청구내역 (고객명: BigCo)",
      "Hamlet : $650.00 (55석)",
      "Othello : $450.00 (35석)",
      "총액: $1,100.00",
      "적립 포인트: 30점",
    ];

    for (const line of expectedLines) {
      expect(result).toContain(line);
    }
  });
});
