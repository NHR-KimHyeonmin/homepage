import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import apr from '../../assets/sections/hero2-showcase/apr.webp'
import dongjin from '../../assets/sections/hero2-showcase/dongjin.webp'
import hankookilbo from '../../assets/sections/hero2-showcase/hankookilbo.webp'
import kbam from '../../assets/sections/hero2-showcase/kbam.webp'
import semes from '../../assets/sections/hero2-showcase/semes.webp'
import sirloin from '../../assets/sections/hero2-showcase/sirloin.webp'
import es from '../../assets/sections/hero2-showcase/es.webp'
import hyundai from '../../assets/sections/hero2-showcase/hyundai.webp'
import lotteAx from '../../assets/sections/hero2-showcase/lotte-ax.webp'
import lx from '../../assets/sections/hero2-showcase/lx-international.webp'
import mbc from '../../assets/sections/hero2-showcase/mbc.webp'
import samsungMedicine from '../../assets/sections/hero2-showcase/samsung-medicine.webp'
import sbs from '../../assets/sections/hero2-showcase/sbs.webp'
import skEcoplant from '../../assets/sections/hero2-showcase/sk-ecoplant.webp'
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
  { name: 'hankookilbo', label: '한국일보', image: hankookilbo, href: 'https://hankookilbo.careerlink.kr/' },
  { name: 'semes', label: '세메스', image: semes, href: 'https://semes.careerlink.kr/' },
  { name: 'sbs', label: 'SBS', image: sbs, href: 'https://sbs.careerlink.kr/' },
  { name: 'samsung-medicine', label: '삼성메디슨', image: samsungMedicine, href: 'https://samsungmedison.careerlink.kr/' },
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
  const { scrollRef, isDragging, dragHandlers } = useDragScroll<HTMLDivElement>()
  const { probeRef, inset } = useContentInsetLeft<HTMLDivElement, HTMLDivElement>(scrollRef)
  const [cardWidth, setCardWidth] = useState(320)
  /** 흘러온 거리. effect 가 다시 돌아도 이어서 가도록 ref 에 담아 둔다. */
  const reduceMotion = useReducedMotion()
  /** 포인터가 올라가 있는 동안은 세운다 — 보려고 멈춘 사람 앞에서 계속
   *  흘러가면 읽히지 않는다. 떼면 다시 흐른다(한 번 만지면 끝나는
   *  색상 스위처와 달리, 여기는 쭉 도는 띠라 멈춰 둘 이유가 없다). */
  const [hovering, setHovering] = useState(false)
  const [touching, setTouching] = useState(false)
  const resumeTimer = useRef(0)

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

  // 띠가 저 혼자 천천히 흐른다. 드래그 중이거나 포인터가 올라가 있으면
  // 멈춘다 — 사용자가 돌리는 중에 같이 밀면 손이 미끄러진 것처럼 느껴진다.
  //
  // requestAnimationFrame 으로 매 프레임 transform 을 고치면, 다른 구역의
  // 연출이 메인 스레드를 잡는 순간마다 프레임이 밀려 미세하게 끊긴다. CSS
  // 애니메이션은 합성 스레드에서 돌아 그런 영향을 받지 않는다. 멈출 때는
  // 지우지 않고 일시정지만 해서, 다시 흐를 때 멈췄던 자리에서 이어진다.
  // 드래그는 scrollLeft 를 쓰므로 transform 과 간섭하지 않고 더해진다.
  // 카드 한 벌 길이 — 첫 벌의 첫 카드에서 둘째 벌의 첫 카드까지.
  const loopWidth = CARDS.length * (cardWidth + GAP)
  const marqueeStyle =
    reduceMotion || loopWidth <= 0
      ? undefined
      : ({
          '--marquee-loop': `${loopWidth}px`,
          animation: `client-marquee ${loopWidth / AUTO_SCROLL_PX_PER_SEC}s linear infinite`,
          animationPlayState: isDragging || hovering || touching ? 'paused' : 'running',
        } as CSSProperties)

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
        {...dragHandlers}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        // 손가락으로 미는 동안에도 띠가 저 혼자 흐르면, 미는 만큼에 흐름이 더해져
        // 손보다 빨리 넘어간다. 닿아 있는 동안과 손을 뗀 뒤 관성이 끝날 때까지 멈춘다.
        onTouchStart={() => {
          window.clearTimeout(resumeTimer.current)
          setTouching(true)
        }}
        onTouchEnd={() => {
          resumeTimer.current = window.setTimeout(() => setTouching(false), 1500)
        }}
        className={`mt-16 w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        {/* 카드를 두 벌 깐다. 한 벌 길이만큼 흘렀을 때 그만큼 되돌리면 같은
            그림이라 이음매가 보이지 않는다 — 끝에서 0 으로 튀는 것과 다르다.
            둘째 벌은 같은 내용의 복제라 보조기기에서는 뺀다. */}
        <div
          className="flex items-stretch will-change-transform"
          style={{ gap: GAP, paddingLeft: inset, paddingRight: 24, ...marqueeStyle }}
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
