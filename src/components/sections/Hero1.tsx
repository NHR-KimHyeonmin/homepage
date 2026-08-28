import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import cursorImg from '../../assets/sections/hero1/cursor/cursor.png'
import dashboardHomeMain from '../../assets/sections/hero1/dashboard-home-main.webp'
import dashboardJobPostingsMain from '../../assets/sections/hero1/dashboard-jobpostings-main.webp'
import heroBg from '../../assets/sections/hero1/hero-bg.webp'
import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { Hero1Sidebar, type Hero1MainView } from './Hero1Sidebar'
import { Hero1TypedHeadline } from './Hero1TypedHeadline'

const MAIN_IMAGES: Record<Hero1MainView, { src: string; alt: string }> = {
  home: { src: dashboardHomeMain, alt: '커리어링크 관리자 대시보드 홈' },
  jobPostings: { src: dashboardJobPostingsMain, alt: '채용 공고 현황' },
}

// Figma node 2323:26304 — custom branded cursor (arrow + "careerlink" pill),
// shown across the whole dashboard mockup card (sidebar and screenshot
// alike) — hotspot (22, 27) lines up with the arrow's own tip.
const DASHBOARD_CARD_STYLE = { aspectRatio: '1280 / 740', cursor: `url(${cursorImg}) 22 27, auto` }

// How long the fully-typed headline sits still before it starts fading out.
const HOLD_TITLE_MS = 1500
// A brief beat after the title has fully faded out, before the rest of the
// hero starts rising into view.
const POST_TITLE_PAUSE_MS = 300
const REVEAL_STAGGER_MS = 500
const REVEAL_TRANSITION = { duration: 1, ease: [0.16, 1, 0.3, 1] as const }

type IntroPhase = 'typing' | 'holding' | 'exiting' | 'paused' | 'revealing' | 'done'

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
  const [jobsExpanded, setJobsExpanded] = useState(false)
  const [phase, setPhase] = useState<IntroPhase>('typing')
  // Subtitle, 메인텍스트2, CTA and the dashboard image all mount together —
  // only their individual transition `delay` staggers when each visually
  // rises into place.
  const revealed = phase === 'revealing' || phase === 'done'

  const goHome = () => {
    setActiveNav('home')
    setJobsExpanded(false)
  }

  // Lock page scroll for the whole intro (type -> title fades out -> pause
  // -> sequential reveal). Released once the reveal finishes.
  useEffect(() => {
    if (phase === 'done') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [phase])

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

  // Unlock scroll once the slowest-staggered element (the dashboard image)
  // has finished rising into place.
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
                jobsExpanded={jobsExpanded}
                onSelectHome={goHome}
                onToggleJobs={() => setJobsExpanded((v) => !v)}
                onSelectJobPostings={() => setActiveNav('jobPostings')}
                className="w-[260px] shrink-0 border-r border-[#e8eaee]"
              />

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
                    className="absolute inset-0 size-full object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </Section>
  )
}
