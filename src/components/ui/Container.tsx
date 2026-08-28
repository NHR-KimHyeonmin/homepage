import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'
import clsx from 'clsx'

interface ContainerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  children: ReactNode
  className?: string
  /** Max content width in px, matching the Figma frame's content column. */
  maxWidth?: number
  ref?: Ref<HTMLDivElement>
}

export function Container({ children, className, maxWidth = 1280, ref, ...rest }: ContainerProps) {
  return (
    <div
      ref={ref}
      className={clsx('mx-auto w-full px-6 md:px-10 lg:px-16', className)}
      style={{ maxWidth }}
      {...rest}
    >
      {children}
    </div>
  )
}
