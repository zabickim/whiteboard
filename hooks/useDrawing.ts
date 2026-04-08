import { useEffect, useRef } from 'react';
import type { Point } from '../types';

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

    const strokeStyle = '#000';
    const lineWidth = 2;

    const applyStyle = (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
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
      // Keep the path open for the next segment
      ctx.beginPath();
      applyStyle(ctx);
      ctx.moveTo(pos.x, pos.y);
    };

    const onUp = () => {
      if (!isDown.current) return;
      isDown.current = false;
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
