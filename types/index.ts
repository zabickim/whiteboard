export type Point = { x: number; y: number; t?: number };

export type Tool = 'pencil' | 'line' | 'rect' | 'ellipse' | 'eraser';

export type Stroke = {
  id: string;
  tool: Tool;
  color: string;
  width: number;
  points: Point[]; // pencil/eraser: all points; line/rect/ellipse: [start, end]
};

export type DrawingConfig = {
  tool: Tool;
  color: string;
  width: number;
};

export type Viewport = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export const MIN_SCALE = 0.1;
export const MAX_SCALE = 20;
export const DEFAULT_VIEWPORT: Viewport = { scale: 1, offsetX: 0, offsetY: 0 };
