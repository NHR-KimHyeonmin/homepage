import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'framer-motion'
import logoWhite from '../../assets/sections/hero1/cursor/logo-white.png'

/**
 * Tabler pointer-2 를 채운 브랜드 커서: 파란 면, 흰 외곽선, 옅은 그림자.
 * 진짜 커서를 바꾸는 것이라 마우스를 지연 없이 따라간다. 핫스팟은 화살표 끝.
 */
const POINTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="-4 -4 32 32"><defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.4" flood-color="#000" flood-opacity=".3"/></filter></defs><path filter="url(#s)" fill="#0041b7" stroke="#fff" stroke-width="4.4" stroke-linejoin="round" paint-order="stroke" d="M14.185 13.14l5.644 -2.202c1.625 -.634 1.538 -2.962 -.13 -3.473l-14.319 -4.382c-1.41 -.431 -2.73 .888 -2.298 2.298l4.382 14.318c.51 1.668 2.84 1.755 3.473 .13l2.202 -5.644a1.84 1.84 0 0 1 1.045 -1.045z"/></svg>`
const POINTER_URL = `data:image/svg+xml,${encodeURIComponent(POINTER_SVG)}`
export const BRAND_CURSOR = `url("${POINTER_URL}") 12 12, auto`
/** 커서 그림 안에서 화살표 끝이 놓인 자리(px). */
const HOTSPOT = 12
/** 터치에서 그리는 화살표·알약 배율. 휴대폰 화면에서는 데스크톱 커서 크기가 너무 컸다. */
const TOUCH_SCALE = 0.68
/** 터치일 때 알약이 쉬는 자리(화살표 끝 기준). */
const TOUCH_OFFSET = { x: 15, y: 20 }

/** 알약이 쉬는 자리: 화살표 끝에서 오른쪽 아래. */
const OFFSET = { x: 22, y: 30 }
/** 남은 거리가 이 시간(ms)마다 약 37% 로 준다. 작을수록 빨리 따라온다.
 *  매 프레임 남은 거리의 일정 비율만큼 가므로 가까워질수록 저절로 느려진다. */
const FOLLOW_MS = 130

/**
 * 커서 옆 커리어링크 알약. 커서보다 살짝 늦게 따라오다 가까워지면 천천히 멈춘다.
 * 카드 밖으로 살짝 나가도 잘리지 않도록 body 에 붙인다.
 */
export function BrandCursorFollower({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const pillRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLImageElement>(null)
  const [visible, setVisible] = useState(false)
  // 손가락으로 누르고 있는 동안. 터치에는 커서가 없으니 화살표도 직접 그린다.
  const [touching, setTouching] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const goal = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let frame = 0
    let previous = 0

    const paint = () => {
      if (pillRef.current) pillRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
    }

    const step = (now: number) => {
      // 주사율과 상관없이 같은 속도가 되도록 지난 시간으로 비율을 낸다.
      // 프레임 시각이 잠든 동안 찍힌 시각보다 앞설 수 있어 음수는 0 으로 막는다 — 안 그러면 뒤로 튄다.
      const ease = 1 - Math.exp(-Math.max(0, now - previous) / FOLLOW_MS)
      previous = now
      pos.x += (goal.x - pos.x) * ease
      pos.y += (goal.y - pos.y) * ease
      paint()
      // 거의 다 왔으면 멈춘다. 다음 움직임이 다시 깨운다.
      frame = Math.hypot(goal.x - pos.x, goal.y - pos.y) > 0.1 ? requestAnimationFrame(step) : 0
    }

    const setGoal = (event: PointerEvent) => {
      goal.x = event.clientX + OFFSET.x
      goal.y = event.clientY + OFFSET.y
    }

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      setGoal(event)
      // 들어온 자리에서 나타난다 — 지난번 나간 자리에서 날아오지 않게.
      pos.x = goal.x
      pos.y = goal.y
      paint()
      setVisible(true)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      setGoal(event)
      if (reduceMotion) {
        pos.x = goal.x
        pos.y = goal.y
        paint()
      } else if (!frame) {
        previous = performance.now()
        frame = requestAnimationFrame(step)
      }
    }

    // 터치는 브라우저가 스크롤을 가져가는 순간 pointerleave 가 와서 알약이 꺼졌다 — 마우스만 받는다.
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setVisible(false)
    }

    // 터치: 누른 자리에 화살표를 띄우고, 끄는 동안 따라오게 한다. 마우스처럼 알약은 살짝 늦게 온다.
    // 페이지 스크롤로 넘어가도 touchmove 는 계속 오므로 pointer 이벤트 대신 touch 이벤트를 쓴다.
    const placeArrow = (x: number, y: number) => {
      if (arrowRef.current)
        arrowRef.current.style.transform = `translate3d(${x - HOTSPOT * TOUCH_SCALE}px, ${y - HOTSPOT * TOUCH_SCALE}px, 0)`
    }
    const onTouchStart = (event: TouchEvent) => {
      const t = event.touches[0]
      if (!t) return
      goal.x = t.clientX + TOUCH_OFFSET.x
      goal.y = t.clientY + TOUCH_OFFSET.y
      pos.x = goal.x
      pos.y = goal.y
      paint()
      placeArrow(t.clientX, t.clientY)
      setTouching(true)
      setVisible(true)
    }
    const onTouchMove = (event: TouchEvent) => {
      const t = event.touches[0]
      if (!t) return
      goal.x = t.clientX + TOUCH_OFFSET.x
      goal.y = t.clientY + TOUCH_OFFSET.y
      placeArrow(t.clientX, t.clientY)
      if (reduceMotion) {
        pos.x = goal.x
        pos.y = goal.y
        paint()
      } else if (!frame) {
        previous = performance.now()
        frame = requestAnimationFrame(step)
      }
    }
    const onTouchEnd = () => {
      setTouching(false)
      setVisible(false)
    }

    target.addEventListener('pointerenter', onEnter)
    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerleave', onLeave)
    target.addEventListener('touchstart', onTouchStart, { passive: true })
    target.addEventListener('touchmove', onTouchMove, { passive: true })
    target.addEventListener('touchend', onTouchEnd)
    target.addEventListener('touchcancel', onTouchEnd)
    return () => {
      cancelAnimationFrame(frame)
      target.removeEventListener('pointerenter', onEnter)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerleave', onLeave)
      target.removeEventListener('touchstart', onTouchStart)
      target.removeEventListener('touchmove', onTouchMove)
      target.removeEventListener('touchend', onTouchEnd)
      target.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [targetRef, reduceMotion])

  return createPortal(
    <>
    <img
      ref={arrowRef}
      src={POINTER_URL}
      alt=""
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-40 size-[34px] max-w-none will-change-transform ${touching ? 'block' : 'hidden'}`}
    />
    <div ref={pillRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 will-change-transform">
      <div
        style={touching ? { transform: `scale(${TOUCH_SCALE})`, transformOrigin: 'top left' } : undefined}
        className={`flex h-[22px] items-center rounded-full bg-[#0041b7] px-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <img src={logoWhite} alt="" className="h-[11px] w-auto max-w-none" />
      </div>
    </div>
    </>,
    document.body,
  )
}
