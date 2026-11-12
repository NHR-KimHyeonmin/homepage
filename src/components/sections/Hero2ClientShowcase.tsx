import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import apr from '../../assets/sections/hero2-showcase/apr.webp'
import dongjin from '../../assets/sections/hero2-showcase/dongjin.webp'
import kbam from '../../assets/sections/hero2-showcase/kbam.webp'
import semes from '../../assets/sections/hero2-showcase/semes.webp'
import sirloin from '../../assets/sections/hero2-showcase/sirloin.webp'
import es from '../../assets/sections/hero2-showcase/es.webp'
import hyundai from '../../assets/sections/hero2-showcase/hyundai.webp'
import lotteAx from '../../assets/sections/hero2-showcase/lotte-ax.webp'
import lx from '../../assets/sections/hero2-showcase/lx-international.webp'
import mbc from '../../assets/sections/hero2-showcase/mbc.webp'
import mbcRecruit from '../../assets/sections/hero2-showcase/mbc-recruit.webp'
import meritz from '../../assets/sections/hero2-showcase/meritz.webp'
import hanalife from '../../assets/sections/hero2-showcase/hanalife.webp'
import samsungMedicine from '../../assets/sections/hero2-showcase/samsung-medicine.webp'
import sbs from '../../assets/sections/hero2-showcase/sbs.webp'
import skEcoplant from '../../assets/sections/hero2-showcase/sk-ecoplant.webp'
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
  { name: 'lx', label: 'LX인터내셔널', image: lx, href: 'https://lxinternational-recruit.com/' },
  { name: 'sk-ecoplant', label: 'SK에코플랜트', image: skEcoplant, href: 'https://recruit-skecoplant.com/' },
  { name: 'apr', label: 'APR', image: apr, href: 'https://26mkt-aprcareers.com/' },
  { name: 'lotte-ax', label: '롯데 AX 챌린지', image: lotteAx, href: 'https://lotteaxchallenge.com/preview' },
  { name: 'hyundai', label: '현대그룹', image: hyundai, href: 'https://careers.hyundaigroup.com/' },
  { name: 'es', label: '대학내일ES', image: es, href: 'https://univ.careerlink.kr/' },
  { name: 'dongjin', label: '동진쎄미켐', image: dongjin, href: 'https://dongjin.careerlink.kr/' },
  { name: 'sirloin', label: '설로인', image: sirloin, href: 'https://sirloin.careerlink.kr/' },
  { name: 'kbam', label: 'KB자산운용', image: kbam, href: 'https://kbam.careerlink.kr/' },
  { name: 'mbc', label: 'iMBC', image: mbc, href: 'https://imbc.careerlink.kr/' },
  { name: 'semes', label: '세메스', image: semes, href: 'https://semes.careerlink.kr/' },
  { name: 'sbs', label: 'SBS', image: sbs, href: 'https://sbs.careerlink.kr/' },
  { name: 'samsung-medicine', label: '삼성메디슨', image: samsungMedicine, href: 'https://samsungmedison.careerlink.kr/' },
  { name: 'meritz', label: '메리츠증권', image: meritz, href: 'https://recruit-meritz.com/' },
  { name: 'mbc-recruit', label: 'MBC', image: mbcRecruit, href: 'https://mbc.careerlink.kr/' },
  { name: 'hanalife', label: '하나생명', image: hanalife, href: 'https://hanalife.careerlink.kr/' },
]

/** Track gap, matching the reference row (tana.inc UseCaseSection_row). */
const GAP = 24

/** 자동 진행 속도(px/초). 카드 한 장이 지나가는 데 10초쯤 걸린다 — 흐르고
 *  있다는 것만 알아채고 읽는 데는 걸리지 않는 속도.
 *  프레임당이 아니라 초당으로 잡아야 주사율이 120Hz 든 60Hz 든 같은 속도로
 *  보인다. */
