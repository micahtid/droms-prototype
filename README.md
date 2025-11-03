# Disaster Relief Map

A modern, mobile-first disaster relief coordination platform built with Next.js and OpenStreetMap.

## Features

- **Interactive Map** - Real-time disaster location tracking centered on Lincoln, Nebraska
- **Color-Coded Severity** - Visual indicators for disaster severity levels (Critical, Severe, Moderate, Minor)
- **Mobile-First Design** - Optimized for mobile devices with desktop support
- **Detailed Information** - View comprehensive disaster details including location, impact, and severity
- **Relief Coordination** - Track relief groups, volunteer needs, and resource requirements
- **Modern UI** - Clean, minimal design with intentional spacing and professional aesthetics

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet + react-leaflet (OpenStreetMap)
- **Icons**: lucide-react
- **Language**: TypeScript

## Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deploy on Vercel

This project is ready to deploy on [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Project Structure

```
app/
├── components/          # React components
├── data/               # Disaster data
├── icon.svg           # App favicon
└── globals.css        # Global styles
```

## License

MIT
