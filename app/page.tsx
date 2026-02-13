'use client'

import dynamic from 'next/dynamic'
import PWARegistration from '@/components/PWARegistration'
import { Suspense } from 'react'

const BunMap = dynamic(() => import('@/components/BunMap').catch(err => {
  console.error('Failed to load BunMap:', err)
  return { default: () => <div style={{ padding: '20px', textAlign: 'center' }}>Error loading map. Please refresh the page.</div> }
}), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '24px',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div>Loading map... 🗺️</div>
      <div style={{ fontSize: '14px', color: '#666' }}>Загружаем карту...</div>
    </div>
  )
})

export default function Home() {
  return (
    <>
      <PWARegistration />
      <BunMap />
    </>
  )
}
