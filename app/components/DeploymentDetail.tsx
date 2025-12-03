'use client';

import { useState } from 'react';
import { Disaster, ReliefGroup, Volunteer, ourOrganization } from '../data/disasters';
import { ArrowLeft, Users, Package, Building2, ChevronRight, X, MapPin, Clock, CheckCircle, Truck, Phone, ChevronDown } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import OrganizationContributions from './OrganizationContributions';

interface DeploymentDetailProps {
  disaster: Disaster;
  onBack: () => void;
  onBackToMap?: () => void;
  onVolunteerContribution: (disasterId: string, volunteerType: string, quantity: number, maxPositions: number) => void;
  onResourceContribution: (disasterId: string, resourceIndex: number, resourceName: string, quantity: number, maxQuantity: number) => void;
}

type ModalType = 'volunteers' | 'resources' | 'track-volunteers' | 'track-resources' | 'select-volunteers' | 'select-resources' | null;
type VolunteerCategory = 'Medical Staff' | 'Search & Rescue' | 'Logistics Support' | null;

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
  return descriptions[resourceName] || '';
};

export default function DeploymentDetail({ disaster, onBack, onBackToMap, onVolunteerContribution, onResourceContribution }: DeploymentDetailProps) {
  const [selectedOrg, setSelectedOrg] = useState<ReliefGroup | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [volunteerQuantities, setVolunteerQuantities] = useState<{ [key: string]: number }>({});
  const [resourceQuantities, setResourceQuantities] = useState<{ [key: string]: number }>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['needs']));
  const [selectedVolunteerCategory, setSelectedVolunteerCategory] = useState<VolunteerCategory>(null);
  const [selectedResourceName, setSelectedResourceName] = useState<string | null>(null);
  const [selectedResourceIndex, setSelectedResourceIndex] = useState<number | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Open volunteer selection modal for a specific category
  const openVolunteerSelection = (category: VolunteerCategory) => {
    setSelectedVolunteerCategory(category);
    setActiveModal('select-volunteers');
  };

  // Open resource selection modal for a specific resource
  const openResourceSelection = (resourceName: string, resourceIndex: number) => {
    setSelectedResourceName(resourceName);
    setSelectedResourceIndex(resourceIndex);
    setActiveModal('select-resources');
  };

  // Get filtered volunteers by category
  const getFilteredVolunteers = (category: VolunteerCategory): Volunteer[] => {
    if (!category || !ourOrganization.volunteers) return [];
    return ourOrganization.volunteers.filter(volunteer =>
      volunteer.tags.includes(category)
    );
  };

  // Handlers for sending contributions
  const handleSendVolunteers = (volunteerType: string, maxPositions: number, key: string) => {
    const quantity = volunteerQuantities[key];
    if (quantity && quantity > 0) {
      onVolunteerContribution(disaster.id, volunteerType, quantity, maxPositions);
      // Reset quantity input
      setVolunteerQuantities({ ...volunteerQuantities, [key]: 0 });
    }
  };

  const handleSendResource = (resourceIndex: number, resourceName: string, maxQuantity: number, key: string) => {
    const quantity = resourceQuantities[key];
    if (quantity && quantity > 0) {
      onResourceContribution(disaster.id, resourceIndex, resourceName, quantity, maxQuantity);
      // Reset quantity input
      setResourceQuantities({ ...resourceQuantities, [key]: 0 });
    }
  };

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
          {/* Last Updated */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(disaster.lastUpdated).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Relief Groups Working - Collapsible */}
          <div className="mb-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('groups')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <Building2 size={18} />
                Groups Working ({disaster.reliefGroups.length})
              </h3>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${expandedSections.has('groups') ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedSections.has('groups') && (
              <div className="space-y-2 p-4 bg-white border-t border-gray-200">
                {disaster.reliefGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedOrg(group)}
                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-all text-left group touch-manipulation"
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
            )}
          </div>

          {/* Needs - Collapsible */}
          <div className="mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('needs')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <Package size={18} />
                Current Needs
              </h3>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${expandedSections.has('needs') ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedSections.has('needs') && (

            <div className="space-y-4 p-4 bg-white border-t border-gray-200">
              {/* Volunteers Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Volunteers</h4>
                  <p className="text-sm text-gray-600">{disaster.volunteersNeeded} needed</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveModal('volunteers')}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
                  >
                    Contribute
                  </button>
                  <button
                    onClick={() => setActiveModal('track-volunteers')}
                    className="w-full py-3 bg-white text-gray-900 border-2 border-gray-300 font-medium rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                  >
                    Track
                  </button>
                </div>
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
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveModal('resources')}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
                  >
                    Contribute
                  </button>
                  <button
                    onClick={() => setActiveModal('track-resources')}
                    className="w-full py-3 bg-white text-gray-900 border-2 border-gray-300 font-medium rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                  >
                    Track
                  </button>
                </div>
              </div>
            </div>
            )}
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
                  <div className="flex gap-2">
                    <Phone size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Point of Contact:</p>
                      <p className="text-sm text-gray-600">402-555-0301</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openVolunteerSelection('Medical Staff')}
                  className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
                >
                  Send Volunteers
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
                  <div className="flex gap-2">
                    <Phone size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Point of Contact:</p>
                      <p className="text-sm text-gray-600">402-555-0302</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openVolunteerSelection('Search & Rescue')}
                  className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
                >
                  Send Volunteers
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
                  <div className="flex gap-2">
                    <Phone size={16} className="text-gray-500 mt-[2px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Point of Contact:</p>
                      <p className="text-sm text-gray-600">402-555-0303</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openVolunteerSelection('Logistics Support')}
                  className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
                >
                  Send Volunteers
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
              {disaster.resourcesNeeded.map((resource, index) => {
                // Parse quantity from resource string (e.g., "120 Heavy-duty tents" -> 120)
                const match = resource.match(/^(\d+)\s+(.+)$/);
                const maxQuantity = match ? parseInt(match[1]) : 100;
                const resourceName = match ? match[2] : resource;

                return (
                  <div key={index} className="mb-6 p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1">{resourceName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{maxQuantity} units needed</p>
                      <p className="text-sm text-gray-700">{getResourceDescription(resourceName)}</p>
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
                    <button
                      onClick={() => openResourceSelection(resourceName, index)}
                      className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
                    >
                      Send Resources
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Track Volunteers Modal */}
      {activeModal === 'track-volunteers' && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex flex-col justify-end max-w-[430px] mx-auto" onClick={() => setActiveModal(null)}>
          <div
            className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-gray-900">Track Volunteers</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-20">
              {disaster.reliefGroups.flatMap(group =>
                group.contributions
                  .filter(c => c.type === 'Volunteers')
                  .map(contribution => (
                    <div key={contribution.id} className="mb-4 p-4 bg-white border border-gray-200 rounded-xl">
                      <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{group.organization}</h3>
                            <p className="text-sm text-gray-600">{group.name}</p>
                          </div>
                          <div className={`px-3 py-1.5 rounded-md border text-xs font-medium whitespace-nowrap ${
                            contribution.status === 'Arrived'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : contribution.status === 'Sent'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : contribution.status === 'Being Sent'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : contribution.status === 'Processing'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {contribution.status}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{contribution.details}</p>
                      </div>
                      {contribution.pointOfContact && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Point of Contact</p>
                          <p className="text-sm font-semibold text-gray-900">{contribution.pointOfContact}</p>
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          {new Date(contribution.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
              )}
              {disaster.reliefGroups.flatMap(g => g.contributions).filter(c => c.type === 'Volunteers').length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No volunteer contributions yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Track Resources Modal */}
      {activeModal === 'track-resources' && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex flex-col justify-end max-w-[430px] mx-auto" onClick={() => setActiveModal(null)}>
          <div
            className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-gray-900">Track Resources</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-20">
              {disaster.reliefGroups.flatMap(group =>
                group.contributions
                  .filter(c => c.type === 'Resources')
                  .map(contribution => (
                    <div key={contribution.id} className="mb-4 p-4 bg-white border border-gray-200 rounded-xl">
                      <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{group.organization}</h3>
                            <p className="text-sm text-gray-600">{group.name}</p>
                          </div>
                          <div className={`px-3 py-1.5 rounded-md border text-xs font-medium whitespace-nowrap ${
                            contribution.status === 'Arrived'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : contribution.status === 'Sent'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : contribution.status === 'Being Sent'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : contribution.status === 'Processing'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {contribution.status}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{contribution.details}</p>
                      </div>
                      {contribution.eta !== undefined && contribution.status === 'Being Sent' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Estimated Arrival</p>
                          <p className="text-sm font-semibold text-gray-900">{contribution.eta} hours</p>
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          {new Date(contribution.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
              )}
              {disaster.reliefGroups.flatMap(g => g.contributions).filter(c => c.type === 'Resources').length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No resource contributions yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Select Volunteers Modal */}
      {activeModal === 'select-volunteers' && selectedVolunteerCategory && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex flex-col justify-end max-w-[430px] mx-auto" onClick={() => setActiveModal(null)}>
          <div
            className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-gray-900">Select {selectedVolunteerCategory}</h2>
              <button
                onClick={() => setActiveModal('volunteers')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-20">
              {getFilteredVolunteers(selectedVolunteerCategory).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No volunteers available with this qualification
                </div>
              ) : (
                <>
                  {getFilteredVolunteers(selectedVolunteerCategory).map(volunteer => (
                    <div
                      key={volunteer.id}
                      className={`mb-4 p-4 rounded-xl border ${
                        volunteer.isDeployed
                          ? 'bg-gray-50 border-gray-300 opacity-60'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900">{volunteer.name}</h3>
                      </div>

                      {/* Tags */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Qualifications</p>
                        <div className="flex flex-wrap gap-1">
                          {volunteer.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md border border-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      {volunteer.certifications && volunteer.certifications.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Certifications</p>
                          <div className="flex flex-wrap gap-1">
                            {volunteer.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md border border-green-200"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {volunteer.phone && (
                        <div className="mb-3 flex items-center gap-2">
                          <Phone size={14} className="text-gray-500" />
                          <p className="text-sm text-gray-700">{volunteer.phone}</p>
                        </div>
                      )}

                      {/* Deploy Button */}
                      <button
                        disabled={volunteer.isDeployed}
                        onClick={() => {
                          // Here you would handle the deployment logic
                          alert(`Deploying ${volunteer.name} to ${disaster.type}`);
                          setActiveModal('volunteers');
                        }}
                        className={`w-full py-2.5 font-medium rounded-lg transition-colors touch-manipulation ${
                          volunteer.isDeployed
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                        }`}
                      >
                        {volunteer.isDeployed ? 'Deployed' : 'Deploy'}
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Select Resources Modal */}
      {activeModal === 'select-resources' && selectedResourceName && selectedResourceIndex !== null && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex flex-col justify-end max-w-[430px] mx-auto" onClick={() => setActiveModal(null)}>
          <div
            className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-gray-900">Send {selectedResourceName}</h2>
              <button
                onClick={() => setActiveModal('resources')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-20">
              {ourOrganization.resourceInventory?.filter(res =>
                res.name.toLowerCase().includes(selectedResourceName.toLowerCase())
              ).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No matching resources in inventory
                </div>
              ) : (
                <>
                  {ourOrganization.resourceInventory
                    ?.filter(res => res.name.toLowerCase().includes(selectedResourceName.toLowerCase()))
                    .map(resource => (
                      <div key={resource.id} className="mb-4 p-4 bg-white border border-gray-200 rounded-xl">
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 mb-1">{resource.name}</h3>
                          <p className="text-sm text-gray-600">Available: {resource.quantity} {resource.unit}</p>
                          <p className="text-xs text-gray-500 mt-1">Category: {resource.category}</p>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Send</label>
                          <input
                            type="number"
                            min="1"
                            max={resource.quantity}
                            placeholder={`Enter quantity (max ${resource.quantity})`}
                            value={resourceQuantities[resource.id] || ''}
                            onChange={(e) => setResourceQuantities({ ...resourceQuantities, [resource.id]: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
                          />
                        </div>

                        <button
                          disabled={!resourceQuantities[resource.id] || resourceQuantities[resource.id] <= 0 || resourceQuantities[resource.id] > resource.quantity}
                          onClick={() => {
                            const quantity = resourceQuantities[resource.id];
                            if (quantity && quantity > 0) {
                              // Parse the needed resource to get max quantity
                              const neededResource = disaster.resourcesNeeded[selectedResourceIndex];
                              const match = neededResource.match(/^(\d+)\s+(.+)$/);
                              const maxQuantity = match ? parseInt(match[1]) : 100;

                              onResourceContribution(disaster.id, selectedResourceIndex, selectedResourceName, quantity, maxQuantity);
                              setResourceQuantities({ ...resourceQuantities, [resource.id]: 0 });
                              setActiveModal('resources');
                            }
                          }}
                          className="w-full mt-3 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Send {resourceQuantities[resource.id] > 0 ? `(${resourceQuantities[resource.id]} ${resource.unit})` : ''}
                        </button>
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
