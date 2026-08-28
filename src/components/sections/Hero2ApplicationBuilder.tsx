import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import formBuilderScreenshot from '../../assets/sections/hero2-application-builder/form-builder-screenshot.webp'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

/**
 * Figma node 2287:5828 — "Hero 2-Feature cards". A large (899px tall),
 * deeply-nested admin "지원서 양식 편집기" (application form builder) UI —
 * sidebar of form-section toggles, a live form preview, and a right-hand
 * settings panel. Too deeply nested to hand-reproduce faithfully (same
 * call as Hero2ThemeShowcase's dashboard mockup), so it's flattened to a
 * single exported screenshot with a caption below it. The rounded corners
 * and border visible on the card are baked into the export itself (the
 * Figma node already renders them), so no extra chrome wrapper is added.
 *
 * NOTE (future work): the sidebar's toggles are meant to hide/show the
 * matching preview boxes live — that interaction isn't implemented yet
 * since it needs the toggle behavior spec'd out first. For now the image
 * only grows into view on scroll (see below).
 */
export function Hero2ApplicationBuilder() {
  const scaleWrapperRef = useRef<HTMLDivElement>(null)
  // Scales the screenshot up as it scrolls into view, locking at 100% (no
  // further growth) once it reaches the vertical center of the viewport.
  const { scrollYProgress } = useScroll({
    target: scaleWrapperRef,
    offset: ['start end', 'center center'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1])

  return (
    <Section className="flex flex-col items-center gap-10 bg-white px-6 pb-16 pt-10 md:px-16 md:pb-16 md:pt-[60px]">
      <Container maxWidth={1280}>
        <motion.div ref={scaleWrapperRef} style={{ scale }} className="origin-center">
          <motion.img
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            src={formBuilderScreenshot}
            alt="지원서 양식 편집기: 항목 토글, 실시간 미리보기, 평가자 공개·출력 설정을 갖춘 관리자 화면"
            className="block w-full"
          />
        </motion.div>
      </Container>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="max-w-[1208px] text-center text-lg leading-[1.45] tracking-[-0.1px] text-black/55 md:text-xl"
      >
        144개의 다양한 지원서 항목을 직접 추가해보변서 지원서 양식을 구성해보세요.
      </motion.p>
    </Section>
  )
}
