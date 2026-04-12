import { useEffect, useRef } from 'react';
import type { Point } from '../types';
import { useWhiteboardStore } from '@/store/useWhiteboardStore';

export function useDrawing(
  draftCanvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const isDown = useRef(false);
  const currentPoints = useRef<Point[]>([]);

  const commitStroke = useWhiteboardStore((s) => s.commitStroke);
  const config = useWhiteboardStore((s) => s.config);

  useEffect(() => {
    const canvas = draftCanvasRef.current;
    if (!canvas) return;

    const getPos = (e: PointerEvent): Point => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, t: Date.now() };
    };

    const applyStyle = (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = config.color;
      ctx.lineWidth = config.width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
    };

    const onDown = (e: PointerEvent) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      isDown.current = true;
      const pos = getPos(e);
      currentPoints.current = [pos];
      ctx.beginPath();
      applyStyle(ctx);
      ctx.moveTo(pos.x, pos.y);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown.current) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const pos = getPos(e);
      currentPoints.current.push(pos);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      applyStyle(ctx);
      ctx.moveTo(pos.x, pos.y);
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown.current) return;
      isDown.current = false;

      // Add the final point and commit to store
      currentPoints.current.push(getPos(e));
      commitStroke(currentPoints.current);
      currentPoints.current = [];

      // Clear draft canvas — committed canvas will be redrawn by useRedraw
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [draftCanvasRef, commitStroke, config]);
}
