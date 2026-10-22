import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { SectionEyebrow } from '../ui/SectionEyebrow'
import { Section } from '../ui/Section'

/**
 * Figma node 2287:3740 — "Hero 2-Title". Centered eyebrow + single-line
 * headline, plain white background, no body copy. Same visual pattern as
 * Hero2Headline.tsx but with only one headline line and no follow-up
 * two-line title.
 */
export function Hero2ApplicationTitle() {
  return (
    <Section id="hero2-application-title" className="flex flex-col items-center bg-white pt-12 md:pt-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <SectionEyebrow>서류 접수</SectionEyebrow>
          <p className="text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-black md:text-[48px]">자유로운 지원서 설정</p>
          <p className="max-w-[1208px] text-[17px] font-medium leading-[1.45] tracking-[-0.1px] text-black/55">
            144개의 다양한 지원서 항목을 직접 추가해보변서 지원서 양식을 구성해보세요.
          </p>
        </motion.div>
      </Container>
    </Section>
  )
}
