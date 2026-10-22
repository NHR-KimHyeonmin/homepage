import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import iconDocTabActive from '../../assets/sections/hero00/icon-doc-tab.svg'
import iconDocTabInactive from '../../assets/sections/hero00/icon-doc-tab-inactive.svg'
import iconInterviewTabActive from '../../assets/sections/hero00/icon-interview-tab-active.svg'
import iconInterviewTabInactive from '../../assets/sections/hero00/icon-interview-tab.svg'
import iconReferenceTabActive from '../../assets/sections/hero00/icon-reference-tab-active.svg'
import iconReferenceTabInactive from '../../assets/sections/hero00/icon-reference-tab.svg'
import logoCareern from '../../assets/sections/hero00/logo-careern.png'
import logoMonster from '../../assets/sections/hero00/logo-monster.png'
import logoPrism from '../../assets/sections/hero00/logo-prism.png'
import logoSpector from '../../assets/sections/hero00/logo-spector.png'
import logoViewinter from '../../assets/sections/hero00/logo-viewinter.png'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

type ScreeningTab = 'doc' | 'interview' | 'reference'

const NAV_TABS: { id: ScreeningTab; label: string; iconActive: string; iconInactive: string }[] = [
  { id: 'doc', label: 'AI 서류 검토', iconActive: iconDocTabActive, iconInactive: iconDocTabInactive },
  { id: 'interview', label: 'AI 면접 / 인적성 검사', iconActive: iconInterviewTabActive, iconInactive: iconInterviewTabInactive },
  { id: 'reference', label: '레퍼런스 검토', iconActive: iconReferenceTabActive, iconInactive: iconReferenceTabInactive },
]

interface PartnerCard {
  logo: string
  org: string
  name: string
  description: string
  /** Which nav tab lights this card up at full opacity when selected. */
  group: ScreeningTab
}

const CARDS: PartnerCard[] = [
  {
    logo: logoPrism,
    org: '무하유',
    name: '프리즘',
    description:
      '프리즘은 생성형 AI 자소서 탐지는 물론, 직무 적합성 등 사람이 판단하기 어려운 요소를 AI가 정밀하게 분석하여 결과를 제공합니다. 이제 지원자의 본질적인 역량에 집중하세요.',
    group: 'doc',
  },
  {
    logo: logoViewinter,
    org: '제네시스랩',
    name: '뷰인터 HR',
    description:
      'Interactive AI 기술을 기반으로 보다 정확한 인재를 공정하게 선발할 수 있도록 도움을 드리는 AI면접 솔루션입니다.',
    group: 'interview',
  },
  {
    logo: logoMonster,
    org: '무하유',
    name: '몬스터',
    description:
      '몬스터는 AI면접 답변 내용과 역량검사 결과를 기반으로 서류에서 알 수 없는 진짜 역량을 검증하고 오피스빌런 리스크까지 예측하여 채용 효율과 정확성을 극대화합니다.',
    group: 'interview',
  },
  {
    logo: logoCareern,
    org: 'NHR',
    name: '커리어앤',
    description:
      '기업이 보다 직무에 FIT한 역량, 조직에 FIT한 가치관을 가진 인재를 확보할 수 있도록 돕는 성격 진단 솔루션입니다.',
    group: 'interview',
  },
  {
    logo: logoSpector,
    org: 'Spector',
    name: '스펙터',
    description:
      '기업, 지원자, 평판 작성자를 연결하는 인재검증(평판조회) 플랫폼입니다. 인재 검증 시간을 단축 시켜주며 채용에 대한 리스크를 감소시켜줍니다.',
    group: 'reference',
  },
]

const CARD_WIDTH = 300

