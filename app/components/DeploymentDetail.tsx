'use client';

import { useState } from 'react';
import { Disaster, ReliefGroup } from '../data/disasters';
import { ArrowLeft, Users, Package, Building2, ChevronRight, X, MapPin, Clock } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import OrganizationContributions from './OrganizationContributions';

interface DeploymentDetailProps {
  disaster: Disaster;
  onBack: () => void;
  onBackToMap?: () => void;
}

type ModalType = 'volunteers' | 'resources' | null;

const getResourceDescription = (resourceName: string): string => {
  const descriptions: { [key: string]: string } = {
    'Generators': 'Portable and industrial generators for emergency power. Must be diesel or gas-powered, in working condition.',
    'Emergency Lighting': 'Battery-powered emergency lights, flashlights, and portable lighting systems for affected areas.',
    'Communication Equipment': 'Radios, satellite phones, and emergency communication devices for coordination.',
    'Sandbags': 'Heavy-duty sandbags for flood control. Filled or unfilled bags accepted.',
    'Water Pumps': 'Submersible and portable water pumps for flood water removal. Must be in working condition.',
    'Medical Supplies': 'First aid kits, bandages, antiseptics, pain relievers, and emergency medical equipment.',
    'Shelter Supplies': 'Tents, blankets, sleeping bags, cots, and temporary shelter materials.',
    'First Aid Kits': 'Comprehensive first aid kits with bandages, medications, and emergency medical supplies.',
    'Food & Water': 'Non-perishable food items, bottled water, and ready-to-eat meals. Must be unexpired.',
    'Gas Detection Equipment': 'Handheld gas detectors and monitoring equipment for hazardous gas identification.',
    'Evacuation Transport': 'Buses, vans, or vehicles for emergency evacuation. Drivers must have valid licenses.',
    'Bottled Water': 'Sealed bottled water for emergency distribution. Must be unexpired and in cases.',
    'Repair Equipment': 'Tools and equipment for infrastructure repair including wrenches, pipe cutters, and welding equipment.',
    'Traffic Control': 'Cones, barriers, signs, and traffic control equipment for road management.'
  };
  return descriptions[resourceName] || 'Specific details about required specifications and quantities.';
};

export default function DeploymentDetail({ disaster, onBack, onBackToMap }: DeploymentDetailProps) {
  const [selectedOrg, setSelectedOrg] = useState<ReliefGroup | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  if (selectedOrg) {
    return (
      <OrganizationContributions
        organization={selectedOrg}
        disasterType={disaster.type}
        onBack={() => setSelectedOrg(null)}
        onBackToMap={onBackToMap}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[980] overflow-y-auto overscroll-contain max-w-[430px] mx-auto">
      <div className="min-h-full pb-24">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Map', onClick: onBackToMap },
            { label: disaster.type, onClick: onBack },
            { label: 'Deployment' }
          ]}
        />

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center px-5 py-4">
            <button
              onClick={onBack}
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
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
                  className="w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-all text-left group touch-manipulation"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-900 truncate">{group.name}</p>
                      <p className="text-sm text-gray-600 mt-0.5 truncate">{group.organization}</p>
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
                <button
                  onClick={() => setActiveModal('volunteers')}
                  className="w-full px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation"
                >
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
                <button
                  onClick={() => setActiveModal('resources')}
                  className="w-full px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors touch-manipulation"
                >
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

      {/* Volunteers Modal */}
      {activeModal === 'volunteers' && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex flex-col justify-end max-w-[430px] mx-auto" onClick={() => setActiveModal(null)}>
          <div
            className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-gray-900">Volunteer Details</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-20">
              {/* Medical Staff */}
              <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Medical Staff</h3>
                  <p className="text-sm text-gray-600 mb-2">15 positions available</p>
                  <p className="text-sm text-gray-700">Licensed physicians, nurses, and EMTs needed. Must have current medical certifications and emergency response experience.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Clock size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Shifts Available:</p>
                      <p className="text-sm text-gray-600">Morning (6AM-2PM), Afternoon (2PM-10PM), Night (10PM-6AM)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location:</p>
                      <p className="text-sm text-gray-600">{disaster.location} - Emergency Medical Center</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation">
                  Send
                </button>
              </div>

              {/* Search & Rescue */}
              <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Search & Rescue</h3>
                  <p className="text-sm text-gray-600 mb-2">25 positions available</p>
                  <p className="text-sm text-gray-700">Physical fitness required. Previous search and rescue training preferred. Must be able to work in challenging weather conditions and rough terrain.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Clock size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Shifts Available:</p>
                      <p className="text-sm text-gray-600">Day Shift (8AM-8PM), Night Shift (8PM-8AM)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location:</p>
                      <p className="text-sm text-gray-600">{disaster.location} - Disaster Zone Perimeter</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation">
                  Send
                </button>
              </div>

              {/* Logistics Support */}
              <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">Logistics Support</h3>
                  <p className="text-sm text-gray-600 mb-2">10 positions available</p>
                  <p className="text-sm text-gray-700">Warehouse and inventory management experience preferred. Responsible for organizing supply distribution and maintaining accurate records.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Clock size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Shifts Available:</p>
                      <p className="text-sm text-gray-600">Full Day (9AM-5PM), Evening (5PM-1AM)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location:</p>
                      <p className="text-sm text-gray-600">{disaster.location} - Supply Distribution Hub</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resources Modal */}
      {activeModal === 'resources' && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex flex-col justify-end max-w-[430px] mx-auto" onClick={() => setActiveModal(null)}>
          <div
            className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-gray-900">Resource Details</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-20">
              {disaster.resourcesNeeded.map((resource, index) => (
                <div key={index} className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{resource}</h3>
                    <p className="text-sm text-gray-600 mb-2">{Math.floor(Math.random() * 500) + 100} units needed</p>
                    <p className="text-sm text-gray-700">{getResourceDescription(resource)}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <MapPin size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Drop-off Points:</p>
                        <p className="text-sm text-gray-600 mb-1">{disaster.location} - Central Collection Center</p>
                        <p className="text-sm text-gray-600 mb-1">{disaster.location} - North Distribution Hub</p>
                        <p className="text-sm text-gray-600">{disaster.location} - South Relief Station</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Clock size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Collection Hours:</p>
                        <p className="text-sm text-gray-600">24/7 Emergency Collection</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation">
                    Mark as Sent
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
