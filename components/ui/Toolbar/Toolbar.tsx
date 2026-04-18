'use client';

import type { Tool } from '@/types';
import { useWhiteboardStore } from '@/store/useWhiteboardStore';
import {
  UndoIcon,
  RedoIcon,
  PencilIcon,
  LineIcon,
  RectIcon,
  EllipseIcon,
  EraserIcon,
  TrashIcon,
} from '@/components/ui/icons';

const PRESET_WIDTHS = [2, 5, 10, 20];

const TOOLS: { tool: Tool; title: string; icon: React.ReactNode }[] = [
  { tool: 'pencil', title: 'Ołówek', icon: <PencilIcon /> },
  { tool: 'line', title: 'Linia', icon: <LineIcon /> },
  { tool: 'rect', title: 'Prostokąt', icon: <RectIcon /> },
  { tool: 'ellipse', title: 'Elipsa', icon: <EllipseIcon /> },
  { tool: 'eraser', title: 'Gumka', icon: <EraserIcon /> },
];

export const Toolbar = () => {
  const config = useWhiteboardStore((s) => s.config);
  const setTool = useWhiteboardStore((s) => s.setTool);
  const setColor = useWhiteboardStore((s) => s.setColor);
  const setWidth = useWhiteboardStore((s) => s.setWidth);
  const undo = useWhiteboardStore((s) => s.undo);
  const redo = useWhiteboardStore((s) => s.redo);
  const clear = useWhiteboardStore((s) => s.clear);
  const canUndo = useWhiteboardStore((s) => s.undoStack.length > 0);
  const canRedo = useWhiteboardStore((s) => s.redoStack.length > 0);

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-10
                 flex items-center gap-3
                 bg-white/90 backdrop-blur-sm
                 border border-gray-200 rounded-2xl
                 px-4 py-2 shadow-md"
    >
      {/* Undo / Redo */}
      <ToolbarButton onClick={undo} disabled={!canUndo} title="Cofnij (Ctrl+Z)">
        <UndoIcon />
      </ToolbarButton>
      <ToolbarButton onClick={redo} disabled={!canRedo} title="Ponów (Ctrl+Y)">
        <RedoIcon />
      </ToolbarButton>

      <Divider />

      {/* Tool selection */}
      <div className="flex items-center gap-1">
        {TOOLS.map(({ tool, title, icon }) => (
          <ToolbarButton
            key={tool}
            onClick={() => setTool(tool)}
            title={title}
            active={config.tool === tool}
          >
            {icon}
          </ToolbarButton>
        ))}
      </div>

      <Divider />

      {/* Color picker */}
      {config.tool !== 'eraser' && (
        <label className="cursor-pointer" title="Kolor">
          <div
            className="w-7 h-7 rounded-full border-2 border-gray-300 overflow-hidden"
            style={{ backgroundColor: config.color }}
          >
            <input
              type="color"
              value={config.color}
              onChange={(e) => setColor(e.target.value)}
              className="opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </label>
      )}

      {/* Stroke width presets */}
      <div className="flex items-center gap-2">
        {PRESET_WIDTHS.map((w) => (
          <button
            key={w}
            onClick={() => setWidth(w)}
            title={`Grubość ${w}px`}
            className={`rounded-full bg-gray-800 transition-all
                        ${config.width === w ? 'ring-2 ring-offset-1 ring-blue-500' : 'opacity-50 hover:opacity-80'}`}
            style={{ width: w + 8, height: w + 8 }}
          />
        ))}
      </div>

      <Divider />

      {/* Clear */}
      <ToolbarButton
        onClick={clear}
        title="Wyczyść tablicę"
        className="text-red-400 hover:text-red-600"
      >
        <TrashIcon />
      </ToolbarButton>
    </div>
  );
};

// helpers

type ToolbarButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title?: string;
  className?: string;
  children: React.ReactNode;
};

const ToolbarButton = ({
  onClick,
  disabled,
  active,
  title,
  className = '',
  children,
}: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-lg transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed
                hover:bg-gray-100 active:bg-gray-200
                ${active ? 'bg-blue-100 text-blue-600' : ''}
                ${className}`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200" />;
