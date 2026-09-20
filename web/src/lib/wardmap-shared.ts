/** Shared with client components, so nothing here may touch node: builtins. */
export const MAP_W = 560;
export const MAP_H = 440;

export const PAIR_COLOURS: Record<string, string> = {
  "1+5": "#a32338",
  "2+6": "#1a5557",
  "3+4": "#8a5a0b",
  "7+8": "#4a3a78",
  "9+10": "#2f6b3a",
};

export interface WardShape {
  ward: string;
  pair: string;
  colour: string;
  d: string;
  labelX: number;
  labelY: number;
}
