import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * "SEO 설정" 카드 안의 브라우저 목업. 애널리틱스 쪽과 같은 이유로 402x175
 * PNG 를 걷어내고 벡터·DOM 으로 다시 그렸다 — 배율 125%/150% 나 레티나에서
 * 뭉개지지 않고, 섹션에 들어올 때 검색어가 타이핑되고 결과가 떠오르는
 * 연출을 붙일 수 있다.
 *
 * 색은 원본 PNG 에서 뽑았다. 파비콘의 파랑이 브랜드 토큰(#0042b7)과 같아
 * 그대로 쓴다.
 */

const QUERY = '커리어링크 채용'
const MS_PER_CHAR = 95
/** 다 치고 나서 결과가 올라오기까지의 뜸. */
const RESULT_DELAY_MS = 260

/** 탭은 검색 결과 페이지, 아래 결과 카드는 우리 사이트 — 둘은 다르다. */
const TAB_TITLE = '커리어링크 - Google 검색'
const RESULT_TITLE = '커리어링크 | 채용 홈페이지'
const RESULT_URL = 'https://careers.careerlink.kr'
const RESULT_DESC = '나다움으로 새로운 HR를 여는, 동료를 찾습니다.'

const LINK_BLUE = '#524ac0'
const CHROME_BG = '#f2f3f5'

/** 탭의 구글 파비콘. 검색 결과 페이지를 띄운 탭이라는 표시일 뿐이다. */
function GoogleMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" style={{ width: size, height: size }} className="shrink-0" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

/**
 * 커리어링크 파비콘. 브라우저 탭에 쓰는 것과 같은 파일(public/favicon_bl.png)
 * 을 그대로 쓴다 — 검색 결과에 뜨는 파비콘이 실제 사이트 파비콘과 같아야
 * 이 목업이 설명하려는 것(SEO 설정이 검색 노출에 반영된다)이 맞아떨어진다.
 */
function Favicon({ size }: { size: number }) {
  return (
    <img
      src="/favicon_bl.png"
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-[3px]"
      style={{ width: size, height: size }}
    />
  )
}

export function Hero2SeoBrowserMockup() {
  const reduceMotion = useReducedMotion()
  const [started, setStarted] = useState(false)
  const [count, setCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  // 움직임을 끈 환경에서는 타이핑 과정을 건너뛰고 완성된 화면을 바로 둔다.
  const typed = reduceMotion ? QUERY : QUERY.slice(0, count)
  const doneTyping = reduceMotion || count >= QUERY.length

  useEffect(() => {
    if (!started || reduceMotion || count >= QUERY.length) return
    const timer = setTimeout(() => setCount((c) => c + 1), MS_PER_CHAR)
    return () => clearTimeout(timer)
  }, [started, count, reduceMotion])

  useEffect(() => {
    if (!doneTyping) return
    const timer = setTimeout(() => setShowResult(true), RESULT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [doneTyping])

  return (
    <motion.div
      viewport={{ amount: 0.5 }}
      onViewportEnter={() => setStarted(true)}
      onViewportLeave={() => {
        // 화면 밖으로 나가면 처음 상태로 되돌려, 다시 들어올 때 타이핑부터
        // 다시 보여준다.
        setStarted(false)
        setCount(0)
        setShowResult(false)
      }}
      className="relative h-[192px] w-[480px] shrink-0 overflow-hidden rounded-t-[10px] shadow-[0_6px_22px_rgba(32,40,45,0.16)]"
      style={{ backgroundColor: CHROME_BG }}
    >
      {/* 탭 바 — 탭 위 회색 띠는 탭이 바닥에 붙어 보일 만큼만 남긴다. */}
      <div className="flex h-[38px] items-end pl-[26px]">
        <div className="flex h-[32px] w-[216px] items-center gap-2 rounded-t-[8px] bg-white pl-3 pr-2.5">
          <GoogleMark size={14} />
          <span className="flex-1 truncate text-[11px] leading-none text-[#3c4043]">{TAB_TITLE}</span>
          <svg viewBox="0 0 12 12" className="size-[9px] shrink-0" aria-hidden>
            <path d="M2 2l8 8M10 2l-8 8" stroke="#80868b" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 페이지 */}
      <div className="h-full bg-white px-[18px] pt-[14px]">
        {/* 검색창 */}
        <div className="flex h-[36px] items-center gap-2.5 rounded-full border border-[#e3e3e3] px-4">
          <svg viewBox="0 0 16 16" className="size-[14px] shrink-0" aria-hidden>
            <circle cx="7" cy="7" r="4.6" fill="none" stroke="#9aa0a6" strokeWidth="1.5" />
            <path d="M10.4 10.4 14 14" stroke="#9aa0a6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="flex min-w-0 items-center text-[13px] leading-none text-[#202124]">
            {typed}
            {started && !doneTyping && (
              <span aria-hidden className="ml-px inline-block h-[14px] w-px bg-[#202124] align-middle" />
            )}
          </span>
          <span className="sr-only">{QUERY} 검색 결과</span>
        </div>

        {/* 검색 결과 — 타이핑이 끝나면 아래에서 떠오른다 */}
        <motion.div
          initial={false}
          animate={showResult ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pt-[22px]"
          aria-hidden={!showResult}
        >
          <div className="flex items-center gap-2.5">
            <Favicon size={22} />
            <div className="flex min-w-0 flex-col gap-[3px]">
              <span className="truncate text-[10px] leading-none text-[#202124]">{RESULT_TITLE}</span>
              <span className="truncate text-[10px] leading-none text-[#5f6368]">{RESULT_URL}</span>
            </div>
          </div>
          <p className="pt-2.5 text-[16px] font-medium leading-tight" style={{ color: LINK_BLUE }}>
            {RESULT_TITLE}
          </p>
          <p className="pt-1.5 text-[11px] leading-tight text-[#4d5156]">{RESULT_DESC}</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
