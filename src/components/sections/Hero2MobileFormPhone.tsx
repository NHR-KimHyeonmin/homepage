import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import iconBattery from '../../assets/sections/hero2-application-cards/icon-battery.svg'
import iconSignal from '../../assets/sections/hero2-application-cards/icon-signal.svg'
import iconWifi from '../../assets/sections/hero2-application-cards/icon-wifi.svg'
import { useFitScale } from '../../hooks/useFitScale'
import { useSequence, useTyped } from '../../hooks/useStepSequence'

/**
 * "모바일 반응형 지원서" 카드 속 휴대폰. 전에는 통짜 스크린샷이었는데,
 * 모바일에서도 지원서를 끝까지 쓸 수 있다는 게 정지 화면으로는 전달되지
 * 않아 폼을 DOM 으로 다시 그렸다 — 영문 이름 · 휴대폰 번호 · 이메일이
 * 차례로 입력되고, 화면이 스스로 올라가 주소까지 채워진다.
 *
 * 설계 폭 370px 로 그린 다음 카드 폭에 맞춰 통째로 축소한다(useFitScale).
 * 폰은 카드 바닥에 맞붙어, 화면이 카드 밖으로 이어지는 것처럼 보인다 —
 * 원래 스크린샷의 잘린 모양 그대로다.
 *
 * 검은 테두리(베젤)는 뺐다. 카드 틴트 위에서 검은 테두리가 가장 진한 면이
 * 되어 정작 봐야 할 폼보다 먼저 눈에 들어왔다. 지금은 흰 화면만 둥근 모서리로
 * 서 있고, 떠 있는 느낌은 그림자가 맡는다.
 */
const PHONE_WIDTH = 370
/** 화면 높이. 카드 바닥에 닿아 잘리므로 아래쪽은 둥글리지 않는다. */
const PHONE_HEIGHT = 476
/** 화면 476 - 상태바 34. "인적정보" 띠는 이 안에서 같이 흘러간다. */
const FORM_VIEWPORT = 442
const SCROLL_MS = 700

/**
 * 1 화면이 올라간다 → 2 주소 입력 → 3 완료.
 *
 * 윗칸(영문 이름 · 휴대폰 번호 · 이메일)은 처음부터 채워진 채로 둔다 —
 * 한 칸씩 다 치는 걸 보여 주면 9초가 걸려서, 정작 보여 주려던 "모바일에서
 * 화면을 내려 가며 끝까지 쓴다"가 한참 뒤에야 나왔다.
 */
const STEP_DELAYS = [600, SCROLL_MS + 100, 1100]
/** 기본값(90ms)보다 빠르게 — 주소 한 줄만 남아서 또박또박 칠 이유가 없다. */
const MS_PER_CHAR = 60

const ENGLISH_NAME = 'HONG GILDONG'
const PHONE_NUMBER = '+82) 010-1234-5678'
const EMAIL = 'honggildong@nhr.kr'
const ADDRESS = '서울 강서구 까치산로 23'

interface FieldProps {
  label: string
  required?: boolean
  /** 입력되는 값. 비워 두면 placeholder 만 있는 빈 칸이다. */
  value?: string
  placeholder?: string
  busy?: boolean
  done?: boolean
}

function PhoneField({ label, required, value = '', placeholder, busy = false, done = false }: FieldProps) {
  const typedCount = useTyped(value, busy, done, MS_PER_CHAR)
  const shown = value.slice(0, typedCount)

  return (
    <div className="relative">
      {/* 테두리 위에 걸터앉는 라벨. 흰 배경으로 선을 끊어 낸다. */}
      {/* 파란 테두리는 "지금 치고 있는 칸" 하나에만 준다 — 이미 채워진
          칸까지 파래지면 어디에 커서가 있는지 안 보인다. */}
      <span
        className={clsx(
          'absolute -top-[8px] left-[11px] z-10 bg-white px-1 text-[11px] leading-[16px] transition-colors duration-300',
          busy ? 'text-primary' : 'text-[#6c737f]',
        )}
      >
        {label}
        {required && <span className="text-primary">*</span>}
      </span>

      <div
        className={clsx(
          'flex h-[44px] items-center rounded-ui border px-[13px] transition-colors duration-300',
          busy ? 'border-primary' : 'border-[#d2d6db]',
        )}
      >
        <span className="truncate text-[15px] tracking-[-0.1px] text-[#212121]">{shown}</span>
        {busy && (
          <span
            aria-hidden
            className="ml-px inline-block h-[18px] w-px shrink-0 bg-[#212121] [animation:hero1-cursor-blink_1s_steps(1,end)_infinite]"
          />
        )}
        {!shown && placeholder && (
          <span className="truncate text-[15px] tracking-[-0.1px] text-black/30">{placeholder}</span>
        )}
      </div>
      {/* 다 친 값은 읽어 줄 수 있어야 한다 — 화면에는 한 글자씩 나타나지만
          스크린 리더에는 완성된 값으로 한 번만 전달된다. */}
      {value && <span className="sr-only">{value}</span>}
    </div>
  )
}

