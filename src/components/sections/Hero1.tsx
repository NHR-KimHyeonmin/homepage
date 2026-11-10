import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BRAND_CURSOR, BrandCursorFollower } from '../ui/BrandCursorFollower'
import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { Hero1TypedHeadline } from './Hero1TypedHeadline'
import { AdminFrame, FRAME_HEIGHT, FRAME_WIDTH, VIEW_ORDER, type AdminView } from './hero1-admin/AdminShell'
import { VIEWS } from './hero1-admin/views'

/** 자동 순회 간격. */
const NAV_AUTOPLAY_MS = 3500


// How long the fully-typed headline sits still before it starts fading out.
const HOLD_TITLE_MS = 1000
// A brief beat after the title has fully faded out, before the rest of the
// hero starts rising into view.
const POST_TITLE_PAUSE_MS = 300
const REVEAL_STAGGER_MS = 500
const REVEAL_TRANSITION = { duration: 1, ease: [0.16, 1, 0.3, 1] as const }

type IntroPhase = 'typing' | 'holding' | 'exiting' | 'paused' | 'revealing' | 'done'

/** Entering on a deep link (e.g. "/#hero2-highlight") means the visitor is
 *  being sent straight to another section — playing the typing intro there
 *  would lock the page around an animation nobody is looking at, so the
 *  hero starts already settled in its final state. "#top" (and no hash at
 *  all) is a normal landing and still gets the full intro. */
function initialPhase(): IntroPhase {
  if (typeof window === 'undefined') return 'typing'
  const target = window.location.hash.slice(1)
  return target && target !== 'top' ? 'done' : 'typing'
}

// Delay (seconds) before each reveal element's own rise-in transition
// starts, so they stagger visually without staggering when they *mount* —
// all four are inserted into the DOM in one pass, then each independently
// animates from a bit below its final resting spot. Mounting together
// (rather than one after another) means nothing already on-screen ever gets
// shoved by a later sibling's insertion — every element's layout space is
// reserved from the same instant, so only opacity/transform animate.
const CTA_DELAY_S = REVEAL_STAGGER_MS / 1000
const IMAGE_DELAY_S = (REVEAL_STAGGER_MS * 2) / 1000

/**
 * 메인 배너 배경 — 레퍼런스의 세로 램프를 그대로 옮겼다. 위에서 아래로
 * 흰빛 라벤더 → 바이올렛 → 블루 → 하늘색으로 한 방향으로만 흐른다.
 *
 * 다만 색이 바뀌는 높이는 레퍼런스와 다르게 잡았다. 레퍼런스는 한가운데가
 * 가장 진한 바이올렛(#675fe7)인데, 이 배너는 그 높이에 어두운 머리글이
 * 올라간다 — 진한 구간을 CTA 아래로 내려, 글자가 앉는 띠는 연하게 두고
 * 진한 색은 대시보드 목업 뒤에서만 나오게 했다.
 *
 * 레퍼런스가 왼쪽이 조금 밝아(#b5adea 대 오른쪽 #6460e8) 그 기울기도
 * 한 겹 얹었다. 세로 램프만 두면 띠가 평평해 보인다.
 */
const STAGE_GRADIENT = [
  // 왼쪽을 살짝 띄우는 가로 기울기
  'linear-gradient(90deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0) 58%)',
  // 하늘색과 이웃한 두 색을 양쪽 아래에서 번지게 한다. 왼쪽은 연보라, 오른쪽은 민트.
  'radial-gradient(58% 62% at 12% 88%, rgba(170, 176, 255, 0.9) 0%, rgba(170, 176, 255, 0) 100%)',
  'radial-gradient(52% 58% at 90% 84%, rgba(112, 232, 218, 0.8) 0%, rgba(112, 232, 218, 0) 100%)',
  // 본체: 위에서 아래로 흐르는 세로 램프
  [
    'linear-gradient(180deg',
    '#f5fafe 0%',
    '#e3f1fb 24%',
    '#c5e3f7 42%',
    '#9dd7f5 58%',
    '#75c5f0 72%',
    '#39bbf3 88%',
    '#0d9ceb 100%)',
  ].join(', '),
].join(', ')

/**
 * 그라데이션을 잘라내는 마스크 두 장. 첫 장은 화면 아래 한가운데를 중심에
 * 둔 큰 타원이라, 경계가 수평선이 아니라 가운데가 가장 높고 좌우로 흘러
 * 내리는 아치가 된다. 둘째 장은 맨 아래를 투명으로 빼서 다음 섹션의 흰
 * 배경으로 이어준다. 두 장은 겹치는 부분만 남기도록 합성한다.
 */
const STAGE_ARCH = 'radial-gradient(ellipse 88% 104% at 50% 100%, #000 68%, transparent 100%)'
const STAGE_FOOT = 'linear-gradient(to bottom, #000 82%, transparent 100%)'
const STAGE_MASK = `${STAGE_ARCH}, ${STAGE_FOOT}`

