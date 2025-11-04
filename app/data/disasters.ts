export type DisasterSeverity = 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
export type ContributionStatus = 'Being Sent' | 'Sent' | 'Retracted' | 'Delivered';
export type ContributionType = 'Volunteers' | 'Resources' | 'Funding';

export interface Contribution {
  id: string;
  type: ContributionType;
  details: string;
  quantity?: number;
  date: string; // ISO date string
  status: ContributionStatus;
}

export interface ReliefGroup {
  id: string;
  name: string;
  organization: string;
  contributions: Contribution[];
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
        organization: 'Voice Relief',
        contributions: [
          {
            id: 'c1',
            type: 'Volunteers',
            details: '5 volunteers for power restoration support',
            quantity: 5,
            date: '2025-11-03T08:30:00Z',
            status: 'Sent'
          },
          {
            id: 'c2',
            type: 'Resources',
            details: 'Emergency Lighting - 15 units',
            quantity: 15,
            date: '2025-11-03T09:15:00Z',
            status: 'Delivered'
          },
          {
            id: 'c3',
            type: 'Funding',
            details: 'Emergency fund allocation',
            date: '2025-11-03T10:00:00Z',
            status: 'Being Sent'
          }
        ]
      },
      {
        id: 'rg2',
        name: 'Lincoln Emergency Response',
        organization: 'City Services',
        contributions: [
          {
            id: 'c4',
            type: 'Resources',
            details: 'Generators - 3 industrial units',
            quantity: 3,
            date: '2025-11-03T07:00:00Z',
            status: 'Delivered'
          },
          {
            id: 'c5',
            type: 'Volunteers',
            details: '8 electricians',
            quantity: 8,
            date: '2025-11-03T07:30:00Z',
            status: 'Sent'
          }
        ]
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
        organization: 'American Red Cross',
        contributions: [
          {
            id: 'c6',
            type: 'Resources',
            details: 'Sandbags - 500 units',
            quantity: 500,
            date: '2025-11-02T14:00:00Z',
            status: 'Delivered'
          },
          {
            id: 'c7',
            type: 'Volunteers',
            details: '12 relief workers',
            quantity: 12,
            date: '2025-11-02T15:00:00Z',
            status: 'Sent'
          }
        ]
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
        organization: 'State Agency',
        contributions: [
          {
            id: 'c8',
            type: 'Resources',
            details: 'Shelter Supplies - Full emergency kit',
            date: '2025-11-03T06:00:00Z',
            status: 'Delivered'
          }
        ]
      },
      {
        id: 'rg5',
        name: 'Community Relief Team',
        organization: 'Local Volunteers',
        contributions: [
          {
            id: 'c9',
            type: 'Volunteers',
            details: '20 volunteers for shelter setup',
            quantity: 20,
            date: '2025-11-03T07:00:00Z',
            status: 'Sent'
          }
        ]
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
        organization: 'Emergency Services',
        contributions: [
          {
            id: 'c10',
            type: 'Resources',
            details: 'Gas Detection Equipment - 5 units',
            quantity: 5,
            date: '2025-11-01T12:00:00Z',
            status: 'Delivered'
          }
        ]
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
        organization: 'Public Works',
        contributions: [
          {
            id: 'c11',
            type: 'Resources',
            details: 'Repair Equipment - Complete toolkit',
            date: '2025-11-02T10:00:00Z',
            status: 'Being Sent'
          }
        ]
      }
    ]
  }
];
