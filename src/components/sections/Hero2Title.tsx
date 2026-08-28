import { motion } from 'framer-motion'
import chevronDown from '../../assets/sections/hero2-title/chevron-down.svg'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

function scrollToApplicantSection() {
  document.getElementById('hero2-headline')?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero2Title() {
  return (
    <Section id="hero2-title" className="flex flex-col items-center justify-center gap-24 bg-white px-6 py-24 md:py-[160px]">
      <Container maxWidth={1208}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-1 text-center text-2xl font-bold tracking-[-0.64px] text-ink md:text-[32px]"
        >
          <p className="leading-[1.4]">채용사이트 제작부터 홍보, 평가, 결과 안내까지</p>
          <p className="leading-[1.4]">채용의 모든 과정이 커리어링크에서</p>
          <p className="leading-[1.4]">하나로 이어집니다.</p>
        </motion.div>
      </Container>

      <motion.button
        type="button"
        onClick={scrollToApplicantSection}
        aria-label="다음 섹션(지원자 모집)으로 이동"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="flex cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-70"
      >
        <motion.img
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          src={chevronDown}
          alt=""
          aria-hidden
          className="size-9"
        />
      </motion.button>
    </Section>
  )
}
