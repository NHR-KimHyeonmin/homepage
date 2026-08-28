import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Container } from './Container'
import { Section } from './Section'

interface SectionTitleProps {
  eyebrow?: string
  heading: string[]
  body?: string
  align?: 'center' | 'left'
  background?: string
  maxWidth?: number
  /** 'lg' = 56px (default, most sections) · 'md' = 40px (compact service-list style) */
  headingSize?: 'lg' | 'md'
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
  background = 'bg-white',
  maxWidth = 1208,
  headingSize = 'lg',
  bodyTone = 'muted',
  paddingClassName = 'px-6 pt-24 md:px-16 md:pt-[180px]',
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
          {eyebrow && <p className="text-xl font-semibold tracking-[-0.1px] text-gray-200">{eyebrow}</p>}
          <h2
            className={clsx(
              'font-bold leading-[1.4] tracking-[-1.12px] text-black',
              headingSize === 'lg' ? 'text-[40px] md:text-[56px]' : 'text-[32px] md:text-[40px] tracking-[-0.8px]',
            )}
          >
            {heading.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          {body && (
            <p
              className={clsx(
                'max-w-[720px] text-lg leading-[1.45] tracking-[-0.1px] md:text-xl',
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
