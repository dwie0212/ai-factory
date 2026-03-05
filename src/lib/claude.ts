import type { Alert, Order, InventoryPart, Engineer, ProductionLine } from './supabase'

export interface ContextData {
  alert: Alert
  affectedOrder: Order
  availableLines: ProductionLine[]
  parts: InventoryPart[]
  engineers: Engineer[]
}

export interface Recommendation {
  action: string
  reasoning: string
  priority: number
  estimatedDowntime: number
  riskLevel: 'low' | 'medium' | 'high'
  steps: string[]
}

export async function getAiRecommendation(context: ContextData): Promise<{ recommendations: Recommendation[]; summary: string }> {
  const deadline = new Date(context.affectedOrder.deadline)
  const hoursLeft = Math.round((deadline.getTime() - Date.now()) / 3600000)
  const availableEngineers = context.engineers.filter(e => e.available)
  const relevantParts = context.parts.filter(p => p.equipment_type === 'CNC')
  const spareLine = context.availableLines.find(l => l.id !== context.alert.line_id && l.capacity_used < 70)

  const prompt = `당신은 스마트 제조공장의 AI 운영 최적화 시스템입니다. 다음 상황을 분석하고 최적의 대응 방안을 JSON 형식으로 제시하세요.

## 현재 상황

### 이상 감지 (진동 센서)
- 설비: ${context.alert.equipment_name} (${context.alert.line_id})
- 진동값: ${context.alert.vibration_value} mm/s (임계값: ${context.alert.threshold} mm/s, ${Math.round((context.alert.vibration_value / context.alert.threshold - 1) * 100)}% 초과)
- 심각도: ${context.alert.severity}

### ERP 정보 (주문)
- 고객: ${context.affectedOrder.customer_name}
- 제품: ${context.affectedOrder.product} ${context.affectedOrder.quantity}개
- 납기까지: ${hoursLeft}시간 (내일 오전)
- 지연 페널티: 시간당 ${context.affectedOrder.penalty_per_hour.toLocaleString()}원

### MES 정보 (생산라인)
- ${spareLine ? `${spareLine.name}: 가동 중, 여유 용량 ${100 - spareLine.capacity_used}%` : '인근 라인 여유 없음'}

### WMS 정보 (재고)
- CNC 스핀들 베어링: ${relevantParts[0]?.quantity ?? 0}개 (창고 ${relevantParts[0]?.location ?? '-'})

### HR 정보 (엔지니어)
${availableEngineers.map(e => `- ${e.name}: ${e.specialty}, 교대 종료 ${Math.round((new Date(e.shift_end).getTime() - Date.now()) / 3600000)}시간 후`).join('\n')}

## 요청
위 상황을 종합적으로 판단하여 3가지 대응 방안을 우선순위 순으로 제시하세요.
각 방안은 반드시 ERP/MES/CRM/WMS/HR 정보를 교차 활용한 근거를 포함해야 합니다.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "summary": "상황 요약 2-3문장",
  "recommendations": [
    {
      "action": "대응 방안 제목",
      "reasoning": "ERP/MES/WMS/HR 정보를 연계한 판단 근거 (2-3문장)",
      "priority": 1,
      "estimatedDowntime": 90,
      "riskLevel": "low|medium|high",
      "steps": ["구체적 실행 단계1", "단계2", "단계3", "단계4"]
    }
  ]
}`

  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error('Claude API error:', err)
    // Fallback mock recommendations
    return {
      summary: `CNC 선반 #1에서 진동값 ${context.alert.vibration_value}mm/s 감지 (임계값 ${context.alert.threshold}mm/s 대비 ${Math.round((context.alert.vibration_value / context.alert.threshold - 1) * 100)}% 초과). ${hoursLeft}시간 내 납기가 있는 A고객 주문이 위험 상태입니다. 즉각적인 다중 시스템 연계 대응이 필요합니다.`,
      recommendations: [
        {
          action: '즉시 정비 + B라인 병행 생산 전환',
          reasoning: `WMS상 스핀들 베어링 2개 재고 확보됨. 엔지니어 ${availableEngineers[0]?.name ?? ''}(${availableEngineers[0]?.specialty})를 즉시 투입하여 예상 90분 내 복구. MES 확인 결과 B라인 여유 용량 55%로 병행 생산 가능하여 CRM 납기 리스크를 최소화.`,
          priority: 1,
          estimatedDowntime: 90,
          riskLevel: 'low',
          steps: [
            `${availableEngineers[0]?.name ?? '엔지니어'} 즉시 A라인 CNC 선반 #1 투입 (WH-A-12 베어링 지참)`,
            'B라인에 A라인 작업 물량 50% 즉시 이관 (MES 생산계획 변경)',
            'A고객에게 상황 선제 통보 및 납기 준수 의지 전달 (CRM)',
            'CNC 선반 #1 복구 후 A/B 라인 협업으로 납기 완료',
          ],
        },
        {
          action: '설비 부분 가동 + 속도 제한 운영',
          reasoning: `진동이 임계값을 초과했으나 즉각 파손 위험 수준은 아님. RPM을 70%로 낮춰 안전 범위에서 제한 운영하며 B라인 지원을 병행. 납기 페널티(시간당 85만원) 대비 즉시 정지 손실이 더 클 수 있음.`,
          priority: 2,
          estimatedDowntime: 30,
          riskLevel: 'medium',
          steps: [
            'CNC 선반 #1 RPM 70% 제한 설정 (MES 파라미터 조정)',
            `${availableEngineers[1]?.name ?? '2번 엔지니어'} 상시 모니터링 배치`,
            'B라인 동시 생산 지원 요청',
            '다음 교대 시 즉각 전면 정비 예약',
          ],
        },
        {
          action: '설비 즉시 정지 + 완전 정비',
          reasoning: `추가 손상 시 복구 비용이 납기 페널티를 초과할 수 있음. 두 엔지니어 동시 투입으로 정비 시간을 60분으로 단축 가능. B라인 전면 전환으로 납기는 2-3시간 지연될 수 있으나 설비 안전 확보 우선.`,
          priority: 3,
          estimatedDowntime: 60,
          riskLevel: 'high',
          steps: [
            'CNC 선반 #1 즉시 셧다운 및 안전 잠금',
            `${availableEngineers.map(e => e.name).join(', ')} 동시 투입 긴급 정비`,
            'A고객에 2-3시간 납기 지연 공식 통보 (페널티 협의)',
            'B라인 100% 전환 및 추가 야간 특근 편성',
          ],
        },
      ],
    }
  }
}
