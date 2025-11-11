export type Point = { x: number; y: number; t?: number };
export type Stroke = {
  id: string;
  color: string;
  width: number;
  points: Point[];
};
