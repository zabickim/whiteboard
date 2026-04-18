import type { Point, Stroke } from '@/types';

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function renderStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  if (stroke.points.length < 1) return;

  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  switch (stroke.tool) {
    case 'pencil':
      renderPencil(ctx, stroke.points);
      break;
    case 'line':
      renderLine(ctx, stroke.points);
      break;
    case 'rect':
      renderRect(ctx, stroke.points);
      break;
    case 'ellipse':
      renderEllipse(ctx, stroke.points);
      break;
    // eraser strokes are never stored — handled by eraseStrokesAt in store
  }

  ctx.restore();
}

function renderPencil(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function renderLine(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;
  const [start, end] = [points[0], points[points.length - 1]];
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

function renderRect(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;
  const [start, end] = [points[0], points[points.length - 1]];
  ctx.beginPath();
  ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
}

function renderEllipse(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length < 2) return;
  const [start, end] = [points[0], points[points.length - 1]];
  const cx = (start.x + end.x) / 2;
  const cy = (start.y + end.y) / 2;
  const rx = Math.abs(end.x - start.x) / 2;
  const ry = Math.abs(end.y - start.y) / 2;
  if (rx === 0 || ry === 0) return;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
}
