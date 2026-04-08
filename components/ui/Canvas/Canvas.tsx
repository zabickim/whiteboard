'use client';

import { useRef, useEffect } from 'react';
import { useDrawing } from '@/hooks';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useDrawing(canvasRef);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const resize = () => {
      const rect = c.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.floor(rect.width * dpr);
      c.height = Math.floor(rect.height * dpr);
      c.style.width = `${rect.width}px`;
      c.style.height = `${rect.height}px`;
      const ctx = c.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c.parentElement || c);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none select-none
                      text-xs text-gray-400 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full
                      transition-opacity duration-300"
      >
        Whiteboard. Kliknij i przeciągnij, aby rysować
      </div>
    </div>
  );
};
