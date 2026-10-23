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
        // 테두리를 gray-400(#d2d6db) 으로 두면 띠 그라데이션 위에서 대비가
        // 1.08 까지 떨어져 사라진다. 흰 배경·연파랑 섹션·띠 어디에 놓여도
        // 읽히는 선으로 올리되, 글자색(#51565f)보다는 연하게 둬서 칩이
        // 딱딱한 외곽선으로 보이지는 않게 한다.
        tone === 'onDark' ? 'border-white/25 text-white/70' : 'border-[#8290a9] text-gray-300',
        className,
      )}
    >
      {children}
    </span>
  )
}
