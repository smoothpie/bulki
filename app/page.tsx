'use client'

import dynamic from 'next/dynamic'
import PWARegistration from '@/components/PWARegistration'

const BunMap = dynamic(() => import('@/components/BunMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '24px'
    }}>
      Loading map... 🗺️
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
