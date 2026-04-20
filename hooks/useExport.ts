import { type RefObject, useCallback } from 'react';

export function useExport(committedCanvasRef: RefObject<HTMLCanvasElement | null>) {
  const exportPng = useCallback(() => {
    const canvas = committedCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [committedCanvasRef]);

  return { exportPng };
}
