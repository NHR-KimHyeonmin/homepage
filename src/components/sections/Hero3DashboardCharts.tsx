import type { ReactNode } from 'react'

/**
 * 커스텀 대시보드 카드 안에 들어가는 그래프 넉 장.
 *
 * 전에는 820x590 스크린샷 네 장이었다. 카드 폭이 400px 안팎이라 늘 줄여
 * 그렸는데, 고해상도 화면에서는 원본 픽셀이 모자라 글자가 뭉개졌다. 같은
 * 그림을 SVG 로 다시 그려 어느 배율에서도 선명하고, viewBox 로 카드 폭을
 * 그대로 따라간다.
 *
 * 색은 제품 화면에서 가져오되 두 군데를 고쳤다. 임시저장 막대가 원본에서
 * #a8c6f7 이었는데 흰 바탕 대비가 1.69 라 거의 보이지 않았다 — 같은 파랑
 * 계열에서 한 단계 내려 #60a5fa 로 두고, 최종제출을 #1d4ed8 로 받쳤다.
 * 두 색의 구분 정도(ΔE)는 일반 시야 23.9 / 색각이상 20.5 로, 색만으로도
 * 갈리고 범례가 한 번 더 받쳐 준다.
 *
 * 마우스를 올렸을 때 뜨는 말풍선은 넣지 않았다. 이 그래프는 읽는 자료가
 * 아니라 "이런 대시보드를 만들 수 있다" 를 보여 주는 제품 그림이고, 카드가
 * 하나씩 깔리는 연출이 이미 돌고 있다.
 */
const W = 400
const H = 300

/** 가로축 눈금 자리. 왼쪽 축 글자와 범례 자리를 뺀 그림 영역. */
const PLOT_LEFT = 50
const PLOT_RIGHT = 384
const PLOT_TOP = 62
const BASELINE = 236

const INK = '#212121'
const MUTED = '#9aa3af'
const GRID = '#f1f3f5'
const DIVIDER = '#eef0f3'

/** 최종제출 / 임시저장 / 누적제출 */
const FINAL = '#1d4ed8'
const DRAFT = '#60a5fa'
const CUMULATIVE = '#10b981'
/** 면을 채우는 연두는 흰 바탕 대비가 2.5 라 선까지 같은 색이면 윤곽이
 *  흐려진다. 선만 한 단계 진하게 쓴다. */
const CUMULATIVE_LINE = '#0ea371'

/** 앞의 이틀(06.29·06.30)은 뺐다. 열다섯 칸을 다 세우면 막대가 빽빽해지고
 *  마지막 날이 카드 오른쪽 끝에 닿아 잘린 것처럼 보였다. */
const DAYS = [
  '07.01(수)', '07.02(목)', '07.03(금)', '07.04(토)', '07.05(일)',
  '07.06(월)', '07.07(화)', '07.08(수)', '07.09(목)', '07.10(금)',
  '07.11(토)', '07.12(일)', '07.13(월)',
]

const FINAL_COUNTS = [6, 11, 10, 8, 24, 17, 29, 25, 38, 27, 33, 85, 404]
const DRAFT_COUNTS = [4, 7, 8, 6, 12, 15, 25, 18, 28, 9, 5, 15, 22]
/** 누적제출은 최종제출을 쌓은 값이다 — 따로 적어 두면 둘이 어긋날 수 있다. */
const CUMULATIVE_COUNTS = FINAL_COUNTS.reduce<number[]>(
  (acc, value) => [...acc, (acc[acc.length - 1] ?? 0) + value],
  [],
)

/** 마지막 날이 그림 오른쪽 끝에 붙지 않도록 남겨 두는 여백. */
const RIGHT_GUTTER = 18
const STEP = (PLOT_RIGHT - PLOT_LEFT - 8 - RIGHT_GUTTER) / (DAYS.length - 1)
const xAt = (index: number) => PLOT_LEFT + 4 + index * STEP

function ChartFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#eef0f3] bg-white shadow-[0_1px_6px_rgba(32,40,45,0.05)]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full font-sans" role="img" aria-label={title}>
        <text x={20} y={27} fontSize={13.5} fontWeight={700} fill={INK}>
          {title}
        </text>
        <line x1={20} y1={44} x2={W - 20} y2={44} stroke={DIVIDER} strokeWidth={1} />
        {children}
      </svg>
    </div>
  )
}

