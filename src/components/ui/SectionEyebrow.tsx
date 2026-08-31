import type { ReactNode } from 'react'
import clsx from 'clsx'

interface SectionEyebrowProps {
  children: ReactNode
  /** 'onDark' = the "보안" section's navy background — same chip, but the
   *  fill drops to 15% and the label to 80% so it reads as a soft tint
   *  instead of a bright light-blue block. */
  tone?: 'default' | 'onDark'
  className?: string
}

const CHIP_BG = '#e1ecfe'
const CHIP_TEXT = '#3379f3'

/**
 * Shared eyebrow "chip" used above every section headline
 * ("지원자 모집", "서류 접수", "평가", "보안", "FAQ", …): 20px side /
 * 4px vertical padding, pill corners, light-blue fill with a blue label.
 */
export function SectionEyebrow({ children, tone = 'default', className }: SectionEyebrowProps) {
  const onDark = tone === 'onDark'

  return (
    <span
      className={clsx(
        'mb-2 inline-flex items-center rounded-full px-5 py-1 text-lg font-semibold tracking-[-0.09px]',
        className,
      )}
      style={{
        backgroundColor: onDark ? 'rgba(225, 236, 254, 0.15)' : CHIP_BG,
        color: onDark ? 'rgba(51, 121, 243, 0.8)' : CHIP_TEXT,
      }}
    >
      {children}
    </span>
  )
}
