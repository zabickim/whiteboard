import { useEffect, useRef } from 'react';
import type { Point, Stroke } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useDrawing(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const isDown = useRef(false);
  const currentPoints = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, t: Date.now() };
    };

    const onDown = (e: PointerEvent) => {
      isDown.current = true;
      currentPoints.current = [getPos(e)];
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown.current) return;
      currentPoints.current.push(getPos(e));
    };

    const onUp = () => {
      if (!isDown.current) return;
      isDown.current = false;
      const stroke: Stroke = {
        id: uuidv4(),
        color: '#000',
        width: 2,
        points: currentPoints.current,
      };

      const ctx = canvas.getContext('2d');
      if (ctx && stroke.points.length) {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (const p of stroke.points) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      currentPoints.current = [];
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [canvasRef]);
}