/**
 * 그라데이션 위에 얹는 아주 연한 흰 모눈. 선 자체를 읽히게 하려는 게
 * 아니라 색면에 결을 주려는 것이라 1px / 알파 0.09 정도로 둔다.
 *
 * 색 레이어와 한 장에 합치지 않는다 — 색 레이어에는 숨쉬기 scaleY 가
 * 걸려 있어서, 같이 두면 모눈이 늘었다 줄었다 하며 움직임이 드러난다.
 */
/** 머리글에 입히는 기울기. 레퍼런스에서 뽑은 두 끝값 그대로다. */
const HEADLINE_GRADIENT = 'linear-gradient(100deg, #10263a 0%, #15304a 45%, #1d3d58 100%)'

const GRID_SIZE = 28
const GRID_LINE = 'rgba(255, 255, 255, 0.18)'
const STAGE_GRID = [
  `repeating-linear-gradient(0deg, ${GRID_LINE} 0 1px, transparent 1px ${GRID_SIZE}px)`,
  `repeating-linear-gradient(90deg, ${GRID_LINE} 0 1px, transparent 1px ${GRID_SIZE}px)`,
].join(', ')

/**
 * 대시보드 목업 그림자. 검정은 한색 그라데이션 위에서 탁하게 뜨므로,
 * 베이스 그라데이션의 블루그레이(#bfcde9)보다 어두운 쪽으로 내린
 * 청색 슬레이트를 쓴다. 넓게 퍼지는 한 겹과 바짝 붙는 한 겹을 겹쳐
 * 떠 있는 느낌만 주고 윤곽은 흐리지 않는다.
 */
const DASHBOARD_SHADOW = '0 24px 60px -12px rgba(13, 82, 140, 0.28)'

/**
 * 아치가 천천히 눌렸다 부풀기를 반복한다. 가로는 건드리지 않고 scaleY 만
 * 쓴다 — 양축을 함께 줄이면 레이어가 화면보다 좁아지는 순간 양옆에 잘린
 * 가장자리가 드러난다. 세로 위치도 아래를 축으로 고정해, 인트로 중과
 * 끝난 뒤의 배경 위치가 달라지지 않는다. 기준 크기는 왕복의 가운데에 둬서
 * 움직임을 끈 환경에서도 평균과 어긋나지 않게 했다.
 */
