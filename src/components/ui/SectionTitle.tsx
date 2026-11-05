import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Container } from './Container'
import { SectionEyebrow } from './SectionEyebrow'
import { Section } from './Section'

interface SectionTitleProps {
  /** 오른쪽 챕터 네비게이터(ScrollNav)가 잡는 앵커. */
  id?: string
  eyebrow?: string
  heading: string[]
  body?: string
  align?: 'center' | 'left'
  background?: string
  maxWidth?: number
  className?: string
}

/**
 * Shared "eyebrow + big headline (+ optional body)" block used as a
 * standalone divider before most sections — mirrors the single
 * reusable "Hero 2-Title" component instance in the Figma file.
 */
export function SectionTitle({
  id,
  eyebrow,
  heading,
  body,
  align = 'center',
  background = 'bg-white',
  maxWidth = 1280,
  className,
}: SectionTitleProps) {
  const isCenter = align === 'center'

  return (
    <Section id={id} className={clsx('section-pt flex flex-col', isCenter ? 'items-center' : 'items-start', background, className)}>
      <Container maxWidth={maxWidth}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={clsx('flex w-full flex-col gap-5', isCenter ? 'items-center text-center' : 'items-start text-left')}
        >
          {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
          <h2 className="type-title">
            {heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          {body && (
            <p className="type-lead max-w-[720px]">{body}</p>
          )}
        </motion.div>
      </Container>
    </Section>
  )
}
