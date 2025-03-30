// statement.test.ts
import statement, { type Invoice, type Plays } from "./statement";

describe("statement()", () => {
	// const plays: Plays = {
	// 	hamlet: { name: "Hamlet", type: "tragedy" },
	// 	"as-like": { name: "As You Like It", type: "comedy" },
	// 	othello: { name: "Othello", type: "tragedy" },
	// };

	it("고객 이름과 각 공연, 총액, 포인트를 포함한 청구서 문자열을 반환해야 함", () => {
		const invoice: Invoice = {
			customer: "BigCo",
			performances: [
				{ playID: "hamlet", audience: 55 },
				{ playID: "othello", audience: 35 },
			],
		};

		const result = statement(invoice);

		expect(result).toContain("청구내역 (고객명: BigCo)");
		expect(result).toContain("Hamlet : $650.00 (55석)");
		expect(result).toContain("Othello : $450.00 (35석)");
		expect(result).toContain("총액: $1,100.00");
		expect(result).toContain("적립 포인트: 30점");
	});
});
