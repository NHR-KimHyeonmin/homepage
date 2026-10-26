import { useEffect, useState } from 'react'

/**
 * 단계가 하나씩 넘어가는 연출의 드라이버. `delays[0]` 은 첫 단계까지의 뜸,
 * `delays[i]` 는 i 번째 단계가 켜진 뒤 다음 단계까지 기다리는 시간이다.
 * 반환값은 지금까지 지나온 단계 수(0 ~ delays.length).
 *
 * `delays` 는 모듈 상수로 두고 넘긴다 — 렌더마다 새 배열을 만들면 그때마다
 * 타이머가 다시 깔려 연출이 처음으로 되감긴다.
 *
 * `active` 가 꺼지면(섹션을 벗어나면) 0 으로 되돌아가, 다시 들어왔을 때
 * 처음부터 보인다. `instant` 는 움직임을 줄이기로 한 사람에게 과정을
 * 건너뛰고 마지막 상태만 준다.
 */
export function useSequence(delays: number[], active: boolean, startDelay = 0, instant = false) {
  const [step, setStep] = useState(0)
  const steps = delays.length

  useEffect(() => {
    if (instant || !active) return

    const timers: number[] = []
    let current = 0
    const tick = (wait: number) => {
      timers.push(
        window.setTimeout(() => {
          current += 1
          setStep(current)
          if (current < steps) tick(delays[current])
        }, wait),
      )
    }
    tick(startDelay + delays[0])

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      setStep(0)
    }
  }, [delays, steps, active, startDelay, instant])

  return instant ? steps : step
}

/** 한 글자씩 늘어나는 글자 수. 멈춰 있을 때는 0, 끝나면 전체. */
export function useTyped(text: string, busy: boolean, done: boolean, msPerChar = 90) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!busy) return
    const timers = text
      .split('')
      .map((_, index) => window.setTimeout(() => setCount(index + 1), (index + 1) * msPerChar))
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      setCount(0)
    }
  }, [text, busy, msPerChar])

  if (done) return text.length
  return busy ? count : 0
}
