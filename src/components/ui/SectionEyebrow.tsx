import type { ReactNode } from 'react'
import clsx from 'clsx'

interface SectionEyebrowProps {
  children: ReactNode
  /** 'onDark' = 어두운 바탕의 보안 구역 전용. */
  tone?: 'default' | 'onDark'
  className?: string
}

/** 구역 제목 위에 붙는 칩. 옅은 하늘색 면에 진한 파란 글자로 어느 구역에서나 같다. */
export function SectionEyebrow({ children, tone = 'default', className }: SectionEyebrowProps) {
  return (
    <span
      className={clsx(
        'mb-2 inline-flex items-center rounded-full px-4 py-1 text-[15px] font-semibold tracking-[-0.09px]',
        tone === 'onDark' ? 'border border-white/25 text-white/70' : 'bg-brand-100 text-brand-700',
        className,
      )}
    >
      {children}
    </span>
  )
}
