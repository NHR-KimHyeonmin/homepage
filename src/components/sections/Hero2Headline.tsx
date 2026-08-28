import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

export function Hero2Headline() {
  return (
    <Section id="hero2-headline" className="flex flex-col items-center bg-[#f8f9fa] px-6 pt-24 md:pt-[180px]">
      <Container maxWidth={1208}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <p className="text-xl font-bold tracking-[-0.1px] text-gray-200">지원자 모집</p>
          <div className="text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-black md:text-[56px]">
            <p>지원하고 싶은 사이트,</p>
            <p>들어오고 싶은 회사</p>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
