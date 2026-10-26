import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { Section } from '../ui/Section'
import { Hero3CustomDashboard } from './Hero3CustomDashboard'
import { Hero3EvalGroups } from './Hero3EvalGroups'
import { Hero3MypagePreview } from './Hero3MypagePreview'
import { Hero3ScreeningToggle } from './Hero3ScreeningToggle'

type TabId = 'dashboard' | 'mypage' | 'evalGroup'

/** 아이콘은 글자색을 그대로 따라간다(currentColor) — 켜짐/꺼짐용 그림을 따로
 *  두면 색을 바꿀 때마다 두 벌을 같이 손봐야 한다. */
const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  {
    id: 'dashboard',
    label: '커스텀 대시보드',
    // 카드 넉 장 — 대시보드에서 더하고 빼는 것이 그 카드들이다.
    icon: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
      </>
    ),
  },
  {
    id: 'mypage',
    label: '마이페이지 안내',
    // 지원자 한 사람 앞으로 가는 안내 — 이름표.
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <circle cx="9" cy="11" r="2.2" />
        <path d="M5.9 16.3c.6-1.5 1.7-2.3 3.1-2.3s2.5.8 3.1 2.3" />
        <path d="M14.6 10h3.6M14.6 13.6h3.6" />
      </>
    ),
  },
  {
    id: 'evalGroup',
    label: '평가 그룹 설정',
    // 여럿을 묶는 일이라 사람 둘.
    icon: (
      <>
        <circle cx="9" cy="8.6" r="2.8" />
        <path d="M3.9 18.4c.5-2.5 2.6-4.1 5.1-4.1s4.6 1.6 5.1 4.1" />
        <circle cx="16.9" cy="9.6" r="2.1" />
        <path d="M15.4 14.7c2.2-.3 4.1 1.1 4.7 3.5" />
      </>
    ),
  },
]

/**
 * Every tab is its own interactive panel now — see Hero3CustomDashboard,
 * Hero3ScreeningToggle, Hero3MypagePreview and Hero3EvalGroups. This
 * component only owns the tab bar and the per-tab description copy.
 */
const TAB_DESCRIPTIONS: Record<TabId, string> = {
  dashboard:
    '필요한 그래프를 자유롭게 추가·제외하여 활용 목적에 맞는 대시보드를 직접 만들 수 있습니다.\n엑셀 추출도 가능하여 가공하여 공고별, 기간별 맞춤 보고서를 생성하여 업무에 활용할 수 있습니다.',
  mypage:
    '지원자에게 마이페이지를 통해 전형안내, 결과발표, 자료 제출 등을 요청할 수 있습니다.\n개별 연락 없이 한 곳에서 안내가 오가서, 지원자는 자신의 전형 상황을 언제든 확인할 수 있습니다.',
  evalGroup:
    '평가 일정과 평가자별로 그룹을 생성하여 지원자를 해당 그룹에 할당해 관리할 수 있습니다.' +
    '\n지원자 명단에서 바로 배정할 수 있어 인원이 많아도 그룹을 나누는 데 오래 걸리지 않습니다.',
}

