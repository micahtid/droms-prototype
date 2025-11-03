'use client';

import { useState } from 'react';
import { Disaster } from '../data/disasters';
import { ArrowLeft, MapPin, Users, AlertTriangle } from 'lucide-react';
import DeploymentDetail from './DeploymentDetail';

interface IssueDetailProps {
  disaster: Disaster;
  onBack: () => void;
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

export default function IssueDetail({ disaster, onBack }: IssueDetailProps) {
  const [showDeployment, setShowDeployment] = useState(false);

  if (showDeployment) {
    return <DeploymentDetail disaster={disaster} onBack={() => setShowDeployment(false)} />;
  }

  return (
    <div className="absolute inset-0 bg-white z-[950] overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center px-5 py-4">
          <button
            onClick={onBack}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Issue Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        {/* Title & Severity */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{disaster.type}</h2>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm ${getSeverityColor(disaster.severity)}`}>
            <AlertTriangle size={16} />
            Severity: {disaster.severity}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <MapPin size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Location</p>
              <p className="text-base text-gray-900 mt-1">{disaster.location}</p>
            </div>
          </div>
        </div>

        {/* Estimated Impact */}
        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <Users size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Estimated Impact</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {disaster.estimatedImpact.toLocaleString()} people
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description</h3>
          <p className="text-base text-gray-700 leading-relaxed">{disaster.shortDescription}</p>
        </div>

        {/* View Deployment Button */}
        <button
          onClick={() => setShowDeployment(true)}
          className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-base"
        >
          View Deployment
        </button>
      </div>
    </div>
  );
}