const AUTO_SCROLL_PX_PER_SEC = 40

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
      <p className="absolute bottom-3.5 left-5 text-sm font-medium tracking-[-0.08px] text-white/85">{card.label}</p>
    </>
  )

  const shell = 'relative block aspect-[360/220] w-full overflow-hidden rounded-media'

  return card.href ? (
    <a href={card.href} target="_blank" rel="noopener noreferrer" draggable={false} className={shell}>
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { probeRef, inset } = useContentInsetLeft<HTMLDivElement, HTMLDivElement>(scrollRef)
  const [cardWidth, setCardWidth] = useState(320)
  const reduceMotion = useReducedMotion()
  /** 흘러온 거리(px). 늘 [0, 한 벌 길이) 안으로 접어 둔다 — 그래서 어느 쪽으로 끌어도 끝이 없다. */
  const offset = useRef(0)
  const loopRef = useRef(0)
  /** 끄는 중: 누른 자리, 그때의 offset, 지금까지 움직인 최대 거리. */
  const drag = useRef<{ x: number; start: number; moved: number } | null>(null)
  /** 끌기가 끝난 직후의 click 은 링크를 열지 않는다. */
  const swallowClick = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

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

  // 카드 한 벌 길이 — 첫 벌의 첫 카드에서 둘째 벌의 첫 카드까지.
  loopRef.current = CARDS.length * (cardWidth + GAP)

  // 띠는 늘 흐른다(마우스를 올려도 멈추지 않는다). 끄는 동안만 손을 따라가고,
  // 손을 떼면 그 자리에서 다시 흐른다. 흐름과 끌기가 같은 offset 하나를 움직이고
  // 매 프레임 한 벌 길이로 접으므로, 두 벌을 깔아 둔 띠가 이음매 없이 끝없이 돈다.
  // ponytail: 매 프레임 transform 을 쓴다 — 다른 연출이 메인 스레드를 잡으면 드물게 끊길 수 있다.
  useEffect(() => {
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000
      last = now
      if (!drag.current && !reduceMotion) offset.current += AUTO_SCROLL_PX_PER_SEC * dt
      const loop = loopRef.current
      if (loop > 0) offset.current = ((offset.current % loop) + loop) % loop
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-offset.current}px, 0, 0)`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduceMotion])

  // 끌기. 손가락도 같은 길로 받는다(가로는 우리가, 세로는 페이지 스크롤이 — touch-action: pan-y).
  // 포인터를 붙잡지(capture) 않는다 — 붙잡으면 click 대상이 띠로 바뀌어 카드 링크가 안 눌린다.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const d = drag.current
      if (!d) return
      const dx = event.clientX - d.x
      d.moved = Math.max(d.moved, Math.abs(dx))
      if (d.moved > 4) setIsDragging(true)
      offset.current = d.start - dx
    }
    const onUp = () => {
      const d = drag.current
      if (!d) return
      swallowClick.current = d.moved > 4
      drag.current = null
      setIsDragging(false)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <Section id="hero2-client-showcase" className="section-pt section-pb flex flex-col bg-white">
      <Container>
        <div ref={probeRef} aria-hidden className="h-0" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex w-full flex-col items-start gap-5"
        >
          <div className="type-title">
            <p>세련된 채용사이트로 지원자에게</p>
            <p>강력한 첫 인상을 심어주세요.</p>
          </div>
        </motion.div>
      </Container>

      <div
        ref={scrollRef}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          swallowClick.current = false
          drag.current = { x: event.clientX, start: offset.current, moved: 0 }
        }}
        onClickCapture={(event) => {
          if (!swallowClick.current) return
          swallowClick.current = false
          event.preventDefault()
          event.stopPropagation()
        }}
        onDragStart={(event) => event.preventDefault()}
        className={`mt-16 w-full touch-pan-y overflow-hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        {/* 카드를 두 벌 깐다. 한 벌 길이만큼 흘렀을 때 그만큼 되돌리면 같은
            그림이라 이음매가 보이지 않는다 — 끝에서 0 으로 튀는 것과 다르다.
            둘째 벌은 같은 내용의 복제라 보조기기에서는 뺀다. */}
        <div
          ref={trackRef}
          className="flex w-max items-stretch will-change-transform"
          style={{ gap: GAP, paddingLeft: inset, paddingRight: 24 }}
        >
          {[0, 1].map((copy) =>
            CARDS.map((card) => (
              <div
                key={`${copy}-${card.name}`}
                aria-hidden={copy === 1}
                className="shrink-0"
                style={{ width: cardWidth }}
              >
                <ShowcaseCardItem card={card} />
              </div>
            )),
          )}
        </div>
      </div>
    </Section>
  )
}
