'use client';

import { Home, Map, Menu } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-300 flex items-center justify-around px-8 z-[1000] shadow-lg">
      <button
        disabled
        className="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-not-allowed min-w-[60px]"
      >
        <Home size={26} strokeWidth={1.5} />
        <span className="text-xs font-medium">Home</span>
      </button>

      <button
        className="flex flex-col items-center justify-center gap-1.5 text-blue-600 min-w-[60px]"
      >
        <Map size={26} strokeWidth={2} />
        <span className="text-xs font-semibold">Map</span>
      </button>

      <button
        disabled
        className="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-not-allowed min-w-[60px]"
      >
        <Menu size={26} strokeWidth={1.5} />
        <span className="text-xs font-medium">Menu</span>
      </button>
    </nav>
  );
}
