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

export interface User {
  id: string;
  fingerprint: string;
  jwt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isRegistered: boolean;
  login: (fingerprint: string) => Promise<void>;
  register: (fingerprint: string) => Promise<void>;
  logout: (fingerprint: string) => Promise<void>;
}
