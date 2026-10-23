import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import iconBattery from '../../assets/sections/hero2-application-cards/icon-battery.svg'
import iconPlus from '../../assets/sections/hero2-application-cards/icon-plus.svg'
import iconSignal from '../../assets/sections/hero2-application-cards/icon-signal.svg'
import iconSmiley from '../../assets/sections/hero2-application-cards/icon-smiley.svg'
import iconWifi from '../../assets/sections/hero2-application-cards/icon-wifi.svg'
import ogPreviewImage from '../../assets/sections/hero2-application-cards/og-preview-image.webp'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { Hero2JobPromoMockup } from './Hero2JobPromoMockup'

/**
 * Figma node 2287:3751 — "Hero 2-Feature cards". Two-column card grid:
 * Card 1 ("공고별 OG설정") has a full phone-frame mockup of a KakaoTalk-style
 * share sheet with a live OG preview card; Card 2 ("채용 공고 홍보") shows the
 * "공고 홍보하기" menu wired to the external job channels (Figma node
 * 2337:13527).
 */
const SHARE_URL = 'https://careers.nhr.kr/jobs/RC202310181234'
const MS_PER_CHAR = 38
/** 다 치고 나서 전송 버튼을 누르기까지의 뜸. */
const SEND_DELAY_MS = 300
/** 버튼이 눌려 있는 시간. 손을 떼는 순간 말풍선이 올라온다. */
const PRESS_MS = 170

