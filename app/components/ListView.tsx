'use client';

import { useState } from 'react';
import { Disaster } from '../data/disasters';
import { MapPin, Users, AlertTriangle, ChevronRight } from 'lucide-react';
import IssueDetail from './IssueDetail';

interface ListViewProps {
  disasters: Disaster[];
  onVolunteerContribution: (disasterId: string, volunteerType: string, quantity: number, maxPositions: number) => void;
  onResourceContribution: (disasterId: string, resourceIndex: number, resourceName: string, quantity: number, maxQuantity: number) => void;
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

export default function ListView({ disasters, onVolunteerContribution, onResourceContribution }: ListViewProps) {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  // Group disasters by parent
  const parentDisasters = disasters.filter(d => d.isParent);
  const standaloneDisasters = disasters.filter(d => !d.isParent && !d.parentId);

  const getChildDisasters = (parentId: string) => {
    return disasters.filter(d => d.parentId === parentId);
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
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-5 py-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Active Disasters</h1>
        <p className="text-sm text-gray-600 mt-1">
          {parentDisasters.length + standaloneDisasters.length} total incidents
        </p>
      </div>

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
                      <div className="flex items-center gap-2 mb-2">
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
                            <div className="flex items-center gap-2 mb-1">
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
                  <div className="flex items-center gap-2 mb-2">
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
