import { useEffect, useRef } from 'react';
import { useWhiteboardStore } from '@/store/useWhiteboardStore';
import { MAX_SCALE, MIN_SCALE } from '@/types';

export function useViewport(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const setViewport = useWhiteboardStore((s) => s.setViewport);
  const viewportRef = useRef(useWhiteboardStore.getState().viewport);

  // Keep viewportRef in sync with store without subscribing inside the effect
  useEffect(
    () =>
      useWhiteboardStore.subscribe((state) => {
        viewportRef.current = state.viewport;
      }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const { scale, offsetX, offsetY } = viewportRef.current;

      // Zoom towards the cursor position
      const rect = canvas.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const delta = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));
      const ratio = newScale / scale;

      setViewport({
        scale: newScale,
        offsetX: cursorX - ratio * (cursorX - offsetX),
        offsetY: cursorY - ratio * (cursorY - offsetY),
      });
    };

    //  Pan (Space + drag)
    const spaceDown = { current: false };
    const dragOrigin = { x: 0, y: 0, ox: 0, oy: 0, active: false };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        spaceDown.current = true;
        canvas.style.cursor = 'grab';
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceDown.current = false;
        dragOrigin.active = false;
        canvas.style.cursor = '';
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!spaceDown.current) return;
      dragOrigin.active = true;
      dragOrigin.x = e.clientX;
      dragOrigin.y = e.clientY;
      dragOrigin.ox = viewportRef.current.offsetX;
      dragOrigin.oy = viewportRef.current.offsetY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragOrigin.active) return;
      setViewport({
        offsetX: dragOrigin.ox + (e.clientX - dragOrigin.x),
        offsetY: dragOrigin.oy + (e.clientY - dragOrigin.y),
      });
    };

    const onPointerUp = () => {
      if (!dragOrigin.active) return;
      dragOrigin.active = false;
      canvas.style.cursor = spaceDown.current ? 'grab' : '';
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [canvasRef, setViewport]);
}
