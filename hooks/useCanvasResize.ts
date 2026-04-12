import { useEffect } from 'react';

type CanvasRefs = {
  canvases: React.RefObject<HTMLCanvasElement | null>[];
  containerRef?: React.RefObject<HTMLElement | null>;
};

export function useCanvasResize({ canvases, containerRef }: CanvasRefs) {
  useEffect(() => {
    // Determine container: explicit ref, or parent of first canvas, or body
    const first = canvases[0]?.current;
    const container: Element = containerRef?.current ?? first?.parentElement ?? document.body;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      for (const ref of canvases) {
        const c = ref.current;
        if (!c) continue;
        c.width = Math.floor(rect.width * dpr);
        c.height = Math.floor(rect.height * dpr);
        c.style.width = `${rect.width}px`;
        c.style.height = `${rect.height}px`;
        const ctx = c.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
    // canvases is a stable array of refs — intentionally omitted
  }, []);
}