export function Hero2MobileFormPhone() {
  const { ref: fitRef, scale } = useFitScale(PHONE_WIDTH)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const addressRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.4 })
  const reduceMotion = useReducedMotion()
  const step = useSequence(STEP_DELAYS, inView, 0, !!reduceMotion)

  /** 주소 칸까지 올리는 거리와 스크롤바 길이. 글꼴이 바뀌면 내용 높이도
   *  달라지므로 눈대중 상수 대신 실제 레이아웃을 재서 구한다. scale 은
   *  transform 이라 offsetTop · clientHeight 에 영향을 주지 않는다. */
  const [{ offset, contentHeight }, setScroll] = useState({ offset: 0, contentHeight: FORM_VIEWPORT })

  useEffect(() => {
    const content = contentRef.current
    const address = addressRef.current
    if (!content || !address) return
    const height = content.scrollHeight
    const max = Math.max(0, height - FORM_VIEWPORT)
    setScroll({ offset: Math.min(max, Math.max(0, address.offsetTop - 12)), contentHeight: height })
  }, [])

  const scrolled = step >= 1
  const thumbHeight = Math.round((FORM_VIEWPORT / contentHeight) * FORM_VIEWPORT)
  const thumbTop = scrolled ? Math.round((offset / contentHeight) * FORM_VIEWPORT) : 0

  return (
    <div ref={fitRef} className="mt-6 w-full" style={{ height: PHONE_HEIGHT * scale }}>
      <div
        ref={stageRef}
        className="relative origin-top"
        style={{
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          marginLeft: '50%',
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="relative h-full overflow-hidden rounded-t-[32px] bg-white shadow-[0_18px_50px_-14px_rgba(15,26,61,0.3)]">
            {/* 상태바. 폰 안에서 가장 작은 글자라야 "인적정보" 가 먼저
                읽힌다 — 시간 14px < 인적정보 17px. 아이콘은 그 비율에
                맞춰 줄였다. 와이파이만 글리프가 상자 중앙보다 아래에
                그려져 있어 2px 끌어올린다. */}
            <div className="flex items-center justify-between px-[18px] pb-[5px] pt-[9px]">
              <p className="text-[14px] font-semibold leading-[20px] tracking-[-0.07px] text-black">17:21</p>
              <div className="flex items-center gap-[2px]">
                <img loading="lazy" decoding="async" src={iconSignal} alt="" className="h-[10px] w-[7px]" />
                <img
                  loading="lazy"
                  decoding="async"
                  src={iconWifi}
                  alt=""
                  className="h-[22px] w-[21px] -translate-y-[2px]"
                />
                <img loading="lazy" decoding="async" src={iconBattery} alt="" className="-ml-[2px] h-[20px] w-[20px]" />
              </div>
            </div>

            <div className="relative overflow-hidden" style={{ height: FORM_VIEWPORT }}>
              {/* 상태바만 고정이고 그 아래는 전부 같이 흐른다 — "인적정보" 는
                  화면에 박힌 머리글이 아니라 폼의 첫 줄이라, 내려 가면 같이
                  올라가야 진짜 모바일 화면처럼 읽힌다.

                  relative 를 주는 이유는 아래 offsetTop 측정 때문이다. 이게
                  없으면 자식의 offsetTop 이 폰 화면(relative) 기준으로 재져
                  상태바 높이만큼 더 올려 버린다. */}
              <div
                ref={contentRef}
                className="relative"
                style={{
                  transform: `translateY(${scrolled ? -offset : 0}px)`,
                  transition: `transform ${SCROLL_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
                }}
              >
                <div className="bg-[#eceef2] px-[18px] py-[13px]">
                  <p className="text-[17px] font-bold leading-[24px] tracking-[-0.09px] text-[#212121]">인적정보</p>
                </div>

                <div className="flex flex-col gap-[14px] px-4 pb-4 pt-[18px]">
                <div className="flex h-[96px] flex-col items-center justify-center gap-1 rounded-ui border border-dashed border-[#d2d6db] bg-[#fcfcfd]">
                  <span className="flex items-center gap-1.5 text-[14px] font-medium text-[#212121]">
                    <svg aria-hidden viewBox="0 0 24 24" className="size-[15px]">
                      <path
                        d="M12 16V5M12 5 7.5 9.5M12 5l4.5 4.5M5 18.5h14"
                        fill="none"
                        stroke="#212121"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    사진
                  </span>
                  <span className="text-[12px] text-black/40">사진을 등록해 주세요.</span>
                  <span className="text-[10px] text-black/30">(GIF,JPG,JPEG,PNG) 3mb 이하</span>
                </div>

                <PhoneField label="이름" required placeholder="홍길동" />
                <PhoneField label="영문 이름" value={ENGLISH_NAME} done />
                <PhoneField label="휴대폰 번호" required value={PHONE_NUMBER} done />
                <PhoneField label="이메일" required value={EMAIL} done />

                <div ref={addressRef} className="flex flex-col gap-[14px] pt-1">
                  <p className="text-[15px] font-bold leading-[22px] text-[#212121]">주소</p>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <PhoneField label="우편번호" value="07727" done={step >= 2} />
                    </div>
                    <button
                      type="button"
                      className="h-[44px] shrink-0 rounded-ui bg-[#eceef2] px-[14px] text-[13px] font-medium text-text"
                    >
                      주소 검색
                    </button>
                  </div>
                  <PhoneField label="주소" value={ADDRESS} busy={step === 2} done={step >= 3} />
                  <PhoneField label="상세주소" placeholder="상세주소를 입력해 주세요." />
                  </div>
                </div>
              </div>

              {/* 스크롤바. "화면이 스스로 올라갔다"는 걸 말없이 알려 주는
                  유일한 단서라 폼과 같은 속도로 함께 내려간다. */}
              <span
                aria-hidden
                className="absolute right-[3px] w-[4px] rounded-full bg-black/25"
                style={{
                  height: thumbHeight,
                  top: thumbTop,
                  transition: `top ${SCROLL_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`,
                }}
              />
            </div>

        </div>
      </div>
    </div>
  )
}
