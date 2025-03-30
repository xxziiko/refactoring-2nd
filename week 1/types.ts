export type PlayMeta = { name: string; type: string };
export type PlayID = "hamlet" | "as-like" | "othello";
export type Performance = { playID: PlayID; audience: number };

export type EnrichedPerformance = Performance & {
  play: PlayMeta;
  amount: number;
  volumeCredits: number;
};

export type StatementData = {
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