// 눈에 띄라고 진폭을 크게 벌렸다(11% -> 22% 왕복). 그만큼 주기도 늘린다 —
// 큰 폭을 빠르게 돌리면 숨이 아니라 들썩임으로 보인다.
const BREATH_SCALE = [0.93, 1.15, 0.93]
const BREATH_TRANSITION = {
  duration: 4.6,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

export function Hero1() {
  const reduceMotion = useReducedMotion()
  const [activeNav, setActiveNav] = useState<AdminView>('home')

  // 관리자 화면은 1920 x 1080 판으로 그려 두고 카드 폭에 맞춰 zoom 한다.
  // transform 과 달리 zoom 은 줄인/키운 크기로 다시 그려 글자가 흐려지지 않는다.
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(FRAME_WIDTH)
  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const measure = () => setCardWidth(el.clientWidth || FRAME_WIDTH)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 한 번이라도 직접 누르면 자동 전환은 끝난다 — 보고 있는 화면을 타이머가
  // 빼앗는 건 고장으로 읽힌다.
  const [navTakenOver, setNavTakenOver] = useState(false)
  const [phase, setPhase] = useState<IntroPhase>(initialPhase)
  // Subtitle, 메인텍스트2, CTA and the dashboard image all mount together —
  // only their individual transition `delay` staggers when each visually
  // rises into place.
  const revealed = phase === 'revealing' || phase === 'done'

  // Once typing finishes, hold the fully-typed headline in place for a
  // beat before it starts fading out.
  useEffect(() => {
    if (phase !== 'holding') return
    const timer = setTimeout(() => setPhase('exiting'), HOLD_TITLE_MS)
    return () => clearTimeout(timer)
  }, [phase])

  // Once the title has fully faded (see the AnimatePresence below), pause
  // briefly before the rest of the hero starts rising into view.
  useEffect(() => {
    if (phase !== 'paused') return
    const timer = setTimeout(() => setPhase('revealing'), POST_TITLE_PAUSE_MS)
    return () => clearTimeout(timer)
  }, [phase])

  // Mark the intro finished once the slowest-staggered element (the
  // dashboard image) has risen into place. The page is never scroll-locked
  // during any of this — a visitor who wants to move on can scroll straight
  // past the intro while it plays.
  useEffect(() => {
    if (phase !== 'revealing') return
    const doneTimer = setTimeout(() => setPhase('done'), REVEAL_STAGGER_MS * 2 + REVEAL_TRANSITION.duration * 1000)
    return () => clearTimeout(doneTimer)
  }, [phase])

  // 인트로가 끝난 뒤부터 좌측 메뉴를 한 칸씩 눌러 보여준다.
  useEffect(() => {
    if (navTakenOver || reduceMotion || phase !== 'done') return
    const timer = setInterval(() => {
      setActiveNav((current) => VIEW_ORDER[(VIEW_ORDER.indexOf(current) + 1) % VIEW_ORDER.length])
    }, NAV_AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [navTakenOver, reduceMotion, phase])

  const selectNav = (view: AdminView) => {
    setNavTakenOver(true)
    setActiveNav(view)
  }

  return (
    <Section
      id="top"
      className="flex min-h-screen flex-col items-center justify-center gap-16 overflow-hidden px-5 pb-24 pt-[140px] md:px-8 md:pb-[100px] md:pt-[180px]"
    >
      {/* 흰 바탕 위의 그라데이션 아치. 인트로가 도는 동안에도 끝난 뒤에도
          같은 자리에 있고, 아래를 축으로 줄었다 부푸는 움직임만 이어진다. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-white">
        <motion.div
          className="size-full origin-bottom"
          style={{
            backgroundImage: STAGE_GRADIENT,
            maskImage: STAGE_MASK,
            maskComposite: 'intersect',
            WebkitMaskImage: STAGE_MASK,
            WebkitMaskComposite: 'source-in',
          }}
          animate={reduceMotion ? undefined : { scaleY: BREATH_SCALE }}
          transition={reduceMotion ? undefined : BREATH_TRANSITION}
        />
        {/* 모눈은 숨쉬기를 따라가지 않는다. 같은 마스크로 잘라 아치 밖으로
            새어 나가지 않게만 맞춘다. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: STAGE_GRID,
            maskImage: STAGE_MASK,
            maskComposite: 'intersect',
            WebkitMaskImage: STAGE_MASK,
            WebkitMaskComposite: 'source-in',
          }}
        />
      </div>

      {/* 타이핑 인트로만 레이아웃 흐름에서 빼 뷰포트 한가운데 띄운다.
          배너 맨 위가 곧 화면 맨 위이므로 50vh 가 화면 중앙이다. */}
      <AnimatePresence onExitComplete={() => setPhase('paused')}>
        {(phase === 'typing' || phase === 'holding') && (
          <motion.div
            key="headline"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-x-0 top-[50vh] z-10 -translate-y-1/2 px-5 text-center text-title md:px-8"
          >
            <Hero1TypedHeadline start onDone={() => setPhase('holding')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 본문과 대시보드는 인트로가 도는 동안에도 DOM 에 남아 제 높이를
          차지한다 — 조건부로 끼워 넣으면 인트로가 끝나는 순간 섹션이
          늘어나며 페이지가 덜컥 밀린다. 보이지 않는 동안에는 보조기기와
          포인터 모두에서 빼 둔다. */}
      <div
        aria-hidden={!revealed}
        className={`flex w-full max-w-[1080px] flex-col items-center gap-12 pt-10 text-center ${revealed ? '' : 'pointer-events-none'}`}
      >
        <div className="flex flex-col items-center gap-6 text-title">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
            transition={REVEAL_TRANSITION}
            className="text-[18px] font-semibold tracking-[-0.12px] md:text-2xl"
          >
            채용 브랜딩부터 지원자 관리까지
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
            transition={REVEAL_TRANSITION}
            // 레퍼런스처럼 글자 자체에 아주 옅은 기울기를 준다 — 왼쪽은
            // 짙은 남색, 오른쪽으로 가며 살짝 밝아진다. 배경을 글자 모양으로
            // 오려내는 방식이라 color 는 투명으로 둔다.
            className="bg-clip-text text-[40px] font-bold leading-[1.28] text-transparent md:text-[64px]"
            style={{ backgroundImage: HEADLINE_GRADIENT }}
          >
            <span className="block">채용의 모든 것을</span>
            {/* 휴대폰에서는 "해결하세요." 가 한 글자만 다음 줄로 밀려 떨어졌다 — 좁은 화면에서는 세 줄로 끊는다. */}
            <span className="block">
              <span className="block md:inline">커리어링크에서</span> 해결하세요.
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
          transition={{ ...REVEAL_TRANSITION, delay: revealed ? CTA_DELAY_S : 0 }}
        >
          <Button variant="dark" className="px-5 py-2.5 text-[16px] md:px-7 md:py-3.5 md:text-[19px]">
            도입 문의하기
          </Button>
        </motion.div>
      </div>

      <motion.div
        aria-hidden={!revealed}
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 48 }}
        transition={{ ...REVEAL_TRANSITION, delay: revealed ? IMAGE_DELAY_S : 0 }}
        className={`relative w-full overflow-hidden rounded-media bg-white lg:w-[80vw] ${revealed ? '' : 'pointer-events-none'}`}
        style={{ boxShadow: DASHBOARD_SHADOW }}
      >
        <div
          ref={cardRef}
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}`, cursor: BRAND_CURSOR }}
        >
          <BrandCursorFollower targetRef={cardRef} />
          <div className="absolute left-0 top-0" style={{ zoom: cardWidth / FRAME_WIDTH }}>
            <AdminFrame active={activeNav} onSelect={selectNav} crumbs={VIEWS[activeNav].crumbs}>
              {/* 바뀌는 건 본문뿐 — 틀은 그대로 두고 본문만 겹쳐 바꾼다. */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeNav}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {(() => {
                    const View = VIEWS[activeNav].Component
                    return <View />
                  })()}
                </motion.div>
              </AnimatePresence>
            </AdminFrame>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
