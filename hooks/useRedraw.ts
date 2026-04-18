import { useEffect } from 'react';
import { useWhiteboardStore } from '@/store/useWhiteboardStore';
import { renderStroke } from '@/lib/rendering';

export function useRedraw(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const strokes = useWhiteboardStore((s) => s.strokes);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redraw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const stroke of strokes) {
        renderStroke(ctx, stroke);
      }
    };

    redraw();

    const ro = new ResizeObserver(redraw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [strokes, canvasRef]);
}
