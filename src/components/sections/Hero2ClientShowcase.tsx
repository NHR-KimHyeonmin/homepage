import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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

/** 자동 진행 속도(px/초). 카드 한 장이 지나가는 데 25초쯤 걸린다 — 흐르고
 *  있다는 것만 알아채고 읽는 데는 걸리지 않는 속도.
 *  프레임당이 아니라 초당으로 잡아야 주사율이 120Hz 든 60Hz 든 같은 속도로
 *  보인다. */
const AUTO_SCROLL_PX_PER_SEC = 13

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
  const trackRef = useRef<HTMLDivElement>(null)
  /** 흘러온 거리. effect 가 다시 돌아도 이어서 가도록 ref 에 담아 둔다. */
  const positionRef = useRef(0)
  const reduceMotion = useReducedMotion()
  /** 포인터가 올라가 있는 동안은 세운다 — 보려고 멈춘 사람 앞에서 계속
   *  흘러가면 읽히지 않는다. 떼면 다시 흐른다(한 번 만지면 끝나는
   *  색상 스위처와 달리, 여기는 쭉 도는 띠라 멈춰 둘 이유가 없다). */
  const [hovering, setHovering] = useState(false)

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

  // 띠가 저 혼자 아주 천천히 흐른다. 드래그 중이거나 포인터가 올라가 있으면
  // 멈춘다 — 사용자가 돌리는 중에 같이 밀면 손이 미끄러진 것처럼 느껴진다.
  useEffect(() => {
    const container = scrollRef.current
    if (!container || reduceMotion || isDragging || hovering) return

    // 카드 한 벌의 길이. gap 이 카드 사이마다 들어가므로 첫 벌의 첫 카드에서
    // 둘째 벌의 첫 카드까지가 정확히 이만큼이다.
    const loopWidth = CARDS.length * (cardWidth + GAP)
    if (loopWidth <= 0) return

    // scrollLeft 가 아니라 트랙의 transform 을 민다. 네이티브 스크롤 위치는
    // 정수 픽셀로 스냅되기 때문에, 프레임당 이동량이 1px 보다 작으면 몇 프레임
    // 가만히 있다 1px 씩 튀어 버벅여 보인다 — transform 은 소수점 그대로
    // 합성되므로 같은 속도여도 매끄럽다. 드래그는 scrollLeft 를 쓰므로
    // 둘은 서로 간섭하지 않고 그대로 더해진다.
    const track = trackRef.current
    if (!track) return

    // 진행 위치는 ref 에 둔다. 호버가 끝나거나 창 크기가 바뀌어 이 effect 가
    // 다시 돌 때 0 부터 시작하면 띠가 맨 앞으로 튄다 — 멈췄던 자리에서
    // 이어서 흘러야 한다.
    let position = positionRef.current % loopWidth
    let previous = performance.now()
    let frame = 0

    const step = (now: number) => {
      position += (AUTO_SCROLL_PX_PER_SEC * (now - previous)) / 1000
      previous = now
      // 한 벌 길이만큼 흘렀으면 되돌린다. 둘째 벌이 같은 그림이라 티가 안 난다.
      if (position >= loopWidth) position -= loopWidth
      positionRef.current = position
      track.style.transform = `translate3d(${-position}px, 0, 0)`
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [scrollRef, cardWidth, isDragging, hovering, reduceMotion])

  return (
    <Section id="hero2-client-showcase" className="flex flex-col bg-surface-page pb-12 pt-12 md:pb-24 md:pt-[120px]">
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
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`mt-16 w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        {/* 카드를 두 벌 깐다. 한 벌 길이만큼 흘렀을 때 그만큼 되돌리면 같은
            그림이라 이음매가 보이지 않는다 — 끝에서 0 으로 튀는 것과 다르다.
            둘째 벌은 같은 내용의 복제라 보조기기에서는 뺀다. */}
        <div
          ref={trackRef}
          className="flex items-stretch will-change-transform"
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
