import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import cursorImg from '../../assets/sections/hero1/cursor/cursor.png'
import dashboardHomeMain from '../../assets/sections/hero1/dashboard-home-main.webp'
import dashboardJobPostingsMain from '../../assets/sections/hero1/dashboard-jobpostings-main.webp'
import viewApplicants from '../../assets/sections/hero1/views/applicants.webp'
import viewHiringProcess from '../../assets/sections/hero1/views/hero-process.webp'
import viewSending from '../../assets/sections/hero1/views/sending.webp'
import viewSiteBuilder from '../../assets/sections/hero1/views/site-builder.webp'
import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { Hero1Sidebar, type Hero1MainView } from './Hero1Sidebar'
import { Hero1TopBar } from './Hero1TopBar'
import { Hero1TypedHeadline } from './Hero1TypedHeadline'

const MAIN_IMAGES: Record<Hero1MainView, { src: string; alt: string }> = {
  home: { src: dashboardHomeMain, alt: '커리어링크 관리자 대시보드 홈' },
  jobPostings: { src: dashboardJobPostingsMain, alt: '채용 공고 현황' },
  hiringProcess: { src: viewHiringProcess, alt: '채용 전형 관리' },
  applicants: { src: viewApplicants, alt: '지원자 관리' },
  sending: { src: viewSending, alt: '발송 관리' },
  siteBuilder: { src: viewSiteBuilder, alt: '채용 사이트 빌더' },
}

// Figma node 2323:26304 — custom branded cursor (arrow + "careerlink" pill),
// shown across the whole dashboard mockup card (sidebar and screenshot
// alike) — hotspot (22, 27) lines up with the arrow's own tip.
const DASHBOARD_CARD_STYLE = { aspectRatio: '1280 / 740', cursor: `url(${cursorImg}) 22 27, auto` }

// The admin page background behind every content-pane screenshot — sampled
// straight out of the exported views, so the strip left over below a
// screenshot (at viewport widths where the card is narrower than its full
// 1280px) is indistinguishable from the image itself.
const MAIN_PANE_BG = '#f0f4f9'

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
 * 메인 배너 배경 — tana.inc HeroStage_stage 의 3층 구성(대각선 베이스 위에
 * 반대쪽 두 모서리의 radial 글로우)을 명도까지 같은 수준으로 맞췄다.
 * 난색을 쓰지 않고 한색 안에서만 대비를 만든다 — 양 끝을 라벤더와 민트로
 * 벌려 두면 인접색만 쓸 때의 단조로움 없이 전체 온도는 차갑게 유지된다.
 * 배경이 밝으므로 이 위의 글자는 어두운 색이어야 한다.
 */
const STAGE_GRADIENT = [
  // 우상단: 맑은 하늘색이 번진다
  'radial-gradient(60% 70% at 85% 10%, rgba(186, 212, 246, 0.9) 0px, rgba(186, 212, 246, 0) 70%)',
  // 좌측 중단: 서늘한 민트. 배너 아래쪽 절반은 대시보드 목업이 덮으므로
  // 레퍼런스처럼 바닥(100%)에 두면 보이지 않는다 — 눈에 걸리는 높이로 올렸다.
  'radial-gradient(55% 65% at 6% 60%, rgba(183, 228, 226, 0.95) 0px, rgba(183, 228, 226, 0) 70%)',
  // 베이스: 블루그레이 -> 라벤더 -> 민트로 넘어가는 대각선
  'linear-gradient(135deg, #bfcde9, #d6d3ef 45%, #c6e3e6)',
].join(', ')

/**
 * 그라데이션을 잘라내는 마스크 두 장. 첫 장은 화면 아래 한가운데를 중심에
 * 둔 큰 타원이라, 경계가 수평선이 아니라 가운데가 가장 높고 좌우로 흘러
 * 내리는 아치가 된다. 둘째 장은 맨 아래를 투명으로 빼서 다음 섹션의 흰
 * 배경으로 이어준다. 두 장은 겹치는 부분만 남기도록 합성한다.
 */
const STAGE_ARCH = 'radial-gradient(ellipse 67% 75% at 50% 100%, #000 72%, transparent 100%)'
const STAGE_FOOT = 'linear-gradient(to bottom, #000 82%, transparent 100%)'
const STAGE_MASK = `${STAGE_ARCH}, ${STAGE_FOOT}`

