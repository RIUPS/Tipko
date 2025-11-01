export interface CharacterState {
  id: string;
  char: string;
  status: "pending" | "correct" | "wrong";
}

export type QuoteLengthType = "short" | "medium" | "long";

export interface ErrorType {
  index: number;
  expected: string;
  typed: string;
}

export interface ChartDataPoint {
  time: number;
  wpm: number;
  accuracy: number;
}
