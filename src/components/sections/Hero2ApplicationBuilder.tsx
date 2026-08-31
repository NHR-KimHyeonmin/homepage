import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { Hero2FormBuilderMockup } from './Hero2FormBuilderMockup'

/**
 * Figma node 2337:13686 — the "지원서 양식 편집기" (application form builder).
 * Used to be a flattened screenshot; it is now real DOM (see
 * Hero2FormBuilderMockup) so the sidebar's switches actually hide and show
 * the matching preview cards.
 *
 * The mockup still grows into view on scroll, locking at 100% once it
 * reaches the vertical centre of the viewport.
 */
export function Hero2ApplicationBuilder() {
  const scaleWrapperRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scaleWrapperRef,
    offset: ['start end', 'center center'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1])

  return (
    <Section className="flex flex-col items-center gap-10 bg-white px-6 pb-16 pt-10 md:px-16 md:pb-16 md:pt-[60px]">
      <Container maxWidth={1280}>
        <motion.div
          ref={scaleWrapperRef}
          style={{ scale }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="origin-center"
        >
          <Hero2FormBuilderMockup />
        </motion.div>
      </Container>
    </Section>
  )
}
