'use client';

import { useRef } from 'react';
import { useCanvasResize, useDrawing, useExport, useRedraw, useViewport } from '@/hooks';
import { Toolbar } from '@/components/ui/Toolbar/Toolbar';
import { useWhiteboardStore } from '@/store/useWhiteboardStore';

export const Canvas = () => {
  // committed canvas - all finalized strokes, redrawn from store by useRedraw
  const committedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // draft canvas - current in-progress stroke only, sits on top
  const draftCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useCanvasResize({ canvases: [committedCanvasRef, draftCanvasRef] });
  useRedraw(committedCanvasRef);
  useDrawing(draftCanvasRef);
  useViewport(draftCanvasRef);

  const { exportPng } = useExport(committedCanvasRef);
  const resetViewport = useWhiteboardStore((s) => s.resetViewport);

  return (
    <div className="relative w-full h-full">
      {/* Bottom layer: finalized strokes */}
      <canvas ref={committedCanvasRef} className="absolute inset-0 w-full h-full" />
      {/* Top layer: current stroke being drawn */}
      <canvas ref={draftCanvasRef} className="absolute inset-0 w-full h-full" />
      <Toolbar onExportPng={exportPng} />
      {/* Reset zoom/pan button */}
      <button
        onClick={resetViewport}
        title="Reset zoom & pan (100%)"
        className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm
                   border border-gray-200 px-2 py-1 rounded-full hover:bg-white hover:text-gray-700
                   transition-colors shadow-sm cursor-pointer"
      >
        Reset zoom
      </button>
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
