'use client'

import { sparStores } from './sparStores'
import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom bun icon
const bunIcon = L.divIcon({
  className: 'custom-bun-icon',
  html: '<div style="font-size: 16px; text-align: center; line-height: 1;">🥐</div>',
  iconSize: [16, 16],
  iconAnchor: [8, 16],
  popupAnchor: [0, -16]
})

// Custom heart icon for favorites
const heartIcon = L.divIcon({
  className: 'custom-heart-icon',
  html: '<div style="font-size: 16px; text-align: center; line-height: 1;">❤️</div>',
  iconSize: [16, 16],
  iconAnchor: [8, 16],
  popupAnchor: [0, -16]
})

// Highlighted bun icon (bigger)
const bunIconHighlighted = L.divIcon({
  className: 'custom-bun-icon-highlighted',
  html: '<div style="font-size: 32px; text-align: center; line-height: 1; filter: drop-shadow(0 0 4px rgba(255, 140, 66, 0.8));">🥐</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// Highlighted heart icon (bigger)
const heartIconHighlighted = L.divIcon({
  className: 'custom-heart-icon-highlighted',
  html: '<div style="font-size: 32px; text-align: center; line-height: 1; filter: drop-shadow(0 0 4px rgba(255, 140, 66, 0.8));">❤️</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// User location icon
const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: '<div style="font-size: 24px; text-align: center; line-height: 1; filter: drop-shadow(0 0 3px rgba(0,0,0,0.5));">📍</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
})

interface Store {
  id: string
  name: string
  bunTypes: string[]
  lat: number
  lng: number
  favorite?: boolean
}

// ohhh maybe replace it with baby cat stickers
// Tiger character component with different expressions
function TigerCharacter({ favoriteCount }: { favoriteCount: number }) {
  // Calculate happiness level (0-4)
  const happiness = Math.min(4, Math.floor(favoriteCount / 2))
  
  // Mouth path based on happiness - simple and cute
  const getMouthPath = () => {
    switch(happiness) {
      case 0: return "M32,48 Q40,48 48,48" // Straight
      case 1: return "M32,48 Q40,50 48,48" // Tiny smile
      case 2: return "M30,47 Q40,52 50,47" // Small smile
      case 3: return "M30,46 Q40,53 50,46" // Happy smile
      case 4: return "M30,45 Q40,54 50,45" // Big happy smile
      default: return "M32,48 Q40,48 48,48"
    }
  }
  
  // Cheek blush for higher happiness
  const showCheeks = happiness >= 2
  
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      {/* Head */}
      <circle cx="40" cy="40" r="30" fill="#FFB366" stroke="#E89850" strokeWidth="2"/>
      
      {/* Ears */}
      <circle cx="22" cy="22" r="10" fill="#FFB366" stroke="#E89850" strokeWidth="2"/>
      <circle cx="58" cy="22" r="10" fill="#FFB366" stroke="#E89850" strokeWidth="2"/>
      <circle cx="22" cy="23" r="5" fill="#FFCFA3"/>
      <circle cx="58" cy="23" r="5" fill="#FFCFA3"/>
      
      {/* Stripes */}
      <path d="M32,20 Q36,18 40,20" stroke="#D97020" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M40,20 Q44,18 48,20" stroke="#D97020" strokeWidth="2" fill="none" strokeLinecap="round"/>
      
      {/* Eyes - simple and cute */}
      <circle cx="30" cy="35" r="4" fill="#000"/>
      <circle cx="50" cy="35" r="4" fill="#000"/>
      {/* Eye shine */}
      <circle cx="31" cy="34" r="1.5" fill="#fff"/>
      <circle cx="51" cy="34" r="1.5" fill="#fff"/>
      
      {/* Nose - simple */}
      <circle cx="40" cy="43" r="3" fill="#000"/>
      
      {/* Cheeks */}
      {showCheeks && (
        <>
          <circle cx="20" cy="44" r="5" fill="#FFB3D9" opacity="0.6"/>
          <circle cx="60" cy="44" r="5" fill="#FFB3D9" opacity="0.6"/>
        </>
      )}
      
      {/* Mouth */}
      <path d={getMouthPath()} stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
      
      {/* Whiskers */}
      <line x1="10" y1="40" x2="20" y2="40" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="45" x2="20" y2="45" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
      
      <line x1="70" y1="40" x2="60" y2="40" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="70" y1="45" x2="60" y2="45" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// Component to handle map centering
function MapController({ center }: { center: { lat: number; lng: number } | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 16)
    }
  }, [center, map])
  
  return null
}

