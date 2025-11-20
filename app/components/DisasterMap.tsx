'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Disaster } from '../data/disasters';
import PinTooltip from './PinTooltip';

interface DisasterMapProps {
  disasters: Disaster[];
  onVolunteerContribution: (disasterId: string, volunteerType: string, quantity: number, maxPositions: number) => void;
  onResourceContribution: (disasterId: string, resourceIndex: number, resourceName: string, quantity: number, maxQuantity: number) => void;
  disasterTypeFilter: string[];
  onDisasterTypeFilterChange: (types: string[]) => void;
  severityFilter: string[];
  onSeverityFilterChange: (severities: string[]) => void;
}

// Get disaster type category for color coding
const getDisasterTypeCategory = (type: string): string => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('tornado') || lowerType.includes('destruction')) return 'tornado';
  if (lowerType.includes('flood') || lowerType.includes('water')) return 'flood';
  if (lowerType.includes('fire') || lowerType.includes('burn')) return 'fire';
  if (lowerType.includes('gas') || lowerType.includes('leak')) return 'gas';
  if (lowerType.includes('utility') || lowerType.includes('power')) return 'utility';
  if (lowerType.includes('medical') || lowerType.includes('triage')) return 'medical';
  if (lowerType.includes('shelter')) return 'shelter';
  return 'other';
}

// FERPA Emergency Type Mapping
const getFERPAType = (disasterCategory: string): string => {
  switch (disasterCategory) {
    case 'tornado':
      return 'Weather Emergency';
    case 'flood':
      return 'Weather Emergency';
    case 'fire':
      return 'Fire Emergency';
    case 'gas':
      return 'Hazmat Emergency';
    case 'utility':
      return 'Infrastructure';
    case 'medical':
      return 'Medical Emergency';
    case 'shelter':
      return 'Shelter Emergency';
    default:
      return 'Other Emergency';
  }
}

// Get disaster type color
const getDisasterTypeColor = (type: string): string => {
  const category = getDisasterTypeCategory(type);
  switch (category) {
    case 'tornado':
      return 'rgba(139, 92, 246, 0.8)'; // purple
    case 'flood':
      return 'rgba(6, 182, 212, 0.8)'; // cyan
    case 'fire':
      return 'rgba(249, 115, 22, 0.8)'; // orange
    case 'gas':
      return 'rgba(234, 179, 8, 0.8)'; // yellow
    case 'utility':
      return 'rgba(16, 185, 129, 0.8)'; // green
    case 'medical':
      return 'rgba(236, 72, 153, 0.8)'; // pink
    case 'shelter':
      return 'rgba(59, 130, 246, 0.8)'; // blue
    default:
      return 'rgba(107, 114, 128, 0.8)'; // gray
  }
}

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

