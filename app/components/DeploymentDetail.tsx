'use client';

import { useState } from 'react';
import { Disaster, ReliefGroup } from '../data/disasters';
import { ArrowLeft, Users, Package, Building2, ChevronRight } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import OrganizationContributions from './OrganizationContributions';

interface DeploymentDetailProps {
  disaster: Disaster;
  onBack: () => void;
}

export default function DeploymentDetail({ disaster, onBack }: DeploymentDetailProps) {
  const [selectedOrg, setSelectedOrg] = useState<ReliefGroup | null>(null);

  if (selectedOrg) {
    return (
      <OrganizationContributions
        organization={selectedOrg}
        disasterType={disaster.type}
        onBack={() => setSelectedOrg(null)}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-white z-[980] overflow-y-auto pb-20">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Map', onClick: () => {} },
          { label: disaster.type, onClick: onBack },
          { label: 'Deployment' }
        ]}
      />

      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center px-5 py-4">
          <button
            onClick={onBack}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Deployment</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        {/* Relief Groups Working */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
            <Building2 size={16} />
            Groups Working ({disaster.reliefGroups.length})
          </h3>
          <div className="space-y-2">
            {disaster.reliefGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedOrg(group)}
                className="w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-900">{group.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{group.organization}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {group.contributions.length} contribution{group.contributions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Needs */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Current Needs
          </h3>

          <div className="space-y-4">
            {/* Volunteers Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Volunteers</h4>
                <p className="text-sm text-gray-600">{disaster.volunteersNeeded} needed</p>
              </div>
              <button className="w-full px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Contribute
              </button>
            </div>

            {/* Resources Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
                <ul className="space-y-2">
                  {disaster.resourcesNeeded.map((resource, index) => (
                    <li key={index} className="text-sm text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-0">
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Contribute
              </button>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Contribution features will be available soon. Click the buttons above to register your interest.
          </p>
        </div>
      </div>
    </div>
  );
}
