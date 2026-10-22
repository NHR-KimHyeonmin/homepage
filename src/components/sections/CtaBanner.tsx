import { motion } from 'framer-motion'
import background from '../../assets/sections/cta-banner/background.webp'
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
    <Section className="flex flex-col items-center justify-center gap-9 overflow-hidden px-5 py-12 text-center md:px-8 md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <img loading="lazy" decoding="async" src={background} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

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
        <button
          type="button"
          className="rounded-full bg-black px-4 py-3 text-lg font-semibold tracking-[-0.09px] text-white transition-colors hover:bg-black/80"
        >
          도입 문의하기
        </button>
      </motion.div>
    </Section>
  )
}
