import { CONNECT_LINES, STATUS_LINES } from "./templates";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function pickRandomStatusLine(): string {
  return pick(STATUS_LINES);
}

export function pickRandomConnectLine(): string {
  return pick(CONNECT_LINES);
}
