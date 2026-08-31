import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { SectionEyebrow } from '../ui/SectionEyebrow'
import { Section } from '../ui/Section'

export function Hero2Headline() {
  return (
    <Section id="hero2-headline" className="flex flex-col items-center bg-white px-6 pt-24 md:pt-[180px]">
      <Container maxWidth={1208}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <SectionEyebrow>지원자 모집</SectionEyebrow>
          <div className="text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-black md:text-[56px]">
            <p>지원하고 싶은 사이트,</p>
            <p>들어오고 싶은 회사</p>
          </div>
          <p className="text-lg leading-[1.45] tracking-[-0.1px] text-black/55 md:text-xl">
            커리어링크 사이트빌더로 최신 UI의 채용사이트를 만들어 보세요.
          </p>
        </motion.div>
      </Container>
    </Section>
  )
}
