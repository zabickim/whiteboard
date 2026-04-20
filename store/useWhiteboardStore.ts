import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { DrawingConfig, Point, Stroke, Tool, Viewport } from '@/types';
import { DEFAULT_VIEWPORT } from '@/types';
import { hitsStroke } from '@/lib/collision';

type WhiteboardState = {
  strokes: Stroke[];
  undoStack: Stroke[][];
  redoStack: Stroke[][];
  config: DrawingConfig;
  viewport: Viewport;
};

type WhiteboardActions = {
  commitStroke: (points: Point[]) => void;
  eraseStrokesAt: (point: Point, radius: number) => void;

  undo: () => void;
  redo: () => void;
  clear: () => void;

  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setWidth: (width: number) => void;

  setViewport: (viewport: Partial<Viewport>) => void;
  resetViewport: () => void;
};

const DEFAULT_CONFIG: DrawingConfig = {
  tool: 'pencil',
  color: '#000000',
  width: 2,
};

export const useWhiteboardStore = create<WhiteboardState & WhiteboardActions>()(
  devtools(
    persist(
      (set, get) => ({
        strokes: [],
        undoStack: [],
        redoStack: [],
        config: DEFAULT_CONFIG,
        viewport: DEFAULT_VIEWPORT,

        commitStroke: (points) => {
          if (points.length < 2) return;

          const { config, strokes, undoStack } = get();

          const newStroke: Stroke = {
            id: uuidv4(),
            tool: config.tool,
            color: config.color,
            width: config.width,
            points,
          };

          set({
            strokes: [...strokes, newStroke],
            undoStack: [...undoStack, strokes],
            redoStack: [],
          });
        },

        undo: () => {
          const { undoStack, strokes, redoStack } = get();
          if (undoStack.length === 0) return;

          const previous = undoStack[undoStack.length - 1];

          set({
            strokes: previous,
            undoStack: undoStack.slice(0, -1),
            redoStack: [...redoStack, strokes],
          });
        },

        redo: () => {
          const { redoStack, strokes, undoStack } = get();
          if (redoStack.length === 0) return;

          const next = redoStack[redoStack.length - 1];

          set({
            strokes: next,
            redoStack: redoStack.slice(0, -1),
            undoStack: [...undoStack, strokes],
          });
        },

        clear: () => {
          const { strokes, undoStack } = get();
          if (strokes.length === 0) return;

          set({
            strokes: [],
            undoStack: [...undoStack, strokes],
            redoStack: [],
          });
        },

        eraseStrokesAt: (point, radius) => {
          const { strokes, undoStack } = get();

          const next = strokes.filter((s) => !hitsStroke(s, point, radius));
          if (next.length === strokes.length) return;

          set({
            strokes: next,
            undoStack: [...undoStack, strokes],
            redoStack: [],
          });
        },

        setTool: (tool) => set((s) => ({ config: { ...s.config, tool } })),
        setColor: (color) => set((s) => ({ config: { ...s.config, color } })),
        setWidth: (width) => set((s) => ({ config: { ...s.config, width } })),

        setViewport: (vp) => set((s) => ({ viewport: { ...s.viewport, ...vp } })),
        resetViewport: () => set({ viewport: DEFAULT_VIEWPORT }),
      }),
      {
        name: 'whiteboard-strokes',
        // Persist only strokes - undo/redo history, config and viewport reset on refresh
        partialize: (state) => ({ strokes: state.strokes }),
        onRehydrateStorage: () => (state) => {
          if (state && !Array.isArray(state.strokes)) {
            state.strokes = [];
          }
        },
      },
    ),
    { name: 'whiteboard' },
  ),
);
