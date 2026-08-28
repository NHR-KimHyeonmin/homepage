import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'

/**
 * Mouse-drag-to-scroll for a horizontally-scrolling container — native
 * `overflow-x-auto` only responds to wheel/touch/trackpad gestures, so this
 * adds real click-and-drag panning (cursor grab/grabbing) on top of it.
 * The trailing click a drag gesture produces is swallowed via
 * `onClickCapture` so dragging never also triggers a card's own click
 * handler/link.
 */
export function useDragScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null)
  const isDraggingRef = useRef(false)
  const didDragRef = useRef(false)
  const startXRef = useRef(0)
  const startScrollLeftRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const onPointerDown = (event: PointerEvent<T>) => {
    const el = scrollRef.current
    if (!el) return
    isDraggingRef.current = true
    didDragRef.current = false
    setIsDragging(true)
    startXRef.current = event.clientX
    startScrollLeftRef.current = el.scrollLeft
    el.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<T>) => {
    const el = scrollRef.current
    if (!el || !isDraggingRef.current) return
    const delta = event.clientX - startXRef.current
    if (Math.abs(delta) > 3) didDragRef.current = true
    el.scrollLeft = startScrollLeftRef.current - delta
  }

  const endDrag = (event: PointerEvent<T>) => {
    const el = scrollRef.current
    isDraggingRef.current = false
    setIsDragging(false)
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
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
