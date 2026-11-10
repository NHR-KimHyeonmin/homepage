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
  const [thumb, setThumb] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  // 항목이 넷 이상이면 휴대폰에서는 한 줄에 다 안 들어가 가로로 밀렸다 — 두 칸씩 접는다.
  const wrap = items.length > 3

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const measure = () => {
      const el = nav.querySelector<HTMLElement>(`[data-pill="${value}"]`)
      if (el) setThumb({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight })
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
        'relative mx-auto max-w-full bg-white p-1.5 shadow-soft md:flex md:w-fit md:items-center md:gap-1 md:rounded-full',
        // 셋 이하는 같은 폭 칸으로 나눠 한 줄에 둔다. 좁은 폰(360)에서 마지막 칸이 화면 밖으로 밀렸다.
        wrap ? 'grid w-full grid-cols-2 gap-0.5 rounded-[24px] sm:max-w-[400px] md:max-w-full' : 'grid w-full auto-cols-fr grid-flow-col gap-0.5 rounded-[24px]',
        className,
      )}
    >
      {thumb && (
        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: thumb.x, y: thumb.y, width: thumb.w, height: thumb.h }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="absolute left-0 top-0 rounded-full bg-[#eceff3]"
        />
      )}
      {items.map((item, index) => {
        const isActive = item.id === value
        // 두 칸씩 접을 때 홀수로 남는 마지막 칸은 한 줄을 통째로 쓴다.
        const lone = wrap && items.length % 2 === 1 && index === items.length - 1
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={isActive}
            data-pill={item.id}
            className={clsx(
              'relative z-10 flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2 py-2 text-center text-[13px] leading-[1.3] md:whitespace-nowrap font-semibold tracking-[-0.09px] transition-colors duration-200 md:gap-2 md:px-4 md:text-[16px] md:leading-normal',
              isActive ? 'text-title' : 'text-sub hover:text-body',
              lone && 'col-span-2',
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
                className="hidden size-4 shrink-0 min-[400px]:block md:size-[18px]"
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