/**
 * 대시보드 목업 그림자. 검정은 한색 그라데이션 위에서 탁하게 뜨므로,
 * 베이스 그라데이션의 블루그레이(#bfcde9)보다 어두운 쪽으로 내린
 * 청색 슬레이트를 쓴다. 넓게 퍼지는 한 겹과 바짝 붙는 한 겹을 겹쳐
 * 떠 있는 느낌만 주고 윤곽은 흐리지 않는다.
 */
const DASHBOARD_SHADOW = '0 24px 60px -12px rgba(47, 68, 116, 0.28), 0 2px 10px 0 rgba(47, 68, 116, 0.12)'

/**
 * 아치가 천천히 눌렸다 부풀기를 반복한다. 가로는 건드리지 않고 scaleY 만
 * 쓴다 — 양축을 함께 줄이면 레이어가 화면보다 좁아지는 순간 양옆에 잘린
 * 가장자리가 드러난다. 세로 위치도 아래를 축으로 고정해, 인트로 중과
 * 끝난 뒤의 배경 위치가 달라지지 않는다. 기준 크기는 왕복의 가운데에 둬서
 * 움직임을 끈 환경에서도 평균과 어긋나지 않게 했다.
 */
const BREATH_SCALE = [0.94, 1.11, 0.94]
const BREATH_TRANSITION = {
  // 진폭을 키운 만큼 주기도 늘린다 — 크게 움직이는데 빠르면 숨이 아니라
  // 들썩임으로 보인다.
  duration: 5,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

export function Hero1() {
  const reduceMotion = useReducedMotion()
  const [activeNav, setActiveNav] = useState<Hero1MainView>('home')
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
      </div>

      {/* 타이핑 인트로만 레이아웃 흐름에서 빼 뷰포트 한가운데 띄운다.
          배너 맨 위가 곧 화면 맨 위이므로 50vh 가 화면 중앙이다. */}
      <AnimatePresence onExitComplete={() => setPhase('paused')}>
        {(phase === 'typing' || phase === 'holding') && (
          <motion.div
            key="headline"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-x-0 top-[50vh] z-10 -translate-y-1/2 px-5 text-center text-ink md:px-8"
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
        <div className="flex flex-col items-center gap-6 text-ink">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
            transition={REVEAL_TRANSITION}
            className="text-2xl font-semibold tracking-[-0.12px]"
          >
            채용 브랜딩부터 지원자 관리까지
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
            transition={REVEAL_TRANSITION}
            className="text-[40px] font-bold leading-[1.28] md:text-[64px]"
          >
            <span className="block">채용의 모든 것을</span>
            <span className="block">커리어링크에서 해결하세요.</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
          transition={{ ...REVEAL_TRANSITION, delay: revealed ? CTA_DELAY_S : 0 }}
        >
          <Button variant="dark">도입 문의하기</Button>
        </motion.div>
      </div>

      <motion.div
        aria-hidden={!revealed}
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 48 }}
        transition={{ ...REVEAL_TRANSITION, delay: revealed ? IMAGE_DELAY_S : 0 }}
        className={`relative w-full max-w-[1280px] overflow-hidden rounded-media bg-white ${revealed ? '' : 'pointer-events-none'}`}
        style={{ boxShadow: DASHBOARD_SHADOW }}
      >
          <div className="relative w-full" style={DASHBOARD_CARD_STYLE}>
            <div className="absolute inset-0 flex">
              <Hero1Sidebar
                activeNav={activeNav}
                onSelectView={setActiveNav}
                className="w-[260px] shrink-0 border-r border-[#e8eaee]"
              />

              {/* Right pane = a fixed top bar that never moves, plus the
                  content-pane screenshot below it. The screenshot is sized
                  by width only (`w-full`, auto height) so it is never
                  cropped horizontally — every view shares the same
                  1020 x 680 content-pane framing. */}
              <div className="relative flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: MAIN_PANE_BG }}>
                <Hero1TopBar />

                <div className="relative flex-1 overflow-hidden">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={activeNav}
                      src={MAIN_IMAGES[activeNav].src}
                      alt={MAIN_IMAGES[activeNav].alt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="absolute inset-x-0 top-0 w-full"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
    </Section>
  )
}
