import { useEffect, useState } from 'react'

const LINES = ['인재 관리를 깊이있게,', '채용 업무는 간결하게']
const FULL_TEXT = LINES.join('\n')
const MS_PER_CHAR = 55
const CURSOR_BLINK_MS = 1000
const PRE_TYPE_BLINKS = 1

interface Hero1TypedHeadlineProps {
  /** Typing (and the pre-type cursor blink) only begins once this flips
   *  true — driven by the parent's scroll-triggered intro sequence. */
  start: boolean
  /** Fires once, the moment typing finishes — lets the parent reveal the
   *  rest of the hero (subtitle, CTA, dashboard image) in sequence. */
  onDone?: () => void
}

/** Blinks the cursor once (reads as two visible flashes bracketing the
 *  blink), then types the hero headline out once, then hides the cursor
 *  entirely (no lingering blink once typing is done). */
export function Hero1TypedHeadline({ start, onDone }: Hero1TypedHeadlineProps) {
  const [count, setCount] = useState(0)
  const [typingStarted, setTypingStarted] = useState(false)

  useEffect(() => {
    if (!start) return
    const startTimer = setTimeout(() => setTypingStarted(true), CURSOR_BLINK_MS * PRE_TYPE_BLINKS)
    return () => clearTimeout(startTimer)
  }, [start])

  useEffect(() => {
    if (!typingStarted || count >= FULL_TEXT.length) return
    const timer = setTimeout(() => setCount((c) => c + 1), MS_PER_CHAR)
    return () => clearTimeout(timer)
  }, [typingStarted, count])

  const done = count >= FULL_TEXT.length

  useEffect(() => {
    if (done) onDone?.()
    // onDone is a one-shot callback keyed only on the typing-finished edge.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  const revealed = FULL_TEXT.slice(0, count)
  const [line1, line2 = ''] = revealed.split('\n')

  return (
    <h1 className="text-[40px] font-bold leading-[1.28] md:text-[64px]">
      <span className="block">{line1}</span>
      <span className="block">
        {line2}
        {start && !done && (
          <span
            aria-hidden
            className="ml-1 inline-block h-[1em] w-[3px] translate-y-[1px] bg-ink align-middle"
            style={{
              animation: !typingStarted ? `hero1-cursor-blink ${CURSOR_BLINK_MS}ms step-end infinite` : 'none',
              opacity: !typingStarted ? undefined : 1,
            }}
          />
        )}
      </span>
      <span className="sr-only">
        {LINES[0]}, {LINES[1]}
      </span>
    </h1>
  )
}
