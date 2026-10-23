import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import logoCatch from '../../assets/sections/hero2-application-cards/channels/catch.png'
import logoDemand from '../../assets/sections/hero2-application-cards/channels/demand.png'
import logoFacebook from '../../assets/sections/hero2-application-cards/channels/facebook.png'
import logoIndeed from '../../assets/sections/hero2-application-cards/channels/indeed.png'

/**
 * Figma node 2337:13527 — 공고 목록의 "공고 홍보하기" 메뉴에서 외부 채널로
 * 연동되는 흐름. 원래는 1584x1227 webp 한 장이었는데, 스크롤해 들어올 때
 * ⋯ → 메뉴 → 연결선 → 채널 상자 순서로 보여주려면 각 조각이 따로 움직여야
 * 해서 DOM 으로 다시 짰다. 채널 로고만 원본 webp 에서 떼어내 썼다.
 *
 * 좌표와 색은 원본 webp 를 3.168 로 나눠(1584 → 500) 옮겼다.
 */

const CHANNELS = [
  { src: logoIndeed, alt: '인디스워크', w: 30 },
  { src: logoCatch, alt: '캐치', w: 34 },
  { src: logoDemand, alt: '디맨드', w: 33 },
  { src: logoFacebook, alt: '페이스북', w: 38 },
]

const ROWS = [
  { title: '커리어링크 신입/경력 채용', status: '접수마감', closed: true },
  { title: '커리어링크 경력 채용', status: '접수중', closed: false },
  { title: '커리어링크 IT직군 인턴 채용', status: '접수중', closed: false },
]

const MENU = ['복제하기', '수정하기', '공고 홍보하기', '삭제하기']
/** 메뉴에서 눌리는 항목. 이 줄이 강조되고 거기서 연결선이 뻗는다. */
const PROMO_INDEX = 2

const EASE = [0.16, 1, 0.3, 1] as const

/** 연출 순서(초). 하나라도 어긋나면 "누르니까 떴다" 가 아니라 "따로 논다". */
const T = {
  press: 0.25,
  menu: 0.5,
  highlight: 1.05,
  line: 1.35,
  /** 점선이 트레이에 닿을 즈음 받침 상자가 나타난다. */
  tray: 1.95,
  /** 선이 다 그려진 뒤, 신호 한 조각이 선을 타고 트레이까지 내려간다. */
  pulse: 2.25,
  pulseDuration: 0.75,
  channels: 2.85,
  perChannel: 0.1,
}

/**
 * 연결선의 전체 길이(가로 166 + 모서리 호 ≈ 12.6 + 세로 36). 신호 조각을
 * 이 길이만큼 흘려보내야 선 끝에서 정확히 사라진다.
 */
const LINE_LENGTH = 215
/** 흘러가는 신호 조각의 길이. */
const PULSE_LENGTH = 16
/** 신호 조각 색 — 표의 링크와 같은 계열로 둬서 이 목업 안에서만 논다. */
const BLUE = '#3570b8'

function Dots({ active }: { active: boolean }) {
  return (
    <span
      className="flex size-[22px] items-center justify-center gap-[2px] rounded-full transition-colors duration-200"
      style={{ backgroundColor: active ? '#f0f0f0' : 'transparent' }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-[2.5px] rounded-full bg-[#9aa0a6]" />
      ))}
    </span>
  )
}

