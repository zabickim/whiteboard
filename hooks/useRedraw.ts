import { useEffect } from 'react';
import { useWhiteboardStore } from '@/store/useWhiteboardStore';
import { renderStroke } from '@/lib/rendering';

export function useRedraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const strokes = useWhiteboardStore((s) => s.strokes);
  const viewport = useWhiteboardStore((s) => s.viewport);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redraw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const { scale, offsetX, offsetY } = viewport;

      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr);
      ctx.clearRect(
        -offsetX / scale,
        -offsetY / scale,
        canvas.width / (scale * dpr),
        canvas.height / (scale * dpr),
      );

      for (const stroke of strokes) {
        renderStroke(ctx, stroke);
      }
    };

    redraw();

    const ro = new ResizeObserver(redraw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [strokes, viewport, canvasRef]);
}
