import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET() {
  try {
    const stores = await redis.get('tbilisi-bun-stores')
    const bunTypes = await redis.get('tbilisi-bun-types')
    
    return NextResponse.json({
      stores: stores || null,
      bunTypes: bunTypes || null
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { stores, bunTypes } = await request.json()
    
    if (stores !== undefined) {
      await redis.set('tbilisi-bun-stores', stores)
    }
    
    if (bunTypes !== undefined) {
      await redis.set('tbilisi-bun-types', bunTypes)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
