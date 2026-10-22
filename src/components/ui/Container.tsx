import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import clsx from 'clsx'

interface ContainerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  children: ReactNode
  className?: string
  /** Outer max width in px. Defaults to the page column (1280, i.e. a
   *  1216px content column inside the gutter); only full-bleed tracks
   *  that deliberately run wider should override it. */
  maxWidth?: number
  ref?: Ref<HTMLDivElement>
}

/**
 * The page's single horizontal gutter. Every section's content goes
 * through here, so the left/right margin is identical page-wide -
 * sections must not add px-* of their own or it compounds.
 */
export function Container({ children, className, maxWidth = 1280, ref, ...rest }: ContainerProps) {
  return (
    <div
      ref={ref}
      className={clsx('mx-auto w-full px-5 md:px-8', className)}
      style={{ maxWidth }}
      {...rest}
    >
      {children}
    </div>
  )
}