export function Hero3Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  /**
   * 탭을 바꿔도 흰 상자 높이가 그대로이게 잡아 두는 값. 기준은 처음 열리는
   * "커스텀 대시보드" 의 높이다 — 탭마다 높이가 들쭉날쭉하면 누를 때마다
   * 아래 내용이 들썩여서, 바뀐 건 그림인데 페이지가 움직인 것처럼 보인다.
   */
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelHeight, setPanelHeight] = useState<number>()

  /** 켜진 칸의 자리와 폭. 글자 길이가 달라 고정값으로는 맞출 수 없다. */
  const navRef = useRef<HTMLElement>(null)
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const measure = () => {
      const el = nav.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`)
      if (el) setThumb({ x: el.offsetLeft - 4, w: el.offsetWidth })
    }
    measure()
    // 글꼴이 늦게 바뀌면 칸 폭도 바뀐다 — 그때 다시 잰다.
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [activeTab])

  useLayoutEffect(() => {
    const el = panelRef.current
    if (activeTab !== 'dashboard' || !el) return
    const measure = () => setPanelHeight(el.scrollHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [activeTab])

  return (
    <Section id="dashboard" className="flex flex-col items-center bg-group-recruit pb-12 pt-6 md:pb-24 md:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex w-full max-w-[1208px] flex-col items-center gap-5"
      >
        {/* "일반/간편 전형" 은 탭에서 빼내 제목 바로 아래에 혼자 세운다 —
            전형을 어떤 꼴로 운영할지 고르는 일은 나머지 셋(대시보드·발송·평가
            그룹)처럼 "운영 중에 쓰는 기능" 이 아니라 그 앞에 오는 결정이라,
            같은 줄에서 고르는 것으로 보이면 위계가 뒤섞인다. */}
        <div className="flex w-full flex-col items-center pb-[72px] md:pb-[100px]">
          <Hero3ScreeningToggle />
        </div>

        {/* 탭 묶음이 무슨 이야기에 딸린 것인지 말해 주는 제목. 위 섹션 제목은
            "일반 / 간편 전형" 을 가리키고 여기부터는 운영 중에 쓰는 기능들이라,
            한 섹션 안에 제목이 둘이다. */}
        <h3 className="pb-8 text-center text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-black md:text-[48px]">
          <span className="block">반복되는 채용업무를</span>
          <span className="block">보다 간결하게</span>
        </h3>

        {/* 알약 꼴 탭. 밑줄 탭은 선 하나로만 현재를 표시해서, 이 블록처럼
            위아래로 내용이 긴 화면에서는 어느 탭이 켜져 있는지 훑어보다
            놓치기 쉬웠다. 켜진 칸이 통째로 칠해지면 멀리서도 걸린다. */}
        <nav ref={navRef} className="relative mx-auto flex w-fit items-center gap-1 rounded-full bg-[#e2ebfd] p-1">
          {/* 켜진 칸은 칠해지는 게 아니라 한 장이 좌우로 미끄러진다. 칸마다
              색을 켜고 끄면 두 칸이 동시에 흐려졌다 진해져 "사라지고 나타난다"
              로 보인다. 칸 폭은 글자에 맡기고 미끄러질 거리를 실측한다 —
              외부 검사 연동 쪽 스위치와 같은 방식이다. */}
          {thumb && (
            <motion.span
              aria-hidden
              initial={false}
              animate={{ x: thumb.x, width: thumb.w }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              className="absolute left-1 top-1 h-[calc(100%-8px)] rounded-full bg-white shadow-[0_1px_3px_rgba(32,40,45,0.16)]"
            />
          )}
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={isActive}
                data-tab={tab.id}
                className={clsx(
                  'relative z-10 flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[18px] font-bold tracking-[-0.09px] transition-colors duration-200',
                  isActive ? 'text-[#3379f3]' : 'text-black/35 hover:bg-[#d2e0fb] hover:text-black/55',
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 shrink-0"
                >
                  {tab.icon}
                </svg>
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* 세로로 늘어나는 사슬: 래퍼(min-height) → 전환 상자 → 패널.
            마지막 [&>*]:flex-1 이 어느 탭의 패널이든 남는 높이를 채우게 한다 —
            이게 없으면 내용이 짧은 탭에서 흰 카드만 쪼그라들어, 탭을 바꿀
            때마다 카드가 줄었다 늘었다 한다. */}
        <div ref={panelRef} className="flex w-full flex-col" style={{ minHeight: panelHeight }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex w-full flex-1 flex-col [&>*]:flex-1"
          >
            {activeTab === 'dashboard' && <Hero3CustomDashboard />}
            {activeTab === 'mypage' && <Hero3MypagePreview />}
            {activeTab === 'evalGroup' && <Hero3EvalGroups />}
          </motion.div>
        </AnimatePresence>
        </div>

        {/* 설명문은 목업 아래에 둔다 — 탭을 누르면 바뀌는 건 그림이고, 글은
            그 그림이 무엇인지 뒤에서 확인해 주는 말이다. 위에 두면 그림이
            나오기 전에 설명부터 읽히는데, 이 블록은 보고 나서 읽는 쪽이다. */}
        <p className="w-full max-w-[1100px] whitespace-pre-line px-8 pt-[30px] text-center text-[20px] font-medium leading-[1.45] tracking-[-0.1px] text-black/55">
          {TAB_DESCRIPTIONS[activeTab]}
        </p>
      </motion.div>
    </Section>
  )
}
