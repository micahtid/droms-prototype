'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import BottomNav from './components/BottomNav';
import ListView from './components/ListView';
import LoginPage from './components/LoginPage';
import { disasters as initialDisasters, Disaster, Contribution } from './data/disasters';

// Dynamically import the map component to avoid SSR issues with leaflet
const DisasterMap = dynamic(() => import('./components/DisasterMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');
  const [disasters, setDisasters] = useState<Disaster[]>(initialDisasters);

  // Function to handle volunteer contributions
  const handleVolunteerContribution = (
    disasterId: string,
    volunteerType: string,
    quantity: number,
    maxPositions: number
  ) => {
    setDisasters(prevDisasters =>
      prevDisasters.map(disaster => {
        if (disaster.id !== disasterId) return disaster;

        // Decrease volunteers needed
        const newVolunteersNeeded = Math.max(0, disaster.volunteersNeeded - quantity);

        // Create contribution
        const newContribution: Contribution = {
          id: `contrib-${Date.now()}`,
          type: 'Volunteers',
          details: `${quantity} ${volunteerType}`,
          quantity: quantity,
          date: new Date().toISOString(),
          status: 'Processing',
          pointOfContact: '402-555-YOUR-ORG'
        };

        // Find or create "Your Organization" relief group
        let reliefGroups = [...disaster.reliefGroups];
        const yourOrgIndex = reliefGroups.findIndex(rg => rg.id === 'your-org');

        if (yourOrgIndex >= 0) {
          // Update existing organization
          reliefGroups[yourOrgIndex] = {
            ...reliefGroups[yourOrgIndex],
            contributions: [...reliefGroups[yourOrgIndex].contributions, newContribution]
          };
        } else {
          // Create new organization
          reliefGroups.push({
            id: 'your-org',
            name: 'Your Organization',
            organization: 'Local Relief',
            contributions: [newContribution]
          });
        }

        return {
          ...disaster,
          volunteersNeeded: newVolunteersNeeded,
          reliefGroups: reliefGroups
        };
      })
    );
  };

  // Function to handle resource contributions
  const handleResourceContribution = (
    disasterId: string,
    resourceIndex: number,
    resourceName: string,
    quantity: number,
    maxQuantity: number
  ) => {
    setDisasters(prevDisasters =>
      prevDisasters.map(disaster => {
        if (disaster.id !== disasterId) return disaster;

        // Update resources needed
        const newResourcesNeeded = [...disaster.resourcesNeeded];
        const currentResource = newResourcesNeeded[resourceIndex];
        const match = currentResource.match(/^(\d+)\s+(.+)$/);

        if (match) {
          const currentQty = parseInt(match[1]);
          const resourceDesc = match[2];
          const newQty = Math.max(0, currentQty - quantity);
          newResourcesNeeded[resourceIndex] = `${newQty} ${resourceDesc}`;
        }

        // Create contribution
        const newContribution: Contribution = {
          id: `contrib-${Date.now()}`,
          type: 'Resources',
          details: `${quantity} ${resourceName}`,
          quantity: quantity,
          date: new Date().toISOString(),
          status: 'Being Sent',
          eta: Math.floor(Math.random() * 8) + 2 // Random ETA between 2-10 hours
        };

        // Find or create "Your Organization" relief group
        let reliefGroups = [...disaster.reliefGroups];
        const yourOrgIndex = reliefGroups.findIndex(rg => rg.id === 'your-org');

        if (yourOrgIndex >= 0) {
          // Update existing organization
          reliefGroups[yourOrgIndex] = {
            ...reliefGroups[yourOrgIndex],
            contributions: [...reliefGroups[yourOrgIndex].contributions, newContribution]
          };
        } else {
          // Create new organization
          reliefGroups.push({
            id: 'your-org',
            name: 'Your Organization',
            organization: 'Local Relief',
            contributions: [newContribution]
          });
        }

        return {
          ...disaster,
          resourcesNeeded: newResourcesNeeded,
          reliefGroups: reliefGroups
        };
      })
    );
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // Show main app after login
  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="flex-1 relative z-0 overflow-hidden">
        {activeView === 'map' ? (
          <DisasterMap
            disasters={disasters}
            onVolunteerContribution={handleVolunteerContribution}
            onResourceContribution={handleResourceContribution}
          />
        ) : (
          <ListView
            disasters={disasters}
            onVolunteerContribution={handleVolunteerContribution}
            onResourceContribution={handleResourceContribution}
          />
        )}
      </div>
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
