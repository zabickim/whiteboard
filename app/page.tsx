'use client';

import { Canvas, Toolbar } from '@/components';
import { useKeyboardShortcuts } from '@/hooks';

export default function Home() {
  useKeyboardShortcuts();

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <Canvas />
      <Toolbar />
    </main>
  );
}
