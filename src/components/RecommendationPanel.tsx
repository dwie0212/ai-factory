import { Brain, ChevronDown, ChevronUp, Clock, Shield, CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { Recommendation } from '../lib/claude'

interface Props {
  recommendations: Recommendation[]
  summary: string
  loading: boolean
  onGenerate: () => void
}

const riskColors = {
  low: 'text-green-400 bg-green-400/10 border-green-400/30',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  high: 'text-red-400 bg-red-400/10 border-red-400/30',
}

const riskLabels = { low: '저위험', medium: '중위험', high: '고위험' }
const priorityColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500']
const priorityLabels = ['1순위', '2순위', '3순위']

export function RecommendationPanel({ recommendations, summary, loading, onGenerate }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <div className="bg-slate-800/60 border border-violet-500/40 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-500/20 rounded-lg">
            <Brain className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">AI 최적 대응 분석</h2>
            <p className="text-xs text-slate-500">Claude Sonnet 4.6 — ERP/MES/CRM/WMS/HR 연계</p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              AI 분석 실행
            </>
          )}
        </button>
      </div>

      {summary && (
        <div className="bg-violet-950/50 border border-violet-500/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
        </div>
      )}

      {recommendations.length === 0 && !loading && (
        <div className="text-center py-10 text-slate-500">
          <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">AI 분석 실행 버튼을 클릭하여<br />최적 대응 방안을 생성하세요.</p>
        </div>
      )}

      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="border border-slate-700 rounded-lg overflow-hidden animate-fade-in"
          >
            <button
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-700/40 transition-colors"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${priorityColors[idx] ?? 'bg-slate-600'}`}>
                {priorityLabels[idx] ?? `${idx + 1}순위`}
              </span>
              <span className="text-sm font-semibold text-white flex-1">{rec.action}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${riskColors[rec.riskLevel]}`}>
                  {riskLabels[rec.riskLevel]}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {rec.estimatedDowntime}분
                </div>
                {expanded === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {expanded === idx && (
              <div className="px-4 pb-4 border-t border-slate-700">
                <div className="flex items-start gap-2 py-3">
                  <Shield className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">{rec.reasoning}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">실행 단계</p>
                  {rec.steps.map((step, si) => (
                    <div key={si} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
