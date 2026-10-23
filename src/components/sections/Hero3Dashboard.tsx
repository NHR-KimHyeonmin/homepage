import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { Section } from '../ui/Section'
import { Hero3CustomDashboard } from './Hero3CustomDashboard'
import { Hero3EvalGroups } from './Hero3EvalGroups'
import { Hero3MypagePreview } from './Hero3MypagePreview'
import { Hero3ScreeningToggle } from './Hero3ScreeningToggle'

type TabId = 'dashboard' | 'general' | 'mypage' | 'evalGroup'

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: '커스텀 대시보드' },
  { id: 'general', label: '일반/간편 전형' },
  { id: 'mypage', label: '마이페이지 발송' },
  { id: 'evalGroup', label: '평가 그룹 설정' },
]

/**
 * Every tab is its own interactive panel now — see Hero3CustomDashboard,
 * Hero3ScreeningToggle, Hero3MypagePreview and Hero3EvalGroups. This
 * component only owns the tab bar and the per-tab description copy.
 */
const TAB_DESCRIPTIONS: Record<TabId, string> = {
  dashboard:
    '필요한 그래프를 자유롭게 추가·제외하여 활용 목적에 맞는 대시보드를 직접 만들 수 있습니다.\n공고별, 기간별 보고서를 생성하여 업무에 활용할 수 있어요.엑셀 추출도 가능하여 가공하여 활용하실 수 있습니다.',
  general: '채용 인원에 따라 알맞는 전형 유형을 선택하여 채용을 운영할 수 있습니다.',
  mypage: '채용 인원에 따라 알맞는 전형 유형을 선택하여 채용을 운영할 수 있습니다.',
  evalGroup: '채용 인원에 따라 알맞는 전형 유형을 선택하여 채용을 운영할 수 있습니다.',
}

export function Hero3Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  return (
    <Section id="dashboard" className="flex flex-col items-center bg-[#f4f8ff] pb-12 pt-6 md:pb-24 md:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex w-full max-w-[1208px] flex-col items-center gap-5"
      >
        <nav className="flex flex-wrap items-center justify-center gap-4 rounded-t-card border-b border-[#3379f3]/20 backdrop-blur-[35px]">
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
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full"
          >
            {activeTab === 'dashboard' && <Hero3CustomDashboard />}
            {activeTab === 'general' && <Hero3ScreeningToggle />}
            {activeTab === 'mypage' && <Hero3MypagePreview />}
            {activeTab === 'evalGroup' && <Hero3EvalGroups />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
