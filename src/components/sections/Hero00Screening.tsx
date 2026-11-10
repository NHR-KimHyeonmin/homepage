import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { IconPlus } from '@tabler/icons-react'
import iconDocTabInactive from '../../assets/sections/hero00/icon-doc-tab-inactive.svg'
import iconInterviewTabInactive from '../../assets/sections/hero00/icon-interview-tab.svg'
import iconReferenceTabInactive from '../../assets/sections/hero00/icon-reference-tab.svg'
import logoCareern from '../../assets/sections/hero00/logo-careern.png'
import logoMonster from '../../assets/sections/hero00/logo-monster.png'
import logoPrism from '../../assets/sections/hero00/logo-prism.png'
import logoSpector from '../../assets/sections/hero00/logo-spector.png'
import logoViewinter from '../../assets/sections/hero00/logo-viewinter.png'
import { useDragScroll } from '../../hooks/useDragScroll'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

type ScreeningTab = 'doc' | 'interview' | 'reference'

const NAV_TABS: { id: ScreeningTab; label: string; iconInactive: string }[] = [
  { id: 'doc', label: 'AI 서류 검토', iconInactive: iconDocTabInactive },
  { id: 'interview', label: 'AI 면접 / 인적성 검사', iconInactive: iconInterviewTabInactive },
  { id: 'reference', label: '레퍼런스 검토', iconInactive: iconReferenceTabInactive },
]

interface PartnerCard {
  logo: string
  org: string
  name: string
  description: string
  /** Which nav tab lights this card up at full opacity when selected. */
  group: ScreeningTab
  href: string
}

const CARDS: PartnerCard[] = [
  {
    logo: logoPrism,
    org: '무하유',
    name: '프리즘',
    href: 'https://service.prism.work/prism',
    description:
      '프리즘은 생성형 AI 자소서 탐지는 물론, 직무 적합성 등 사람이 판단하기 어려운 요소를 AI가 정밀하게 분석하여 결과를 제공합니다. 이제 지원자의 본질적인 역량에 집중하세요.',
    group: 'doc',
  },
  {
    logo: logoViewinter,
    org: '제네시스랩',
    name: '뷰인터 HR',
    href: 'https://viewinterhr.com/',
    description:
      'Interactive AI 기술을 기반으로 보다 정확한 인재를 공정하게 선발할 수 있도록 도움을 드리는 AI면접 솔루션입니다.',
    group: 'interview',
  },
  {
    logo: logoMonster,
    org: '무하유',
    name: '몬스터',
    href: 'https://service.prism.work/monster',
    description:
      '몬스터는 AI면접 답변 내용과 역량검사 결과를 기반으로 서류에서 알 수 없는 진짜 역량을 검증하고 오피스빌런 리스크까지 예측하여 채용 효율과 정확성을 극대화합니다.',
    group: 'interview',
  },
  {
    logo: logoCareern,
    org: 'NHR',
    name: '커리어앤',
    href: 'https://n-hrlab.careerlink.kr/products',
    description:
      '기업이 보다 직무에 FIT한 역량, 조직에 FIT한 가치관을 가진 인재를 확보할 수 있도록 돕는 성격 진단 솔루션입니다.',
    group: 'interview',
  },
  {
    logo: logoSpector,
    org: 'Spector',
    name: '스펙터',
    href: 'https://www.specter.co.kr/',
    description:
      '기업, 지원자, 평판 작성자를 연결하는 인재검증(평판조회) 플랫폼입니다. 인재 검증 시간을 단축 시켜주며 채용에 대한 리스크를 감소시켜줍니다.',
    group: 'reference',
  },
]

const CARD_WIDTH = 300

/** 이만큼만 끌어도 다음 그룹으로 넘어간다 — 카드 한 장을 다 끌어야
 *  넘어가면 "안 움직인다"로 읽힌다. */
const STEP_THRESHOLD = 24

