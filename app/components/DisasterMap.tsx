'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
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

// Custom marker colors based on severity - Modern minimal design with zoom scaling
const getMarkerIcon = (severity: string, zoom: number = 13) => {
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

  // Scale based on zoom level (bigger icons, scale down as you zoom in)
  const baseSize = 40;
  const minSize = 32;
  const maxSize = 48;

  // As zoom increases, size decreases slightly
  let size = baseSize - (zoom - 13) * 1.5;
  size = Math.max(minSize, Math.min(maxSize, size));

  const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${severity}">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      <!-- Outer circle with shadow -->
      <circle cx="20" cy="20" r="18" fill="white" filter="url(#shadow-${severity})" stroke="${color}" stroke-width="3"/>
      <!-- Inner solid circle -->
      <circle cx="20" cy="20" r="12" fill="${color}"/>
      <!-- Inner white dot for contrast -->
      <circle cx="20" cy="20" r="5" fill="white" opacity="0.9"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Component to handle zoom changes
function MapZoomHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };

    map.on('zoomend', handleZoom);

    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, onZoomChange]);

  return null;
}

export default function DisasterMap() {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(13);

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

        <MapZoomHandler onZoomChange={setCurrentZoom} />

        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={disaster.coordinates}
            icon={getMarkerIcon(disaster.severity, currentZoom)}
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