/** 세로 눈금 + 가로 보조선. 선은 읽는 대상이 아니라 바탕이라 아주 연하게. */
function YAxis({ max, ticks }: { max: number; ticks: number[] }) {
  return (
    <g>
      {ticks.map((tick) => {
        const y = BASELINE - (tick / max) * (BASELINE - PLOT_TOP)
        return (
          <g key={tick}>
            <line x1={PLOT_LEFT} y1={y} x2={PLOT_RIGHT} y2={y} stroke={GRID} strokeWidth={1} />
            <text x={PLOT_LEFT - 8} y={y + 3.5} fontSize={9} fill={MUTED} textAnchor="end">
              {tick}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/** 날짜는 가로로 늘어놓으면 겹쳐서 45도 눕힌다. */
function XAxis() {
  return (
    <g>
      {DAYS.map((day, i) => (
        <text
          key={day}
          x={xAt(i)}
          y={BASELINE + 10}
          fontSize={8}
          fill={MUTED}
          textAnchor="end"
          transform={`rotate(-45 ${xAt(i)} ${BASELINE + 10})`}
        >
          {day}
        </text>
      ))}
    </g>
  )
}

function Legend({ items }: { items: { color: string; label: string }[] }) {
  // 가운데 정렬. 글자 폭을 재지 않고 한 글자 5.4px 로 어림해 폭을 잡는다.
  const widths = items.map((item) => 9 + item.label.length * 5.4)
  const total = widths.reduce((sum, width) => sum + width, 0) + (items.length - 1) * 14
  const start = W / 2 - total / 2
  const offsets = widths.map((_, i) => widths.slice(0, i).reduce((sum, width) => sum + width + 14, start))

  return (
    <g>
      {items.map((item, i) => (
        <g key={item.label}>
          <circle cx={offsets[i] + 3} cy={286} r={3.2} fill={item.color} />
          <text x={offsets[i] + 10} y={289} fontSize={9} fill="#5a6372">
            {item.label}
          </text>
        </g>
      ))}
    </g>
  )
}

export function CumulativeChart() {
  const max = 800
  const yAt = (value: number) => BASELINE - (value / max) * (BASELINE - PLOT_TOP)
  const line = CUMULATIVE_COUNTS.map((value, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)} ${yAt(value)}`).join(' ')

  return (
    <ChartFrame title="누적 지원 추이">
      <defs>
        <linearGradient id="cumulative-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CUMULATIVE} stopOpacity={0.45} />
          <stop offset="100%" stopColor={CUMULATIVE} stopOpacity={0.04} />
        </linearGradient>
      </defs>
      <YAxis max={max} ticks={[0, 200, 400, 600, 800]} />

      {/* 누적 면이 먼저, 그 위에 막대 — 막대가 면에 묻히지 않는다. */}
      <path
        d={`${line} L${xAt(DAYS.length - 1)} ${BASELINE} L${xAt(0)} ${BASELINE} Z`}
        fill="url(#cumulative-fill)"
      />
      <path d={line} fill="none" stroke={CUMULATIVE_LINE} strokeWidth={1.8} strokeLinejoin="round" />

      {FINAL_COUNTS.map((value, i) => {
        const height = Math.max(1.5, (value / max) * (BASELINE - PLOT_TOP))
        return (
          <rect key={DAYS[i]} x={xAt(i) - 3} y={BASELINE - height} width={6} height={height} rx={2} fill={FINAL} />
        )
      })}

      <line x1={PLOT_LEFT} y1={BASELINE} x2={PLOT_RIGHT} y2={BASELINE} stroke="#e5e7eb" strokeWidth={1} />
      <XAxis />
      <Legend items={[{ color: FINAL, label: '최종제출' }, { color: CUMULATIVE, label: '누적제출' }]} />
    </ChartFrame>
  )
}

export function FlowChart() {
  const max = 500
  const barW = 5
  const gap = 2

  return (
    <ChartFrame title="지원 흐름 현황">
      <YAxis max={max} ticks={[0, 100, 200, 300, 400, 500]} />

      {DAYS.map((day, i) => {
        const left = xAt(i) - (barW * 2 + gap) / 2
        return (
          <g key={day}>
            {[
              { value: DRAFT_COUNTS[i], color: DRAFT, x: left },
              { value: FINAL_COUNTS[i], color: FINAL, x: left + barW + gap },
            ].map((bar) => {
              const height = Math.max(1.5, (bar.value / max) * (BASELINE - PLOT_TOP))
              return (
                <rect
                  key={bar.color}
                  x={bar.x}
                  y={BASELINE - height}
                  width={barW}
                  height={height}
                  rx={2}
                  fill={bar.color}
                />
              )
            })}
          </g>
        )
      })}

      <line x1={PLOT_LEFT} y1={BASELINE} x2={PLOT_RIGHT} y2={BASELINE} stroke="#e5e7eb" strokeWidth={1} />
      <XAxis />
      <Legend items={[{ color: DRAFT, label: '임시저장' }, { color: FINAL, label: '최종제출' }]} />
    </ChartFrame>
  )
}

/** 지역은 많은 쪽에서 적은 쪽으로 내려간다 — 크기를 나타내는 색이므로
 *  색상은 하나로 두고 밝기만 단계적으로 올린다(진한 쪽이 큰 값). */
const REGIONS = [
  { label: '서울', percent: 21.0 },
  { label: '부산', percent: 19.1 },
  { label: '대구', percent: 10.6 },
  { label: '경기', percent: 10.2 },
  { label: '경북', percent: 8.8 },
  { label: '대전', percent: 6.9 },
  { label: '경남', percent: 5.4 },
  { label: '충남', percent: 4.2 },
  { label: '인천', percent: 2.7 },
  { label: '해외', percent: 2.3 },
  { label: '그 외 8개', percent: 8.8 },
]

const regionColor = (index: number) => `hsl(221 83% ${48 + index * 4}%)`

export function RegionDonut() {
  const cx = 132
  const cy = 170
  const outer = 68
  const inner = 43
  const slices = REGIONS.map((region, index) => {
    const sweep = (region.percent / 100) * Math.PI * 2
    // 앞선 조각들을 합한 자리에서 시작한다 — 누적 변수를 돌리는 것보다
    // 조각 하나하나가 자기 위치를 스스로 결정해 순서에 덜 민감하다.
    const start =
      -Math.PI / 2 +
      REGIONS.slice(0, index).reduce((sum, previous) => sum + (previous.percent / 100) * Math.PI * 2, 0)
    const end = start + sweep
    const point = (radius: number, at: number) => `${cx + radius * Math.cos(at)} ${cy + radius * Math.sin(at)}`
    const large = sweep > Math.PI ? 1 : 0
    return {
      ...region,
      color: regionColor(index),
      mid: start + sweep / 2,
      d: [
        `M${point(outer, start)}`,
        `A${outer} ${outer} 0 ${large} 1 ${point(outer, end)}`,
        `L${point(inner, end)}`,
        `A${inner} ${inner} 0 ${large} 0 ${point(inner, start)}`,
        'Z',
      ].join(' '),
    }
  })

  return (
    <ChartFrame title="학교 지역 분포">
      {slices.map((slice) => (
        /* 조각 사이를 흰 선으로 끊어 붙은 두 조각이 한 덩어리로 안 보이게 한다. */
        <path key={slice.label} d={slice.d} fill={slice.color} stroke="#fff" strokeWidth={1.5} />
      ))}

      {/* 10% 아래 조각은 숫자를 띄우지 않는다. 조각이 얇아질수록 글자가
          고리 밖으로 삐져나오거나 옆 조각 숫자와 붙어서, 읽으라고 띄운
          숫자가 오히려 고리 모양을 어지럽힌다 — 범례가 대신 읽어 준다. */}
      {slices
        .filter((slice) => slice.percent > 10)
        .map((slice) => (
          <text
            key={slice.label}
            x={cx + 55.5 * Math.cos(slice.mid)}
            y={cy + 55.5 * Math.sin(slice.mid) + 3}
            fontSize={8.5}
            fontWeight={700}
            fill="#fff"
            textAnchor="middle"
          >
            {slice.percent.toFixed(1)}%
          </text>
        ))}

      {/* 두 줄을 한 덩어리로 보고 고리 안쪽 한가운데에 맞춘다 — "889" 가
          커서 아래로 쏠려 보이던 것을 5 올려 바로잡았다. */}
      <text x={cx} y={cy - 11} fontSize={9} fill={MUTED} textAnchor="middle">
        전체
      </text>
      <text x={cx} y={cy + 11} fontSize={21} fontWeight={700} fill={INK} textAnchor="middle">
        30
      </text>

      {REGIONS.map((region, index) => (
        <g key={region.label}>
          <circle cx={248} cy={69 + index * 17.5} r={3.6} fill={regionColor(index)} />
          <text x={258} y={72.5 + index * 17.5} fontSize={9.5} fill="#5a6372">
            {region.label}
          </text>
        </g>
      ))}
    </ChartFrame>
  )
}

const MAJORS = [
  { label: '기계공학과', count: 33 },
  { label: '화학공학과', count: 27 },
  { label: '전자공학과', count: 26 },
  { label: '전기공학과', count: 17 },
  { label: '신소재공학과', count: 16 },
  { label: '학부 기계공학전공', count: 13 },
  { label: '산업경영공학과', count: 12 },
  { label: '전자공학부', count: 10 },
  { label: '컴퓨터공학과', count: 10 },
  { label: '기계공학부', count: 9 },
]

export function MajorBars() {
  const labelRight = 118
  const barLeft = 126
  const barMax = W - 24 - barLeft
  const max = MAJORS[0].count
  const rowHeight = 21
  const barHeight = 14

  return (
    <ChartFrame title="전공(학과) 현황">
      {MAJORS.map((major, index) => {
        const y = 62 + index * rowHeight
        const width = (major.count / max) * barMax
        return (
          <g key={major.label}>
            <text x={labelRight} y={y + barHeight / 2 + 3} fontSize={8.5} fill="#5a6372" textAnchor="end">
              {major.label}
            </text>
            <rect x={barLeft} y={y} width={width} height={barHeight} rx={4} fill={FINAL} />
            {/* 값은 막대 안에 — 한 계열뿐이라 범례 없이 값만 직접 붙인다. */}
            <text
              x={barLeft + width / 2}
              y={y + barHeight / 2 + 3}
              fontSize={8.5}
              fontWeight={700}
              fill="#fff"
              textAnchor="middle"
            >
              {major.count}
            </text>
          </g>
        )
      })}
    </ChartFrame>
  )
}
