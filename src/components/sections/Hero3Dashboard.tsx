import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import chartCumulative from '../../assets/sections/hero3-dashboard/chart-cumulative-applications.png'
import chartFlow from '../../assets/sections/hero3-dashboard/chart-application-flow.png'
import chartRegion from '../../assets/sections/hero3-dashboard/chart-school-region.png'
import chartMajor from '../../assets/sections/hero3-dashboard/chart-major-status.png'
import iconClose from '../../assets/sections/hero3-dashboard/icon-close.svg'
import iconPlus from '../../assets/sections/hero3-dashboard/icon-plus.svg'
import iconPlusActive from '../../assets/sections/hero3-dashboard/icon-plus-active.svg'
import tabEvalGroup from '../../assets/sections/hero3-tabs/tab-eval-group.webp'
import tabGeneral from '../../assets/sections/hero3-tabs/tab-general.webp'
import tabMypage from '../../assets/sections/hero3-tabs/tab-mypage.webp'
import { Section } from '../ui/Section'

type TabId = 'dashboard' | 'general' | 'mypage' | 'evalGroup'

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: '커스텀 대시보드' },
  { id: 'general', label: '일반/간편 전형' },
  { id: 'mypage', label: '마이페이지 발송' },
  { id: 'evalGroup', label: '평가 그룹 설정' },
]

/**
 * "커스텀 대시보드" keeps its original real-DOM panel (chart grid + sidebar
 * list). The other three tabs are flattened admin-mockup screenshots — same
 * pattern used elsewhere in this codebase for deeply-nested panels — each
 * paired with the description copy given for that tab.
 *
 * NOTE: these three mockups (일반/간편전형 토글, 마이페이지 발송 안내, 평가
 * 그룹 설정) contain their own internal interactive affordances that will
 * get dedicated interaction specs later — for now they render as static
 * reference images.
 */
const TAB_DESCRIPTIONS: Record<TabId, string> = {
  dashboard:
    '필요한 그래프를 자유롭게 추가·제외하여 활용 목적에 맞는 대시보드를 직접 만들 수 있습니다.\n공고별, 기간별 보고서를 생성하여 업무에 활용할 수 있어요.엑셀 추출도 가능하여 가공하여 활용하실 수 있습니다.',
  general: '채용 인원에 따라 알맞는 전형 유형을 선택하여 채용을 운영할 수 있습니다.',
  mypage: '채용 인원에 따라 알맞는 전형 유형을 선택하여 채용을 운영할 수 있습니다.',
  evalGroup: '채용 인원에 따라 알맞는 전형 유형을 선택하여 채용을 운영할 수 있습니다.',
}

const TAB_IMAGES: Partial<Record<TabId, { src: string; alt: string }>> = {
  general: { src: tabGeneral, alt: '일반 전형과 간편 전형을 전환하는 미리보기 화면' },
  mypage: { src: tabMypage, alt: '지원자 마이페이지로 안내 메시지를 발송하는 미리보기 화면' },
  evalGroup: { src: tabEvalGroup, alt: '면접 평가 그룹을 생성하고 관리하는 미리보기 화면' },
}

const CHARTS = [
  { src: chartCumulative, alt: '누적 지원 추이 차트' },
  { src: chartFlow, alt: '지원 흐름 현황 차트' },
  { src: chartRegion, alt: '학교 지역 분포 차트' },
  { src: chartMajor, alt: '전공(학과) 현황 차트' },
]

const DASHBOARD_ITEMS = [
  { label: '누적 지원 추이', active: false },
  { label: '지원 흐름 현황', active: true },
  { label: '학교 지역 분포', active: false },
  { label: '전공(학과) 현황', active: false },
]

export function Hero3Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  return (
    <Section id="dashboard" className="flex flex-col items-center bg-[#f4f8ff] px-6 py-20 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex w-full max-w-[1208px] flex-col items-center gap-5"
      >
        <nav className="flex flex-wrap items-center justify-center gap-4 rounded-t-2xl border-b border-[#3379f3]/20 backdrop-blur-[35px]">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={isActive}
                className={clsx(
                  'flex cursor-pointer items-center justify-center whitespace-nowrap border-b-[3px] px-4 py-2 text-[22px] font-bold tracking-[-0.11px] transition-colors',
                  isActive ? 'border-[#3379f3] text-[#3379f3]' : 'border-transparent text-black/30 hover:text-black/50',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        <p className="w-full whitespace-pre-line px-8 pb-[40px] pt-[30px] text-center text-xl font-medium tracking-[-0.1px] text-black/55">
          {TAB_DESCRIPTIONS[activeTab]}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full overflow-hidden rounded-2xl bg-white p-8 shadow-card"
            >
              <div className="flex flex-col gap-5 md:flex-row">
                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                  {CHARTS.map((chart) => (
                    <div
                      key={chart.alt}
                      className="relative overflow-hidden rounded-lg border border-gray-150 bg-white"
                      style={{ aspectRatio: '380 / 300' }}
                    >
                      <img src={chart.src} alt={chart.alt} className="size-full object-cover" />
                      <button
                        type="button"
                        aria-label="차트 제거"
                        className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-black shadow-[0_2px_10px_0_rgba(0,0,0,0.08)]"
                      >
                        <img src={iconClose} alt="" className="size-3.5 -rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex w-full flex-col gap-2 md:w-[293px]">
                  {DASHBOARD_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className={clsx(
                        'flex items-center justify-between gap-2 rounded-lg border px-5 py-[13px]',
                        item.active ? 'border-[#3379f3] bg-[#3379f3]/5' : 'border-gray-150',
                      )}
                    >
                      <span
                        className={clsx(
                          'text-sm font-semibold tracking-[-0.07px]',
                          item.active ? 'text-[#3379f3]' : 'text-black',
                        )}
                      >
                        {item.label}
                      </span>
                      <img src={item.active ? iconPlusActive : iconPlus} alt="" className="size-6 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.img
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              src={TAB_IMAGES[activeTab]?.src}
              alt={TAB_IMAGES[activeTab]?.alt}
              className="w-full overflow-hidden rounded-2xl"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
