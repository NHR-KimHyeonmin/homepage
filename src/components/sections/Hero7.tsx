import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import arrowNext from '../../assets/sections/hero7/arrow-next.svg'
import arrowPrev from '../../assets/sections/hero7/arrow-prev.svg'
import badge from '../../assets/sections/hero7/badge.png'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionEyebrow } from '../ui/SectionEyebrow'

interface Review {
  /** 한 줄로 요약한 후기. 따옴표까지 문구에 포함한다. */
  quote: string
  body: string
  /** 기업 로고. 아직 못 받은 자리는 비워 두고 이름만 글자로 세운다. */
  logo?: string
  company: string
  /** 글쓴이 — "채용담당자(인사팀)" 처럼 부서명까지. */
  author: string
}

/**
 * ⚠️ 실제로 받은 후기는 첫 번째 하나뿐이다. 나머지는 넘어가는 모습을 볼 수
 * 있게 둔 자리표시이며, 어느 기업의 말로도 적지 않았다 — 받은 후기로
 * 바꿔 넣을 것.
 */
const REVIEWS: Review[] = [
  {
    quote: '"전형 리드타임 단축 및 높은 사용자 편의성"',
    body: '도입 이후 지원자가 90% 상승했습니다. 실시간 대응과 일부 커스터마이징 가능한 항목이 있어 전형 리드타임이 단축되었고, 고졸 채용 시 자동 평점 계산이 큰 도움이 되었습니다. 사용해 본 ATS 중 최고의 디자인과 사용자 편의성, 계속되는 업데이트가 매우 만족스럽습니다.',
    logo: badge,
    company: '대학내일ES',
    author: '채용담당자',
  },
  {
    quote: '"메인 후기 문구가 들어갈 자리"',
    body: '후기 상세 내용이 들어갈 자리입니다. 받은 후기로 바꿔 넣어 주세요.',
    company: '기업 로고',
    author: '채용담당자(부서명)',
  },
  {
    quote: '"메인 후기 문구가 들어갈 자리"',
    body: '후기 상세 내용이 들어갈 자리입니다. 받은 후기로 바꿔 넣어 주세요.',
    company: '기업 로고',
    author: '채용담당자(부서명)',
  },
]

/** 다음 후기로 넘어가는 간격(ms). */
const INTERVAL = 2000
/** 이만큼 넘게 가로로 밀어야 다음 후기로 넘어간다(px). */
const SWIPE_MIN = 50

export function Hero7() {
  const [index, setIndex] = useState(0)
  /** 읽는 중에 글이 바뀌면 문장을 놓친다 — 올려 두면 멈춘다. */
  const [paused, setPaused] = useState(false)
  const total = REVIEWS.length

  useEffect(() => {
    if (paused || total < 2) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), INTERVAL)
    return () => clearInterval(timer)
  }, [paused, total, index])

  const go = (next: number) => setIndex(((next % total) + total) % total)

  // 본문을 좌우로 밀어도 넘어간다(마우스 끌기·터치 모두). 세로로 더 움직였으면
  // 페이지 스크롤로 보고 넘기지 않는다.
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const onSwipeEnd = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return
    go(dx < 0 ? index + 1 : index - 1)
  }

  return (
    <Section id="testimonials" className="flex flex-col items-center section-pt section-pb bg-brand-50">
      <Container className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <SectionEyebrow>후기</SectionEyebrow>
        </motion.div>

        {/* 후기를 모두 같은 칸에 포개 둔다. 칸은 가장 긴 후기에 맞춰지므로,
            글 길이가 다른 후기끼리 오가도 아래 화살표가 들썩이지 않는다.
            안 보이는 쪽은 지우지 않고 투명도만 0 으로 둔다 — 빼 버리면 칸이
            다시 줄어 같은 들썩임이 돌아온다. */}
        <div
          // pan-y: 세로 스크롤은 브라우저에 맡기고, 가로 밀기만 여기서 받는다.
          className="mt-7 grid w-full max-w-[760px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={(event) => {
            swipeStart.current = { x: event.clientX, y: event.clientY }
          }}
          onPointerUp={onSwipeEnd}
          onPointerCancel={() => {
            swipeStart.current = null
          }}
        >
          {REVIEWS.map((review, i) => {
            const isCurrent = i === index
            return (
              <motion.figure
                key={`${review.company}-${i}`}
                aria-hidden={!isCurrent}
                initial={false}
                animate={{ opacity: isCurrent ? 1 : 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{ pointerEvents: isCurrent ? 'auto' : 'none' }}
                className="col-start-1 row-start-1 flex flex-col items-center gap-5 text-center"
              >
                <blockquote className="flex flex-col gap-4">
                  <p className="text-[34px] font-semibold leading-[1.35] tracking-[-0.68px] text-title">
                    {review.quote}
                  </p>
                  <p className="type-card-body">{review.body}</p>
                </blockquote>
                <figcaption className="flex flex-col items-center gap-2 pt-2">
                  {review.logo ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={review.logo}
                      alt={review.company}
                      className="h-8 w-[106px] object-contain"
                    />
                  ) : (
                    <span className="flex h-8 items-center text-base font-bold tracking-[-0.08px] text-sub">
                      {review.company}
                    </span>
                  )}
                  <span className="text-sm tracking-[-0.07px] text-sub">{review.author}</span>
                </figcaption>
              </motion.figure>
            )
          })}
        </div>

        <div className="flex items-center gap-4 pt-10">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="이전 후기"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-70"
          >
            <img loading="lazy" decoding="async" src={arrowPrev} alt="" className="size-7" />
          </button>
          {/* 몇 번째인지 점으로 짚어 준다. 2초마다 바뀌는 글만 보고 있으면
              몇 개짜리인지, 한 바퀴를 돌았는지가 안 잡힌다. */}
          <div className="flex items-center gap-2">
            {REVIEWS.map((review, i) => (
              <button
                key={`dot-${review.company}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번째 후기 보기`}
                aria-current={i === index}
                className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-[#4f6272]' : 'w-2 bg-[#d3d9df] hover:bg-[#9aa5b1]'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="다음 후기"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-70"
          >
            <img loading="lazy" decoding="async" src={arrowNext} alt="" className="size-7" />
          </button>
        </div>
      </Container>
    </Section>
  )
}
