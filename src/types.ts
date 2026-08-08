export type View = 'landing' | 'dashboard' | 'map' | 'alerts' | 'evacuation' | 'report' | 'community' | 'jobs'

export type RiskLevel = 0 | 1 | 2 | 3 | 4  // none, low, elevated, high, critical
export type AlertLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'
export type Trend = 'rising' | 'stable' | 'falling'
export type SensorStatus = 'online' | 'degraded' | 'offline'

export interface NigeriaState {
  id: string
  name: string
  risk: RiskLevel
  population: number
  alertsSent: number
  sensorsOnline: number
  sensorsTotal: number
  waterLevelCm: number
  trend: Trend
  region: 'north-west' | 'north-east' | 'north-central' | 'south-west' | 'south-east' | 'south-south'
}

export interface FloodAlert {
  id: string
  state: string
  lga: string
  level: AlertLevel
  message: string
  timestamp: string
  smsSent: number
  affectedPop: number
  status: 'active' | 'resolved'
  evacuationRoutes: string[]
  nearestShelter: string
  waterLevel: number
  forecast72h: number
}

export interface Sensor {
  id: string
  name: string
  state: string
  lga: string
  depthCm: number
  trend: Trend
  batteryPct: number
  lastSeen: string
  status: SensorStatus
  lat: number
  lng: number
}

export interface Shelter {
  id: string
  name: string
  state: string
  lga: string
  address: string
  capacity: number
  occupied: number
  status: 'open' | 'full' | 'standby'
  amenities: string[]
  contact: string
}

export interface EvacuationRoute {
  id: string
  state: string
  fromZone: string
  toShelter: string
  distanceKm: number
  estimatedMins: number
  status: 'clear' | 'partial' | 'blocked'
  landmarks: string[]
}

export interface CommunityReport {
  id: string
  reporterName: string
  state: string
  lga: string
  landmark: string
  depthCm: number
  trend: Trend
  notes: string
  timestamp: string
  verified: boolean
  points: number
}

export interface Job {
  id: string
  title: string
  category: 'field' | 'data' | 'community' | 'training'
  state: string
  count: number
  salaryMonthly: number
  deadline: string
  requirements: string[]
  description: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  state: string
  lga: string
  reportsThisMonth: number
  totalPoints: number
  badge: string
  streak: number
}
