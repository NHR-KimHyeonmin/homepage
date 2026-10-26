import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { animate, useMotionValue, type AnimationPlaybackControls } from 'framer-motion'

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

/** 끝에 닿은 뒤 더 끌었을 때 트랙이 늘어나는 한계(px). */
const OVERSCROLL_LIMIT = 90

/**
 * 끝을 넘어 끈 거리를 고무줄처럼 눌러 준다. 처음엔 손을 거의 그대로 따라오다
 * 점점 뻑뻑해지고 LIMIT 에 닿을 듯 말 듯 멈춘다 — 아무리 세게 당겨도 트랙이
 * 화면 밖으로 날아가지 않으면서 "끝이다" 라는 저항이 손에 잡힌다.
 */
function rubber(distance: number) {
  return (distance * OVERSCROLL_LIMIT) / (distance + OVERSCROLL_LIMIT)
}

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
/**
 * @param onDragEnd 끌기를 끝냈을 때 자리를 직접 정하고 싶은 쪽에 넘긴다.
 *   주면 관성 대신 이 함수가 불리고, 끌린 거리(px, 양수면 오른쪽으로 민
 *   것)를 받는다 — 탭 그룹처럼 정해진 자리로 붙어야 하는 트랙은 미끄러진
 *   끝에서 멈추면 어중간한 위치에 선다.
 */
export function useDragScroll<T extends HTMLElement>(onDragEnd?: (scrolled: number) => void) {
  const scrollRef = useRef<T>(null)
  /** 끝에서 더 끈 만큼 트랙을 밀어내는 값. 쓰는 쪽에서 style={{ x }} 로 받는다.
   *  state 가 아니라 MotionValue 인 이유는, 끄는 내내 프레임마다 값이 바뀌는데
   *  그때마다 다시 렌더하면 카드 다섯 장이 통째로 돌아가기 때문이다. */
  const overscrollX = useMotionValue(0)
  const springRef = useRef<AnimationPlaybackControls | null>(null)
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

  /** 손을 떼면 제자리로 튕겨 돌아간다. damping 을 낮게 둬 한 번 지나쳤다
   *  돌아오는 반동을 남긴다 — 이게 없으면 그냥 미끄러져 멈추는 것과 같다. */
  const releaseOverscroll = useCallback(() => {
    springRef.current?.stop()
    if (overscrollX.get() === 0) return
    springRef.current = animate(overscrollX, 0, {
      type: 'spring',
      stiffness: 320,
      damping: 20,
      mass: 0.9,
    })
  }, [overscrollX])

  // 관성이 도는 중에 언마운트되면 rAF가 사라진 노드를 건드린다.
  useEffect(() => stopGlide, [stopGlide])
  useEffect(() => () => springRef.current?.stop(), [])

  const onPointerDown = (event: PointerEvent<T>) => {
    const el = scrollRef.current
    if (!el) return
    stopGlide()
    springRef.current?.stop()
    isDraggingRef.current = true
    didDragRef.current = false
    setIsDragging(true)
    startXRef.current = event.clientX
    startScrollLeftRef.current = el.scrollLeft
    lastXRef.current = event.clientX
    lastTimeRef.current = performance.now()
    velocityRef.current = 0
    // 포인터 캡처는 실제로 끌기 시작한 뒤에 잡는다. 누르자마자 잡으면 뒤따르는
    // click 의 대상이 컨테이너로 바뀌어, 안에 있는 카드 버튼이 눌리지 않는다.
  }

  const onPointerMove = (event: PointerEvent<T>) => {
    const el = scrollRef.current
    if (!el || !isDraggingRef.current) return
    const delta = event.clientX - startXRef.current
    if (Math.abs(delta) > 3 && !didDragRef.current) {
      didDragRef.current = true
      el.setPointerCapture(event.pointerId)
    }
    // 끝을 넘어선 만큼은 scrollLeft 가 받아 주지 않는다(0/max 에서 잘린다).
    // 그 초과분을 고무줄로 눌러 트랙 자체를 밀어낸다.
    const target = startScrollLeftRef.current - delta
    const max = el.scrollWidth - el.clientWidth
    if (target < 0) {
      el.scrollLeft = 0
      overscrollX.set(rubber(-target))
    } else if (target > max) {
      el.scrollLeft = max
      overscrollX.set(-rubber(target - max))
    } else {
      el.scrollLeft = target
      if (overscrollX.get() !== 0) overscrollX.set(0)
    }

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
    releaseOverscroll()
    if (performance.now() - lastTimeRef.current > STALE_MS) velocityRef.current = 0
    if (!didDragRef.current) return
    if (onDragEnd) onDragEnd(el ? el.scrollLeft - startScrollLeftRef.current : 0)
    else startGlide()
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
    overscrollX,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onClickCapture,
    },
  }
}
