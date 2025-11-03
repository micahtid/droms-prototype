# Disaster Relief Map Prototype

A high-fidelity mobile prototype for disaster relief coordination, built with Next.js, React, and OpenStreetMap.

## Features Implemented

### 1. Mobile-First Layout
- Phone-constrained viewport (max-width: 430px)
- Black bars on desktop to maintain mobile aspect ratio
- Responsive design that simulates a mobile app experience

### 2. Bottom Navigation Bar
- Three navigation options: Home, Map, and Menu
- Map is active by default
- Home and Menu are temporarily disabled as requested
- Clean, modern design with icon + label layout

### 3. Interactive Map (OpenStreetMap)
- Centered on Lincoln, Nebraska (40.8136, -96.7026)
- 5 disaster pins with dummy data placed around Lincoln
- Color-coded pins based on severity:
  - Red: CRITICAL
  - Orange: SEVERE
  - Yellow: MODERATE
  - Blue: MINOR

### 4. Pin Tooltip
- Appears when clicking on a map pin
- Shows disaster type and short description
- "View Details" button to expand to full issue details
- Slide-up animation for smooth UX

### 5. Issue Detail View
- Full-screen modal with disaster information
- Displays:
  - Disaster type and severity badge
  - Location coordinates
  - Estimated impact (number of people affected)
  - Description
- "View Deployment" button to access relief coordination

### 6. Deployment Detail View (Nested)
- Shows relief groups currently working on the issue
- Action Incentives section with:
  - **Volunteers Needed**: Shows count with "Join" button
  - **Resources Needed**: Lists required resources with "View" button
- Placeholder note indicating future contribution functionality
- Clean card-based layout for easy scanning

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet + react-leaflet
- **Icons**: lucide-react
- **Language**: TypeScript

## Design Principles

- **Clean & Modern**: Sans-serif fonts (Geist), no gradients, minimal shadows
- **Intentional Spacing**: Consistent padding and margins throughout
- **Easy Navigation**: Clear hierarchy and intuitive flow
- **Professional**: Color-coded severity levels, organized information architecture

## Data Structure

Disasters are stored in a local TypeScript object (`app/data/disasters.ts`) with:
- Unique ID
- Type (Power Outage, Flooding, Tornado Warning, etc.)
- Location coordinates
- Impact metrics
- Severity level
- Relief group information
- Volunteer and resource requirements

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── components/
│   ├── BottomNav.tsx          # Bottom navigation bar
│   ├── DisasterMap.tsx        # Main map component with pins
│   ├── PinTooltip.tsx         # Initial tooltip when pin clicked
│   ├── IssueDetail.tsx        # Full issue details view
│   └── DeploymentDetail.tsx   # Relief coordination view
├── data/
│   └── disasters.ts           # Dummy disaster data
├── layout.tsx                 # Root layout with mobile constraints
├── page.tsx                   # Main page component
└── globals.css               # Global styles and animations
```

## Future Enhancements

- Implement actual contribution functionality for volunteers and resources
- Enable Home and Menu navigation
- Add real-time data updates
- Implement filtering by severity
- Add search functionality
- User authentication for organizations
