import { motion } from 'framer-motion'
// 예시 이미지. 최종 이미지가 정해지면 파일과 함께 교체한다.
import ctaBackground from '../../assets/sections/cta-banner/laptop-background.webp'
import { Button } from '../ui/Button'
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
      {/* 보안 구역과 같은 전체 폭 둥근 박스(좌우 흰 여백만 남긴다). 아래 여백이 푸터와의 간격이다. */}
      <div className="mx-3 md:mx-5">
      <div className="relative isolate flex flex-col items-center justify-center gap-9 overflow-hidden rounded-[24px] bg-[#dcebf8] md:rounded-[32px] px-5 py-12 text-center md:px-8 md:pb-24 md:pt-[120px]">
      {/* 글자가 읽히도록 그림만 흐린다. 흐린 가장자리가 비치지 않게 박스보다 크게 깐다. */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 bg-cover bg-center blur-[2px]"
        style={{ backgroundImage: `url(${ctaBackground})` }}
      />
      {/* 흰 제목이 밝은 사진에 묻히지 않도록 남색 막을 한 겹 덮는다. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#0b1e33]/50" />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-[28px] font-bold leading-[1.2] tracking-[-0.72px] text-white md:text-[36px]"
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
        {/* 어둡게 덮은 사진 위라 기본 남색 버튼은 묻힌다 — 더 짙은 검정으로 띄운다. */}
        <Button variant="dark" className="bg-[#05080c]! px-7 py-3.5 text-[19px] hover:bg-[#1a2129]!">
          도입 문의하기
        </Button>
      </motion.div>
      </div>
      </div>
    </Section>
  )
}