export function Hero2JobPromoMockup() {
  const reduceMotion = useReducedMotion()
  const [started, setStarted] = useState(false)
  const [pressed, setPressed] = useState(false)

  // 움직임을 끈 환경에서는 완성된 화면을 바로 둔다.
  const on = reduceMotion || started
  const at = (sec: number) => (reduceMotion ? 0 : sec)

  useEffect(() => {
    if (!started || reduceMotion) return
    const down = setTimeout(() => setPressed(true), T.press * 1000)
    const up = setTimeout(() => setPressed(false), (T.press + 0.18) * 1000)
    return () => {
      clearTimeout(down)
      clearTimeout(up)
    }
  }, [started, reduceMotion])

  return (
    <motion.div
      viewport={{ amount: 0.5 }}
      onViewportEnter={() => setStarted(true)}
      onViewportLeave={() => {
        setStarted(false)
        setPressed(false)
      }}
      className="relative h-[380px] w-[500px] shrink-0"
    >
      {/* 공고 목록 */}
      <div className="absolute left-[32px] top-[4px] w-[388px] overflow-hidden rounded-[10px] bg-white shadow-[0_2px_14px_rgba(32,40,45,0.10)]">
        <div className="flex h-[40px] items-center bg-[#f9fbfc] text-[13px] font-medium text-[#181818]">
          <span className="flex-1 text-center">공고명</span>
          <span className="w-[1px] self-stretch bg-[#e3e6e8]" />
          <span className="w-[96px] text-center">상태</span>
          <span className="w-[1px] self-stretch bg-[#e3e6e8]" />
          <span className="w-[52px]" />
        </div>

        {ROWS.map((row, i) => (
          <div
            key={row.title}
            className="flex h-[38px] items-center border-t border-[#eaeced] text-[12px]"
          >
            <span className="flex-1 pl-[18px]">
              <span className="text-[#3570b8] underline underline-offset-[3px]">{row.title}</span>
            </span>
            <span className="flex w-[96px] justify-center">
              <span
                className="rounded-full px-[9px] py-[2px] text-[11px] font-medium"
                style={
                  row.closed
                    ? { backgroundColor: '#ebf5eb', color: '#309b2e' }
                    : { backgroundColor: '#e6ebf7', color: '#0f3c85' }
                }
              >
                {row.status}
              </span>
            </span>
            <span className="flex w-[52px] justify-center">
              {/* 2행(커리어링크 경력 채용)의 ⋯ 가 눌린다 */}
              <motion.span
                animate={i === 1 && pressed ? { scale: 0.88 } : { scale: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Dots active={i === 1 && on} />
              </motion.span>
            </span>
          </div>
        ))}
      </div>

      {/* ⋯ 에서 펼쳐지는 메뉴 */}
      <motion.div
        initial={false}
        animate={on ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: -8 }}
        transition={{ duration: 0.4, ease: EASE, delay: at(T.menu) }}
        aria-hidden={!on}
        className="absolute left-[362px] top-[118px] w-[113px] origin-top-right overflow-hidden rounded-[10px] bg-white shadow-[0_4px_20px_rgba(32,40,45,0.16)]"
      >
        {MENU.map((item, i) => {
          const isPromo = i === PROMO_INDEX
          return (
            <motion.div
              key={item}
              initial={false}
              // 눌린 티는 색으로만 낸다 — 짙은 파랑이 한 번 번쩍였다가 연한
              // 바탕으로 가라앉고, 글씨는 파랗게 남는다.
              animate={
                on && isPromo
                  ? {
                      backgroundColor: ['#ffffff', '#bdcef0', '#e6ebf7'],
                      color: ['#1a1a1a', '#0f3c85', '#0f3c85'],
                    }
                  : { backgroundColor: '#ffffff', color: '#1a1a1a' }
              }
              transition={
                on && isPromo
                  ? { duration: 0.5, times: [0, 0.3, 1], ease: 'easeOut', delay: at(T.highlight) }
                  : { duration: 0.2 }
              }
              className="flex h-[36px] items-center border-t border-[#f1f2f4] pl-[14px] text-[13px] first:border-t-0"
            >
              {item}
            </motion.div>
          )
        })}
      </motion.div>

      {/* 메뉴의 "공고 홍보하기" 줄에서 트레이로 내려가는 대시 점선.
          pathLength 를 애니메이션하면 framer 가 strokeDasharray 를 제 용도로
          덮어써서 대시가 사라지고 실선이 된다 — 그래서 선은 그대로 두고,
          오른쪽에서 왼쪽으로 훑는 마스크로 그려지게 한다. */}
      <svg
        className="absolute left-[180px] top-[200px]"
        width="190"
        height="60"
        viewBox="0 0 190 60"
        fill="none"
        aria-hidden
      >
        <defs>
          {/* 오른쪽(메뉴) 에서 왼쪽(트레이) 으로 훑는 마스크. scaleX 로 줄이면
              SVG 에서 transform-origin 이 먹지 않아 가운데를 기준으로 커지고,
              첫 프레임에 선이 통째로 번쩍인다 — 폭은 그대로 두고 x 만 옮겨
              덮는 범위를 바꾼다. x=190 이면 viewBox 밖이라 아무것도 안 보인다. */}
          <mask id="promo-line-wipe">
            <motion.rect
              y="0"
              width="190"
              height="60"
              fill="#fff"
              initial={false}
              animate={{ x: on ? 0 : 190 }}
              transition={{ duration: 0.65, ease: 'easeInOut', delay: at(T.line) }}
            />
          </mask>
        </defs>
        <path
          d="M182 8 H16 Q8 8 8 16 V52"
          stroke="#c2c8cf"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          strokeLinecap="butt"
          mask="url(#promo-line-wipe)"
        />
        {/* 선을 타고 내려가는 신호 한 조각 — 공고가 채널로 "보내지는" 순간.
            선이 그려지기만 하면 연결됐다는 뜻에 그치고, 무언가 오간다는
            느낌이 나지 않는다. */}
        <motion.path
          d="M182 8 H16 Q8 8 8 16 V52"
          stroke={BLUE}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray={`${PULSE_LENGTH} ${LINE_LENGTH * 2}`}
          initial={false}
          animate={{ strokeDashoffset: on ? -LINE_LENGTH : PULSE_LENGTH }}
          transition={
            on
              ? { duration: T.pulseDuration, ease: 'easeInOut', delay: at(T.pulse) }
              : { duration: 0 }
          }
        />
      </svg>

      {/* 홍보 채널 트레이 — 점선이 내려와 닿은 뒤에 받침이 생긴다. 처음부터
          깔려 있으면 선이 "이미 있던 곳" 으로 가는 셈이라 연결된 느낌이 약하다. */}
      <motion.div
        initial={false}
        animate={on ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 6 }}
        transition={{ duration: 0.4, ease: EASE, delay: at(T.tray) }}
        aria-hidden={!on}
        className="absolute left-[40px] top-[252px] flex origin-top gap-[15px] rounded-[12px] bg-[#ebedee] p-[16px]"
      >
        {CHANNELS.map((ch, i) => (
          <motion.div
            key={ch.alt}
            initial={false}
            // 신호가 도착하는 순간 한 번 튀어오르게 한다 — 그냥 나타나면
            // 받았다기보다 원래 있던 것처럼 보인다.
            animate={on ? { opacity: 1, y: 0, scale: [0.85, 1.09, 1] } : { opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.45, ease: EASE, delay: at(T.channels + i * T.perChannel) }}
            aria-hidden={!on}
            className="flex size-[52px] items-center justify-center rounded-[10px] bg-white shadow-[0_1px_4px_rgba(32,40,45,0.10)]"
          >
            <img src={ch.src} alt={ch.alt} style={{ width: ch.w }} className="h-auto" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
