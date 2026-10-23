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
 * The mockup still grows into view on scroll, locking at 100% a little
 * before it reaches the vertical centre of the viewport.
 */
export function Hero2ApplicationBuilder() {
  const scaleWrapperRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scaleWrapperRef,
    offset: ['start end', 'center center'],
  })
  // 측정 구간(화면 아래 진입 → 화면 중앙)의 70% 에서 이미 100% 에 닿고, 남은
  // 구간은 그대로 멈춰 있다. 정확히 중앙에서야 다 커지면 한창 보고 있는
  // 동안에도 계속 자라고 있어, 다 자란 모습을 볼 틈이 없다.
  // (useTransform 은 범위 밖을 기본으로 끝값에 붙들어 둔다.)
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.82, 1])

  return (
    <Section className="flex flex-col items-center gap-10 bg-surface-page pb-12 pt-6 md:pb-24 md:pt-16">
      <Container>
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
