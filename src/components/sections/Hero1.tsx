import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import cursorImg from '../../assets/sections/hero1/cursor/cursor.png'
import dashboardHomeMain from '../../assets/sections/hero1/dashboard-home-main.webp'
import dashboardJobPostingsMain from '../../assets/sections/hero1/dashboard-jobpostings-main.webp'
import heroBg from '../../assets/sections/hero1/hero-bg.webp'
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

export function Hero1() {
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
      className="flex min-h-screen flex-col items-center justify-center gap-16 overflow-hidden px-6 pb-[100px] pt-[180px] md:px-16"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <img src={heroBg} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[82%] to-white to-[99%]" />
      </div>

      <div className="flex w-full max-w-[1080px] flex-col items-center gap-12 pt-10 text-center">
        <div className="flex flex-col items-center gap-6 text-white">
          {revealed && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={REVEAL_TRANSITION}
              className="text-2xl font-semibold tracking-[-0.12px]"
            >
              채용 브랜딩부터 지원자 관리까지
            </motion.p>
          )}

          <AnimatePresence onExitComplete={() => setPhase('paused')}>
            {(phase === 'typing' || phase === 'holding') && (
              <motion.div key="headline" exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                <Hero1TypedHeadline start onDone={() => setPhase('holding')} />
              </motion.div>
            )}
          </AnimatePresence>

          {revealed && (
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={REVEAL_TRANSITION}
              className="text-[40px] font-bold leading-[1.28] md:text-[64px]"
            >
              <span className="block">채용의 모든 것을</span>
              <span className="block">커리어링크에서 해결하세요.</span>
            </motion.h2>
          )}
        </div>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...REVEAL_TRANSITION, delay: CTA_DELAY_S }}
          >
            <Button variant="accent">도입 문의하기</Button>
          </motion.div>
        )}
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...REVEAL_TRANSITION, delay: IMAGE_DELAY_S }}
          className="relative w-full max-w-[1280px] overflow-hidden rounded-[20px] border-[12px] border-[#e8eaee] bg-white shadow-card"
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
      )}
    </Section>
  )
}
