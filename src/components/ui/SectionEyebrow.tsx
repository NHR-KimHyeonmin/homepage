import type { ReactNode } from 'react'
import clsx from 'clsx'

interface SectionEyebrowProps {
  children: ReactNode
  /** 'onDark' = the "보안" section's navy background — same outlined chip,
   *  but the border and label switch to white at low opacity so it reads
   *  as a soft outline instead of a hard grey line on black. */
  tone?: 'default' | 'onDark'
  className?: string
}

/**
 * Shared eyebrow "chip" used above every section headline
 * ("지원자 모집", "서류 접수", "평가", "보안", "FAQ", …): 16px side /
 * 4px vertical padding, pill corners, outlined in grey with no fill.
 */
export function SectionEyebrow({ children, tone = 'default', className }: SectionEyebrowProps) {
  return (
    <span
      className={clsx(
        'mb-2 inline-flex items-center rounded-full border px-4 py-1 text-[15px] font-semibold tracking-[-0.09px]',
        tone === 'onDark' ? 'border-white/25 text-white/70' : 'border-gray-400 text-gray-300',
        className,
      )}
    >
      {children}
    </span>
  )
}
