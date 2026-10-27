import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import clsx from 'clsx'
import { CumulativeChart, FlowChart, MajorBars, RegionDonut } from './Hero3DashboardCharts'

interface ChartCard {
  id: string
  label: string
  Chart: () => ReactNode
}

/** Figma node 2348:17516 — grid order matches the sidebar list order. */
const CHARTS: ChartCard[] = [
  { id: 'cumulative', label: '누적 지원 추이', Chart: CumulativeChart },
  { id: 'flow', label: '지원 흐름 현황', Chart: FlowChart },
  { id: 'region', label: '학교 지역 분포', Chart: RegionDonut },
  { id: 'major', label: '전공(학과) 현황', Chart: MajorBars },
]

/**
 * Same two strokes as the exported `icon-plus.svg`, drawn inline so the
 * glyph can drop its vertical bar (turning into a minus) and pick up the
 * row's `currentColor` — neither of which an `<img loading="lazy" decoding="async">` can do.
 */
function PlusMinusIcon({ showing }: { showing: boolean }) {
  const Glyph = showing ? IconMinus : IconPlus
  return <Glyph size={24} stroke={1.6} className="shrink-0" />
}

/**
 * 들어왔을 때 한 번 도는 데모의 박자.
 *   FIRST_DELAY 뒤 첫 줄이 눌리고, 이후 STEP 간격으로 한 줄씩.
 *   PRESS_MS 는 줄이 눌려 있는 시간 — 손을 떼는 순간 카드가 올라온다.
 *
 * 줄이 눌리는 데 0.24초, 카드가 떠오르는 데 0.8초가 걸린다. 한 칸이 다 끝나기
 * 전에 다음 칸이 시작되도록 STEP 을 그 합보다 짧게 둔다 — 겹치지 않게 떼어
 * 놓으면 네 장 까는 데 4초가 넘어가 기다리는 화면이 된다.
 */
const FIRST_DELAY = 700
const STEP = 760
const PRESS_MS = 240

/** 차트 카드의 가로세로 비 — Hero3DashboardCharts 의 viewBox 와 같아야 한다. */
const CHART_ASPECT = 300 / 400
/** 격자 간격(gap-3). */
const GRID_GAP = 12

const ALL_HIDDEN = Object.fromEntries(CHARTS.map((chart) => [chart.id, true]))

/**
 * The "커스텀 대시보드" tab of the 전형 운영 section. The four charts always
 * lay out in two columns on the left; each row on the right adds its chart
 * back (+) or takes it out (−).
 *
 * 섹션에 들어오면 빈 대시보드에서 시작해 네 줄이 하나씩 눌리며 카드가 채워진다.
 * 이 화면의 요지가 "원하는 그래프만 골라 담는다" 인데, 다 채워진 상태로 멈춰
 * 있으면 고를 수 있다는 걸 알 길이 없다.
 *
 * 화면을 벗어나면 빈 상태로 되감고, 다시 들어오면 처음부터 다시 돈다 — 스크롤
 * 중에 지나쳤거나 중간부터 본 사람도 한 번은 제대로 보게 된다.
 *
 * 사람이 직접 줄을 누르면 데모는 그 자리에서 멈춘다 — 손으로 고른 상태를
 * 데모가 되돌리면 고장으로 읽힌다. 그 빗장도 화면을 벗어나면 풀린다.
 */
