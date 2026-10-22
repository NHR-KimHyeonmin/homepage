import { useEffect, useRef, useState } from 'react'
import cardAutoEval from '../../assets/sections/hero4-cards/card1-auto-eval.webp'
import cardBasicRetro from '../../assets/sections/hero4-cards/card4-basic-retro.webp'
import cardBlind from '../../assets/sections/hero4-cards/card3-blind.webp'
import cardMemoHighlight from '../../assets/sections/hero4-cards/card2-memo-highlight.webp'
import cardAiQuestion from '../../assets/sections/hero4-cards/card5-ai-question.webp'
import iconChevronLeft from '../../assets/sections/hero4-cards/icon-chevron-left.svg'
import iconChevronRight from '../../assets/sections/hero4-cards/icon-chevron-right.svg'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

const CARDS = [
  {
    image: cardAutoEval,
    title: '자동평가',
    description:
      '경력, 보유 스킬, 자격증, 학력, 근무 가능 조건 등 채용에 필요한 항목을 기준과 배점으로 설정해 지원자를 정량적으로 평가합니다. 사전에 설정한 조건을 기반으로 모든 지원서를 빠짐없이 확인해, 검토 누락 가능성을 낮춥니다.',
  },
  {
    image: cardBasicRetro,
    title: 'Basic·Retro 뷰',
    description:
      '지원서는 확인 목적과 업무 환경에 맞춰 BASIC과 RETRO 두 가지 뷰로 제공됩니다. 화면에서 편리하게 검토하거나, 익숙한 표 형식으로 출력하는 등 원하는 방식으로 지원자 정보를 확인해 보세요.',
  },
  {
    image: cardMemoHighlight,
    title: '메모·하이라이트',
    description:
      '지원서를 검토하며 중요한 내용은 하이라이트로 표시하고, 지원자에 대한 판단이나 확인할 사항은 메모로 남겨 보세요. 면접과 평가 단계에서 검토 내용을 다시 빠르게 확인하며, 더 일관된 판단을 내릴 수 있습니다.',
  },
  {
    image: cardBlind,
    title: '블라인드·평가자 비공개 설정',
    description:
      '공공기관 채용의 공정성과 블라인드 채용 원칙에 맞춰, 지원서 내 특정 정보를 평가자에게 보이지 않도록 설정할 수 있습니다. 평가에 불필요한 개인정보를 최소화하고, 지원자의 역량과 경험에 집중하는 채용을 지원합니다.',
  },
  {
    image: cardAiQuestion,
    title: 'AI직무 질문 생성',
    description:
      'AI가 지원자의 지원 직무와 이력서 속 경력·기술·프로젝트 정보를 분석해, 직무 적합성을 확인할 수 있는 면접 질문을 생성합니다. 직무별 핵심 역량에 맞춘 질문으로 보다 체계적인 인터뷰를 진행할 수 있습니다.',
  },
]

/** Card width as a share of the scroll container so ~1.7 cards sit in view
 *  at once, encouraging horizontal discovery: c = (100% - gap) / 1.7. */
export function Hero4FeatureCards() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  // Empty leading/trailing space so even the first/last card can reach true
  // center — without it, centering clamps at the scroll edges and those two
  // cards can only ever slide as far as the edge, not all the way to center.
  const [spacerWidth, setSpacerWidth] = useState(0)

  const centerCard = (index: number, behavior: ScrollBehavior) => {
    const container = scrollRef.current
    const cardEl = cardRefs.current[index]
    if (!container || !cardEl) return

    const containerRect = container.getBoundingClientRect()
    const cardRect = cardEl.getBoundingClientRect()
    const cardCenterX = cardRect.left + cardRect.width / 2
    const containerCenterX = containerRect.left + containerRect.width / 2
    const maxScrollLeft = container.scrollWidth - container.clientWidth
    const target = container.scrollLeft + (cardCenterX - containerCenterX)

    container.scrollTo({ left: Math.max(0, Math.min(target, maxScrollLeft)), behavior })
  }

  useEffect(() => {
    const container = scrollRef.current
    const firstCard = cardRefs.current[0]
    if (!container || !firstCard) return
    const updateSpacer = () => setSpacerWidth(Math.max(0, (container.clientWidth - firstCard.clientWidth) / 2))
    updateSpacer()
    const observer = new ResizeObserver(updateSpacer)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Snap the first card to center once the spacers have their real size —
    // no animated scroll on first paint, just settle in place.
    centerCard(0, 'auto')
    // Only re-run when the spacer size (re)settles, not on every card change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spacerWidth])

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(CARDS.length - 1, index))
    setActiveIndex(clamped)
    centerCard(clamped, 'smooth')
  }

  return (
    <Section className="bg-white pb-12 pt-6 md:pb-24 md:pt-10">
      <Container className="flex justify-end pb-6">
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
            disabled={activeIndex === CARDS.length - 1}
            aria-label="다음 카드 보기"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#eeeeee]/[0.93] transition-opacity disabled:cursor-default disabled:opacity-40"
          >
            <img src={iconChevronRight} alt="" className="size-7" />
          </button>
        </div>
      </Container>

      <Container
        ref={scrollRef}
        maxWidth={1592}
        className="overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex items-stretch gap-5">
          <div aria-hidden className="shrink-0" style={{ width: spacerWidth }} />
          {CARDS.map((card, index) => (
            <div
              key={card.title}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              className="flex w-[58%] shrink-0 flex-col items-start gap-5"
            >
              <img
                src={card.image}
                alt={card.title}
                className="aspect-[952/580] w-full rounded-media object-cover"
              />
              <div className="flex flex-col gap-2">
                <h5 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-ink">{card.title}</h5>
                <p className="text-lg leading-[1.45] tracking-[-0.08px] text-black/55">{card.description}</p>
              </div>
            </div>
          ))}
          <div aria-hidden className="shrink-0" style={{ width: spacerWidth }} />
        </div>
      </Container>
    </Section>
  )
}
