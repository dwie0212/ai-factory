import { useState } from 'react'
import { Factory, Bell, RefreshCw } from 'lucide-react'
import { AlertBanner } from './components/AlertBanner'
import { ContextCards } from './components/ContextCards'
import { RecommendationPanel } from './components/RecommendationPanel'
import { EquipmentGauge } from './components/EquipmentGauge'
import {
  mockAlert,
  mockEquipment,
  mockLines,
  mockOrders,
  mockParts,
  mockEngineers,
} from './lib/mockData'
import { getAiRecommendation, type Recommendation } from './lib/claude'

export default function App() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [tick, setTick] = useState(0)

  const order = mockOrders[0]!
  const alert = mockAlert

  const handleGenerate = async () => {
    setLoading(true)
    setRecommendations([])
    setSummary('')
    try {
      const result = await getAiRecommendation({
        alert,
        affectedOrder: order,
        availableLines: mockLines,
        parts: mockParts,
        engineers: mockEngineers,
      })
      setRecommendations(result.recommendations)
      setSummary(result.summary)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setTick(t => t + 1)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">AI Factory</h1>
              <p className="text-xs text-slate-400">공장 설비 실시간 모니터링 및 최적 대응</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">ALERT ACTIVE</span>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="데이터 새로고침"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </button>
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">1</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Alert Banner */}
        <AlertBanner alert={alert} />

        {/* Status Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-slate-400 mt-0.5">전체 설비</p>
          </div>
          <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-red-400">1</p>
            <p className="text-xs text-slate-400 mt-0.5">위험 설비</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-400">2</p>
            <p className="text-xs text-slate-400 mt-0.5">정상 설비</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Equipment */}
          <div className="lg:col-span-1 space-y-4">
            <EquipmentGauge equipment={mockEquipment} key={tick} />
          </div>

          {/* Right column: Context + AI */}
          <div className="lg:col-span-2 space-y-4">
            {/* Context Cards */}
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                연계 시스템 현황 — ERP / MES / CRM / WMS / HR
              </h2>
              <ContextCards
                order={order}
                lines={mockLines}
                parts={mockParts}
                engineers={mockEngineers}
              />
            </div>

            {/* AI Recommendation */}
            <RecommendationPanel
              recommendations={recommendations}
              summary={summary}
              loading={loading}
              onGenerate={handleGenerate}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 border-t border-slate-800">
          <p className="text-xs text-slate-600">
            AI Factory Demo — ERP · MES · CRM · WMS · HR 통합 실시간 대응 시스템
          </p>
        </div>
      </main>
    </div>
  )
}
