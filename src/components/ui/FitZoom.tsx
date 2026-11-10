import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'

/**
 * 고정 폭 목업이 좁은 화면(휴대폰)에서 카드 밖으로 잘리지 않도록, 칸이 목업보다
 * 좁아지면 비율을 그대로 둔 채 줄인다. zoom 을 써서 줄인 크기로 다시 그리므로
 * 글자가 흐려지지 않는다. 넓은 화면에서는 1 배 그대로다.
 *
 * width 는 목업의 원래 폭. 줄인 뒤 다시 재면 zoom 이 섞이므로 상수로 받는다.
 */
export function FitZoom({
  width,
  gutter = 24,
  className,
  children,
}: {
  width: number
  /** 그림 양옆에 남길 최소 여백(px). */
  gutter?: number
  className?: string
  children: ReactNode
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => setZoom(Math.min(1, (box.clientWidth - gutter * 2) / width))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    return () => observer.disconnect()
  }, [width, gutter])

  return (
    <div ref={boxRef} className={clsx('flex w-full justify-center', className)}>
      <div style={{ zoom }}>{children}</div>
    </div>
  )
}
