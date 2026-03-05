import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Equipment = {
  id: string
  name: string
  line_id: string
  type: string
  status: 'normal' | 'warning' | 'critical' | 'offline'
  vibration: number
  temperature: number
  rpm: number
  last_updated: string
}

export type ProductionLine = {
  id: string
  name: string
  status: 'running' | 'idle' | 'maintenance'
  capacity_used: number
  capacity_total: number
  product: string
}

export type Order = {
  id: string
  customer_id: string
  customer_name: string
  line_id: string
  product: string
  quantity: number
  deadline: string
  status: 'in_progress' | 'completed' | 'delayed' | 'at_risk'
  penalty_per_hour: number
}

export type InventoryPart = {
  id: string
  name: string
  equipment_type: string
  quantity: number
  location: string
}

export type Engineer = {
  id: string
  name: string
  specialty: string
  available: boolean
  shift_end: string
}

export type Alert = {
  id: string
  equipment_id: string
  equipment_name: string
  line_id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  vibration_value: number
  threshold: number
  created_at: string
  resolved: boolean
}

export type AiRecommendation = {
  id: string
  alert_id: string
  action: string
  reasoning: string
  priority: number
  estimated_downtime_minutes: number
  risk_level: 'low' | 'medium' | 'high'
  created_at: string
}
