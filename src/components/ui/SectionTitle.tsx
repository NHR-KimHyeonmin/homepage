import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Container } from './Container'
import { SectionEyebrow } from './SectionEyebrow'
import { Section } from './Section'

interface SectionTitleProps {
  eyebrow?: string
  heading: string[]
  body?: string
  align?: 'center' | 'left'
  background?: string
  maxWidth?: number
  bodyTone?: 'muted' | 'gray'
  paddingClassName?: string
  className?: string
}

/**
 * Shared "eyebrow + big headline (+ optional body)" block used as a
 * standalone divider before most sections — mirrors the single
 * reusable "Hero 2-Title" component instance in the Figma file.
 */
export function SectionTitle({
  eyebrow,
  heading,
  body,
  align = 'center',
  background = 'bg-surface-page',
  maxWidth = 1280,
  bodyTone = 'muted',
  paddingClassName = 'pt-12 md:pt-[120px]',
  className,
}: SectionTitleProps) {
  const isCenter = align === 'center'

  return (
    <Section className={clsx('flex flex-col', paddingClassName, isCenter ? 'items-center' : 'items-start', background, className)}>
      <Container maxWidth={maxWidth}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={clsx('flex w-full flex-col gap-5', isCenter ? 'items-center text-center' : 'items-start text-left')}
        >
          {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
          <h2 className="text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-black md:text-[48px]">
            {heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          {body && (
            <p
              className={clsx(
                'max-w-[720px] text-[17px] font-medium leading-[1.45] tracking-[-0.1px]',
                bodyTone === 'muted' ? 'text-black/55' : 'text-gray-200',
              )}
            >
              {body}
            </p>
          )}
        </motion.div>
      </Container>
    </Section>
  )
}
