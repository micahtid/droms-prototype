'use client';

import { useState } from 'react';
import { Disaster, disasters } from '../data/disasters';
import { ArrowLeft, MapPin, Users, AlertTriangle, ChevronDown, Clock, Copy, Check } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import DeploymentDetail from './DeploymentDetail';

interface IssueDetailProps {
  disaster: Disaster;
  onBack: () => void;
  onBackToMap?: () => void;
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

// Get city and state from coordinates
const getCityState = (coordinates: [number, number]): string => {
  const [lat, lng] = coordinates;
  // Lincoln, NE area (around 40.8, -96.7)
  if (lat >= 40.7 && lat <= 40.9 && lng >= -96.8 && lng <= -96.6) {
    return 'Lincoln, NE';
  }
  // Omaha, NE area (around 41.25, -95.93)
  if (lat >= 41.2 && lat <= 41.3 && lng >= -96.0 && lng <= -95.8) {
    return 'Omaha, NE';
  }
  // Beatrice, NE area (around 40.58, -96.73)
  if (lat >= 40.5 && lat <= 40.6 && lng >= -96.8 && lng <= -96.6) {
    return 'Beatrice, NE';
  }
  return 'Nebraska';
};

export default function IssueDetail({ disaster, onBack, onBackToMap, onVolunteerContribution, onResourceContribution }: IssueDetailProps) {
  const [showDeployment, setShowDeployment] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['impact']));
  const [copied, setCopied] = useState(false);

  // Find parent disaster if this is a sub-disaster
  const parentDisaster = disaster.parentId
    ? disasters.find(d => d.id === disaster.parentId)
    : null;

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

  const generateShareableInfo = () => {
    // Generate shareable disaster information
    const info = `
DISASTER INFORMATION

Type: ${disaster.type}
Location: ${disaster.location}
Severity: ${disaster.severity}
People Affected: ${disaster.estimatedImpact.toLocaleString()}

Description: ${disaster.shortDescription}

Volunteers Needed: ${disaster.volunteersNeeded}
Resources Needed:
${disaster.resourcesNeeded.map(r => `- ${r}`).join('\n')}

Last Updated: ${new Date(disaster.lastUpdated).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

View more details: ${typeof window !== 'undefined' ? window.location.origin : ''}/share/${disaster.id}
    `.trim();
    return info;
  };

  const copyToClipboard = async () => {
    const info = generateShareableInfo();
    try {
      await navigator.clipboard.writeText(info);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (showDeployment) {
    return (
      <DeploymentDetail
        disaster={disaster}
        onBack={() => setShowDeployment(false)}
        onBackToMap={onBackToMap || onBack}
        onVolunteerContribution={onVolunteerContribution}
        onResourceContribution={onResourceContribution}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[950] overflow-y-auto overscroll-contain max-w-[430px] mx-auto">
      <div className="min-h-full pb-24">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Map', onClick: onBackToMap || onBack },
            { label: disaster.type }
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
            <h1 className="text-xl font-semibold text-gray-900">Issue Details</h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          {/* Title */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{disaster.type}</h2>
          </div>

          {/* Parent Disaster Context */}
          {parentDisaster && (
            <div className="mb-4 inline-block">
              <div
                className="px-3 py-1.5 rounded-md text-sm font-semibold backdrop-blur-sm border"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                }}
              >
                Part of {parentDisaster.type}
              </div>
            </div>
          )}

          {/* Key Info Cards */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {/* Severity */}
            <div className={`p-3 rounded-lg border ${getSeverityColor(disaster.severity)}`}>
              <p className="text-xs font-medium uppercase tracking-wide mb-1">Severity</p>
              <p className="text-lg font-bold">{disaster.severity}</p>
            </div>

            {/* Last Updated */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(disaster.lastUpdated).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <MapPin size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-base text-gray-900 mt-1">{getCityState(disaster.coordinates)}</p>
                <p className="text-sm text-gray-600 mt-0.5">{disaster.location}</p>
              </div>
            </div>
          </div>

          {/* Estimated Impact - Collapsible */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('impact')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <Users size={18} />
                Estimated Impact
              </h3>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${expandedSections.has('impact') ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedSections.has('impact') && (
              <div className="space-y-3 mt-3">
                {/* People Affected */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Users size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">People Affected</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {disaster.estimatedImpact.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Impact Breakdown */}
                {disaster.impactBreakdown && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="space-y-4">
                    {/* Structural Damage */}
                    {disaster.impactBreakdown.structuralDamage && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Structural Damage</p>
                        <table className="w-full border-collapse">
                          <tbody>
                            {disaster.impactBreakdown.structuralDamage.homesDestroyed !== undefined && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pr-4 text-sm text-gray-600">Homes Destroyed</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.structuralDamage.homesDestroyed}</td>
                              </tr>
                            )}
                            {disaster.impactBreakdown.structuralDamage.homesPartiallyDamaged !== undefined && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pr-4 text-sm text-gray-600">Homes Damaged</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.structuralDamage.homesPartiallyDamaged}</td>
                              </tr>
                            )}
                            {disaster.impactBreakdown.structuralDamage.businessesAffected !== undefined && (
                              <tr>
                                <td className="py-2 pr-4 text-sm text-gray-600">Businesses Affected</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.structuralDamage.businessesAffected}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Casualties */}
                    {disaster.impactBreakdown.casualties && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Casualties</p>
                        <table className="w-full border-collapse">
                          <tbody>
                            {disaster.impactBreakdown.casualties.injuries !== undefined && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pr-4 text-sm text-gray-600">Injuries</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.casualties.injuries}</td>
                              </tr>
                            )}
                            {disaster.impactBreakdown.casualties.fatalities !== undefined && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pr-4 text-sm text-gray-600">Fatalities</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.casualties.fatalities}</td>
                              </tr>
                            )}
                            {disaster.impactBreakdown.casualties.missing !== undefined && (
                              <tr>
                                <td className="py-2 pr-4 text-sm text-gray-600">Missing</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.casualties.missing}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Utilities */}
                    {disaster.impactBreakdown.utilities && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Utilities Disrupted</p>
                        <div className="space-y-2">
                          {disaster.impactBreakdown.utilities.powerOutages !== undefined && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Power Outages</span>
                              <span className="text-sm font-bold text-gray-900">{disaster.impactBreakdown.utilities.powerOutages.toLocaleString()}</span>
                            </div>
                          )}
                          {disaster.impactBreakdown.utilities.waterServiceDisrupted !== undefined && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Water Service Disrupted</span>
                              <span className="text-sm font-bold text-gray-900">{disaster.impactBreakdown.utilities.waterServiceDisrupted.toLocaleString()}</span>
                            </div>
                          )}
                          {disaster.impactBreakdown.utilities.gasLeaksReported !== undefined && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Gas Leaks Reported</span>
                              <span className="text-sm font-bold text-gray-900">{disaster.impactBreakdown.utilities.gasLeaksReported}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Economic Impact */}
                    {disaster.impactBreakdown.economicImpact && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Economic Impact</p>
                        <div className="space-y-2">
                          {disaster.impactBreakdown.economicImpact.estimatedPropertyLoss && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Property Loss</span>
                              <span className="text-sm font-bold text-red-600">{disaster.impactBreakdown.economicImpact.estimatedPropertyLoss}</span>
                            </div>
                          )}
                          {disaster.impactBreakdown.economicImpact.businessInterruption && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Business Interruption</span>
                              <span className="text-sm font-bold text-orange-600">{disaster.impactBreakdown.economicImpact.businessInterruption}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Immediate Needs */}
                    {disaster.impactBreakdown.immediateNeeds && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Immediate Needs</p>
                        <table className="w-full border-collapse">
                          <tbody>
                            {disaster.impactBreakdown.immediateNeeds.evacuation !== undefined && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pr-4 text-sm text-gray-600">Evacuation</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.immediateNeeds.evacuation}</td>
                              </tr>
                            )}
                            {disaster.impactBreakdown.immediateNeeds.emergencyShelter !== undefined && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pr-4 text-sm text-gray-600">Emergency Shelter</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.immediateNeeds.emergencyShelter}</td>
                              </tr>
                            )}
                            {disaster.impactBreakdown.immediateNeeds.medicalAttention !== undefined && (
                              <tr>
                                <td className="py-2 pr-4 text-sm text-gray-600">Medical Attention</td>
                                <td className="py-2 text-sm font-bold text-gray-900 text-right">{disaster.impactBreakdown.immediateNeeds.medicalAttention}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description</h3>
            <p className="text-base text-gray-700 leading-relaxed">{disaster.shortDescription}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowDeployment(true)}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-base touch-manipulation"
            >
              View Deployment
            </button>
            <button
              onClick={copyToClipboard}
              className="w-full py-4 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-base touch-manipulation flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={20} />
                  <span>Share Disaster Info</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
