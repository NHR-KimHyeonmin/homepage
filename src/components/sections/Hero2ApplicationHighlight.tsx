import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

/**
 * Figma node 2294:14163 — "Hero 2-Title". Left-aligned two-line headline +
 * body paragraph, plain white background. Same visual pattern as
 * Hero2Highlight.tsx (same body copy, reused verbatim from that component)
 * but left-aligned instead of centered, with a different headline and no
 * shared bottom padding (kept as a standalone duplicate rather than an
 * extension of Hero2Highlight — see component notes for why).
 */
export function Hero2ApplicationHighlight() {
  return (
    <Section id="hero2-application-highlight" className="flex flex-col items-start bg-white px-6 pt-16 md:px-16 md:pt-[120px]">
      <Container maxWidth={1208}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex w-full flex-col items-start gap-5"
        >
          <div className="text-[32px] font-bold leading-[1.4] tracking-[-0.84px] text-black md:text-[42px]">
            <p>지원자 확보에 유리한</p>
            <p>지원서 접수 설정</p>
          </div>
          <p className="text-lg leading-[1.45] tracking-[-0.1px] text-black/55 md:text-xl">
            채용 사이트 방문자의 데이터를 수집하여 지원자의 유입 채널을 분석하여 다음 채용 전략에 활용할 수 있습니다.
          </p>
        </motion.div>
      </Container>
    </Section>
  )
}
