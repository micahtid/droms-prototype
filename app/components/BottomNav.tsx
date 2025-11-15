'use client';

import { Map, List } from 'lucide-react';

interface BottomNavProps {
  activeView: 'map' | 'list';
  onViewChange: (view: 'map' | 'list') => void;
}

export default function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  return (
    <nav className="relative w-full h-20 bg-white border-t border-gray-300 flex items-center justify-around px-8 z-[1000] shadow-lg flex-shrink-0">
      <button
        onClick={() => onViewChange('map')}
        className={`flex flex-col items-center justify-center gap-1.5 min-w-[60px] transition-colors ${
          activeView === 'map'
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Map size={26} strokeWidth={activeView === 'map' ? 2 : 1.5} />
        <span className={`text-xs ${activeView === 'map' ? 'font-semibold' : 'font-medium'}`}>Map</span>
      </button>

      <button
        onClick={() => onViewChange('list')}
        className={`flex flex-col items-center justify-center gap-1.5 min-w-[60px] transition-colors ${
          activeView === 'list'
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <List size={26} strokeWidth={activeView === 'list' ? 2 : 1.5} />
        <span className={`text-xs ${activeView === 'list' ? 'font-semibold' : 'font-medium'}`}>List</span>
      </button>
    </nav>
  );
}
