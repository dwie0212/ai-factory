import { AlertTriangle, Zap } from 'lucide-react'
import type { Alert } from '../lib/supabase'

interface Props {
  alert: Alert
}

export function AlertBanner({ alert }: Props) {
  const age = Math.round((Date.now() - new Date(alert.created_at).getTime()) / 60000)

  return (
    <div className="bg-red-950 border border-red-500 rounded-xl p-4 flex items-start gap-4 animate-pulse-alert">
      <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">CRITICAL ALERT</span>
          <span className="text-xs text-slate-500">{age < 1 ? '방금 전' : `${age}분 전`}</span>
        </div>
        <p className="text-white font-semibold text-sm">{alert.equipment_name} — {alert.message}</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-slate-300">
              진동: <span className="text-red-400 font-bold">{alert.vibration_value} mm/s</span>
              <span className="text-slate-500"> (임계값 {alert.threshold} mm/s)</span>
            </span>
          </div>
          <span className="text-xs bg-red-500/30 text-red-300 px-2 py-0.5 rounded-full">
            {Math.round((alert.vibration_value / alert.threshold - 1) * 100)}% 초과
          </span>
        </div>
      </div>
    </div>
  )
}
