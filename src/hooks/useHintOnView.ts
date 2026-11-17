import { useEffect, useState, type RefObject } from 'react'
import { useInView } from 'framer-motion'

/**
 * 스위치가 화면에 들어오고 잠시 뒤 true — 그때 hint-outline-on 을 붙여
 * 눌러 볼 수 있는 칸을 한 번 짚는다. 들어오자마자 짚으면 스크롤하는 눈이
 * 아직 닿기 전이라 놓친다.
 */
export function useHintOnView(ref: RefObject<Element | null>, delay = 700) {
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => setOn(true), delay)
    return () => clearTimeout(timer)
  }, [inView, delay])
  return on
}
