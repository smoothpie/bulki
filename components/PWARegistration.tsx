'use client'

import { useEffect, useState } from 'react'

export default function PWARegistration() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(true) // Always show button now

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration)
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error)
          })
      })
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('✅ beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('✅ App is already installed')
      setShowInstallButton(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android Chrome - use native prompt
      console.log('Using native install prompt')
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response: ${outcome}`)
      setDeferredPrompt(null)
      if (outcome === 'accepted') {
        setShowInstallButton(false)
      }
    } else {
      // iOS Safari or browsers without install prompt support
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      
      if (isIOS || isSafari) {
        alert('Чтобы установить приложение на iPhone:\n\n1. Нажмите кнопку "Поделиться" ⬆️ внизу экрана\n2. Прокрутите вниз и выберите "На экран Домой"\n3. Нажмите "Добавить"')
      } else {
        alert('Чтобы установить приложение:\n\n1. Откройте меню браузера (⋮)\n2. Выберите "Установить приложение" или "Добавить на главный экран"\n\nЕсли опция недоступна, попробуйте использовать Chrome или обновите браузер.')
      }
    }
  }

  if (!showInstallButton) return null

  return (
    <button
      onClick={handleInstallClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3000,
        background: '#FF8C42',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        padding: '12px 24px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'transform 0.2s'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(0.95)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
      }}
    >
      📱 Установить приложение
    </button>
  )
}
