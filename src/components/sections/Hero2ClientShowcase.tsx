import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import es from '../../assets/sections/hero2-showcase/es.webp'
import hyundai from '../../assets/sections/hero2-showcase/hyundai.webp'
import mbc from '../../assets/sections/hero2-showcase/mbc.webp'
import samsungMedicine from '../../assets/sections/hero2-showcase/samsung-medicine.webp'
import sbs from '../../assets/sections/hero2-showcase/sbs.webp'
import { useContentInsetLeft } from '../../hooks/useContentInsetLeft'
import { useDragScroll } from '../../hooks/useDragScroll'
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

/** Track gap, matching the reference row (tana.inc UseCaseSection_row). */
const GAP = 24

/** 섹션 배경 — tana.inc CalendarSection_band 의 가로 그라데이션 그대로. 양 끝이
 *  거의 흰색이라 전체폭 섹션인데도 위아래 흰 섹션과 경계 없이 이어진다. */
const BAND_GRADIENT = 'linear-gradient(90deg, #fbfbfb, #e3eaf6 22%, #d3def1 50%, #e3eaf6 78%, #fbfbfb)'

/** Cards visible at once, per breakpoint — 3.5 on desktop, so the half-card
 *  at the right edge signals the track keeps going. */
function cardsInView(viewportWidth: number): number {
  if (viewportWidth >= 1024) return 3.5
  if (viewportWidth >= 768) return 2.5
  return 1.2
}

function ShowcaseCardItem({ card }: { card: ShowcaseCard }) {
  const body = (
    <>
      <img loading="lazy" decoding="async" src={card.image} alt={card.label} className="absolute inset-0 size-full object-cover" />
      {/* Reference scrim (tana.inc UseCaseSection_scrim): a touch of black at
          the very top, then weighted to the bottom so the company name reads
          against any screenshot underneath it. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.7))',
        }}
      />
      <p className="absolute bottom-5 left-5 text-sm font-medium tracking-[-0.08px] text-white/85">{card.label}</p>
    </>
  )

  const shell = 'relative block aspect-[360/220] w-full overflow-hidden rounded-media'

  return card.href ? (
    <a href={card.href} target="_self" className={shell}>
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  )
}

/**
 * Client homepage examples (SBS, iMBC, …). A full-bleed, drag-to-scroll
 * track: its first card is left-aligned with the headline above it
 * (measured, see `useContentInsetLeft`) while the rest run past the right
 * edge of the screen, so 3.5 cards sit in view at desktop width.
 */
export function Hero2ClientShowcase() {
  const { scrollRef, isDragging, dragHandlers } = useDragScroll<HTMLDivElement>()
  const { probeRef, inset } = useContentInsetLeft<HTMLDivElement, HTMLDivElement>(scrollRef)
  const [cardWidth, setCardWidth] = useState(320)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const update = () => {
      const available = container.clientWidth - inset
      const visible = cardsInView(container.clientWidth)
      // `visible` cards plus the gaps between them fill the available width:
      // visible * w + ceil(visible - 1) * GAP = available.
      setCardWidth(Math.max(200, (available - Math.ceil(visible - 1) * GAP) / visible))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [inset, scrollRef])

  return (
    <Section
      id="hero2-client-showcase"
      className="flex flex-col pb-12 pt-12 md:pb-24 md:pt-24"
      style={{ backgroundImage: BAND_GRADIENT }}
    >
      <Container>
        <div ref={probeRef} aria-hidden className="h-0" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex w-full flex-col items-start gap-5"
        >
          <div className="text-[32px] font-bold leading-[1.4] tracking-[-0.84px] text-black md:text-[48px]">
            <p>세련된 채용사이트로 지원자에게</p>
            <p>강력한 첫 인상을 심어주세요.</p>
          </div>
          <p className="text-[17px] font-medium leading-[1.45] tracking-[-0.1px] text-black/55">
            채용 사이트 방문자의 데이터를 수집하여 지원자의 유입 채널을 분석하여 다음 채용 전략에 활용할 수 있습니다.
          </p>
        </motion.div>
      </Container>

      <div
        ref={scrollRef}
        {...dragHandlers}
        className={`mt-8 w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
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
