import { motion } from 'framer-motion'
// 예시 이미지. 최종 이미지가 정해지면 파일과 함께 교체한다.
import sampleBackground from '../../assets/sections/cta-banner/sample-background.webp'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

/**
 * Figma node "Marquee 1" (2230:1110) — despite the layer name, the actual
 * design contains no scrolling logo/text track. get_design_context's code
 * output only showed a flat rgba(0,0,0,0.2) fill, but download_assets
 * revealed a photo fill underneath it (a person typing on a laptop),
 * which the code-gen missed. This is reproduced faithfully as a dark CTA
 * banner: background photo + 20% black overlay + headline + two buttons.
 * See the final report for this discrepancy.
 */
export function CtaBanner() {
  return (
    <Section id="contact" className="pb-4 md:pb-6">
      {/* 다른 구역의 콘텐츠와 같은 폭의 둥근 박스. 아래 여백이 푸터와의 간격이다. */}
      <Container>
      <div className="relative isolate flex flex-col items-center justify-center gap-9 overflow-hidden rounded-[24px] bg-[#dcebf8] px-5 py-12 text-center md:px-8 md:pb-24 md:pt-[120px]">
      {/* 글자가 읽히도록 그림만 흐린다. 흐린 가장자리가 비치지 않게 박스보다 크게 깐다. */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 bg-cover bg-center blur-[4px]"
        style={{ backgroundImage: `url(${sampleBackground})` }}
      />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-[28px] font-bold leading-[1.2] tracking-[-0.72px] text-title md:text-[36px]"
      >
        커리어링크로 성공적인 채용을 만들어보세요.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <Button variant="dark" className="px-7 py-3.5 text-[19px]">
          도입 문의하기
        </Button>
      </motion.div>
      </div>
      </Container>
    </Section>
  )
}