// Custom marker colors based on disaster type - Modern minimal design with zoom scaling
const getMarkerIcon = (disasterType: string, severity: string, zoom: number = 13) => {
  // Use disaster type color instead of severity
  const color = getDisasterTypeColor(disasterType);

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

export default function DisasterMap({ disasters, onVolunteerContribution, onResourceContribution, disasterTypeFilter, onDisasterTypeFilterChange, severityFilter, onSeverityFilterChange }: DisasterMapProps) {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(13);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Get unique disaster types and severities for filter
  const uniqueDisasterTypes = Array.from(new Set(disasters.map(d => getDisasterTypeCategory(d.type))));
  const uniqueSeverities = Array.from(new Set(disasters.map(d => d.severity)));

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

  // Helper function to get circle color based on severity
  const getCircleColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return '#ef4444'; // red
      case 'SEVERE':
        return '#f97316'; // orange
      case 'MODERATE':
        return '#eab308'; // yellow
      case 'MINOR':
        return '#3b82f6'; // blue
      default:
        return '#3b82f6';
    }
  };

  // Filter disasters to only show non-parent disasters (the actual pinpoints)
  let visibleDisasters = disasters.filter(d => !d.isParent);
  let parentDisasters = disasters.filter(d => d.isParent);

  // Apply type filter if active
  if (disasterTypeFilter.length > 0) {
    visibleDisasters = visibleDisasters.filter(d => disasterTypeFilter.includes(getDisasterTypeCategory(d.type)));
    parentDisasters = parentDisasters.filter(d => disasterTypeFilter.includes(getDisasterTypeCategory(d.type)));
  }

  // Apply severity filter if active
  if (severityFilter.length > 0) {
    visibleDisasters = visibleDisasters.filter(d => severityFilter.includes(d.severity));
    parentDisasters = parentDisasters.filter(d => severityFilter.includes(d.severity));
  }

  // Toggle type filter
  const toggleTypeFilter = (type: string) => {
    if (disasterTypeFilter.includes(type)) {
      onDisasterTypeFilterChange(disasterTypeFilter.filter(t => t !== type));
    } else {
      onDisasterTypeFilterChange([...disasterTypeFilter, type]);
    }
  };

  // Toggle severity filter
  const toggleSeverityFilter = (severity: string) => {
    if (severityFilter.includes(severity)) {
      onSeverityFilterChange(severityFilter.filter(s => s !== severity));
    } else {
      onSeverityFilterChange([...severityFilter, severity]);
    }
  };

  return (
    <div className="w-full h-full relative z-0" onClick={() => setShowFilterMenu(false)}>
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

        {/* Render polygons or circles for parent disasters */}
        {parentDisasters.map((disaster) => {
          // Use polygon if polygonCoordinates exist, otherwise use circle
          if (disaster.polygonCoordinates && disaster.polygonCoordinates.length > 0) {
            return (
              <Polygon
                key={`polygon-${disaster.id}`}
                positions={disaster.polygonCoordinates}
                pathOptions={{
                  color: getCircleColor(disaster.severity),
                  fillColor: getCircleColor(disaster.severity),
                  fillOpacity: 0.15,
                  weight: 3,
                  opacity: 0.7
                }}
              />
            );
          } else if (disaster.areaRadius) {
            return (
              <Circle
                key={`circle-${disaster.id}`}
                center={disaster.coordinates}
                radius={disaster.areaRadius}
                pathOptions={{
                  color: getCircleColor(disaster.severity),
                  fillColor: getCircleColor(disaster.severity),
                  fillOpacity: 0.1,
                  weight: 2,
                  opacity: 0.6
                }}
              />
            );
          }
          return null;
        })}

        {/* Render markers for actual disaster pinpoints (non-parent disasters) */}
        {visibleDisasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={disaster.coordinates}
            icon={getMarkerIcon(disaster.type, disaster.severity, currentZoom)}
            eventHandlers={{
              click: () => setSelectedDisaster(disaster),
            }}
          >
          </Marker>
        ))}
      </MapContainer>

      {/* Filter Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowFilterMenu(!showFilterMenu);
        }}
        className="absolute top-4 left-4 z-[800] px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation border border-gray-200"
        aria-label="Filter disasters"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
        <span className="text-sm font-medium">Filter</span>
        {(disasterTypeFilter.length > 0 || severityFilter.length > 0) && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{disasterTypeFilter.length + severityFilter.length}</span>
        )}
      </button>

      {/* Filter Menu */}
      {showFilterMenu && (
        <div
          className="absolute top-16 left-4 z-[850] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Type Filters */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Disaster Type</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueDisasterTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize"
                    style={{
                      backgroundColor: disasterTypeFilter.includes(type) ? getDisasterTypeColor(type) : '#f3f4f6',
                      color: disasterTypeFilter.includes(type) ? 'rgba(255, 255, 255, 0.7)' : '#374151',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Filters */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Severity</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueSeverities.map((severity) => {
                  const getSeverityBgColor = (sev: string) => {
                    switch (sev) {
                      case 'CRITICAL': return '#ef4444';
                      case 'SEVERE': return '#f97316';
                      case 'MODERATE': return '#eab308';
                      case 'MINOR': return '#3b82f6';
                      default: return '#6b7280';
                    }
                  };

                  return (
                    <button
                      key={severity}
                      onClick={() => toggleSeverityFilter(severity)}
                      className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: severityFilter.includes(severity) ? getSeverityBgColor(severity) : '#f3f4f6',
                        color: severityFilter.includes(severity) ? 'rgba(255, 255, 255, 0.7)' : '#374151',
                      }}
                    >
                      {severity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear All Button */}
            {(disasterTypeFilter.length > 0 || severityFilter.length > 0) && (
              <button
                onClick={() => {
                  onDisasterTypeFilterChange([]);
                  onSeverityFilterChange([]);
                }}
                className="w-full mt-4 py-2.5 px-4 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-300"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[800]">
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="px-4 py-2 bg-white/95 backdrop-blur-sm text-gray-700 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="text-sm font-medium">Legend</span>
        </button>

        {showLegend && (
          <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 p-3 max-w-xs">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Disaster Types</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueDisasterTypes.map((type) => (
                <div
                  key={type}
                  className="px-3 py-1.5 rounded-md text-sm font-medium capitalize"
                  style={{
                    backgroundColor: getDisasterTypeColor(type),
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Disaster Button */}
      <button
        className="absolute top-4 right-4 z-[800] w-10 h-10 bg-white text-gray-700 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation border border-gray-200"
        aria-label="Add new disaster point"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      {selectedDisaster && (
        <PinTooltip
          disaster={selectedDisaster}
          onClose={() => setSelectedDisaster(null)}
          onVolunteerContribution={onVolunteerContribution}
          onResourceContribution={onResourceContribution}
        />
      )}
    </div>
  );
}
