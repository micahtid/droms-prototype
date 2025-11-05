'use client';

import dynamic from 'next/dynamic';
import BottomNav from './components/BottomNav';

// Dynamically import the map component to avoid SSR issues with leaflet
const DisasterMap = dynamic(() => import('./components/DisasterMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="flex-1 relative z-0 overflow-hidden">
        <DisasterMap />
      </div>
      <BottomNav />
    </div>
  );
}