export function Hero00Screening() {
  const [activeTab, setActiveTab] = useState<ScreeningTab>('doc')
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  // Empty leading/trailing space so even the first/last card group (프리즘,
  // 스펙터) has enough room to reach true center — without it, centering
  // clamps at the scroll edges and those two groups can only ever slide as
  // far as the edge, not all the way to center.
  const [spacerWidth, setSpacerWidth] = useState(0)

  const centerGroup = (tab: ScreeningTab, behavior: ScrollBehavior) => {
    const container = scrollRef.current
    const indices = CARDS.reduce<number[]>((acc, card, i) => (card.group === tab ? [...acc, i] : acc), [])
    const firstEl = cardRefs.current[indices[0]]
    const lastEl = cardRefs.current[indices[indices.length - 1]]
    if (!container || !firstEl || !lastEl) return

    // Scroll so the active card group's midpoint lands on the scroll
    // container's own center, however many cards are in the group.
    const containerRect = container.getBoundingClientRect()
    const firstRect = firstEl.getBoundingClientRect()
    const lastRect = lastEl.getBoundingClientRect()
    const groupCenterX = (firstRect.left + firstRect.width / 2 + lastRect.left + lastRect.width / 2) / 2
    const containerCenterX = containerRect.left + containerRect.width / 2
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    const target = container.scrollLeft + (groupCenterX - containerCenterX)

    container.scrollTo({ left: Math.max(0, Math.min(target, maxScrollLeft)), behavior })
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const updateSpacer = () => setSpacerWidth(Math.max(0, container.clientWidth / 2 - CARD_WIDTH / 2))
    updateSpacer()
    const observer = new ResizeObserver(updateSpacer)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Snap the initial tab's group to center once the spacers have their
    // real size — no animated scroll on first paint, just settle in place.
    centerGroup(activeTab, 'auto')
    // Only re-run when the spacer size (re)settles, not on every tab switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spacerWidth])

  const selectTab = (tab: ScreeningTab) => {
    setActiveTab(tab)
    centerGroup(tab, 'smooth')
  }

  return (
    <Section className="flex flex-col items-center gap-10 bg-[#f4f8ff] pb-12 pt-6 md:pb-24 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full"
      >
        <Container>
          <nav className="flex flex-wrap items-center justify-center gap-4 rounded-t-card border-b border-[#3379f3]/20 backdrop-blur-[35px]">
            {NAV_TABS.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  aria-pressed={isActive}
                  className={clsx(
                    'flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap border-b-[3px] px-4 py-2 text-[22px] font-bold tracking-[-0.11px] transition-colors',
                    isActive ? 'border-[#3379f3] text-[#3379f3]' : 'border-transparent text-black/30 hover:text-black/50',
                  )}
                >
                  <img loading="lazy" decoding="async" src={isActive ? tab.iconActive : tab.iconInactive} alt="" className="size-7 shrink-0" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </Container>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        className="w-full"
      >
        <Container
          ref={scrollRef}
          maxWidth={1592}
          className="overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-stretch gap-5">
            <div aria-hidden className="shrink-0" style={{ width: spacerWidth }} />
            {CARDS.map((card, index) => (
              <div
                key={card.name}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                className={clsx(
                  'flex h-[400px] shrink-0 flex-col gap-4 overflow-hidden rounded-card bg-white p-7 shadow-[0px_4px_10px_0px_rgba(0,66,183,0.04)] transition-opacity duration-300',
                  card.group === activeTab ? 'opacity-100' : 'opacity-30',
                )}
                style={{ width: CARD_WIDTH }}
              >
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-ui border border-gray-150 bg-white">
                  <img loading="lazy" decoding="async" src={card.logo} alt={`${card.name} 로고`} className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold tracking-[-0.07px] text-gray-200">{card.org}</p>
                    <p className="text-[22px] font-bold tracking-[-0.11px] text-black">{card.name}</p>
                  </div>
                  <p className="text-lg leading-[1.6] tracking-[-0.09px] text-gray-300">{card.description}</p>
                </div>
              </div>
            ))}
            <div aria-hidden className="shrink-0" style={{ width: spacerWidth }} />
          </div>
        </Container>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center rounded-full bg-[#3379f3] px-[30px] py-3 text-xl font-semibold text-white transition-colors hover:bg-[#2a65d1]"
        >
          연동 문의하기
        </button>
      </motion.div>
    </Section>
  )
}
