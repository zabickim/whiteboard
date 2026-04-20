import { useEffect, useRef } from 'react';
import type { Point, Stroke } from '../types';
import { useWhiteboardStore } from '@/store/useWhiteboardStore';
import { clearCanvas, renderStroke } from '@/lib/rendering';

const ERASER_RADIUS = 20;

export function useDrawing(draftCanvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const isDown = useRef(false);
  const startPoint = useRef<Point | null>(null);
  const currentPoints = useRef<Point[]>([]);

  const commitStroke = useWhiteboardStore((s) => s.commitStroke);
  const eraseStrokesAt = useWhiteboardStore((s) => s.eraseStrokesAt);
  const config = useWhiteboardStore((s) => s.config);
  const viewport = useWhiteboardStore((s) => s.viewport);

  useEffect(() => {
    const canvas = draftCanvasRef.current;
    if (!canvas) return;

    const getPos = (e: PointerEvent): Point => {
      const r = canvas.getBoundingClientRect();
      const screenX = e.clientX - r.left;
      const screenY = e.clientY - r.top;
      // Convert screen → world coordinates (inverse viewport transform)
      const { scale, offsetX, offsetY } = viewport;
      return {
        x: (screenX - offsetX) / scale,
        y: (screenY - offsetY) / scale,
        t: Date.now(),
      };
    };

    // Render a live preview of the current stroke on the draft canvas
    const renderDraft = (points: Point[]) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      clearCanvas(canvas);

      const dpr = window.devicePixelRatio || 1;
      const { scale, offsetX, offsetY } = viewport;
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr);

      const draftStroke: Stroke = {
        id: 'draft',
        tool: config.tool,
        color: config.color,
        width: config.width,
        points,
      };
      renderStroke(ctx, draftStroke);
    };

    const onDown = (e: PointerEvent) => {
      isDown.current = true;
      const pos = getPos(e);
      startPoint.current = pos;
      currentPoints.current = [pos];

      if (config.tool === 'eraser') {
        eraseStrokesAt(pos, ERASER_RADIUS);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown.current) return;
      const pos = getPos(e);

      if (config.tool === 'eraser') {
        eraseStrokesAt(pos, ERASER_RADIUS);
        return;
      }

      if (config.tool === 'pencil') {
        currentPoints.current.push(pos);
        renderDraft(currentPoints.current);
      } else {
        // line / rect / ellipse - only start + current end
        renderDraft([startPoint.current!, pos]);
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown.current) return;
      isDown.current = false;

      const pos = getPos(e);

      if (config.tool !== 'eraser') {
        const finalPoints =
          config.tool === 'pencil' ? [...currentPoints.current, pos] : [startPoint.current!, pos];

        commitStroke(finalPoints);
      }

      clearCanvas(canvas);
      startPoint.current = null;
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
  }, [draftCanvasRef, commitStroke, eraseStrokesAt, config, viewport]);
}
