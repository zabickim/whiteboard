const SVG_PROPS = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function UndoIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M3 7v6h6" />
      <path d="M3 13a9 9 0 1 0 2.83-6.36L3 9" />
    </svg>
  );
}

export function RedoIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M21 7v6h-6" />
      <path d="M21 13a9 9 0 1 1-2.83-6.36L21 9" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

export function LineIcon() {
  return (
    <svg {...SVG_PROPS}>
      <line x1="5" y1="19" x2="19" y2="5" />
    </svg>
  );
}

export function RectIcon() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

export function EllipseIcon() {
  return (
    <svg {...SVG_PROPS}>
      <ellipse cx="12" cy="12" rx="10" ry="6" />
    </svg>
  );
}

export function EraserIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M20 20H7L3 16l10-10 7 7-2.5 2.5" />
      <path d="M6.0001 17.0001 17 6" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

export function ExportIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
