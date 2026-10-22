import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import bgTexture from '../../assets/sections/testimonials/bg-texture.webp'
import iconTrash from '../../assets/sections/testimonials/icon-1-trash.png'
import iconEye from '../../assets/sections/testimonials/icon-2-eye.png'
import iconLock from '../../assets/sections/testimonials/icon-3-lock.png'
import iconPin from '../../assets/sections/testimonials/icon-4-pin.png'
import iconLogout from '../../assets/sections/testimonials/icon-5-logout.png'
import iconPrinter from '../../assets/sections/testimonials/icon-6-printer.png'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionEyebrow } from '../ui/SectionEyebrow'

interface SecurityCard {
  icon: string
  iconSize: number
  title: string
  description: string
}

const CARDS: SecurityCard[] = [
  {
    icon: iconTrash,
    iconSize: 26,
    title: '지원서 자동 파기',
    description: '채용 절차법에 따라 보유 기간이 지난 지원자 정보를 자동 파기해, 개인정보를 안전하게 관리할 수 있습니다.',
  },
  {
    icon: iconEye,
    iconSize: 30,
    title: '관리자 접속 기록',
    description: '접속 일시, IP, 열람 내역을 기록하여 누가 언제 어떤 정보에 접근했는지 확인할 수 있습니다.',
  },
  {
    icon: iconLock,
    iconSize: 26,
    title: '2차 인증 로그인',
    description: '아이디·비밀번호 외에 추가 인증 절차를 거쳐 관리자 계정 도용을 방지할 수 있습니다.',
  },
  {
    icon: iconLogout,
    iconSize: 26,
    title: '자동 로그아웃',
    description: '일정 시간 사용하지 않으면 자동 로그아웃되어 자리를 비운 사이 발생할 수 있는 정보 노출을 막을 수 있습니다.',
  },
  {
    icon: iconPrinter,
    iconSize: 26,
    title: '파기 확인서 발급',
    description: '지원서 개인정보 파기 내역을 확인서로 발급하여 파기 여부를 문서로 남기고 증빙할 수 있습니다.',
  },
  {
    icon: iconPin,
    iconSize: 28,
    title: 'IP 접근 제어',
    description: '등록된 IP에서만 관리자 사이트에 접속할 수 있도록 제한해, 외부의 무단 접근을 차단 할 수 있습니다.',
  },
]

/**
 * Dark "보안" (security) section. Background is a radial navy-to-black
 * gradient (from the Figma fill) with a low-opacity network-texture image
 * blended on top via mix-blend-difference — there's no flat dark token
 * that matches this, see the final report for the exact gradient stops.
 */
export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  // The section itself starts at 70vh tall and grows to a full 100vh as it
  // scrolls up into view, finishing exactly when it's centered in the
  // viewport. Only the section's height changes — the heading and cards
  // keep their normal size and just get more (or less) breathing room
  // around them, staying centered via `justify-center`.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })
  const minHeight = useTransform(scrollYProgress, [0, 1], ['70vh', '100vh'])

  return (
    <Section
      id="security"
      as={motion.section}
      ref={sectionRef}
      style={{ minHeight }}
      className="flex flex-col items-center justify-center gap-[80px] overflow-hidden bg-black py-12 md:py-24"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            // Reproduces the Figma radial-gradient fill (an off-canvas
            // elliptical glow anchored bottom-left, fading to black) as a
            // plain CSS gradient instead of an inline SVG data URI.
            backgroundImage:
              'radial-gradient(ellipse 160% 130% at 28% 118%, rgba(0,11,78,1) 0%, rgba(1,9,92,1) 34%, rgba(0,7,49,1) 69%, rgba(0,3,25,1) 84%, rgba(0,2,12,1) 92%, rgba(0,0,0,1) 100%)',
          }}
        />
        <div className="absolute inset-0 overflow-hidden mix-blend-difference opacity-20">
          <img
            src={bgTexture}
            alt=""
            className="absolute left-[-27.78%] top-[18.45%] h-[91.71%] w-[127.78%] max-w-none object-cover"
          />
        </div>
      </div>

      <Container className="flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <SectionEyebrow tone="onDark">보안</SectionEyebrow>
          <h2 className="text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-white md:text-[48px]">
            지원자와 기업 정보
            <br />
            보안은 강력하게
          </h2>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: (i % 3) * 0.08 }}
              className="flex h-40 flex-col justify-center gap-3 rounded-card border border-white/15 bg-[#292e54]/50 px-8 py-5 shadow-card"
            >
              <img src={card.icon} alt="" style={{ width: card.iconSize, height: card.iconSize }} />
              <div className="flex flex-col gap-0.5">
                <p className="text-lg font-bold tracking-[-0.09px] text-white">{card.title}</p>
                <p className="text-sm tracking-[-0.07px] text-[#d9e3f4]">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