export function Hero3CustomDashboard() {
  const reduceMotion = useReducedMotion()
  // 움직임을 줄이기로 했거나 이미 한 번 돌았으면 처음부터 다 채워 둔다.
  const [hidden, setHidden] = useState<Record<string, boolean>>(() => (reduceMotion ? {} : ALL_HIDDEN))
  const [pressing, setPressing] = useState<string | null>(null)
  // 네 장이 다 떠 있을 때의 높이. 카드를 빼도 흰 상자가 이만큼은 유지해,
  // 한 장 뺄 때마다 상자가 접혔다 펴지며 아래 내용이 들썩이지 않게 한다.
  const [fullHeight, setFullHeight] = useState<number>()
  const gridRef = useRef<HTMLDivElement>(null)
  const [takenOver, setTakenOver] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })

  // 화면을 벗어나면 빈 상태로 되감는다 — 되감기를 정리 함수에 두는 이유는,
  // 사람이 줄을 누른 순간(takenOver)에는 돌아서는 안 되기 때문이다. 이 효과는
  // inView 만 보므로 손으로 고른 상태를 건드리지 않는다.
  useEffect(() => {
    if (!inView || reduceMotion) return
    return () => {
      setHidden(ALL_HIDDEN)
      setPressing(null)
      setTakenOver(false)
    }
  }, [inView, reduceMotion])

  useEffect(() => {
    if (!inView || reduceMotion || takenOver) return

    const timers = CHARTS.flatMap((chart, i) => {
      const at = FIRST_DELAY + i * STEP
      return [
        window.setTimeout(() => setPressing(chart.id), at),
        window.setTimeout(() => {
          setPressing(null)
          setHidden((current) => ({ ...current, [chart.id]: false }))
        }, at + PRESS_MS),
      ]
    })

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [inView, reduceMotion, takenOver])

  /**
   * 네 장이 다 떠 있을 때의 높이를 **폭에서 계산한다.**
   *
   * 전에는 네 장이 실제로 다 떠 있는 순간의 scrollHeight 를 쟀는데, 처음
   * 들어올 때는 빈 상태에서 시작하므로 그 순간이 데모가 끝난 뒤에야 온다 —
   * 그래서 첫 회차만 상자가 작게 시작해 카드가 들어올 때마다 늘어났다.
   *
   * 차트 카드는 SVG viewBox(400x300) 비율 그대로 폭을 따라가므로, 폭만
   * 알면 높이는 바로 나온다: 두 줄 × (칸 폭 × 0.75) + 줄 사이 + 테두리.
   *
   * useLayoutEffect 인 이유는 그려진 다음이 아니라 그리기 전에 높이를 정해야
   * 하기 때문이다. useEffect 로 두면 첫 프레임만 빈 상자 높이로 한 번 깜빡인다.
   */
  useLayoutEffect(() => {
    const el = gridRef.current
    if (!el) return
    const measure = () => {
      const column = (el.clientWidth - GRID_GAP) / 2
      setFullHeight(Math.round(column * CHART_ASPECT * 2 + GRID_GAP + 4))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toggle = (id: string) => {
    setTakenOver(true)
    setPressing(null)
    setHidden((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <div ref={ref} className="w-full overflow-hidden rounded-card bg-white p-8 shadow-card">
      <div className="flex flex-col gap-5 md:flex-row">
        <div
          ref={gridRef}
          className="relative grid flex-1 grid-cols-2 content-start gap-3"
          style={{ minHeight: fullHeight }}
        >
          {CHARTS.every((chart) => hidden[chart.id]) && (
            <p
              className="col-span-2 flex min-h-[300px] items-center justify-center text-lg text-[#b8baba]"
              style={{ minHeight: fullHeight }}
            >
              카드를 추가해 보세요.
            </p>
          )}
          <AnimatePresence mode="popLayout" initial={false}>
            {CHARTS.filter((chart) => !hidden[chart.id]).map((chart) => (
              <motion.div
                key={chart.id}
                layout
                /* 톡 튀어나오는 대신 아래에서 천천히 떠오르게 — 시간을 넉넉히
                   주고(0.28 → 0.8초) 뒤로 갈수록 느려지는 곡선을 쓴다. 자리를
                   옮기는 layout 애니메이션도 같이 늘려, 카드가 들어오며 격자가
                   다시 짜일 때 덜컥거리지 않게 한다. */
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  layout: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                }}
                className="w-full"
              >
                <chart.Chart />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-[293px]">
          {CHARTS.map((chart) => {
            const showing = !hidden[chart.id]
            return (
              <button
                key={chart.id}
                type="button"
                onClick={() => toggle(chart.id)}
                aria-pressed={showing}
                aria-label={`${chart.label} ${showing ? '제외' : '추가'}`}
                /* 테두리만 있던 걸 면으로 채웠다. 네 줄이 늘 같은 자리에 서
                   있고 바뀌는 건 담겼는지 아닌지뿐이라, 담긴 줄이 통째로
                   칠해져야 옆 차트를 보다가도 어느 게 올라와 있는지 바로
                   걸린다. 다만 꽉 찬 파랑으로 칠하니 네 줄이 한꺼번에 무거워
                   져서, 같은 파랑을 아주 옅게 깔고 글자만 파랑으로 남겼다 —
                   담겼다는 건 그대로 읽히면서 옆 차트보다 앞에 나서지 않는다. */
                className={clsx(
                  'flex cursor-pointer items-center justify-between gap-2 rounded-ui px-5 py-[13px] transition-all duration-200 ease-out',
                  showing
                    ? 'bg-[#e4ecfd] text-[#1d4ed8] hover:bg-[#d6e3fc]'
                    : 'bg-[#f1f3f5] text-[#6c737f] hover:bg-[#e4e8ec] hover:text-ink',
                  // 데모가 이 줄을 누르고 있는 동안. 사람 손가락이 닿은 것처럼
                  // 살짝 눌리고 색이 먼저 들어온다 — 손을 떼면 카드가 올라온다.
                  pressing === chart.id && 'scale-[0.97] bg-[#e4ecfd] text-[#1d4ed8]',
                )}
              >
                <span className="text-sm font-semibold tracking-[-0.07px]">{chart.label}</span>
                <PlusMinusIcon showing={showing} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
