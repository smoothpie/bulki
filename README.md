# 🥐 Tbilisi Bun Map

A cute interactive map to track bakeries and stores selling different types of buns in Tbilisi.

## Features

- 🗺️ Interactive Leaflet map centered on Tbilisi
- 📍 Click anywhere to add a new store
- 🥐 Track different bun types (coconut, chocolate, cherry, or custom)
- ✏️ Edit and delete existing stores
- ❤️ Mark favorite stores
- 💾 Cross-device data sync with Upstash Redis
- 📱 Responsive mobile design
- 📲 **Progressive Web App (PWA)** - Install as an app on your phone!
- 🐯 Cute tiger character that gets happier with more favorites
- � User location tracking
- 🎯 Filter and sort stores by bun type and favorites

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

## How to Use

1. **Add a store**: Click anywhere on the map to place a marker
2. **Fill in details**: Enter store name and select which bun types they have
3. **Add custom bun types**: Type a new bun type and click "Add"
4. **Edit stores**: Click "Edit" on any store in the sidebar
5. **Delete stores**: Click "Delete" to remove a store
6. **Mark favorites**: Click the heart button to save your favorite stores
7. **Install as app**: On mobile, tap "Add to Home Screen" to install as a PWA

### Installing as an App (PWA)

#### On iPhone/iPad (Safari):
1. Open the website in Safari
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right

#### On Android (Chrome):
1. Open the website in Chrome
2. Tap the three dots menu
3. Tap "Add to Home screen" or "Install app"
4. Tap "Install"

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React Leaflet for maps
- Upstash Redis for cross-device data sync
- Mapbox for map tiles
- Progressive Web App (PWA) capabilities

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Then push to GitHub and connect to Vercel, or use:

```bash
vercel
```
