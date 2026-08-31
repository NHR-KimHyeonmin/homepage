import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import chartFlow from '../../assets/sections/hero3-dashboard/chart-application-flow.webp'
import chartCumulative from '../../assets/sections/hero3-dashboard/chart-cumulative-applications.webp'
import chartMajor from '../../assets/sections/hero3-dashboard/chart-major-status.webp'
import chartRegion from '../../assets/sections/hero3-dashboard/chart-school-region.webp'

interface ChartCard {
  id: string
  label: string
  src: string
}

/** Figma node 2348:17516 — grid order matches the sidebar list order. */
const CHARTS: ChartCard[] = [
  { id: 'cumulative', label: '누적 지원 추이', src: chartCumulative },
  { id: 'flow', label: '지원 흐름 현황', src: chartFlow },
  { id: 'region', label: '학교 지역 분포', src: chartRegion },
  { id: 'major', label: '전공(학과) 현황', src: chartMajor },
]

/**
 * Same two strokes as the exported `icon-plus.svg`, drawn inline so the
 * glyph can drop its vertical bar (turning into a minus) and pick up the
 * row's `currentColor` — neither of which an `<img>` can do.
 */
function PlusMinusIcon({ showing }: { showing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 shrink-0">
      <path d="M6 12L18 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {!showing && <path d="M12 6L12 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
    </svg>
  )
}

/**
 * The "커스텀 대시보드" tab of the 전형 운영 section. The four charts always
 * lay out in two columns on the left; each row on the right adds its chart
 * back (+) or takes it out (−).
 */
export function Hero3CustomDashboard() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => setHidden((current) => ({ ...current, [id]: !current[id] }))

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white p-8 shadow-card">
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="relative grid flex-1 grid-cols-2 content-start gap-5">
          {CHARTS.every((chart) => hidden[chart.id]) && (
            <p className="col-span-2 flex min-h-[300px] items-center justify-center text-lg text-[#b8baba]">
              카드를 추가해 보세요.
            </p>
          )}
          <AnimatePresence mode="popLayout" initial={false}>
            {CHARTS.filter((chart) => !hidden[chart.id]).map((chart) => (
              <motion.img
                key={chart.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                src={chart.src}
                alt={`${chart.label} 차트`}
                className="w-full"
              />
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
                className={clsx(
                  'flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-5 py-[13px] transition-colors',
                  showing ? 'border-[#3379f3] bg-[#3379f3]/5 text-[#3379f3]' : 'border-gray-150 text-black',
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
