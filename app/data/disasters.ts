export type DisasterSeverity = 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
export type ContributionStatus = 'Being Sent' | 'Sent' | 'Delivered' | 'Processing' | 'Arrived' | 'Retracted';
export type ContributionType = 'Volunteers' | 'Resources' | 'Funding';

export interface Contribution {
  id: string;
  type: ContributionType;
  details: string;
  quantity?: number;
  date: string; // ISO date string
  status: ContributionStatus;
  eta?: number; // ETA in hours for resources being delivered
  pointOfContact?: string; // Phone number for volunteers
}

export interface ReliefGroup {
  id: string;
  name: string;
  organization: string;
  contributions: Contribution[];
}

export interface ImpactBreakdown {
  peopleAffected: number;
  structuralDamage?: {
    homesDestroyed?: number;
    homesPartiallyDamaged?: number;
    businessesAffected?: number;
  };
  utilities?: {
    powerOutages?: number;
    waterServiceDisrupted?: number;
    gasLeaksReported?: number;
  };
  casualties?: {
    injuries?: number;
    fatalities?: number;
    missing?: number;
  };
  economicImpact?: {
    estimatedPropertyLoss?: string;
    businessInterruption?: string;
  };
  immediateNeeds?: {
    evacuation?: number;
    emergencyShelter?: number;
    medicalAttention?: number;
  };
}

export interface Disaster {
  id: string;
  type: string;
  shortDescription: string;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  estimatedImpact: number; // number of people affected (for backward compatibility)
  impactBreakdown?: ImpactBreakdown; // Detailed impact information
  severity: DisasterSeverity;
  volunteersNeeded: number;
  resourcesNeeded: string[];
  reliefGroups: ReliefGroup[];
  parentId?: string; // For sub-disasters within a complex disaster
  areaRadius?: number; // For parent disasters - radius in meters
  isParent?: boolean; // True if this disaster has sub-disasters
  polygonCoordinates?: [number, number][]; // For complex non-radial disaster zones
  lastUpdated: string; // ISO date string - when the disaster data was last updated
  manuallyReviewed: boolean; // Whether an admin has manually reviewed this disaster
  lastReviewedAt?: string; // ISO date string - when the disaster was last reviewed
}

