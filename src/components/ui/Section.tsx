import type { ElementType, ReactNode, Ref } from 'react'
import clsx from 'clsx'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  as?: ElementType
  ref?: Ref<HTMLElement>
  /** Passed straight through to the underlying tag — typed loosely (rather
   *  than CSSProperties) so a framer-motion MotionValue can be used here
   *  too, e.g. when `as={motion.section}` for a scroll-linked style. */
  style?: Record<string, unknown>
}

/**
 * Base wrapper for full-bleed page sections. Always carries `isolate`
 * alongside `relative` — a section with an absolutely-positioned
 * background layer (`-z-10`) needs its own stacking context, otherwise
 * the negative z-index sinks the layer below the page's own background
 * instead of just behind its siblings.
 */
export function Section({ children, className, id, as: Tag = 'section', ref, style }: SectionProps) {
  return (
    <Tag ref={ref} id={id} className={clsx('relative isolate', className)} style={style}>
      {children}
    </Tag>
  )
}
