export type Point = { x: number; y: number; t?: number };

export type Tool = 'pencil' | 'line' | 'rect' | 'ellipse' | 'eraser';

export type Stroke = {
  id: string;
  tool: Tool;
  color: string;
  width: number;
  points: Point[];
};

export type DrawingConfig = {
  tool: Tool;
  color: string;
  width: number;
};
