import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { IconChevronRight } from '@tabler/icons-react'
import card1 from '../../assets/sections/hero8-gallery/card-1.webp'
import card2 from '../../assets/sections/hero8-gallery/card-2.webp'
import card3 from '../../assets/sections/hero8-gallery/card-3.webp'
import card4 from '../../assets/sections/hero8-gallery/card-4.webp'
import card5 from '../../assets/sections/hero8-gallery/card-5.webp'
import card6 from '../../assets/sections/hero8-gallery/card-6.webp'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

interface ServiceCard {
  name: string
  href: string
  image: string
  description: string
}

const CARDS: ServiceCard[] = [
  {
    name: '커리어톡',
    href: 'https://www.careertalk.kr/home',
    image: card2,
    description: '채용 관련 행사를 올인원으로 준비할 수 있는 운영 솔루션, 국내/외 탑티어 유저가 꾸준히 확보되는 플랫폼입니다.',
  },
  {
    name: '커리어앤',
    href: 'https://n-hrlab.careerlink.kr/',
    image: card1,
    description: '개인과 조직에 대한 다차원적 진단을 바탕으로 적합한 인재를 확보할 수 있도록 돕는 진단 솔루션입니다.',
  },
  {
    name: '채용 마케팅',
    href: 'https://nhr.kr/project_HRM',
    image: card5,
    description: '채용부터 조직문화까지, 전방위적인 HR 마케팅 통합 솔루션으로 HR 브랜딩의 방향을 제시합니다.',
  },
  {
    name: '채용 컨설팅',
    href: 'https://nhr.kr/project_HRC',
    image: card3,
    description: '채용 직무 분석, 채용 역량 모델링, 채용평가 재설계 및 교육, 서류/필기/면접전형 대행을 진행합니다.',
  },
  {
    name: 'peak',
    href: 'https://peak.io.kr/',
    image: card4,
    description: '채용 프로세스 구축부터 온보딩 설계까지, 기업의 채용 문제를 해결하는 All-in-One 채용솔루션입니다.',
  },
  {
    name: '20대 연구소',
    href: 'https://www.20slab.org/',
    image: card6,
    description: '20대 유저의 라이프스타일, 가치관, 소비 트렌드를 연구하여 기업의 마케팅 전략 수립에 필요한 인사이트를 지원합니다.',
  },
]

/** 접힌 띠 한 장의 폭. 그림이 어떤 그림인지 알아볼 만큼은 남기고, 펼친
 *  장의 자리를 뺏지 않을 만큼만 좁힌다. */
const COLLAPSED = 68
/** 장 사이. */
const GAP = 14
/** 다음 장이 펼쳐지는 간격(ms). */
const INTERVAL = 3000
/** 무대 높이 = 무대 폭 × 이 값. 펼친 장이 가로로 긴 판이 된다. */
const RATIO = 0.44

/**
 * 가로로 접었다 펴는 띠.
 *
 * 한 장만 펼쳐 두고 나머지는 띠로 접어 오른쪽에 세워 둔다. 띠를 누르면 그
 * 장이 펴지고, 펴져 있던 장은 그 자리에서 띠로 접힌다 — 접힌 장이 왼쪽에
 * 쌓이고 아직 안 본 장이 오른쪽에 남아, 여섯 장 중 지금 어디쯤인지가 자리로
 * 드러난다.
 *
 * 펼친 폭과 접힌 폭은 늘 같다. 장마다 크기가 달라지면 "고른 것" 이 아니라
 * "큰 것" 으로 읽혀, 무엇을 누른 건지가 흐려진다.
 *
 * 전에는 가운데 한 장을 두고 3D 로 펼치는 덱이었다. 겹쳐 놓으면 뒤 장이
 * 무엇인지 알아볼 수가 없어, 누를 대상을 고를 수가 없었다.
 *
 * 글은 그림 위에 얹는다 — 그림과 글이 아래위로 떨어져 있으면 어느 글이 어느
 * 그림의 것인지 한 번 더 짚어 봐야 한다. 대신 그림이 밝으면 흰 글씨가 묻히니
 * 아래쪽에 검정 그라데이션을 깔아 글이 설 바닥을 만든다.
 */
