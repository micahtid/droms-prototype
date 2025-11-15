'use client';

import { useState } from 'react';
import { Disaster, disasters } from '../data/disasters';
import { ChevronUp, X } from 'lucide-react';
import IssueDetail from './IssueDetail';
import DeploymentDetail from './DeploymentDetail';

interface PinTooltipProps {
  disaster: Disaster;
  onClose: () => void;
  onVolunteerContribution: (disasterId: string, volunteerType: string, quantity: number, maxPositions: number) => void;
  onResourceContribution: (disasterId: string, resourceIndex: number, resourceName: string, quantity: number, maxQuantity: number) => void;
}

type ViewState = 'preview' | 'details' | 'contribute';

export default function PinTooltip({ disaster, onClose, onVolunteerContribution, onResourceContribution }: PinTooltipProps) {
  const [viewState, setViewState] = useState<ViewState>('preview');

  // Find parent disaster if this is a sub-disaster
  const parentDisaster = disaster.parentId
    ? disasters.find(d => d.id === disaster.parentId)
    : null;

  if (viewState === 'details') {
    return (
      <IssueDetail
        disaster={disaster}
        onBack={() => setViewState('preview')}
        onBackToMap={onClose}
        onVolunteerContribution={onVolunteerContribution}
        onResourceContribution={onResourceContribution}
      />
    );
  }

  if (viewState === 'contribute') {
    return (
      <DeploymentDetail
        disaster={disaster}
        onBack={() => setViewState('preview')}
        onBackToMap={onClose}
        onVolunteerContribution={onVolunteerContribution}
        onResourceContribution={onResourceContribution}
      />
    );
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[900] animate-slide-up pointer-events-none max-w-[430px] mx-auto">
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-xl border border-gray-200 pointer-events-auto relative">
        {/* X button - top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Handle bar */}
        <div className="flex justify-center pt-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-5 pt-4">
          {/* Parent Disaster Context */}
          {parentDisaster && (
            <div className="mb-3 inline-block">
              <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <p className="text-xs text-amber-800">
                  Part of larger {parentDisaster.type.replace(/^Severe\s+|^Major\s+/, '')}
                </p>
              </div>
            </div>
          )}

          <div className="mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{disaster.type}</h3>
            <p className="text-sm text-gray-600 mt-1">{disaster.shortDescription}</p>
          </div>

          {/* Buttons */}
          <div className="space-y-2 mt-4">
            <button
              onClick={() => setViewState('details')}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 touch-manipulation"
            >
              View Details
              <ChevronUp size={18} />
            </button>
            <button
              onClick={() => setViewState('contribute')}
              className="w-full py-3 bg-white text-gray-900 border-2 border-gray-300 font-medium rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2 touch-manipulation"
            >
              Contribute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
