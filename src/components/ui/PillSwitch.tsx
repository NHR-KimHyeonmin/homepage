import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export interface PillSwitchItem<T extends string> {
  id: T
  label: string
  /** 24 뷰박스 기준 svg 내용. 선 색은 글자색을 따라간다(currentColor). */
  icon?: ReactNode
}

interface PillSwitchProps<T extends string> {
  items: readonly PillSwitchItem<T>[]
  value: T
  onChange: (id: T) => void
  /** 스크린리더에게 이 스위치가 무엇을 고르는 것인지 알려 준다. */
  label?: string
  className?: string
}

/**
 * 알약 꼴 전환 스위치. 흰 바탕 위에서 켜진 칸만 옅게 칠해지고, 칠해진 자리는
 * 켜고 끄는 게 아니라 한 장이 좌우로 미끄러진다 — 칸마다 색을 켜고 끄면 두
 * 칸이 동시에 흐려졌다 진해져 "사라지고 나타난다" 로 보이는데, 한 장이
 * 움직이면 고른 자리가 저쪽에서 이쪽으로 옮겨 왔다는 게 눈에 그려진다.
 *
 * 칸 폭은 글자에 맡기고 미끄러질 거리를 실측한다. 글자 길이가 제각각이라
 * 고정값으로는 맞출 수 없다.
 *
 * 주의: scale() 이 걸린 무대 안에서는 쓸 수 없다 — 실측값이 그 배율까지
 * 끌어안아 어긋난다. 그런 자리(Hero3ScreeningToggle)는 칸 폭을 고정해 두고
 * 거리를 직접 계산한다.
 */
export function PillSwitch<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
}: PillSwitchProps<T>) {
  const navRef = useRef<HTMLElement>(null)
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const measure = () => {
      const el = nav.querySelector<HTMLElement>(`[data-pill="${value}"]`)
      if (el) setThumb({ x: el.offsetLeft - 6, w: el.offsetWidth })
    }
    measure()
    // 글꼴이 늦게 바뀌면 칸 폭도 바뀐다 — 그때 다시 잰다.
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [value])

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className={clsx(
        'relative mx-auto flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-soft',
        className,
      )}
    >
      {thumb && (
        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: thumb.x, width: thumb.w }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="absolute left-1.5 top-1.5 h-[calc(100%-12px)] rounded-full bg-brand-100"
        />
      )}
      {items.map((item) => {
        const isActive = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={isActive}
            data-pill={item.id}
            className={clsx(
              'relative z-10 flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[16px] font-semibold tracking-[-0.09px] transition-colors duration-200',
              isActive ? 'text-brand-700' : 'text-sub hover:text-body',
            )}
          >
            {item.icon && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-[18px] shrink-0"
              >
                {item.icon}
              </svg>
            )}
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
