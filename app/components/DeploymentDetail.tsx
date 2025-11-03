'use client';

import { Disaster } from '../data/disasters';
import { ArrowLeft, Users, Package, Building2 } from 'lucide-react';

interface DeploymentDetailProps {
  disaster: Disaster;
  onBack: () => void;
}

export default function DeploymentDetail({ disaster, onBack }: DeploymentDetailProps) {
  return (
    <div className="absolute inset-0 bg-white z-[980] overflow-y-auto pb-20">
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
            Groups Working
          </h3>
          <div className="space-y-3">
            {disaster.reliefGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <p className="font-semibold text-gray-900">{group.name}</p>
                <p className="text-sm text-gray-600 mt-1">{group.organization}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Incentives */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Action Incentives
          </h3>

          {/* Volunteers Needed */}
          <div className="mb-4 p-5 bg-blue-50 rounded-xl border border-blue-200 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Users size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Volunteers Needed</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-3">{disaster.volunteersNeeded}</p>
            <p className="text-sm text-gray-600 mb-4">
              Your organization can contribute volunteers to help with relief efforts.
            </p>
            <button className="w-full mt-auto px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Join
            </button>
          </div>

          {/* Resources Needed */}
          <div className="p-5 bg-green-50 rounded-xl border border-green-200 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Package size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Resources Needed</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {disaster.resourcesNeeded.map((resource, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0" />
                  {resource}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mb-4">
              Your organization can contribute resources to support the relief operation.
            </p>
            <button className="w-full mt-auto px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
              View
            </button>
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
