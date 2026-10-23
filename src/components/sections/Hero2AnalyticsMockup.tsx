import { motion } from 'framer-motion'

/**
 * "애널리틱스 / 태그 설정" 카드 안의 목업. 원래는 399x181 PNG 한 장이었다.
 * 그 크기로는 1배 화면에서만 선명하고, 윈도우 배율 125%/150% 나 레티나
 * 에서는 그만큼 늘어나 뭉갠다 — 그래서 벡터로 다시 그렸다. 덤으로
 * 스크롤해 들어올 때 도넛과 꺾은선이 그려지는 연출이 가능해졌다.
 *
 * 색은 원본 PNG 에서 뽑았다: 주색 #3379f3, 보조 #9bbdf9, 잔여 #d9e3f4,
 * 강조 칩 배경 #eff5fe.
 */

const BLUE = '#3379f3'
const BLUE_MID = '#9bbdf9'
const BLUE_PALE = '#d9e3f4'

const STATS = [
  { label: 'Users', value: '1.2K', highlight: false },
  { label: 'Sessions', value: '2.6K', highlight: true },
  { label: 'Active', value: '304"', highlight: false },
  { label: 'Bounce', value: '0%', highlight: false },
]

/**
 * 도넛 치수. 링의 바깥 반지름은 R + 선두께/2 이므로, viewBox 한 변의 절반
 * (40) 보다 작아야 사방이 잘리지 않는다 — 28 + 7.5 = 35.5 로 4.5 여유.
 */
const R = 28
const STROKE = 15
const C = 2 * Math.PI * R

const SEGMENTS = [
  { key: 'pc', ratio: 0.57, color: BLUE, from: 0 },
  { key: 'mobile', ratio: 0.32, color: BLUE_MID, from: 0.57 },
  { key: 'tablet', ratio: 0.11, color: BLUE_PALE, from: 0.89 },
]

const LEGEND = [
  { color: BLUE, label: 'PC · 57%' },
  { color: BLUE_MID, label: '모바일 · 32%' },
  { color: BLUE_PALE, label: '태블릿 · 11%' },
]

/** 세션 추이 곡선. 오른쪽으로 갈수록 가팔라지는 S 자. */
const CURVE =
  'M0,86 C30,84 47,81 68,73 C90,65 104,56 128,51 C146,48 160,49 177,45 C201,38 220,21 248,12 C271,5 288,3 304,2'
/** 같은 곡선을 바닥까지 닫아 면으로 채운다. */
const AREA = `${CURVE} L304,100 L0,100 Z`

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero2AnalyticsMockup() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.5 }}
      className="relative h-[192px] w-[480px] shrink-0"
    >
      {/* 오른쪽 큰 패널. 왼쪽 카드와 겹치지 않고 나란히 서며, 카드 쪽이
          더 높이 올라온다 — 원본 PNG 의 배치 그대로다. */}
      <div className="absolute bottom-0 left-[168px] right-[8px] top-[28px] overflow-hidden rounded-t-[10px] bg-white">
        <div className="flex gap-1 px-2.5 pt-2.5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, delay: 0.1 + i * 0.07 } },
              }}
              className={`flex flex-1 flex-col gap-1 rounded-[5px] px-2 py-1.5 ${stat.highlight ? 'bg-[#eff5fe]' : ''}`}
            >
              <span className="whitespace-nowrap text-[10px] leading-none text-[#6b7280]">{stat.label}</span>
              <span className="whitespace-nowrap text-[17px] font-bold leading-none text-[#1f2937]">{stat.value}</span>
            </motion.div>
          ))}
        </div>

        <svg viewBox="0 0 304 100" className="mt-2 w-full" aria-hidden>
          <defs>
            <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BLUE_MID} stopOpacity="0.55" />
              <stop offset="100%" stopColor={BLUE_MID} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 기준선 */}
          <motion.line
            x1="10"
            y1="45"
            x2="294"
            y2="45"
            stroke="#c9ced8"
            strokeWidth="1"
            strokeDasharray="3 3"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4, delay: 0.15 } } }}
          />

          {/* 면 — 선이 다 그려질 즈음 차오른다 */}
          <motion.path
            d={AREA}
            fill="url(#analytics-area)"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.7, delay: 0.55 } } }}
          />

          {/* 꺾은선 — 왼쪽에서 오른쪽으로 그려진다 */}
          <motion.path
            d={CURVE}
            fill="none"
            stroke={BLUE}
            strokeWidth="2.4"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0 },
              show: { pathLength: 1, transition: { duration: 1.1, ease: EASE, delay: 0.25 } },
            }}
          />

          {/* 커서 — 선이 지나간 뒤 내려온다 */}
          <motion.line
            x1="199"
            y1="0"
            x2="199"
            y2="100"
            stroke={BLUE}
            strokeWidth="1"
            style={{ transformOrigin: '199px 0px' }}
            variants={{
              hidden: { scaleY: 0, opacity: 0 },
              show: { scaleY: 1, opacity: 0.85, transition: { duration: 0.5, ease: EASE, delay: 0.95 } },
            }}
          />
        </svg>
      </div>

      {/* 왼쪽 "접속 기기" 카드 — 오른쪽 패널보다 24px 높이 올라온다. */}
      <div className="absolute bottom-0 left-[8px] top-[4px] w-[152px] overflow-hidden rounded-t-[10px] bg-white shadow-[0_4px_16px_rgba(32,40,45,0.10)]">
        <p className="px-3.5 pt-2.5 text-[11px] font-semibold leading-none text-[#1f2937]">접속 기기</p>

        <svg viewBox="0 0 80 80" className="mx-auto mt-2 size-[80px]" aria-hidden>
          <g transform="rotate(-90 40 40)">
            {SEGMENTS.map((seg) => {
              const len = C * seg.ratio
              return (
                <motion.circle
                  key={seg.key}
                  cx="40"
                  cy="40"
                  r={R}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${len} ${C}`}
                  transform={`rotate(${seg.from * 360} 40 40)`}
                  variants={{
                    hidden: { strokeDashoffset: len },
                    show: {
                      strokeDashoffset: 0,
                      transition: { duration: 0.8, ease: EASE, delay: 0.15 + seg.from * 0.5 },
                    },
                  }}
                />
              )
            })}
          </g>
        </svg>

        <div className="flex flex-col gap-[5px] px-3.5 pt-2.5">
          {LEGEND.map((item, i) => (
            <motion.div
              key={item.label}
              variants={{
                hidden: { opacity: 0, x: -6 },
                show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE, delay: 0.75 + i * 0.1 } },
              }}
              className="flex items-center gap-1.5"
            >
              <span className="size-[7px] shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="whitespace-nowrap text-[10px] leading-none text-[#4b5563]">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
