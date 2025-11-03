'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { disasters, Disaster } from '../data/disasters';
import PinTooltip from './PinTooltip';

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker colors based on severity
const getMarkerIcon = (severity: string) => {
  let color = '#3b82f6'; // blue
  let darkColor = '#2563eb'; // darker blue for border

  switch (severity) {
    case 'CRITICAL':
      color = '#ef4444'; // red
      darkColor = '#dc2626';
      break;
    case 'SEVERE':
      color = '#f97316'; // orange
      darkColor = '#ea580c';
      break;
    case 'MODERATE':
      color = '#eab308'; // yellow
      darkColor = '#ca8a04';
      break;
    case 'MINOR':
      color = '#3b82f6'; // blue
      darkColor = '#2563eb';
      break;
  }

  const svgIcon = `
    <svg width="32" height="45" viewBox="0 0 32 45" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${severity}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      <!-- Outer pin shape -->
      <path d="M16 0C9.373 0 4 5.373 4 12c0 8 12 28 12 28s12-20 12-28c0-6.627-5.373-12-12-12z"
            fill="${darkColor}" filter="url(#shadow-${severity})"/>
      <!-- Inner pin shape -->
      <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 24 10 24s10-17 10-24c0-5.523-4.477-10-10-10z"
            fill="${color}"/>
      <!-- White inner circle with pulse effect -->
      <circle cx="16" cy="12" r="5" fill="white" opacity="0.95"/>
      <!-- Alert icon dot -->
      <circle cx="16" cy="12" r="2.5" fill="${darkColor}"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 45],
    iconAnchor: [16, 45],
    popupAnchor: [0, -40],
  });
};

export default function DisasterMap() {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={[40.8136, -96.7026]} // Lincoln, Nebraska
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={disaster.coordinates}
            icon={getMarkerIcon(disaster.severity)}
            eventHandlers={{
              click: () => setSelectedDisaster(disaster),
            }}
          >
          </Marker>
        ))}
      </MapContainer>

      {selectedDisaster && (
        <PinTooltip
          disaster={selectedDisaster}
          onClose={() => setSelectedDisaster(null)}
        />
      )}
    </div>
  );
}
