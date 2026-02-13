# 🥐 Tbilisi Bun Map

A cute interactive map to track bakeries and stores selling different types of buns in Tbilisi.

## Features

- 🗺️ Interactive Leaflet map centered on Tbilisi
- 📍 Click anywhere to add a new store
- 🥐 Track different bun types (coconut, chocolate, cherry, or custom)
- ✏️ Edit and delete existing stores
- 💾 Persistent storage shared between two users
- 📱 Responsive design

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

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React Leaflet for maps
- Persistent storage API for data sharing

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Then push to GitHub and connect to Vercel, or use:

```bash
vercel
```
