'use client';

import { Home, Map, Menu } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex items-center justify-around px-8 z-[1000]">
      <button
        disabled
        className="flex flex-col items-center justify-center gap-1 opacity-40 cursor-not-allowed"
      >
        <Home size={24} strokeWidth={1.5} />
        <span className="text-xs font-medium">Home</span>
      </button>

      <button
        className="flex flex-col items-center justify-center gap-1 text-blue-600"
      >
        <Map size={24} strokeWidth={2} />
        <span className="text-xs font-semibold">Map</span>
      </button>

      <button
        disabled
        className="flex flex-col items-center justify-center gap-1 opacity-40 cursor-not-allowed"
      >
        <Menu size={24} strokeWidth={1.5} />
        <span className="text-xs font-medium">Menu</span>
      </button>
    </nav>
  );
}
