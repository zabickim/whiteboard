'use client';

import { useRef } from 'react';
import { useCanvasResize, useDrawing, useExport, useRedraw } from '@/hooks';
import { Toolbar } from '@/components/ui/Toolbar/Toolbar';

export const Canvas = () => {
  // committed canvas - all finalized strokes, redrawn from store by useRedraw
  const committedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // draft canvas - current in-progress stroke only, sits on top
  const draftCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useCanvasResize({ canvases: [committedCanvasRef, draftCanvasRef] });
  useRedraw(committedCanvasRef);
  useDrawing(draftCanvasRef);

  const { exportPng } = useExport(committedCanvasRef);

  return (
    <div className="relative w-full h-full">
      {/* Bottom layer: finalized strokes */}
      <canvas ref={committedCanvasRef} className="absolute inset-0 w-full h-full" />
      {/* Top layer: current stroke being drawn */}
      <canvas ref={draftCanvasRef} className="absolute inset-0 w-full h-full" />
      <Toolbar onExportPng={exportPng} />
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
