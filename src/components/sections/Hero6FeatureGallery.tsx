import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  IconBook2,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconMessages,
  IconRocket,
  IconShieldCheck,
  IconUserCheck,
  IconWorldWww,
  type Icon,
} from '@tabler/icons-react'
import { useContentInsetLeft } from '../../hooks/useContentInsetLeft'
import { useDragScroll } from '../../hooks/useDragScroll'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

const CARDS: { title: string; description: string; Icon: Icon }[] = [
  {
    title: '온보딩 및 초기 세팅 지원',
    description: '시스템 실제 오픈 전 대면/비대면 미팅을 통해 온보딩 지원을 드립니다.',
    Icon: IconRocket,
  },
  {
    title: '전담 매니저 배정',
    description: '시스템 사용간 이슈 발생 시 즉각 조치할 수 있도록 전담자를 배정해드립니다.',
    Icon: IconUserCheck,
  },
  {
    title: 'GA 대시보드 제공',
    description:
      '최종제출 인원이 어느 경로에서 인입되었는지 확인할 수 있는 대시보드를 제공해 드립니다. (GA 수집동의 필요)',
    Icon: IconChartBar,
  },
  {
    title: '가이드북 제공',
    description: '커리어링크 사용 온라인 가이드를 제공해 드립니다.',
    Icon: IconBook2,
  },
  {
    title: '실시간 채팅 상담',
    description: '가이드북으로 찾기 어려운 부분을 실시간 채팅을 통해 해소해 드리고 있습니다.',
    Icon: IconMessages,
  },
  {
    title: '홈페이지 제작 지원',
    description: 'HR브랜딩 전문가 NHR이 귀사의 채용 홈페이지 제작을 직접 도와드립니다.',
    Icon: IconWorldWww,
  },
  {
    title: '보안 점검 지원',
    description:
      '안정적인 운영을 위해 안정적인 보안 체계가 중요합니다. 귀사의 정기적 보안 점검에 적극적으로 대응하며 준수합니다.',
    Icon: IconShieldCheck,
  },
]

const CARD_WIDTH = 340
const CARD_GAP = 20

/**
 * 같은 크기의 카드 일곱 장을 한 줄로 두고 가로로 넘긴다. 끌기, 휠, 터치로 넘길 수
 * 있고 넓은 화면에서는 화살표도 쓸 수 있다. 첫 카드는 구역 제목과 왼쪽을 맞춘다.
 */
export function Hero6FeatureGallery() {
  const { scrollRef, isDragging, dragHandlers } = useDragScroll<HTMLDivElement>()
  const { probeRef, inset } = useContentInsetLeft<HTMLDivElement, HTMLDivElement>(scrollRef)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const read = () =>
      setEdge({ start: el.scrollLeft <= 1, end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 1 })
    read()
    el.addEventListener('scroll', read, { passive: true })
    const observer = new ResizeObserver(read)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', read)
      observer.disconnect()
    }
  }, [scrollRef])

  const move = (direction: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: direction * (CARD_WIDTH + CARD_GAP), behavior: 'smooth' })

  const arrow =
    'flex size-10 cursor-pointer items-center justify-center rounded-full bg-white text-brand-700 shadow-soft transition-opacity disabled:cursor-default disabled:opacity-40'

  return (
    <Section className="content-pt flex flex-col items-center">
      {/* 제목이 선 칸을 높이 0 으로 본떠, 폭이 바뀌어도 첫 카드 자리를 재서 맞춘다. */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-0 w-full">
        <div className="mx-auto h-0 w-full max-w-[1280px] px-5 md:px-8">
          <div ref={probeRef} className="h-0" />
        </div>
      </div>

      {/* 제목과 카드 사이 여백 안에 걸쳐 두어, 다른 구역과 간격이 달라지지 않게 한다. */}
      <Container className="relative hidden h-0 md:block">
        <div className="absolute bottom-3 right-8 flex gap-3">
          <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label="이전 카드 보기" className={arrow}>
            <IconChevronLeft size={22} stroke={1.8} />
          </button>
          <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label="다음 카드 보기" className={arrow}>
            <IconChevronRight size={22} stroke={1.8} />
          </button>
        </div>
      </Container>

      <div
        ref={scrollRef}
        {...dragHandlers}
        className={`w-full overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      >
        {/* 넘길 때 카드가 하나씩 나타나지 않도록 줄 전체가 한 번에 들어온다. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex w-max items-stretch"
          style={{ gap: CARD_GAP, paddingLeft: inset, paddingRight: inset }}
        >
          {CARDS.map(({ title, description, Icon }) => (
            <div key={title} className="flex shrink-0 flex-col gap-6 rounded-card bg-brand-50 p-7" style={{ width: CARD_WIDTH }}>
              <span className="flex size-11 items-center justify-center rounded-[10px] bg-white text-brand-700 shadow-soft">
                <Icon size={22} stroke={1.8} />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="type-card-title">{title}</h3>
                <p className="type-card-body">{description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
