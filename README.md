# Campus Map - University of Pardubice
*Created via Replit Agent*

## 🚀 Overview
An interactive map application for the University of Pardubice campus designed to help first-time visitors (especially Erasmus students) navigate and discover key campus facilities. The app provides detailed information about faculties, dormitories, sports facilities, dining halls, and administrative buildings with direct links to official university pages.

## ✨ Key Features
* **Interactive Map**: Built on OpenStreetMap with Leaflet, showing all major campus locations with accurate geolocation.
* **Quick Navigation**: One-click buttons to focus on Main Campus, Litomyšl Campus (Faculty of Restoration), and Faculty of Health Studies.
* **Location Details**: Pop-ups with descriptions, official addresses, and links to faculty/facility websites.
* **Category Filtering**: Filter locations by type (Faculty, Dorm, Dining, Sports, Other).
* **Search Functionality**: Search for specific locations by name.
* **Multi-Campus Support**: Covers University of Pardubice main campus, health studies facility, and the Faculty of Restoration in Litomyšl.

## 🤖 The "Vibe" (Original Prompt)
> Build an interactive map app for the University of Pardubice campus, targeted at first-time visitors (especially Erasmus students). The map should show faculties, dormitories, sports facilities, and dining halls with info pop-ups (English text, links to official pages). Uses OpenStreetMap background tiles with local names. Includes out-of-campus locations like the Faculty of Restoration in Litomyšl.

## 🛠️ How to Run
1. Clone or download this repository.
2. Install dependencies: `npm install` (or use the Replit environment if running there).
3. Set up the PostgreSQL database: `npm run db:push`
4. Run the development server: `npm run dev`
5. Open the application in your browser (usually `http://localhost:5173` for the frontend).

## 📦 Releases
Find the latest ready-to-use version in the **Releases** section of this sidebar.

## 🏗️ Tech Stack
* **Frontend**: React, React Leaflet, Wouter (routing), TanStack Query (data fetching), Shadcn UI components
* **Backend**: Express.js, PostgreSQL, Drizzle ORM
* **Styling**: Tailwind CSS
* **Deployment**: Ready for Replit deployment

## 📝 Notes
- Location coordinates are approximate and may be refined manually for perfect accuracy.
- All location descriptions and links are tailored for international visitors and Erasmus students.
- The app is fully responsive and optimized for mobile devices.
