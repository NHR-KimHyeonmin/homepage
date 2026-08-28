import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

/**
 * Figma node 2287:3740 — "Hero 2-Title". Centered eyebrow + single-line
 * headline, plain white background, no body copy. Same visual pattern as
 * Hero2Headline.tsx but with only one headline line and no follow-up
 * two-line title.
 */
export function Hero2ApplicationTitle() {
  return (
    <Section id="hero2-application-title" className="flex flex-col items-center bg-white px-6 pt-16 md:px-16 md:pt-[180px]">
      <Container maxWidth={1208}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <p className="text-xl font-bold tracking-[-0.1px] text-gray-200">서류 접수</p>
          <p className="text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-black md:text-[56px]">자유로운 지원서 설정</p>
        </motion.div>
      </Container>
    </Section>
  )
}