export function Hero00Screening() {
  const [activeTab, setActiveTab] = useState<ScreeningTab>('doc')
  // 끌어서 옮길 수 있게 하되, 손을 떼면 관성으로 미끄러지는 대신 탭
  // 그룹에 붙는다 — 움직임은 탭을 눌렀을 때와 같다.
  const { scrollRef, isDragging, overscrollX, dragHandlers } = useDragScroll<HTMLDivElement>((scrolled) =>
    settleAfterDrag(scrolled),
  )
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
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
  }, [scrollRef])

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

  /** 지금 화면 한가운데에 가장 가까운 그룹. */
  const nearestGroup = () => {
    const container = scrollRef.current
    if (!container) return activeTab
    const containerCenterX = container.getBoundingClientRect().left + container.clientWidth / 2

    let nearest = activeTab
    let shortest = Infinity
    for (const tab of NAV_TABS) {
      const indices = CARDS.reduce<number[]>((acc, card, i) => (card.group === tab.id ? [...acc, i] : acc), [])
      const firstEl = cardRefs.current[indices[0]]
      const lastEl = cardRefs.current[indices[indices.length - 1]]
      if (!firstEl || !lastEl) continue
      const firstRect = firstEl.getBoundingClientRect()
      const lastRect = lastEl.getBoundingClientRect()
      const groupCenterX = (firstRect.left + firstRect.width / 2 + lastRect.left + lastRect.width / 2) / 2
      const distance = Math.abs(groupCenterX - containerCenterX)
      if (distance < shortest) {
        shortest = distance
        nearest = tab.id
      }
    }
    return nearest
  }

  /**
   * 손을 뗀 자리에서 어느 그룹에 붙일지 정한다. 많이 끌었으면 가장 가까운
   * 그룹이 이미 바뀌어 있고, 살짝만 끌었으면 가운데는 그대로라 가까운
   * 그룹이 안 바뀐다 — 그때는 끈 방향으로 한 칸 넘긴다.
   */
  /** 켜진 칸의 자리와 폭. 글자 길이가 달라 고정값으로는 맞출 수 없다. */
  const navRef = useRef<HTMLElement>(null)
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const measure = () => {
      const el = nav.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`)
      if (el) setThumb({ x: el.offsetLeft - 6, w: el.offsetWidth })
    }
    measure()
    // 글꼴이 늦게 바뀌면 칸 폭도 바뀐다 — 그때 다시 잰다.
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [activeTab])

  const settleAfterDrag = (scrolled: number) => {
    const nearest = nearestGroup()
    if (nearest !== activeTab) {
      selectTab(nearest)
      return
    }

    const order = NAV_TABS.map((tab) => tab.id)
    const step = Math.abs(scrolled) >= STEP_THRESHOLD ? Math.sign(scrolled) : 0
    const index = Math.min(order.length - 1, Math.max(0, order.indexOf(activeTab) + step))
    selectTab(order[index])
  }

  // 터치로 넘기면 마우스 끌기 대신 브라우저 기본 스크롤이 움직여, 그룹에 붙지도
  // 포커스가 옮겨지지도 않았다. 손을 뗀 뒤 관성 스크롤이 멈추면 끌기를 끝낸 것과
  // 똑같이 가장 가까운(또는 넘긴 방향의) 그룹으로 붙이고 켠다.
  const settleRef = useRef(settleAfterDrag)
  settleRef.current = settleAfterDrag
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    let startLeft = 0
    let released = false
    let timer = 0
    const onStart = () => {
      released = false
      window.clearTimeout(timer)
      startLeft = container.scrollLeft
    }
    const settleSoon = () => {
      window.clearTimeout(timer)
      // 스크롤 이벤트가 120ms 동안 없으면 멈춘 것으로 본다.
      timer = window.setTimeout(() => {
        if (!released) return
        released = false
        settleRef.current(container.scrollLeft - startLeft)
      }, 120)
    }
    const onEnd = () => {
      released = true
      settleSoon()
    }
    const onScroll = () => {
      if (released) settleSoon()
    }
    container.addEventListener('touchstart', onStart, { passive: true })
    container.addEventListener('touchend', onEnd, { passive: true })
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      container.removeEventListener('touchstart', onStart)
      container.removeEventListener('touchend', onEnd)
      container.removeEventListener('scroll', onScroll)
    }
  }, [scrollRef])

  return (
    <Section id="integrations" className="flex flex-col items-center content-pt section-pb gap-10 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full"
      >
        <Container>
          {/* 밑줄 탭에서 알약 스위치로. 선 하나로만 켜진 칸을 표시하면 글자
              길이가 제각각인 세 칸에서 어디가 켜졌는지 훑다 놓치기 쉬웠다.
              칸이 통째로 칠해지면 멀리서도 걸린다. 칸 폭이 저마다 달라
              미끄러질 거리는 실측해 둔다. */}
          <nav ref={navRef} className="relative mx-auto flex w-fit items-center gap-1 rounded-full bg-white p-1.5 shadow-soft">
            {thumb && (
              <motion.span
                aria-hidden
                initial={false}
                animate={{ x: thumb.x, width: thumb.w }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute left-1.5 top-1.5 h-[calc(100%-12px)] rounded-full bg-[#eceff3]"
              />
            )}
            {NAV_TABS.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-tab={tab.id}
                  onClick={() => selectTab(tab.id)}
                  aria-pressed={isActive}
                  className={clsx(
                    'relative z-10 flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[16px] font-semibold tracking-[-0.09px] transition-colors duration-200',
                    isActive ? 'text-title' : 'text-sub hover:text-body',
                  )}
                >
                  {/* 켜진 탭의 파란 아이콘 대신 회색 아이콘을 짙게 눌러 글자색과 맞춘다. */}
                  <img loading="lazy" decoding="async" src={tab.iconInactive} alt="" className={clsx('size-[18px] shrink-0 transition-[filter]', isActive && 'brightness-0 opacity-85')} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </Container>
      </motion.div>

      {/* 양 끝에서 더 끌면 트랙이 그만큼 딸려 나왔다가 튕겨 돌아온다. scrollLeft
          는 0/max 에서 잘려 아무 반응이 없는데, 그러면 끝에 닿았는지 화면이
          멈춘 건지 구분이 안 된다.

          미는 건 트랙이 아니라 스크롤 상자를 감싼 **바깥** 상자다. 트랙(스크롤
          되는 내용물)에 transform 을 걸면 그만큼 오른쪽 넘침이 줄어 컨테이너의
          scrollWidth 가 같이 작아지고, 브라우저가 scrollLeft 를 새 최대값으로
          끌어내린다. 그러면 끌지도 않은 거리가 "오른쪽으로 끌었다" 로 기록되어
          (settleAfterDrag 의 scrolled 가 음수) 마지막 그룹에서 왼쪽으로 당겼는데
          이전 그룹으로 넘어가 버렸다. 바깥에서 밀면 스크롤 기하는 그대로다.
          nearestGroup 이 재는 카드·컨테이너 위치도 함께 밀리므로 거리 비교도
          어긋나지 않는다. */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        style={{ x: overscrollX }}
        className="w-full"
      >
        <Container
          ref={scrollRef}
          maxWidth={1592}
          {...dragHandlers}
          className={clsx(
            // scroll-smooth 를 쓰면 드래그 중 scrollLeft 대입까지 애니메이션돼
            // 손가락보다 늦게 따라온다. 자리 잡기는 scrollTo 가 behavior 를 준다.
            'overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            isDragging ? 'cursor-grabbing [&_*]:cursor-grabbing' : 'cursor-grab',
          )}
        >
          <div className="flex items-stretch gap-5">
            <div aria-hidden className="shrink-0" style={{ width: spacerWidth }} />
            {CARDS.map((card, index) => (
              <a
                key={card.name}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                // 링크를 끌면 브라우저가 링크 끌기를 시작해 가로 드래그가 끊긴다.
                draggable={false}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                // 흐린 카드를 누르면 그 그룹으로 옮기기만 한다. 사이트는 켜진 카드에서만 열린다.
                onClick={(event) => {
                  if (card.group !== activeTab) {
                    event.preventDefault()
                    selectTab(card.group)
                  }
                }}
                aria-current={card.group === activeTab ? 'true' : undefined}
                className={clsx(
                  'group relative flex h-[400px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-card p-7 text-left transition-[opacity,background-color,box-shadow] duration-300',
                  card.group === activeTab
                    ? 'bg-brand-50 opacity-100 hover:bg-[#ecf6fc] hover:shadow-[inset_0_0_0_1px_rgba(13,156,235,0.45)]'
                    : 'bg-brand-50 opacity-30 hover:opacity-60',
                )}
                style={{ width: CARD_WIDTH }}
              >
                {/* 켜진 카드에 올리면 내용을 흐리고 "더 알아보기" 를 띄워, 눌렀을 때 어디로 가는지 알린다. */}
                <div
                  className={clsx(
                    'flex flex-col gap-4 transition-[filter] duration-300',
                    card.group === activeTab && 'group-hover:blur-[7px] group-focus-visible:blur-[7px]',
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-ui border border-gray-150 bg-white">
                    {/* 로고 파일은 여백 없이 잘라 두고, 칸 안쪽 여백으로 가운데에 앉힌다. */}
                    <img loading="lazy" decoding="async" src={card.logo} alt={`${card.name} 로고`} className="size-full object-contain p-1.5" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold tracking-[-0.07px] text-sub">{card.org}</p>
                      <p className="type-card-title">{card.name}</p>
                    </div>
                    <p className="type-card-body">{card.description}</p>
                  </div>
                </div>
                {card.group === activeTab && (
                  <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-title opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <IconPlus
                      size={28}
                      stroke={1.8}
                      aria-hidden
                      className="group-hover:[animation:plus-spin_0.4s_ease-out] group-focus-visible:[animation:plus-spin_0.4s_ease-out]"
                    />
                    <span className="text-[16px] font-semibold">더 알아보기</span>
                  </span>
                )}
              </a>
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
          className="flex cursor-pointer items-center justify-center rounded-full bg-cta px-7 py-3.5 text-[19px] font-semibold text-white transition-colors hover:bg-cta-hover"
        >
          연동 문의하기
        </button>
      </motion.div>
    </Section>
  )
}
