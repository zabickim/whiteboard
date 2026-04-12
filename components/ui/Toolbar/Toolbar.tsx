'use client';

import { useWhiteboardStore } from '@/store/useWhiteboardStore';

const PRESET_WIDTHS = [2, 5, 10, 20];

export const Toolbar = () => {
  const config = useWhiteboardStore((s) => s.config);
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
      {/* Undo */}
      <ToolbarButton onClick={undo} disabled={!canUndo} title="Cofnij (Ctrl+Z)">
        <UndoIcon />
      </ToolbarButton>

      {/* Redo */}
      <ToolbarButton onClick={redo} disabled={!canRedo} title="Ponów (Ctrl+Y)">
        <RedoIcon />
      </ToolbarButton>

      <Divider />

      {/* Color picker */}
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

      <Divider />

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
  title?: string;
  className?: string;
  children: React.ReactNode;
};

const ToolbarButton = ({
  onClick,
  disabled,
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
                ${className}`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-gray-200" />;

const UndoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7v6h6" />
    <path d="M3 13a9 9 0 1 0 2.83-6.36L3 9" />
  </svg>
);

const RedoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 7v6h-6" />
    <path d="M21 13a9 9 0 1 1-2.83-6.36L21 9" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
