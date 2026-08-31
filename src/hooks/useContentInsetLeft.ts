import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Measures how far a section's centered text column starts from the left
 * edge of a full-bleed sibling (a horizontal card track), so the track's
 * first card can begin exactly under the headline while still being free to
 * run off the right edge of the screen.
 *
 * Doing this by measurement rather than `calc(…100vw…)` matters: `100vw`
 * includes the vertical scrollbar, which would push the cards a few pixels
 * to the right of the text on every desktop browser that reserves gutter.
 *
 * Render `probeRef` on a zero-height element placed inside the very same
 * `Container` (same `maxWidth`, same padding classes) as the headline.
 */
export function useContentInsetLeft<P extends HTMLElement, C extends HTMLElement>(
  containerRef: RefObject<C | null>,
) {
  const probeRef = useRef<P>(null)
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const update = () => {
      const probe = probeRef.current
      const container = containerRef.current
      if (!probe || !container) return
      setInset(Math.max(0, probe.getBoundingClientRect().left - container.getBoundingClientRect().left))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [containerRef])

  return { probeRef, inset }
}
