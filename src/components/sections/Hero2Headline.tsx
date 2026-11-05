import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { SectionEyebrow } from '../ui/SectionEyebrow'
import { Section } from '../ui/Section'

export function Hero2Headline() {
  return (
    <Section id="hero2-headline" className="section-pt flex flex-col items-center bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <SectionEyebrow>지원자 모집</SectionEyebrow>
          <div className="type-title">
            <p>지원하고 싶은 사이트,</p>
            <p>들어오고 싶은 회사</p>
          </div>
          <p className="type-lead">
            커리어링크 사이트빌더로 최신 UI의 채용사이트를 만들어 보세요.
          </p>
        </motion.div>
      </Container>
    </Section>
  )
}
