import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'

/** 관성 감속 계수 — 매 프레임 속도에 곱한다. 1에 가까울수록 멀리 미끄러진다. */
const FRICTION = 0.94
/** 이보다 느려지면 멈춘다 (px/frame). */
const MIN_VELOCITY = 0.15
/** 속도의 지수이동평균 가중치 — 최신 프레임 쪽을 높게 둬 반응은 살리되,
 *  손을 떼기 직전의 미세한 떨림이 그대로 관성에 실리는 것은 눌러준다. */
const VELOCITY_SMOOTHING = 0.8
/** 포인터가 이만큼 멈춰 있다 떨어지면 관성을 주지 않는다 (ms). 카드를 붙잡아
 *  세워둔 뒤 떼는 동작까지 미끄러지면 의도와 어긋난다. */
const STALE_MS = 80

/**
 * 가로 스크롤 컨테이너의 마우스 드래그 패닝. 네이티브 `overflow-x-auto`는
 * 휠·터치·트랙패드 제스처에만 반응하므로 클릭 후 끌기를 직접 얹는다
 * (커서 grab/grabbing).
 *
 * 포인터를 떼면 마지막 속도로 계속 굴러가다 마찰로 서서히 멈춘다 — 손을 떼는
 * 순간 뚝 끊기지 않고 미끄러지는 느낌을 준다. 양 끝에 닿거나 다시 잡으면
 * 즉시 멈춘다.
 *
 * 드래그가 만들어내는 뒤따르는 click은 `onClickCapture`에서 삼켜, 끌기가
 * 카드의 클릭 핸들러나 링크까지 발동시키는 일은 없다.
 */
export function useDragScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null)
  const isDraggingRef = useRef(false)
  const didDragRef = useRef(false)
  const startXRef = useRef(0)
  const startScrollLeftRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const velocityRef = useRef(0)
  const frameRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const stopGlide = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
  }, [])

  const startGlide = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const step = () => {
      velocityRef.current *= FRICTION
      if (Math.abs(velocityRef.current) < MIN_VELOCITY) return

      const max = el.scrollWidth - el.clientWidth
      const next = el.scrollLeft - velocityRef.current
      el.scrollLeft = next
      // 양 끝에 닿았으면 더 굴릴 것이 없다.
      if (next <= 0 || next >= max) return

      frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
  }, [])

  // 관성이 도는 중에 언마운트되면 rAF가 사라진 노드를 건드린다.
  useEffect(() => stopGlide, [stopGlide])

  const onPointerDown = (event: PointerEvent<T>) => {
    const el = scrollRef.current
    if (!el) return
    stopGlide()
    isDraggingRef.current = true
    didDragRef.current = false
    setIsDragging(true)
    startXRef.current = event.clientX
    startScrollLeftRef.current = el.scrollLeft
    lastXRef.current = event.clientX
    lastTimeRef.current = performance.now()
    velocityRef.current = 0
    el.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<T>) => {
    const el = scrollRef.current
    if (!el || !isDraggingRef.current) return
    const delta = event.clientX - startXRef.current
    if (Math.abs(delta) > 3) didDragRef.current = true
    el.scrollLeft = startScrollLeftRef.current - delta

    // 프레임(≈16.7ms)당 몇 px로 움직이는지로 환산해 둬야 그대로 관성에 쓸 수 있다.
    const now = performance.now()
    const elapsed = now - lastTimeRef.current
    if (elapsed > 0) {
      const perFrame = ((event.clientX - lastXRef.current) / elapsed) * 16.67
      velocityRef.current =
        velocityRef.current * (1 - VELOCITY_SMOOTHING) + perFrame * VELOCITY_SMOOTHING
    }
    lastXRef.current = event.clientX
    lastTimeRef.current = now
  }

  const endDrag = (event: PointerEvent<T>) => {
    const el = scrollRef.current
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
    if (performance.now() - lastTimeRef.current > STALE_MS) velocityRef.current = 0
    if (didDragRef.current) startGlide()
  }

  const onClickCapture = (event: MouseEvent) => {
    if (didDragRef.current) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return {
    scrollRef,
    isDragging,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onClickCapture,
    },
  }
}