export function Hero2ApplicationCards() {
  const reduceMotion = useReducedMotion()
  const [started, setStarted] = useState(false)
  const [count, setCount] = useState(0)
  const [pressed, setPressed] = useState(false)
  const [showOg, setShowOg] = useState(false)

  // 움직임을 끈 환경에서는 과정을 건너뛰고 완성된 화면을 바로 둔다.
  const typedUrl = reduceMotion ? SHARE_URL : SHARE_URL.slice(0, count)
  const doneTyping = reduceMotion || count >= SHARE_URL.length

  useEffect(() => {
    if (!started || reduceMotion || count >= SHARE_URL.length) return
    const timer = setTimeout(() => setCount((c) => c + 1), MS_PER_CHAR)
    return () => clearTimeout(timer)
  }, [started, count, reduceMotion])

  // 다 치면 → 전송 버튼이 눌렸다 떨어지고 → 그 순간 말풍선이 올라온다.
  useEffect(() => {
    if (!doneTyping) return
    const press = setTimeout(() => setPressed(true), SEND_DELAY_MS)
    const release = setTimeout(() => {
      setPressed(false)
      setShowOg(true)
    }, SEND_DELAY_MS + PRESS_MS)
    return () => {
      clearTimeout(press)
      clearTimeout(release)
    }
  }, [doneTyping])

  return (
    <Section className="bg-surface-page pb-12 pt-6 md:pb-24 md:pt-16">
      <Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            onViewportEnter={() => setStarted(true)}
            onViewportLeave={() => {
              // 화면 밖으로 나가면 처음 상태로 되돌려, 다시 들어올 때
              // 링크 입력부터 다시 보여준다.
              setStarted(false)
              setCount(0)
              setPressed(false)
              setShowOg(false)
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center overflow-hidden rounded-card bg-card"
          >
            <div className="flex w-full flex-col gap-3 p-8">
              <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">공고별 OG설정</h3>
              <p className="text-base leading-[1.45] tracking-[-0.09px] text-black/55">
                공고별 오픈그래프 이미지를 설정해 SNS·메신저에 채용 공고가 공유될 때 자사의 채용 이미지를 보여줄 수 있습니다.
              </p>
            </div>

            <div className="relative h-[409px] w-[370px] shrink-0 rounded-t-[40px] border-x-[10px] border-t-[10px] border-white bg-[#cfe2f0]">
              {/* status bar. 와이파이·배터리는 아이콘 상자 안쪽 여백이 커서
                  16px 로 두면 블루투스보다 한참 작아 보인다 — 원본 치수대로
                  그려야 글리프 높이가 블루투스와 맞는다. 와이파이만 글리프가
                  상자 중앙보다 아래에 그려져 있어 2px 끌어올린다. */}
              <div className="flex items-center justify-between px-6 pt-3.5">
                <p className="text-[18px] font-semibold tracking-[-0.09px] text-black">17:21</p>
                <div className="flex items-center gap-[3px]">
                  <img loading="lazy" decoding="async" src={iconSignal} alt="" className="h-[13px] w-[9px]" />
                  <img
                    loading="lazy"
                    decoding="async"
                    src={iconWifi}
                    alt=""
                    className="h-[28px] w-[27px] -translate-y-[2px]"
                  />
                  <img loading="lazy" decoding="async" src={iconBattery} alt="" className="-ml-[3px] h-[25px] w-[25px]" />
                </div>
              </div>

              {/* OG share preview card — 링크를 다 치고 나면 채팅창에 말풍선이
                  올라오듯 떠오른다. 높이는 고정하지 않는다: 193px 로 묶어 두면
                  설명이 두 줄로 접히는 순간 내용이 196px 이 되어 마지막 줄
                  (careers.nhr.kr) 이 overflow-hidden 에 잘렸다. */}
              <motion.div
                initial={false}
                animate={showOg ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden={!showOg}
                className="absolute right-[13px] top-[76px] w-[236px] origin-bottom-right overflow-hidden rounded-ui bg-white shadow-card"
              >
                <img loading="lazy" decoding="async"
                  src={ogPreviewImage}
                  alt="NHR 신규 채용 오픈그래프 미리보기 이미지"
                  className="h-[124px] w-full object-cover"
                />
                <div className="flex flex-col gap-1 px-[13px] pb-3 pt-3">
                  <p className="text-[13px] font-medium leading-[1.4] text-black">NHR 신규 채용</p>
                  <p className="text-[11px] leading-[1.4] text-[#6b6f78]">2026년 정규직 대규모 채용 (AE마케팅, 디자인)</p>
                  <p className="text-[10px] leading-[1.4] tracking-[-0.05px] text-[#3d96ef] underline">careers.nhr.kr</p>
                </div>
              </motion.div>

              {/* url bar + send control. 폭을 350px 로 박아 두면 브라우저가
                  10px 테두리를 9.697px 로 반올림하는 배율에서 내부 폭이
                  350.6px 이 되어, 오른쪽에 폰 배경색이 0.6px 새어 나와
                  세로 선처럼 보였다 — 양 끝에 붙여 항상 꽉 차게 한다. */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-white px-[9px] pb-2 pt-[13px]">
                {/* 입력 중인 링크. 한 글자도 안 쳤을 때도 줄 높이를 차지해야
                    아래 버튼 줄이 들썩이지 않으므로 빈 문자열 대신 영폭
                    공백을 깔아 둔다. */}
                <p className="truncate text-[16px] font-light tracking-[-0.08px] text-ink">
                  {typedUrl || '​'}
                  {started && !doneTyping && (
                    <span
                      aria-hidden
                      className="ml-px inline-block h-[15px] w-px translate-y-[2px] bg-ink align-baseline"
                    />
                  )}
                </p>
                <span className="sr-only">{SHARE_URL}</span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img loading="lazy" decoding="async" src={iconPlus} alt="" className="size-6" />
                    <img loading="lazy" decoding="async" src={iconSmiley} alt="" className="size-6" />
                  </div>
                  <motion.button
                    type="button"
                    animate={pressed ? { scale: 0.9 } : { scale: 1 }}
                    transition={{ duration: PRESS_MS / 1000, ease: 'easeOut' }}
                    className="min-w-16 rounded-chip px-[15px] py-[6px] text-[14px] font-medium text-ink"
                    style={{ backgroundColor: pressed ? '#e8d400' : '#ffeb00' }}
                  >
                    전송
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col items-center overflow-hidden rounded-card bg-card"
          >
            <div className="flex w-full flex-col gap-3 p-8">
              <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">채용 공고 홍보</h3>
              <p className="text-base leading-[1.45] tracking-[-0.09px] text-black/55">
                인디스워크, 캐치, 디맨드 등의 홍보 채널에 공고 정보가 연동되어 손쉽게 채용공고를 게재할 수 있습니다.
              </p>
            </div>

            <div className="flex w-full flex-1 items-end justify-center overflow-hidden px-6">
              <Hero2JobPromoMockup />
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
