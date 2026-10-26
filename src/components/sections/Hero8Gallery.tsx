import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import card1 from '../../assets/sections/hero8-gallery/card-1.webp'
import card2 from '../../assets/sections/hero8-gallery/card-2.webp'
import card3 from '../../assets/sections/hero8-gallery/card-3.webp'
import card4 from '../../assets/sections/hero8-gallery/card-4.webp'
import card5 from '../../assets/sections/hero8-gallery/card-5.webp'
import card6 from '../../assets/sections/hero8-gallery/card-6.webp'
import chevronRight from '../../assets/sections/hero8-gallery/chevron-right.svg'
import iconChevronLeft from '../../assets/sections/hero4-cards/icon-chevron-left.svg'
import iconChevronNext from '../../assets/sections/hero4-cards/icon-chevron-right.svg'
import { useContentInsetLeft } from '../../hooks/useContentInsetLeft'
import { useDragScroll } from '../../hooks/useDragScroll'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

interface ServiceCard {
  name: string
  image: string
  description: string
}

const CARDS: ServiceCard[] = [
  {
    name: '커리어앤',
    image: card1,
    description: '개인과 조직에 대한 다차원적 진단을 바탕으로 적합한 인재를 확보할 수 있도록 돕는 진단 솔루션입니다.',
  },
  {
    name: '커리어톡',
    image: card2,
    description: '채용 관련 행사를 올인원으로 준비할 수 있는 운영 솔루션, 국내/외 탑티어 유저가 꾸준히 확보되는 플랫폼입니다.',
  },
  {
    name: '채용 컨설팅',
    image: card3,
    description: '채용 직무 분석, 채용 역량 모델링, 채용평가 재설계 및 교육, 서류/필기/면접전형 대행을 진행합니다.',
  },
  {
    name: 'peak',
    image: card4,
    description: '개인과 조직에 대한 다차원적 진단을 바탕으로 적합한 인재를 확보할 수 있도록 돕는 진단 솔루션입니다.',
  },
  {
    name: '채용 마케팅',
    image: card5,
    description: '개인과 조직에 대한 다차원적 진단을 바탕으로 적합한 인재를 확보할 수 있도록 돕는 진단 솔루션입니다.',
  },
  {
    name: '20대 연구소',
    image: card6,
    description: '개인과 조직에 대한 다차원적 진단을 바탕으로 적합한 인재를 확보할 수 있도록 돕는 진단 솔루션입니다.',
  },
]

export function Hero8Gallery() {
  const { scrollRef, isDragging, dragHandlers } = useDragScroll<HTMLDivElement>()
  // First card starts exactly under the "채용을 더 완벽하게" headline, which
  // sits in a 1208px column with this section's own outer padding.
  const { probeRef, inset } = useContentInsetLeft<HTMLDivElement, HTMLDivElement>(scrollRef)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  // No center-focus needed here (unlike the 평가 section) — page so the
  // target card's leading edge lands on the track's own left inset.
  // (`scrollIntoView` would align it to the container edge instead, undoing
  // the headline alignment.)
  const goTo = (index: number) => {
    const container = scrollRef.current
    const cardEl = cardRefs.current[Math.max(0, Math.min(CARDS.length - 1, index))]
    if (!container || !cardEl) return
    const clamped = Math.max(0, Math.min(CARDS.length - 1, index))
    setActiveIndex(clamped)
    const target = container.scrollLeft + cardEl.getBoundingClientRect().left - container.getBoundingClientRect().left - inset
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    container.scrollTo({ left: Math.max(0, Math.min(target, maxScrollLeft)), behavior: 'smooth' })
  }

  return (
    <Section className="flex flex-col items-center pb-12 pt-6 md:pb-24 md:pt-16">
      {/* Zero-height mirror of the headline's column — measured, not
          hard-coded, so the track's left edge tracks it at every width. */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-0 w-full">
        {/* Same box as the <Container> the headline sits in, so the probe
            lands on exactly the page gutter. */}
        <div className="mx-auto h-0 w-full max-w-[1280px] px-5 md:px-8">
          <div ref={probeRef} className="h-0" />
        </div>
      </div>

      <div
        ref={scrollRef}
        {...dragHandlers}
        className={`w-full overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        <div className="flex items-stretch gap-5" style={{ paddingLeft: inset, paddingRight: 24 }}>
          {CARDS.map((card, index) => (
            <motion.div
              key={card.name}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
              className="flex w-[380px] shrink-0 flex-col gap-5"
            >
              <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-media">
                <img loading="lazy" decoding="async" src={card.image} alt="" className="absolute inset-0 size-full object-cover" />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ backgroundImage: 'linear-gradient(180deg, rgba(102,102,102,0.1) 4%, rgba(0,0,0,0.8) 80%)' }}
                />
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <h5 className="text-xl font-bold leading-[1.2] tracking-[-0.4px] text-black">{card.name}</h5>
                  <p className="text-[18px] leading-[1.45] tracking-[-0.08px] text-gray-300">{card.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <h5 className="whitespace-nowrap text-sm font-bold leading-[1.2] tracking-[-0.28px] text-gray-200">
                    자세히 보기
                  </h5>
                  <img loading="lazy" decoding="async" src={chevronRight} alt="" className="size-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Container maxWidth={1592} className="flex justify-end pt-6">
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
    </Section>
  )
}