export function Hero8Gallery() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState(0)
  /** 읽는 중에 장이 넘어가지 않도록 마우스를 올린 동안은 멈춘다. */
  const [paused, setPaused] = useState(false)
  const inView = useInView(stageRef, { amount: 0.4 })
  const reduceMotion = useReducedMotion()

  // active 가 바뀔 때마다 다시 재므로, 직접 누른 뒤에도 3초를 온전히 보여 준다.
  useEffect(() => {
    if (!inView || paused || reduceMotion) return
    const timer = setTimeout(() => setActive((i) => (i + 1) % CARDS.length), INTERVAL)
    return () => clearTimeout(timer)
  }, [active, inView, paused, reduceMotion])

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /** 펼친 장은 남는 폭을 전부 가져간다 — 띠 다섯과 사이 간격을 뺀 나머지. */
  const expanded = Math.max(0, width - (CARDS.length - 1) * (COLLAPSED + GAP))

  return (
    <Section className="flex flex-col items-center content-pt section-pb overflow-x-clip">
      <Container>
        <div
          ref={stageRef}
          className="w-full"
          style={{ height: width * RATIO }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
            <div className="flex h-full" style={{ gap: GAP }}>
              {CARDS.map((card, index) => {
                const isActive = index === active
                return (
                  // 장을 펼치는 버튼 안에 링크를 넣을 수 없어(버튼 안 링크는 잘못된 마크업),
                  // 폭이 바뀌는 판을 밖에 두고 버튼과 글 묶음을 그 안에 나란히 놓는다.
                  <motion.div
                    key={card.name}
                    initial={false}
                    animate={{ width: isActive ? expanded : COLLAPSED }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%' }}
                    className="relative shrink-0 overflow-hidden rounded-media bg-[#111]"
                  >
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-expanded={isActive}
                    aria-label={card.name}
                    className="absolute inset-0 cursor-pointer text-left"
                  >
                    <img
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      src={card.image}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                    {/* 글이 설 바닥. 위쪽은 건드리지 않아 그림이 그대로 보인다. */}
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.88) 100%)',
                      }}
                    />
                    {/* 접힌 띠는 한 겹 더 어둡게 덮는다 — 그림이 밝으면
                        세워 둔 제목이 묻히고, 펼친 장과도 구분이 안 된다. */}
                    <motion.div
                      aria-hidden
                      initial={false}
                      animate={{ opacity: isActive ? 0 : 1 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 bg-black/30"
                    />
                    {/* 접힌 띠에는 제목만 세워 둔다. 가로로 두면 좁은 띠에 다 안 들어간다.
                        세로쓰기(글자 눕힘)를 180도 돌려 아래에서 위로 읽히게 하면,
                        글 길이와 상관없이 시작점이 띠 아래쪽에 일정하게 놓이고
                        좌우 가운데도 flex 로 맞는다. */}
                    <motion.div
                      aria-hidden
                      initial={false}
                      animate={{ opacity: isActive ? 0 : 1 }}
                      transition={{ duration: isActive ? 0.15 : 0.4, delay: isActive ? 0 : 0.2 }}
                      className="absolute inset-x-0 bottom-5 flex justify-center"
                    >
                      <span className="rotate-180 whitespace-nowrap text-[18px] font-bold leading-none tracking-[-0.36px] text-white [text-orientation:sideways] [writing-mode:vertical-rl]">
                        {card.name}
                      </span>
                    </motion.div>

                  </button>

                    <motion.div
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: isActive ? 0.4 : 0.15, delay: isActive ? 0.2 : 0 }}
                      style={{ width: expanded }}
                      className="pointer-events-none absolute bottom-0 left-0 flex flex-col gap-2 p-7"
                    >
                      <h5 className="text-[22px] font-bold leading-[1.25] tracking-[-0.44px] text-white">
                        {card.name}
                      </h5>
                      <p className="text-[16px] leading-[1.5] tracking-[-0.08px] text-white/75">{card.description}</p>
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isActive ? 0 : -1}
                        className={clsx(
                          '-ml-2.5 mt-1 flex w-fit items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-[14px] font-bold tracking-[-0.28px] text-white transition-colors hover:bg-white/15',
                          isActive && 'pointer-events-auto',
                        )}
                      >
                        자세히 보기
                        <IconChevronRight size={16} stroke={2} />
                      </a>
                    </motion.div>
                  </motion.div>
                )
              })}
          </div>
        </div>
      </Container>
    </Section>
  )
}
