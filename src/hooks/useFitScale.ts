import { useEffect, useRef, useState } from 'react'

/**
 * Shrinks a fixed-width mockup so it always fits its container instead of
 * being clipped — the admin screens in this page are laid out at a fixed
 * design width (they are dense, real DOM, and cannot reflow), so the only
 * way to keep them whole on a narrow window is to scale them down.
 *
 * Returns the ref to put on the measured (full-width) wrapper and a scale
 * factor that never goes above 1: at wide viewports the mockup renders at
 * its natural size, below `designWidth` it shrinks proportionally.
 */
export function useFitScale(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const width = el.clientWidth
      if (width > 0) setScale(Math.min(1, width / designWidth))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [designWidth])

  return { ref, scale }
}
