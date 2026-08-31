import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import iconChevronLeft from '../../assets/sections/hero4-cards/icon-chevron-left.svg'
import iconChevronRight from '../../assets/sections/hero4-cards/icon-chevron-right.svg'
import es from '../../assets/sections/hero2-showcase/es.webp'
import hyundai from '../../assets/sections/hero2-showcase/hyundai.webp'
import mbc from '../../assets/sections/hero2-showcase/mbc.webp'
import samsungMedicine from '../../assets/sections/hero2-showcase/samsung-medicine.webp'
import sbs from '../../assets/sections/hero2-showcase/sbs.webp'
import { useContentInsetLeft } from '../../hooks/useContentInsetLeft'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

interface ShowcaseCard {
  name: string
  label: string
  image: string
  href?: string
}

const CARDS: ShowcaseCard[] = [
  { name: 'sbs', label: 'SBS', image: sbs },
  { name: 'mbc', label: 'iMBC', image: mbc, href: 'https://imbc.careerlink.kr/' },
  { name: 'es', label: '대학내일ES', image: es },
  { name: 'hyundai', label: '현대그룹', image: hyundai },
  { name: 'samsung-medicine', label: '삼성메디슨', image: samsungMedicine },
]

const GAP = 20

/** Cards visible at once, per breakpoint — 4.5 on desktop so the half-card
 *  at the right edge signals there is more to page through. */
function cardsInView(viewportWidth: number): number {
  if (viewportWidth >= 1024) return 4.5
  if (viewportWidth >= 768) return 2.5
  return 1.2
}

function ShowcaseCardItem({ card }: { card: ShowcaseCard }) {
  const image = <img src={card.image} alt={card.label} className="size-full rounded-2xl object-cover" />

  return (
    <div className="flex h-full flex-col items-start gap-2">
      {card.href ? (
        <a
          href={card.href}
          target="_self"
          className="block aspect-[360/220] w-full shrink-0 overflow-hidden rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]"
        >
          {image}
        </a>
      ) : (
        <div className="aspect-[360/220] w-full shrink-0 overflow-hidden rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]">
          {image}
        </div>
      )}
      <p className="w-full text-base font-semibold tracking-[-0.08px] text-gray-250">{card.label}</p>
    </div>
  )
}

/**
 * Client homepage examples (SBS, iMBC, …). Used to be an endless marquee;
 * now it is a paged carousel like the "평가" section — one card per arrow
 * press, arrows top-right. The track is full-bleed but its first card is
 * left-aligned with the headline above it (measured, see
 * `useContentInsetLeft`), so cards can run past the right edge of the
 * screen as they are paged.
 */
export function Hero2ClientShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { probeRef, inset } = useContentInsetLeft<HTMLDivElement, HTMLDivElement>(scrollRef)
  const [cardWidth, setCardWidth] = useState(320)
  const [activeIndex, setActiveIndex] = useState(0)
  const [atEnd, setAtEnd] = useState(false)

  const syncEdges = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    setAtEnd(container.scrollLeft >= container.scrollWidth - container.clientWidth - 1)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const update = () => {
      const available = container.clientWidth - inset
      const visible = cardsInView(container.clientWidth)
      // `visible` cards plus the gaps between them fill the available width:
      // visible * w + ceil(visible - 1) * GAP = available.
      setCardWidth(Math.max(200, (available - Math.ceil(visible - 1) * GAP) / visible))
      syncEdges()
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [inset, syncEdges])

  const goTo = (index: number) => {
    const container = scrollRef.current
    if (!container) return
    const clamped = Math.max(0, Math.min(CARDS.length - 1, index))
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    setActiveIndex(clamped)
    container.scrollTo({ left: Math.min(clamped * (cardWidth + GAP), maxScrollLeft), behavior: 'smooth' })
  }

  return (
    <Section id="hero2-client-showcase" className="flex flex-col bg-surface-blue pb-20 pt-14 md:pt-20">
      <div className="px-6 md:px-16">
        <Container maxWidth={1208}>
          <div ref={probeRef} aria-hidden className="h-0" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex w-full flex-col items-start gap-5"
          >
            <div className="text-[32px] font-bold leading-[1.4] tracking-[-0.84px] text-black md:text-[42px]">
              <p>세련된 채용사이트로 지원자에게</p>
              <p>강력한 첫 인상을 심어주세요.</p>
            </div>
            <p className="text-lg leading-[1.45] tracking-[-0.1px] text-black/55 md:text-xl">
              채용 사이트 방문자의 데이터를 수집하여 지원자의 유입 채널을 분석하여 다음 채용 전략에 활용할 수 있습니다.
            </p>
          </motion.div>
        </Container>

        <Container maxWidth={1208} className="flex justify-end pt-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="이전 카드 보기"
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#eeeeee]/[0.93] transition-opacity disabled:cursor-default disabled:opacity-40"
            >
              <img src={iconChevronLeft} alt="" className="size-7" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={atEnd}
              aria-label="다음 카드 보기"
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#eeeeee]/[0.93] transition-opacity disabled:cursor-default disabled:opacity-40"
            >
              <img src={iconChevronRight} alt="" className="size-7" />
            </button>
          </div>
        </Container>
      </div>

      <div
        ref={scrollRef}
        onScroll={syncEdges}
        className="mt-8 w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex items-stretch" style={{ gap: GAP, paddingLeft: inset, paddingRight: 24 }}>
          {CARDS.map((card) => (
            <div key={card.name} className="shrink-0" style={{ width: cardWidth }}>
              <ShowcaseCardItem card={card} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
