import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

export function Hero2Highlight() {
  return (
    <Section id="hero2-highlight" className="flex flex-col items-center bg-group-recruit pt-12 md:pt-[120px]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex w-full flex-col items-start gap-5"
        >
          <div className="text-[32px] font-bold leading-[1.4] tracking-[-0.84px] text-black md:text-[48px]">
            <p>세련된 채용사이트로 지원자에게</p>
            <p>강력한 첫 인상을 심어주세요.</p>
          </div>
          <p className="text-[20px] font-medium leading-[1.45] tracking-[-0.1px] text-black/55">
            채용 사이트 방문자의 데이터를 수집하여 지원자의 유입 채널을 분석하여 다음 채용 전략에 활용할 수 있습니다.
          </p>
        </motion.div>
      </Container>
    </Section>
  )
}
