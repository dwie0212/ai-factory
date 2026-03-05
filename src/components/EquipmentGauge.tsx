import { Activity, Thermometer, Gauge } from 'lucide-react'
import type { Equipment } from '../lib/supabase'

interface Props {
  equipment: Equipment[]
}

function StatusBadge({ status }: { status: Equipment['status'] }) {
  const cfg = {
    normal: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse-alert',
    offline: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }
  const label = { normal: '정상', warning: '경고', critical: '위험', offline: '오프라인' }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg[status]}`}>
      {label[status]}
    </span>
  )
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="w-full bg-slate-700 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function EquipmentGauge({ equipment }: Props) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4" />
        설비 실시간 현황
      </h2>
      <div className="space-y-4">
        {equipment.map(eq => (
          <div key={eq.id} className={`p-3 rounded-lg border ${eq.status === 'critical' ? 'border-red-500/40 bg-red-950/20' : 'border-slate-700 bg-slate-800/40'}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{eq.name}</p>
                <p className="text-xs text-slate-500">{eq.line_id} — {eq.type}</p>
              </div>
              <StatusBadge status={eq.status} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">진동</span>
                </div>
                <p className={`text-sm font-bold ${eq.vibration > 8 ? 'text-red-400' : 'text-white'}`}>
                  {eq.vibration} mm/s
                </p>
                <Bar value={eq.vibration} max={15} color={eq.vibration > 8 ? 'bg-red-500' : 'bg-green-500'} />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Thermometer className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">온도</span>
                </div>
                <p className={`text-sm font-bold ${eq.temperature > 80 ? 'text-orange-400' : 'text-white'}`}>
                  {eq.temperature}°C
                </p>
                <Bar value={eq.temperature} max={100} color={eq.temperature > 80 ? 'bg-orange-500' : 'bg-blue-500'} />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Gauge className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">RPM</span>
                </div>
                <p className="text-sm font-bold text-white">{eq.rpm.toLocaleString()}</p>
                <Bar value={eq.rpm} max={3000} color="bg-blue-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