// Russian pluralization helper for noun
function getPluralForm(count: number) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'находок' // 11-19: находок
  }
  
  if (lastDigit === 1) {
    return 'находка' // 1, 21, 31...: находка
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'находки' // 2-4, 22-24...: находки
  }
  
  return 'находок' // 0, 5-20, 25-30...: находок
}

// Russian pluralization helper for adjective "булочная"
function getAdjectiveForm(count: number) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'булочных' // 11-19: булочных
  }
  
  if (lastDigit === 1) {
    return 'булочная' // 1, 21, 31...: булочная
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'булочные' // 2-4, 22-24...: булочные
  }
  
  return 'булочных' // 0, 5-20, 25-30...: булочных
}

export default function BunMap() {
  const [stores, setStores] = useState<Store[]>([])
  const [bunTypes, setBunTypes] = useState<string[]>(['🥥 Кокосовая булотька', '🍫 Шоколадная булотька', '🍒 Вишневая булотька'])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [newStoreName, setNewStoreName] = useState('')
  const [selectedBunTypes, setSelectedBunTypes] = useState<string[]>([])
  const [newBunType, setNewBunType] = useState('')
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [filterBunType, setFilterBunType] = useState<string | null>(null)
  const [highlightedStoreId, setHighlightedStoreId] = useState<string | null>(null)

  // Load data from storage
  useEffect(() => {
    loadData()
  }, [])

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied or unavailable')
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      )
    }
  }, [])

  async function loadData() {
    try {
      const response = await fetch('/api/stores')
      const data = await response.json()
      
      let loadedStores = []
      if (data.stores) {
        loadedStores = data.stores
      } else {
        // If no stores in database, load SPAR stores by default
        loadedStores = [...sparStores]
        await saveStores(loadedStores)
      }
      
      setStores(loadedStores)
      
      if (data.bunTypes) {
        setBunTypes(data.bunTypes)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to SPAR stores if there's an error
      setStores([...sparStores])
    }
  }

  async function saveStores(newStores: Store[]) {
    try {
      await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stores: newStores })
      })
      setStores(newStores)
    } catch (error) {
      console.error('Error saving stores:', error)
    }
  }

  async function saveBunTypes(types: string[]) {
    try {
      await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bunTypes: types })
      })
      setBunTypes(types)
    } catch (error) {
      console.error('Error saving bun types:', error)
    }
  }

  function handleMapClick(lat: number, lng: number) {
    setSelectedLocation({ lat, lng })
    setShowAddForm(true)
    setNewStoreName('')
    setSelectedBunTypes([])
    setEditingStoreId(null)
  }

  function toggleBunType(type: string) {
    setSelectedBunTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  function handleAddBunType() {
    if (newBunType.trim() && !bunTypes.includes(newBunType.trim())) {
      const updated = [...bunTypes, newBunType.trim()]
      saveBunTypes(updated)
      setNewBunType('')
    }
  }

  function handleSaveStore() {
    if (!newStoreName.trim() || selectedBunTypes.length === 0 || !selectedLocation) return

    if (editingStoreId) {
      // Edit existing store
      const updated = stores.map(store =>
        store.id === editingStoreId
          ? { ...store, name: newStoreName, bunTypes: selectedBunTypes }
          : store
      )
      saveStores(updated)
    } else {
      // Add new store
      const newStore: Store = {
        id: Date.now().toString(),
        name: newStoreName,
        bunTypes: selectedBunTypes,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      }
      saveStores([...stores, newStore])
    }

    setShowAddForm(false)
    setSelectedLocation(null)
    setNewStoreName('')
    setSelectedBunTypes([])
    setEditingStoreId(null)
  }

  function handleEditStore(store: Store) {
    setEditingStoreId(store.id)
    setNewStoreName(store.name)
    setSelectedBunTypes(store.bunTypes)
    setSelectedLocation({ lat: store.lat, lng: store.lng })
    setShowAddForm(true)
    setSidebarOpen(true)
  }

  function handleDeleteStore(id: string) {
    if (confirm('Delete this store?')) {
      saveStores(stores.filter(s => s.id !== id))
    }
  }

  function toggleFavorite(id: string) {
    const updated = stores.map(store =>
      store.id === id ? { ...store, favorite: !store.favorite } : store
    )
    saveStores(updated)
  }

  function cancelAddStore() {
    setShowAddForm(false)
    setSelectedLocation(null)
    setNewStoreName('')
    setSelectedBunTypes([])
    setEditingStoreId(null)
  }

  function centerOnUserLocation() {
    if (userLocation) {
      setMapCenter(userLocation)
    } else {
      alert('Местоположение пока не определено. Проверьте разрешения.')
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  function handleFoundBun() {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude
        const userLng = position.coords.longitude

        // Find closest store
        let closestStore: Store | null = null
        let minDistance = Infinity

        stores.forEach(store => {
          const distance = calculateDistance(userLat, userLng, store.lat, store.lng)
          if (distance < minDistance) {
            minDistance = distance
            closestStore = store
          }
        })

        // Only auto-select if within 100 meters
        if (closestStore && minDistance < 0.1) {
          handleEditStore(closestStore)
        } else {
          alert(`Ближайший SPAR находится в ${(minDistance * 1000).toFixed(0)} метрах. Вы сейчас в магазине?`)
        }
      },
      (error) => {
        alert('Не удалось определить ваше местоположение. Проверьте разрешения.')
        console.error('Geolocation error:', error)
      }
    )
  }

  // как найти булку?? как она выглядит в реальной жизни? может добавить фоточку булки в описание магазина? или даже юзать фоточки булок вместо иконок на карте? а может просто юзать разные эмодзи булок для разных видов булок? ммм, давай пока так, а там посмотрим как люди будут юзать и что они будут добавлять в описания магазинов, может тогда уже будет понятно как лучше отображать булки на карте

  // заказать доставку булок - ссылка на мою телегу
  // пожаловаться разработчикам на отсутствие булок - тоже ссылка на телегу, но с другим текстом и эмодзи
  // может еще добавить кнопку "я нашел булку!" которая будет открывать форму добавления магазина, но с уже заполненными координатами текущего местоположения пользователя, чтобы было еще проще добавлять магазины, которые люди находят в реальной жизни - о точно!
  // поле для комментов для каждого магазина, чтобы люди могли оставлять отзывы и делиться инфой о булках в конкретных магазинах

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '110px',
          left: '10px',
          zIndex: 2000,
          background: 'white',
          border: '2px solid #ff8c42',
          borderRadius: '8px',
          padding: '10px 15px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          fontSize: '20px'
        }}
      >
        {sidebarOpen ? '✖️' : '✏️'}
      </button>

      {/* Tiger Character - Full Width Top Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1999,
        background: 'white',
        padding: '8px 10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: 1.2
        }}>
          Дашин фэйс когда<br />{stores.filter(s => s.favorite).length} {getAdjectiveForm(stores.filter(s => s.favorite).length)} {getPluralForm(stores.filter(s => s.favorite).length)}
        </div>
        <div style={{ transform: 'scale(0.7)' }}>
          <TigerCharacter favoriteCount={stores.filter(s => s.favorite).length} />
        </div>
        {/* <div style={{ 
          fontSize: '19px', 
          lineHeight: 1,
          display: 'flex',
          gap: '1px',
          flexWrap: 'wrap',
          maxWidth: '100px',
          justifyContent: 'center'
        }}>
          {'🥐'.repeat(Math.min(stores.filter(s => s.favorite).length))}
        </div> */}
      </div>

      {/* Sidebar */}
      <div style={{
        width: '350px',
        maxWidth: '100vw',
        background: 'white',
        padding: '20px',
        paddingTop: '120px',
        overflowY: 'auto',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        left: sidebarOpen ? '0' : '-100vw',
        top: 0,
        bottom: 0,
        zIndex: 1500,
        transition: 'left 0.3s ease'
      }}>
        <h1 style={{ fontSize: '28px', marginLeft: 16, marginBottom: '10px' }}>🥐 в поисках булок</h1>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
          кликни на булотьку чтобы дать по ней инфу
        </p>

        {/* Found Bun Button */}
        {/* <button
          onClick={handleFoundBun}
          style={{
            width: '100%',
            padding: '12px',
            background: '#FF8C42',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          🥐 Нашла булочку!
        </button> */}

        {showAddForm && (
          <div style={{
            background: '#fff8e1',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '2px solid #ffd54f'
          }}>
            <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>
              {editingStoreId ? '✏️ что по чем' : '📍 добавить спар'}
            </h3>
            
            <input
              type="text"
              placeholder="Название магазина"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />

            <div style={{ marginBottom: '10px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Обнаружены:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {bunTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleBunType(type)}
                    style={{
                      padding: '5px 10px',
                      border: selectedBunTypes.includes(type) ? '2px solid #ff9800' : '1px solid #ddd',
                      background: selectedBunTypes.includes(type) ? '#ffe0b2' : 'white',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Добавить новый вид булки"
                value={newBunType}
                onChange={(e) => setNewBunType(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddBunType()}
                style={{
                  width: 'calc(100% - 60px)',
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginRight: '5px'
                }}
              />
              <button
                onClick={handleAddBunType}
                style={{
                  padding: '6px 12px',
                  background: '#454545ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Добавить
              </button>
            </div>

            {editingStoreId && (
              <div style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => toggleFavorite(editingStoreId)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: stores.find(s => s.id === editingStoreId)?.favorite ? '#e91e63' : '#999',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {stores.find(s => s.id === editingStoreId)?.favorite ? '❤️ В любимых' : '🤍 Сохранить в любимые'}
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSaveStore}
                disabled={!newStoreName.trim() || selectedBunTypes.length === 0}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  opacity: (!newStoreName.trim() || selectedBunTypes.length === 0) ? 0.5 : 1
                }}
              >
                {editingStoreId ? 'Обновить' : 'Сохранить'}
              </button>
              <button
                onClick={cancelAddStore}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
          📋 ВСЕ СПАРЫ ({stores.filter(store => !filterBunType || store.bunTypes.includes(filterBunType)).length})
        </h3>
        
        {/* Filter by bun type */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            <button
              onClick={() => setFilterBunType(null)}
              style={{
                padding: '5px 10px',
                border: filterBunType === null ? '2px solid #FF8C42' : '1px solid #ddd',
                background: filterBunType === null ? '#FFE0B2' : 'white',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: filterBunType === null ? 'bold' : 'normal'
              }}
            >
              Все
            </button>
            {bunTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilterBunType(type)}
                style={{
                  padding: '5px 10px',
                  border: filterBunType === type ? '2px solid #FF8C42' : '1px solid #ddd',
                  background: filterBunType === type ? '#FFE0B2' : 'white',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: filterBunType === type ? 'bold' : 'normal'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stores
            .filter(store => !filterBunType || store.bunTypes.includes(filterBunType))
            .sort((a, b) => {
              // Sort favorites first
              if (a.favorite && !b.favorite) return -1
              if (!a.favorite && b.favorite) return 1
              
              // Then sort by whether they have buns (bunTypes is not empty)
              const aHasBuns = a.bunTypes.length > 0
              const bHasBuns = b.bunTypes.length > 0
              if (aHasBuns && !bHasBuns) return -1
              if (!aHasBuns && bHasBuns) return 1
              
              return 0
            })
            .map(store => (
            <div
              key={store.id}
              style={{
                background: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #eee'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4 
                    onClick={() => {
                      setMapCenter({ lat: store.lat, lng: store.lng })
                      setHighlightedStoreId(store.id)
                      setTimeout(() => setHighlightedStoreId(null), 3000) // Clear highlight after 3 seconds
                    }}
                    style={{ 
                      fontSize: '15px', 
                      marginBottom: '5px',
                      cursor: 'pointer',
                      color: '#FF8C42',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B42'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#FF8C42'}
                  >
                    {store.name}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {store.bunTypes.join(', ')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => toggleFavorite(store.id)}
                    style={{
                      padding: '4px 8px',
                      background: store.favorite ? '#e91e63' : '#999',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    {store.favorite ? '❤️' : '🤍'}
                  </button>
                  <button
                    onClick={() => handleEditStore(store)}
                    style={{
                      padding: '4px 8px',
                      background: '#89c9fdff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    style={{
                      padding: '4px 8px',
                      background: '#faa9a3ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100vh' }}>
        <MapContainer
          center={[41.7151, 44.8271]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
            tileSize={512}
            zoomOffset={-1}
          />
          
          {stores.map(store => {
            const isHighlighted = highlightedStoreId === store.id
            const isFavorite = store.favorite
            
            // Choose icon based on highlight and favorite status
            let icon
            if (isHighlighted && isFavorite) {
              icon = heartIconHighlighted
            } else if (isHighlighted) {
              icon = bunIconHighlighted
            } else if (isFavorite) {
              icon = heartIcon
            } else {
              icon = bunIcon
            }
            
            return (
              <Marker 
                key={store.id} 
                position={[store.lat, store.lng]} 
                icon={icon}
                eventHandlers={{
                  click: () => handleEditStore(store)
                }}
              />
            )
          })}

          {/* User location marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={userIcon}
            />
          )}

          <MapController center={mapCenter} />
        </MapContainer>

        {/* Locate Me Button */}
        <button
          onClick={centerOnUserLocation}
          style={{
            position: 'absolute',
            bottom: '120px',
            right: '20px',
            zIndex: 1000,
            background: 'white',
            border: '2px solid #FF8C42',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.1s, background 0.2s'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
            e.currentTarget.style.background = '#FFF5E6'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.background = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.background = 'white'
          }}
          title="Показать моё местоположение"
        >
          📍
        </button>
      </div>
    </div>
  )
}
