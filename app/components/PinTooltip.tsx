'use client';

import { useState } from 'react';
import { Disaster } from '../data/disasters';
import { ChevronUp, X } from 'lucide-react';
import IssueDetail from './IssueDetail';

interface PinTooltipProps {
  disaster: Disaster;
  onClose: () => void;
}

export default function PinTooltip({ disaster, onClose }: PinTooltipProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isExpanded) {
    return <IssueDetail disaster={disaster} onBack={() => setIsExpanded(false)} />;
  }

  return (
    <div className="absolute bottom-20 left-0 right-0 z-[900] animate-slide-up">
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Handle bar */}
        <div className="flex justify-center pt-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{disaster.type}</h3>
              <p className="text-sm text-gray-600 mt-1">{disaster.shortDescription}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Expand button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            View Details
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
