export type DisasterSeverity = 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

export interface ReliefGroup {
  id: string;
  name: string;
  organization: string;
}

export interface Disaster {
  id: string;
  type: string;
  shortDescription: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  estimatedImpact: number; // number of people affected
  severity: DisasterSeverity;
  volunteersNeeded: number;
  resourcesNeeded: string[];
  reliefGroups: ReliefGroup[];
}

export const disasters: Disaster[] = [
  {
    id: '1',
    type: 'Power Outage',
    shortDescription: 'Major power outage affecting downtown',
    location: '114.6N, 28.4W',
    coordinates: [40.8136, -96.7026], // Downtown Lincoln
    estimatedImpact: 24630,
    severity: 'SEVERE',
    volunteersNeeded: 4,
    resourcesNeeded: ['Generators', 'Emergency Lighting', 'Communication Equipment'],
    reliefGroups: [
      {
        id: 'rg1',
        name: 'St. Paul\'s Church',
        organization: 'Voice Relief'
      },
      {
        id: 'rg2',
        name: 'Lincoln Emergency Response',
        organization: 'City Services'
      }
    ]
  },
  {
    id: '2',
    type: 'Flooding',
    shortDescription: 'Flash flooding near Salt Creek',
    location: '115.2N, 29.1W',
    coordinates: [40.8258, -96.6852],
    estimatedImpact: 8200,
    severity: 'MODERATE',
    volunteersNeeded: 8,
    resourcesNeeded: ['Sandbags', 'Water Pumps', 'Medical Supplies'],
    reliefGroups: [
      {
        id: 'rg3',
        name: 'Red Cross Lincoln',
        organization: 'American Red Cross'
      }
    ]
  },
  {
    id: '3',
    type: 'Tornado Warning',
    shortDescription: 'Active tornado warning in effect',
    location: '113.8N, 27.9W',
    coordinates: [40.7895, -96.7158],
    estimatedImpact: 15400,
    severity: 'CRITICAL',
    volunteersNeeded: 12,
    resourcesNeeded: ['Shelter Supplies', 'First Aid Kits', 'Food & Water'],
    reliefGroups: [
      {
        id: 'rg4',
        name: 'Nebraska Emergency Management',
        organization: 'State Agency'
      },
      {
        id: 'rg5',
        name: 'Community Relief Team',
        organization: 'Local Volunteers'
      }
    ]
  },
  {
    id: '4',
    type: 'Gas Leak',
    shortDescription: 'Gas leak reported in residential area',
    location: '114.2N, 28.7W',
    coordinates: [40.8021, -96.6945],
    estimatedImpact: 3200,
    severity: 'MODERATE',
    volunteersNeeded: 2,
    resourcesNeeded: ['Gas Detection Equipment', 'Evacuation Transport'],
    reliefGroups: [
      {
        id: 'rg6',
        name: 'Lincoln Fire Department',
        organization: 'Emergency Services'
      }
    ]
  },
  {
    id: '5',
    type: 'Water Main Break',
    shortDescription: 'Major water main break causing flooding',
    location: '114.9N, 28.2W',
    coordinates: [40.8187, -96.7082],
    estimatedImpact: 6800,
    severity: 'MODERATE',
    volunteersNeeded: 5,
    resourcesNeeded: ['Bottled Water', 'Repair Equipment', 'Traffic Control'],
    reliefGroups: [
      {
        id: 'rg7',
        name: 'Lincoln Water Department',
        organization: 'Public Works'
      }
    ]
  }
];
