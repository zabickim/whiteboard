import type { Point, Stroke } from '@/types';

/** Distance from point P to line segment AB */
function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);

  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** Returns true if the eraser circle (center, radius) hits the stroke */
export function hitsStroke(stroke: Stroke, center: Point, radius: number): boolean {
  const pts = stroke.points;
  if (pts.length === 0) return false;

  if (pts.length === 1) {
    return Math.hypot(pts[0].x - center.x, pts[0].y - center.y) <= radius;
  }

  switch (stroke.tool) {
    case 'pencil': {
      for (let i = 0; i < pts.length - 1; i++) {
        if (pointToSegmentDistance(center, pts[i], pts[i + 1]) <= radius) return true;
      }
      return false;
    }

    case 'line': {
      const [start, end] = [pts[0], pts[pts.length - 1]];
      return pointToSegmentDistance(center, start, end) <= radius;
    }

    case 'rect': {
      const [a, c] = [pts[0], pts[pts.length - 1]];
      const b: Point = { x: c.x, y: a.y };
      const d: Point = { x: a.x, y: c.y };
      // Check all 4 edges
      return (
        pointToSegmentDistance(center, a, b) <= radius ||
        pointToSegmentDistance(center, b, c) <= radius ||
        pointToSegmentDistance(center, c, d) <= radius ||
        pointToSegmentDistance(center, d, a) <= radius
      );
    }

    case 'ellipse': {
      const [start, end] = [pts[0], pts[pts.length - 1]];
      const cx = (start.x + end.x) / 2;
      const cy = (start.y + end.y) / 2;
      const rx = Math.abs(end.x - start.x) / 2;
      const ry = Math.abs(end.y - start.y) / 2;
      if (rx === 0 || ry === 0) return false;

      // Approximate: sample ~36 points on the ellipse perimeter
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const ex = cx + rx * Math.cos(angle);
        const ey = cy + ry * Math.sin(angle);
        if (Math.hypot(ex - center.x, ey - center.y) <= radius) return true;
      }
      return false;
    }

    default:
      return false;
  }
}
