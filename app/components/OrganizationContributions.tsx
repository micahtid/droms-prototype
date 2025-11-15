'use client';

import { ReliefGroup, ContributionStatus } from '../data/disasters';
import { ArrowLeft, Package, Users, DollarSign, Clock, CheckCircle, XCircle, Truck, Phone } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

interface OrganizationContributionsProps {
  organization: ReliefGroup;
  disasterType: string;
  onBack: () => void;
  onBackToMap?: () => void;
}

const getStatusColor = (status: ContributionStatus) => {
  switch (status) {
    case 'Arrived':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Sent':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Being Sent':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Processing':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Retracted':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: ContributionStatus) => {
  switch (status) {
    case 'Arrived':
      return <CheckCircle size={16} />;
    case 'Sent':
      return <Truck size={16} />;
    case 'Being Sent':
      return <Clock size={16} />;
    case 'Processing':
      return <Clock size={16} />;
    case 'Retracted':
      return <XCircle size={16} />;
    default:
      return null;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Volunteers':
      return <Users size={20} className="text-blue-600" />;
    case 'Resources':
      return <Package size={20} className="text-green-600" />;
    case 'Funding':
      return <DollarSign size={20} className="text-purple-600" />;
    default:
      return null;
  }
};

export default function OrganizationContributions({
  organization,
  disasterType,
  onBack,
  onBackToMap
}: OrganizationContributionsProps) {
  // Sort contributions by date (most recent first)
  const sortedContributions = [...organization.contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-[990] overflow-y-auto overscroll-contain max-w-[430px] mx-auto">
      <div className="min-h-full pb-24">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Map', onClick: onBackToMap },
            { label: disasterType, onClick: onBack },
            { label: organization.name }
          ]}
        />

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center px-5 py-4">
            <button
              onClick={onBack}
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 truncate">{organization.name}</h1>
              <p className="text-sm text-gray-600 truncate">{organization.organization}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contributions ({sortedContributions.length})
          </h2>

          {sortedContributions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No contributions yet
            </div>
          ) : (
            <div className="space-y-4">
              {sortedContributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="bg-white border border-gray-200 rounded-lg p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base mb-1">{contribution.type}</h3>
                      <p className="text-sm text-gray-600">{formatDate(contribution.date)}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-md border text-xs font-medium whitespace-nowrap ${getStatusColor(contribution.status)}`}>
                      {contribution.status}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">{contribution.details}</p>

                    {/* ETA for Resources being delivered */}
                    {contribution.type === 'Resources' && contribution.eta !== undefined && contribution.status === 'Being Sent' && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Estimated Arrival</p>
                        <p className="text-sm font-bold text-gray-900">{contribution.eta} hours</p>
                      </div>
                    )}

                    {/* Point of Contact for Volunteers */}
                    {contribution.type === 'Volunteers' && contribution.pointOfContact && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Point of Contact</p>
                        <p className="text-sm font-semibold text-gray-900">{contribution.pointOfContact}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
