import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionEyebrow } from '../ui/SectionEyebrow'

export function Hero2Highlight() {
  return (
    <Section id="hero2-highlight" className="flex flex-col items-center bg-white pt-[140px] md:pt-[240px]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex w-full flex-col items-start gap-5"
        >
          <SectionEyebrow>지원자 모집</SectionEyebrow>
          <div className="type-title">
            <p>더 많은 지원자에게 닿도록</p>
            <p>검색부터 공유, 홍보까지 한 번에</p>
          </div>
          <p className="type-lead">
            채용 사이트 방문자의 데이터를 수집하여 지원자의 유입 채널을 분석하여 다음 채용 전략에 활용할 수 있습니다.
          </p>
        </motion.div>
      </Container>
    </Section>
  )
}
