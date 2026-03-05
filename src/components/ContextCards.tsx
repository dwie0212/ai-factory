import { Package, Factory, Users, Warehouse, FileText, Clock } from 'lucide-react'
import type { Order, ProductionLine, InventoryPart, Engineer } from '../lib/supabase'

interface Props {
  order: Order
  lines: ProductionLine[]
  parts: InventoryPart[]
  engineers: Engineer[]
}

function Card({ icon: Icon, label, color, children }: {
  icon: React.ElementType
  label: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div className={`bg-slate-800/60 border ${color} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      {children}
    </div>
  )
}

export function ContextCards({ order, lines, parts, engineers }: Props) {
  const deadline = new Date(order.deadline)
  const hoursLeft = Math.round((deadline.getTime() - Date.now()) / 3600000)
  const spareLine = lines.find(l => l.id !== order.line_id && l.capacity_used < 70)
  const availableEngineers = engineers.filter(e => e.available)
  const cncParts = parts.filter(p => p.equipment_type === 'CNC')

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {/* ERP */}
      <Card icon={FileText} label="ERP — 주문 정보" color="border-orange-500/40">
        <p className="text-sm font-semibold text-white mb-1">{order.customer_name}</p>
        <p className="text-xs text-slate-400 mb-2">{order.product} {order.quantity.toLocaleString()}개</p>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs text-orange-300 font-bold">납기 {hoursLeft}시간 후</span>
        </div>
        <p className="text-xs text-red-400 mt-1">
          페널티: {order.penalty_per_hour.toLocaleString()}원/시간
        </p>
      </Card>

      {/* MES */}
      <Card icon={Factory} label="MES — 생산 라인" color="border-blue-500/40">
        {spareLine ? (
          <>
            <p className="text-xs text-slate-400 mb-1">인근 여유 라인</p>
            <p className="text-sm font-semibold text-white mb-2">{spareLine.name}</p>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${spareLine.capacity_used}%` }}
              />
            </div>
            <p className="text-xs text-blue-300">
              여유 용량: <span className="font-bold">{100 - spareLine.capacity_used}%</span>
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-400">여유 라인 없음</p>
        )}
      </Card>

      {/* WMS */}
      <Card icon={Warehouse} label="WMS — 부품 재고" color="border-green-500/40">
        {cncParts.length > 0 ? (
          cncParts.slice(0, 2).map(part => (
            <div key={part.id} className="mb-2 last:mb-0">
              <p className="text-xs font-medium text-white">{part.name}</p>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-slate-400">{part.location}</span>
                <span className={`text-xs font-bold ${part.quantity <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {part.quantity}개 재고
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">재고 없음</p>
        )}
      </Card>

      {/* HR */}
      <Card icon={Users} label="HR — 정비 엔지니어" color="border-purple-500/40">
        {availableEngineers.length > 0 ? (
          <>
            <p className="text-xs text-green-400 mb-2">
              {availableEngineers.length}명 즉시 투입 가능
            </p>
            {availableEngineers.map(eng => (
              <div key={eng.id} className="mb-1.5 last:mb-0">
                <p className="text-xs font-medium text-white">{eng.name}</p>
                <p className="text-xs text-slate-400">{eng.specialty}</p>
              </div>
            ))}
          </>
        ) : (
          <p className="text-sm text-slate-400">가용 엔지니어 없음</p>
        )}
      </Card>

      {/* CRM */}
      <Card icon={Package} label="CRM — 계약 조건" color="border-yellow-500/40">
        <p className="text-sm font-semibold text-white mb-1">{order.customer_name}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">납기 지연 페널티</span>
            <span className="text-red-400 font-bold">있음</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">지연 시 비용</span>
            <span className="text-yellow-400 font-bold">{order.penalty_per_hour.toLocaleString()}원/h</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">주문 상태</span>
            <span className="text-orange-400 font-bold">위험</span>
          </div>
        </div>
      </Card>

      {/* 설비 현황 */}
      <Card icon={Factory} label="SCADA — 설비 현황" color="border-red-500/40">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">진동</span>
            <span className="text-red-400 font-bold">12.7 mm/s</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">온도</span>
            <span className="text-orange-400 font-bold">87°C</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">RPM</span>
            <span className="text-white font-bold">2,340</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">상태</span>
            <span className="text-red-400 font-bold">CRITICAL</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
