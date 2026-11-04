import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import iconChevronLeft from '../../assets/sections/hero4-cards/icon-chevron-left.svg'
import iconChevronNext from '../../assets/sections/hero4-cards/icon-chevron-right.svg'
import { useContentInsetLeft } from '../../hooks/useContentInsetLeft'
import { useDragScroll } from '../../hooks/useDragScroll'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

/** 카드 한 장의 크기. 일곱 장이 모두 같은 틀이라 여기서만 잡는다.
 *
 *  폭은 px 로 못박지 않는다 — 화면에 늘 3.5 장이 걸치게 둬야 "옆에 더 있다"
 *  가 보이는데, 고정 폭이면 넓은 화면에서는 네 장이 딱 맞아 떨어져 더 없는
 *  것처럼 보이고 좁은 화면에서는 두 장 반만 든다.
 *
 *  퍼센트는 트랙(스크롤 칸)의 안쪽 폭을 기준으로 풀리므로, 보이는 폭에서
 *  사이 간격 셋(20×3)을 뺀 나머지를 3.5 로 나누면 된다. */
const VISIBLE_CARDS = 3.5
const CARD_GAP = 20
const CARD_WIDTH = `calc((100% - ${CARD_GAP * 3}px) / ${VISIBLE_CARDS})`
const CARD_HEIGHT = 480
/** 그림 자리의 높이. 글이 두 줄이든 세 줄이든 같아야 한다 — flex-1 로 남는
 *  높이를 주면 설명이 긴 카드만 그림이 눌려, 일곱 장이 같은 틀로 안 보인다. */
const CARD_MEDIA_HEIGHT = 280

// Figma node 2320:26198 — 전에는 높이가 제각각인 3단 메이슨리였다. 같은 크기
// 카드가 가로로 흐르는 쪽으로 바꾼 이유는, 메이슨리가 "일곱 가지가 나란히
// 있다" 가 아니라 "크기가 다른 일곱 덩어리" 로 읽혀 무엇이 더 중한지를
// 크기로 잘못 말했기 때문이다.
const CARDS: { title: string; description: string }[] = [
  {
    title: '온보딩 및 초기 세팅 지원',
    description: '시스템 실제 오픈 전 대면/비대면 미팅을 통해 온보딩 지원을 드립니다.',
  },
  {
    title: '전담 매니저 배정',
    description: '시스템 사용간 이슈 발생 시 즉각 조치할 수 있도록 전담자를 배정해드립니다.',
  },
  {
    title: 'GA 대시보드 제공',
    description:
      '최종제출 인원이 어느 경로에서 인입되었는지 확인할 수 있는 대시보드를 제공해 드립니다. (GA 수집동의 필요)',
  },
  {
    title: '가이드북 제공',
    description: '커리어링크 사용 온라인 가이드를 제공해 드립니다.',
  },
  {
    title: '실시간 채팅 상담',
    description: '가이드북으로 찾기 어려운 부분을 실시간 채팅을 통해 해소해 드리고 있습니다.',
  },
  {
    title: '홈페이지 제작 지원',
    description: 'HR브랜딩 전문가 NHR이 귀사의 채용 홈페이지 제작을 직접 도와드립니다.',
  },
  {
    title: '보안 점검 지원',
    description:
      '안정적인 운영을 위해 안정적인 보안 체계가 중요합니다. 귀사의 정기적 보안 점검에 적극적으로 대응하며 준수합니다.',
  },
]

export function Hero6FeatureGallery() {
  const { scrollRef, isDragging, dragHandlers } = useDragScroll<HTMLDivElement>()
  // 첫 카드의 왼쪽을 "안정적인 채용을 도와드립니다" 제목에 맞춘다. 제목이 선
  // 칸을 그대로 본뜬 자(probe)를 재서 쓰므로 폭이 바뀌어도 따라간다.
  const { probeRef, inset } = useContentInsetLeft<HTMLDivElement, HTMLDivElement>(scrollRef)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  /** 고른 카드의 왼쪽 변을 트랙의 왼쪽 자리(inset)에 가져다 놓는다. */
  const goTo = (index: number) => {
    const container = scrollRef.current
    const clamped = Math.max(0, Math.min(CARDS.length - 1, index))
    const cardEl = cardRefs.current[clamped]
    if (!container || !cardEl) return
    setActiveIndex(clamped)
    const target =
      container.scrollLeft + cardEl.getBoundingClientRect().left - container.getBoundingClientRect().left - inset
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    container.scrollTo({ left: Math.max(0, Math.min(target, maxScrollLeft)), behavior: 'smooth' })
  }

  return (
    <Section className="flex flex-col items-center pb-12 pt-6 md:pb-24 md:pt-16">
      {/* 제목이 선 칸을 높이 0 으로 본뜬 자. 하드코딩 대신 재는 이유는 폭마다
          가터가 달라지기 때문이다(Hero8Gallery 와 같은 방식). */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-0 w-full">
        <div className="mx-auto h-0 w-full max-w-[1280px] px-5 md:px-8">
          <div ref={probeRef} className="h-0" />
        </div>
      </div>

      <Container className="flex justify-end pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="이전 카드 보기"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#eeeeee]/[0.93] transition-opacity disabled:cursor-default disabled:opacity-40"
          >
            <img loading="lazy" decoding="async" src={iconChevronLeft} alt="" className="size-7" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === CARDS.length - 1}
            aria-label="다음 카드 보기"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#eeeeee]/[0.93] transition-opacity disabled:cursor-default disabled:opacity-40"
          >
            <img loading="lazy" decoding="async" src={iconChevronNext} alt="" className="size-7" />
          </button>
        </div>
      </Container>
      <div
        ref={scrollRef}
        {...dragHandlers}
        className={`w-full overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        <div className="flex items-stretch" style={{ paddingLeft: inset, paddingRight: 24, gap: CARD_GAP }}>
          {CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
              className="flex shrink-0 flex-col overflow-hidden rounded-card bg-card"
            >
              <div className="flex flex-1 flex-col gap-2 p-8">
                <h3 className="text-2xl font-semibold tracking-[-0.48px] text-black">{card.title}</h3>
                <p className="text-base font-medium tracking-[-0.09px] text-black/55">{card.description}</p>
              </div>
              {/* 그림이 들어올 자리. 아직 받은 그림이 없어 면만 깔아 둔다 —
                  빈 칸으로 두면 카드가 글만 있는 쪽지처럼 보여, 자리가 있다는
                  것 자체가 안 보인다. */}
              <div className="shrink-0 bg-[#e4e7ec]" style={{ height: CARD_MEDIA_HEIGHT }} />
            </motion.div>
          ))}
        </div>
      </div>

    </Section>
  )
}