export const disasters: Disaster[] = [
  // COMPLEX DISASTER 1: Severe Tornado Event (Parent + 4 Sub-disasters)
  {
    id: 'tornado-parent',
    type: 'Severe Tornado Event',
    shortDescription: 'EF-4 tornado touchdown with widespread destruction',
    location: '113.8N, 27.9W',
    coordinates: [40.7895, -96.7158],
    estimatedImpact: 35200,
    impactBreakdown: {
      peopleAffected: 35200,
      structuralDamage: {
        homesDestroyed: 142,
        homesPartiallyDamaged: 387,
        businessesAffected: 56
      },
      utilities: {
        powerOutages: 18500,
        waterServiceDisrupted: 12300,
        gasLeaksReported: 8
      },
      casualties: {
        injuries: 47,
        fatalities: 3,
        missing: 2
      },
      economicImpact: {
        estimatedPropertyLoss: '$47.2 million',
        businessInterruption: '$12.8 million'
      },
      immediateNeeds: {
        evacuation: 892,
        emergencyShelter: 1240,
        medicalAttention: 156
      }
    },
    severity: 'CRITICAL',
    volunteersNeeded: 120,
    resourcesNeeded: [],
    reliefGroups: [],
    isParent: true,
    areaRadius: 1000, // 1km radius
    polygonCoordinates: [
      [40.7920, -96.7180],
      [40.7920, -96.7130],
      [40.7870, -96.7130],
      [40.7870, -96.7090],
      [40.7840, -96.7090],
      [40.7840, -96.7180],
      [40.7920, -96.7180]
    ],
    lastUpdated: '2025-11-20T08:30:00Z',
    manuallyReviewed: true,
    lastReviewedAt: '2025-11-20T08:15:00Z'
  },
  {
    id: 'tornado-1',
    type: 'Residential Destruction Zone',
    shortDescription: 'Complete destruction of residential area - priority search and rescue',
    location: '113.7N, 27.8W',
    coordinates: [40.7880, -96.7170],
    parentId: 'tornado-parent',
    estimatedImpact: 8900,
    impactBreakdown: {
      peopleAffected: 8900,
      structuralDamage: {
        homesDestroyed: 89,
        homesPartiallyDamaged: 154
      },
      casualties: {
        injuries: 23,
        fatalities: 2,
        missing: 2
      },
      immediateNeeds: {
        evacuation: 412,
        emergencyShelter: 580,
        medicalAttention: 68
      }
    },
    severity: 'CRITICAL',
    volunteersNeeded: 45,
    resourcesNeeded: [
      '120 Heavy-duty tents (8-person capacity)',
      '500 Thermal blankets (mylar emergency)',
      '350 Sleeping bags (rated to 20°F)',
      '150 Portable cots with mattresses',
      '80 First aid kits (comprehensive trauma)',
      '2500 MREs (Meals Ready to Eat)',
      '1800 Bottled water (1L bottles)'
    ],
    reliefGroups: [
      {
        id: 'rg-t1',
        name: 'Nebraska Emergency Management',
        organization: 'State Agency',
        contributions: [
          {
            id: 'c-t1',
            type: 'Resources',
            details: '50 Heavy-duty tents (8-person capacity)',
            quantity: 50,
            date: '2025-11-14T06:00:00Z',
            status: 'Arrived'
          },
          {
            id: 'c-t2',
            type: 'Volunteers',
            details: '15 Search and rescue specialists',
            quantity: 15,
            date: '2025-11-14T05:30:00Z',
            status: 'Arrived',
            pointOfContact: '402-555-0123'
          }
        ]
      },
      {
        id: 'rg-t2',
        name: 'American Red Cross',
        organization: 'International Relief',
        contributions: [
          {
            id: 'c-t3',
            type: 'Resources',
            details: '200 Thermal blankets (mylar emergency)',
            quantity: 200,
            date: '2025-11-14T08:00:00Z',
            status: 'Being Sent',
            eta: 3
          },
          {
            id: 'c-t4',
            type: 'Volunteers',
            details: '12 Medical personnel (nurses and EMTs)',
            quantity: 12,
            date: '2025-11-14T07:00:00Z',
            status: 'Processing',
            pointOfContact: '402-555-0145'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-20T07:45:00Z',
    manuallyReviewed: true,
    lastReviewedAt: '2025-11-20T07:30:00Z'
  },
  {
    id: 'tornado-2',
    type: 'Emergency Shelter Site',
    shortDescription: 'Lincoln High School - active emergency shelter operations',
    location: '113.9N, 28.0W',
    coordinates: [40.7910, -96.7146],
    parentId: 'tornado-parent',
    estimatedImpact: 1240,
    impactBreakdown: {
      peopleAffected: 1240,
      immediateNeeds: {
        emergencyShelter: 1240,
        medicalAttention: 34
      }
    },
    severity: 'SEVERE',
    volunteersNeeded: 28,
    resourcesNeeded: [
      '300 Sleeping bags (rated to 20°F)',
      '300 Portable cots with mattresses',
      '1500 MREs (Meals Ready to Eat)',
      '2000 Bottled water (1L bottles)',
      '50 Portable toilets with sanitation supplies',
      '20 Hand washing stations with soap',
      '100 Hygiene kits (toiletries, towels)'
    ],
    reliefGroups: [
      {
        id: 'rg-t3',
        name: 'Salvation Army',
        organization: 'Faith-Based Relief',
        contributions: [
          {
            id: 'c-t5',
            type: 'Resources',
            details: '200 Sleeping bags (rated to 20°F)',
            quantity: 200,
            date: '2025-11-14T10:00:00Z',
            status: 'Arrived'
          },
          {
            id: 'c-t6',
            type: 'Volunteers',
            details: '10 Shelter coordinators and support staff',
            quantity: 10,
            date: '2025-11-14T09:00:00Z',
            status: 'Arrived',
            pointOfContact: '402-555-0167'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-20T09:20:00Z',
    manuallyReviewed: true,
    lastReviewedAt: '2025-11-20T09:00:00Z'
  },
  {
    id: 'tornado-3',
    type: 'Medical Triage Center',
    shortDescription: 'St. Mary\'s Parking Lot - field hospital setup for injured',
    location: '113.8N, 28.1W',
    coordinates: [40.7905, -96.7165],
    parentId: 'tornado-parent',
    estimatedImpact: 156,
    impactBreakdown: {
      peopleAffected: 156,
      casualties: {
        injuries: 47
      },
      immediateNeeds: {
        medicalAttention: 156
      }
    },
    severity: 'CRITICAL',
    volunteersNeeded: 32,
    resourcesNeeded: [
      '15 Medical tents (20x30 ft)',
      '25 Trauma first aid kits (advanced)',
      '50 Portable oxygen tanks',
      '200 IV fluid bags (saline)',
      '100 Emergency medical supply kits',
      '10 Portable stretchers',
      '20 Medical examination tables'
    ],
    reliefGroups: [
      {
        id: 'rg-t4',
        name: 'Doctors Without Borders',
        organization: 'International Medical',
        contributions: [
          {
            id: 'c-t7',
            type: 'Resources',
            details: '8 Medical tents (20x30 ft)',
            quantity: 8,
            date: '2025-11-14T04:00:00Z',
            status: 'Arrived'
          },
          {
            id: 'c-t8',
            type: 'Volunteers',
            details: '18 Emergency physicians and surgeons',
            quantity: 18,
            date: '2025-11-14T03:30:00Z',
            status: 'Arrived',
            pointOfContact: '402-555-0189'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-20T06:15:00Z',
    manuallyReviewed: true,
    lastReviewedAt: '2025-11-20T06:00:00Z'
  },
  {
    id: 'tornado-4',
    type: 'Utility Restoration Site',
    shortDescription: 'Critical infrastructure repair - power and water restoration',
    location: '113.7N, 27.9W',
    coordinates: [40.7885, -96.7155],
    parentId: 'tornado-parent',
    estimatedImpact: 18500,
    impactBreakdown: {
      peopleAffected: 18500,
      utilities: {
        powerOutages: 18500,
        waterServiceDisrupted: 12300
      }
    },
    severity: 'SEVERE',
    volunteersNeeded: 15,
    resourcesNeeded: [
      '8 Industrial generators (50kW capacity)',
      '25 Portable generators (5kW capacity)',
      '150 LED work lights (battery powered)',
      '12 Water pumps (submersible, 100 GPM)',
      '500 ft Heavy-duty extension cords (12 gauge)',
      '30 Tool kits (electrical and plumbing)'
    ],
    reliefGroups: [
      {
        id: 'rg-t5',
        name: 'Lincoln Public Works',
        organization: 'Municipal Services',
        contributions: [
          {
            id: 'c-t9',
            type: 'Resources',
            details: '5 Industrial generators (50kW capacity)',
            quantity: 5,
            date: '2025-11-14T11:00:00Z',
            status: 'Being Sent',
            eta: 2
          },
          {
            id: 'c-t10',
            type: 'Volunteers',
            details: '12 Licensed electricians and utility workers',
            quantity: 12,
            date: '2025-11-14T10:30:00Z',
            status: 'Arrived',
            pointOfContact: '402-555-0201'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-20T10:30:00Z',
    manuallyReviewed: false
  },

  // COMPLEX DISASTER 2: Flash Flooding Event (Parent + 3 Sub-disasters)
  {
    id: 'flood-parent',
    type: 'Flash Flooding Event',
    shortDescription: 'Severe flash flooding along Salt Creek with rapid water rise',
    location: '115.2N, 29.1W',
    coordinates: [40.8258, -96.6852],
    estimatedImpact: 14600,
    impactBreakdown: {
      peopleAffected: 14600,
      structuralDamage: {
        homesDestroyed: 23,
        homesPartiallyDamaged: 178,
        businessesAffected: 34
      },
      casualties: {
        injuries: 12,
        fatalities: 1,
        missing: 0
      },
      economicImpact: {
        estimatedPropertyLoss: '$18.5 million',
        businessInterruption: '$5.2 million'
      },
      immediateNeeds: {
        evacuation: 456,
        emergencyShelter: 523,
        medicalAttention: 34
      }
    },
    severity: 'SEVERE',
    volunteersNeeded: 85,
    resourcesNeeded: [],
    reliefGroups: [],
    isParent: true,
    areaRadius: 800, // 800m radius
    polygonCoordinates: [
      [40.8280, -96.6875],
      [40.8280, -96.6830],
      [40.8235, -96.6830],
      [40.8235, -96.6770],
      [40.8210, -96.6770],
      [40.8210, -96.6875],
      [40.8280, -96.6875]
    ],
    lastUpdated: '2025-11-20T05:45:00Z',
    manuallyReviewed: true,
    lastReviewedAt: '2025-11-20T05:30:00Z'
  },
  {
    id: 'flood-1',
    type: 'Residential Flooding Zone',
    shortDescription: 'Oak Creek neighborhood - homes flooded with 3-5 ft of water',
    location: '115.1N, 29.0W',
    coordinates: [40.8245, -96.6865],
    parentId: 'flood-parent',
    estimatedImpact: 6800,
    impactBreakdown: {
      peopleAffected: 6800,
      structuralDamage: {
        homesPartiallyDamaged: 156
      },
      immediateNeeds: {
        evacuation: 412,
        emergencyShelter: 412
      }
    },
    severity: 'SEVERE',
    volunteersNeeded: 35,
    resourcesNeeded: [
      '20 Water pumps (submersible, 100 GPM)',
      '2000 Sandbags (filled, heavy-duty)',
      '40 Wet/dry vacuums (commercial grade)',
      '100 Dehumidifiers (70-pint capacity)',
      '200 Industrial fans (air movers)',
      '500 Waterproof tarps (20x30 ft)',
      '1000 Contractor cleanup bags (heavy-duty)'
    ],
    reliefGroups: [
      {
        id: 'rg-f1',
        name: 'Team Rubicon',
        organization: 'Veteran Disaster Response',
        contributions: [
          {
            id: 'c-f1',
            type: 'Resources',
            details: '12 Water pumps (submersible, 100 GPM)',
            quantity: 12,
            date: '2025-11-13T14:00:00Z',
            status: 'Arrived'
          },
          {
            id: 'c-f2',
            type: 'Volunteers',
            details: '20 Trained disaster response volunteers',
            quantity: 20,
            date: '2025-11-13T13:00:00Z',
            status: 'Arrived',
            pointOfContact: '402-555-0223'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-20T04:20:00Z',
    manuallyReviewed: true,
    lastReviewedAt: '2025-11-20T04:00:00Z'
  },
  {
    id: 'flood-2',
    type: 'Commercial District Flooding',
    shortDescription: 'Downtown businesses - severe water damage and debris',
    location: '115.3N, 29.2W',
    coordinates: [40.8271, -96.6839],
    parentId: 'flood-parent',
    estimatedImpact: 2300,
    impactBreakdown: {
      peopleAffected: 2300,
      structuralDamage: {
        businessesAffected: 34
      },
      economicImpact: {
        estimatedPropertyLoss: '$8.2 million',
        businessInterruption: '$5.2 million'
      }
    },
    severity: 'MODERATE',
    volunteersNeeded: 25,
    resourcesNeeded: [
      '15 Water pumps (submersible, 150 GPM)',
      '80 Dehumidifiers (70-pint capacity)',
      '150 Industrial fans (air movers)',
      '300 Waterproof tarps (20x30 ft)',
      '50 Power washers (gas-powered)',
      '2000 Sandbags (filled, heavy-duty)'
    ],
    reliefGroups: [
      {
        id: 'rg-f2',
        name: 'Lincoln Chamber of Commerce',
        organization: 'Business Association',
        contributions: [
          {
            id: 'c-f3',
            type: 'Funding',
            details: 'Business recovery fund',
            quantity: 250000,
            date: '2025-11-13T16:00:00Z',
            status: 'Arrived'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-19T16:00:00Z',
    manuallyReviewed: false
  },
  {
    id: 'flood-3',
    type: 'Water Contamination Zone',
    shortDescription: 'Sewage system overflow - critical health hazard',
    location: '115.2N, 29.3W',
    coordinates: [40.8265, -96.6845],
    parentId: 'flood-parent',
    estimatedImpact: 5500,
    impactBreakdown: {
      peopleAffected: 5500,
      immediateNeeds: {
        medicalAttention: 34
      }
    },
    severity: 'CRITICAL',
    volunteersNeeded: 25,
    resourcesNeeded: [
      '500 Water testing kits (bacterial)',
      '2000 Bottled water (1L bottles)',
      '300 Disinfectant spray bottles (bleach solution)',
      '500 N95 respirator masks',
      '200 Protective suits (Tyvek)',
      '400 Rubber boots (waterproof)',
      '400 Heavy-duty gloves (nitrile)'
    ],
    reliefGroups: [
      {
        id: 'rg-f3',
        name: 'CDC Emergency Response',
        organization: 'Federal Health Agency',
        contributions: [
          {
            id: 'c-f4',
            type: 'Resources',
            details: '300 Water testing kits (bacterial)',
            quantity: 300,
            date: '2025-11-13T09:00:00Z',
            status: 'Being Sent',
            eta: 6
          },
          {
            id: 'c-f5',
            type: 'Volunteers',
            details: '8 Environmental health specialists',
            quantity: 8,
            date: '2025-11-13T08:00:00Z',
            status: 'Processing',
            pointOfContact: '402-555-0245'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-20T03:10:00Z',
    manuallyReviewed: true,
    lastReviewedAt: '2025-11-20T03:00:00Z'
  },

  // STANDALONE DISASTER 1: Gas Leak
  {
    id: 'gas-leak-1',
    type: 'Natural Gas Leak',
    shortDescription: 'Underground gas line rupture in residential neighborhood',
    location: '114.2N, 28.7W',
    coordinates: [41.2565, -95.9345], // Omaha, NE - spread out from Lincoln
    estimatedImpact: 3200,
    impactBreakdown: {
      peopleAffected: 3200,
      utilities: {
        gasLeaksReported: 1
      },
      immediateNeeds: {
        evacuation: 892,
        medicalAttention: 8
      }
    },
    severity: 'MODERATE',
    volunteersNeeded: 12,
    resourcesNeeded: [
      '8 Gas detection meters (multi-gas)',
      '15 Emergency evacuation buses (45-passenger)',
      '20 Traffic cones with reflective strips',
      '10 Portable barricades',
      '500 Emergency notification flyers'
    ],
    reliefGroups: [
      {
        id: 'rg-g1',
        name: 'Lincoln Fire Department',
        organization: 'Emergency Services',
        contributions: [
          {
            id: 'c-g1',
            type: 'Resources',
            details: '5 Gas detection meters (multi-gas)',
            quantity: 5,
            date: '2025-11-12T12:00:00Z',
            status: 'Arrived'
          },
          {
            id: 'c-g2',
            type: 'Volunteers',
            details: '8 Hazmat technicians',
            quantity: 8,
            date: '2025-11-12T11:30:00Z',
            status: 'Arrived',
            pointOfContact: '402-555-0267'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-19T12:00:00Z',
    manuallyReviewed: false
  },

  // STANDALONE DISASTER 2: Water Main Break
  {
    id: 'water-main-1',
    type: 'Water Main Break',
    shortDescription: 'Major 24-inch water main rupture causing street flooding',
    location: '114.9N, 28.2W',
    coordinates: [40.5853, -96.7311], // Beatrice, NE - south of Lincoln
    estimatedImpact: 6800,
    impactBreakdown: {
      peopleAffected: 6800,
      utilities: {
        waterServiceDisrupted: 6800
      }
    },
    severity: 'MODERATE',
    volunteersNeeded: 8,
    resourcesNeeded: [
      '3500 Bottled water (1L bottles)',
      '12 Traffic cones with reflective strips',
      '8 Portable barricades',
      '200 Sandbags (filled, heavy-duty)',
      '4 Water pumps (submersible, 200 GPM)'
    ],
    reliefGroups: [
      {
        id: 'rg-w1',
        name: 'Lincoln Water Department',
        organization: 'Public Utilities',
        contributions: [
          {
            id: 'c-w1',
            type: 'Resources',
            details: '2000 Bottled water (1L bottles)',
            quantity: 2000,
            date: '2025-11-11T10:00:00Z',
            status: 'Being Sent',
            eta: 4
          },
          {
            id: 'c-w2',
            type: 'Volunteers',
            details: '6 Licensed plumbers and utility workers',
            quantity: 6,
            date: '2025-11-11T09:30:00Z',
            status: 'Arrived',
            pointOfContact: '402-555-0289'
          }
        ]
      }
    ],
    lastUpdated: '2025-11-19T10:00:00Z',
    manuallyReviewed: false
  }
];
