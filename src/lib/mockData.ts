import type { Equipment, ProductionLine, Order, InventoryPart, Engineer, Alert } from './supabase'

export const mockLines: ProductionLine[] = [
  {
    id: 'line-A',
    name: 'A라인 (자동차 부품)',
    status: 'running',
    capacity_used: 85,
    capacity_total: 100,
    product: '엔진 마운트 브라켓',
  },
  {
    id: 'line-B',
    name: 'B라인 (전자 부품)',
    status: 'running',
    capacity_used: 45,
    capacity_total: 100,
    product: 'PCB 기판',
  },
  {
    id: 'line-C',
    name: 'C라인 (금속 가공)',
    status: 'idle',
    capacity_used: 0,
    capacity_total: 100,
    product: '-',
  },
]

export const mockEquipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'CNC 선반 #1',
    line_id: 'line-A',
    type: 'CNC',
    status: 'critical',
    vibration: 12.7,
    temperature: 87,
    rpm: 2340,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'eq-002',
    name: 'CNC 선반 #2',
    line_id: 'line-A',
    type: 'CNC',
    status: 'normal',
    vibration: 2.1,
    temperature: 65,
    rpm: 2100,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'eq-003',
    name: 'SMT 라인 머신',
    line_id: 'line-B',
    type: 'SMT',
    status: 'normal',
    vibration: 1.8,
    temperature: 58,
    rpm: 1800,
    last_updated: new Date().toISOString(),
  },
]

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    customer_id: 'cust-A',
    customer_name: 'A고객 (현대모비스)',
    line_id: 'line-A',
    product: '엔진 마운트 브라켓',
    quantity: 500,
    deadline: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(), // 14시간 후
    status: 'at_risk',
    penalty_per_hour: 850000,
  },
  {
    id: 'ord-002',
    customer_id: 'cust-B',
    customer_name: 'B고객 (삼성전자)',
    line_id: 'line-B',
    product: 'PCB 기판',
    quantity: 2000,
    deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    penalty_per_hour: 320000,
  },
]

export const mockParts: InventoryPart[] = [
  {
    id: 'part-001',
    name: 'CNC 스핀들 베어링',
    equipment_type: 'CNC',
    quantity: 2,
    location: 'WH-A-12',
  },
  {
    id: 'part-002',
    name: 'CNC 절삭 공구 세트',
    equipment_type: 'CNC',
    quantity: 8,
    location: 'WH-A-05',
  },
  {
    id: 'part-003',
    name: 'SMT 노즐 키트',
    equipment_type: 'SMT',
    quantity: 15,
    location: 'WH-B-03',
  },
]

export const mockEngineers: Engineer[] = [
  {
    id: 'eng-001',
    name: '김철수',
    specialty: 'CNC 정비',
    available: true,
    shift_end: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'eng-002',
    name: '박영희',
    specialty: 'CNC / 유압 시스템',
    available: true,
    shift_end: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'eng-003',
    name: '이민준',
    specialty: 'SMT / 전자장비',
    available: false,
    shift_end: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockAlert: Alert = {
  id: 'alert-001',
  equipment_id: 'eq-001',
  equipment_name: 'CNC 선반 #1',
  line_id: 'line-A',
  type: '진동 이상',
  severity: 'critical',
  message: '진동 센서 임계값 초과 감지 - 즉각 점검 필요',
  vibration_value: 12.7,
  threshold: 8.0,
  created_at: new Date().toISOString(),
  resolved: false,
}
