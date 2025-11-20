'use client';

import { useState } from 'react';
import { Disaster } from '../data/disasters';
import { MapPin, Users, AlertTriangle, ChevronRight, Search, Filter, X } from 'lucide-react';
import IssueDetail from './IssueDetail';

interface ListViewProps {
  disasters: Disaster[];
  onVolunteerContribution: (disasterId: string, volunteerType: string, quantity: number, maxPositions: number) => void;
  onResourceContribution: (disasterId: string, resourceIndex: number, resourceName: string, quantity: number, maxQuantity: number) => void;
  disasterTypeFilter: string[];
  onDisasterTypeFilterChange: (types: string[]) => void;
  severityFilter: string[];
  onSeverityFilterChange: (severities: string[]) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'SEVERE':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'MODERATE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'MINOR':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

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

export default function ListView({ disasters, onVolunteerContribution, onResourceContribution, disasterTypeFilter, onDisasterTypeFilterChange, severityFilter, onSeverityFilterChange }: ListViewProps) {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Get unique disaster types and severities for filter
  const uniqueDisasterTypes = Array.from(new Set(disasters.map(d => getDisasterTypeCategory(d.type))));
  const uniqueSeverities = Array.from(new Set(disasters.map(d => d.severity)));

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

  // Filter and search disasters
  let filteredDisasters = disasters;

  // Apply type filter
  if (disasterTypeFilter.length > 0) {
    filteredDisasters = filteredDisasters.filter(d => disasterTypeFilter.includes(getDisasterTypeCategory(d.type)));
  }

  // Apply severity filter
  if (severityFilter.length > 0) {
    filteredDisasters = filteredDisasters.filter(d => severityFilter.includes(d.severity));
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredDisasters = filteredDisasters.filter(d =>
      d.type.toLowerCase().includes(query) ||
      d.location.toLowerCase().includes(query) ||
      d.shortDescription.toLowerCase().includes(query)
    );
  }

  // Group disasters by parent
  const parentDisasters = filteredDisasters.filter(d => d.isParent);
  const standaloneDisasters = filteredDisasters.filter(d => !d.isParent && !d.parentId);

  const getChildDisasters = (parentId: string) => {
    return filteredDisasters.filter(d => d.parentId === parentId);
  };

  const toggleParent = (parentId: string) => {
    const newExpanded = new Set(expandedParents);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
    }
    setExpandedParents(newExpanded);
  };

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-gray-50" onClick={() => setShowFilterMenu(false)}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-5 py-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Active Disasters</h1>
        <p className="text-sm text-gray-600 mt-1">
          {parentDisasters.length + standaloneDisasters.length} total incidents
        </p>

        {/* Search and Filter Bar */}
        <div className="mt-4 flex gap-2">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search disasters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilterMenu(!showFilterMenu);
            }}
            className="px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            {(disasterTypeFilter.length > 0 || severityFilter.length > 0) && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                {disasterTypeFilter.length + severityFilter.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Menu */}
      {showFilterMenu && (
        <div
          className="absolute top-36 right-5 z-20 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilterMenu(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
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

      {/* List Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-24">
        <div className="space-y-3">
          {/* Complex/Parent Disasters */}
          {parentDisasters.map((parent) => {
            const children = getChildDisasters(parent.id);
            const isExpanded = expandedParents.has(parent.id);

            return (
              <div key={parent.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Parent Header */}
                <button
                  onClick={() => toggleParent(parent.id)}
                  className="w-full p-4 text-left hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h2 className="text-lg font-bold text-gray-900">{parent.type}</h2>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${getSeverityColor(parent.severity)}`}>
                          <AlertTriangle size={12} />
                          {parent.severity}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{parent.shortDescription}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {children.length} locations
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {parent.estimatedImpact.toLocaleString()} affected
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className={`text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </button>

                {/* Child Disasters */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setSelectedDisaster(child)}
                        className="w-full p-4 text-left border-b border-gray-200 last:border-b-0 hover:bg-white active:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{child.type}</h3>
                              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${getSeverityColor(child.severity)}`}>
                                {child.severity}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{child.shortDescription}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {child.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={12} />
                                {child.estimatedImpact.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Standalone Disasters */}
          {standaloneDisasters.map((disaster) => (
            <button
              key={disaster.id}
              onClick={() => setSelectedDisaster(disaster)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-900">{disaster.type}</h2>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${getSeverityColor(disaster.severity)}`}>
                      <AlertTriangle size={12} />
                      {disaster.severity}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{disaster.shortDescription}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {disaster.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {disaster.estimatedImpact.toLocaleString()} affected
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedDisaster && (
        <IssueDetail
          disaster={selectedDisaster}
          onBack={() => setSelectedDisaster(null)}
          onVolunteerContribution={onVolunteerContribution}
          onResourceContribution={onResourceContribution}
        />
      )}
    </div>
  );
}
