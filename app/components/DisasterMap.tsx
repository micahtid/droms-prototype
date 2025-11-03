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

// Custom marker colors based on severity - Modern minimal design
const getMarkerIcon = (severity: string) => {
  let color = '#3b82f6'; // blue

  switch (severity) {
    case 'CRITICAL':
      color = '#ef4444'; // red
      break;
    case 'SEVERE':
      color = '#f97316'; // orange
      break;
    case 'MODERATE':
      color = '#eab308'; // yellow
      break;
    case 'MINOR':
      color = '#3b82f6'; // blue
      break;
  }

  const svgIcon = `
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${severity}">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.25"/>
        </filter>
      </defs>
      <!-- Outer circle with shadow -->
      <circle cx="14" cy="14" r="13" fill="white" filter="url(#shadow-${severity})" stroke="${color}" stroke-width="2"/>
      <!-- Inner solid circle -->
      <circle cx="14" cy="14" r="8" fill="${color}"/>
      <!-- Inner white dot for contrast -->
      <circle cx="14" cy="14" r="3" fill="white" opacity="0.9"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
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
