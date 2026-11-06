import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useFitScale } from '../../hooks/useFitScale'
import { SCREEN_HEIGHT, SCREEN_WIDTH, SimpleScreen, StandardScreen } from './Hero3ScreeningScreens'

// Figma node 2320:25550 — "전형운영>일반/간편전형", laid out at this size.
const DESIGN_WIDTH = 1142
const DESIGN_HEIGHT = 854

/**
 * 그림 한 장의 폭. 받치던 흰 카드를 걷어내면서 820 → 1040 까지 키웠다.
 * 본문 단과 거의 같은 폭이다.
 *
 * 1070 까지 키웠다가 30 을 되돌려 놓았다. 앞장은 오른쪽 그림자 몫(24) 때문에
 * 더 왼쪽으로 못 가는데, 그만큼 뒷장이 왼쪽으로 빠질 자리가 24 밖에 안 남아
 * 두 장이 거의 포개져 보였다. 폭 2% 를 내주고 엇갈림을 24 → 54 로 늘렸다.
 *
 * 원본이 1640px 이라 여기까지는 넉넉히 선명하다. 더 키우면 1배율에서는
 * 버텨도 고해상도 화면에서 원본 픽셀이 모자라 뿌옇게 풀린다 — 크기는
 * 이 선에서 멈추고, 더 키울 거면 그림부터 다시 뽑아야 한다.
 */
const SHOT_WIDTH = 1040

/**
 * Where the two screenshots sit (Figma nodes 2320:25553 / 25552). The
 * selected one takes the front slot — up and to the right, fully opaque —
 * and the other drops back to 30%.
 *
 * 위아래 차이를 16 → 110 으로 벌렸다. 그림을 본문 단 폭까지 키우면서 가로로
 * 엇갈릴 자리가 얼마 남지 않았는데, 두 장이 거의 포개져 있으면 한 장이
 * 다른 장을 가린 것인지 두 장인지가 안 읽힌다 — 가로로 못 벌린 만큼 세로로
 * 더 벌어야 두 장이라는 게 보인다.
 *
 * 앞장의 top 88 은 안내 문구(12~46) 다음 자리다.
 * 60 에 두었을 때는 알약 바로 아래에 그림이 맞붙어, 스위치가 그림에 달린
 * 머리띠처럼 보였다.
 *
 * 좌우 여백은 그림자(blur 24) 가 설 자리다. 앞장을 무대 오른쪽
 * 끝(102 + 1040 = 1142)에 딱 맞춰 뒀더니 overflow-hidden 에 오른쪽 그림자만
 * 잘려, 그 변만 칼로 자른 것처럼 각이 섰다. 아래도 같은 이유로 무대 높이에
 * 그림자 몫을 더해 둔다.
 */
const SLOTS = {
  front: { left: 78, top: 88, zIndex: 2, opacity: 1 },
  back: { left: 24, top: 198, zIndex: 1, opacity: 0.3 },
} as const

const SCREENINGS = [
  {
    id: 'standard',
    label: '일반 전형',
    note: '전형보드 형태로, 다수의 지원자를 위한 전형 관리에 적합합니다.',
    Screen: StandardScreen,
    alt: '일반 전형으로 운영되는 전형 관리 화면',
  },
  {
    id: 'simple',
    label: '간편 전형',
    note: '칸반보드 형태로, 소규모 채용을 위한 전형 관리에 적합합니다.',
    Screen: SimpleScreen,
    alt: '간편 전형으로 운영되는 전형 관리 화면',
  },
] as const

/** 화면은 1640 설계 좌표로 그려 놓고 보여 줄 폭에 맞춰 줄인다. */
const SHOT_SCALE = SHOT_WIDTH / SCREEN_WIDTH
const SHOT_HEIGHT = Math.round(SCREEN_HEIGHT * SHOT_SCALE)

/** 작은 스위치 한 칸의 폭. 무대에 scale 이 걸려 있어 실측이 어긋나므로
 *  (PillSwitch 를 못 쓰는 이유) 폭을 못박고 미끄러질 거리를 직접 센다. */
const PILL_CELL_WIDTH = 72

/** 두 장이 자리를 바꾸는 움직임. 천천히 출발해 천천히 멈추게 해 급하게
 *  튀지 않게 한다. 장·스위치 알약·설명 문장이 같은 박자로 움직인다. */
const SWAP = { duration: 0.7, ease: [0.45, 0, 0.2, 1] as const }

/** 카드는 자리 이동은 SWAP 박자로 하되, 투명도는 먼저 끝낸다. 앞뒤 순서(z)는
 *  바뀌는 즉시 넘어가는데 투명도가 느리면, 반투명한 채 앞으로 온 카드 너머로
 *  뒤로 가는 카드가 이동 내내 비쳐 보인다. */
const CARD_SWAP = { ...SWAP, opacity: { duration: 0.2, ease: 'easeOut' as const } }

/** 저절로 바뀌는 간격. */
const AUTOPLAY_MS = 4000

type ScreeningId = (typeof SCREENINGS)[number]['id']

/**
 * The "일반/간편 전형" tab of the 전형 운영 section. The segmented control is
 * real markup; picking a type brings that screenshot to the front slot at
 * full opacity and sends the other one back to 30%, swapping places.
 */
export function Hero3ScreeningToggle() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const [selected, setSelected] = useState<ScreeningId>('standard')
  // 누르기 전까지는 4초마다 일반 ↔ 간편을 저절로 바꿔 둘 다 보여 준다.
  // 한 번 누르면 멈춘다 — 고른 화면을 타이머가 빼앗으면 고장으로 읽힌다.
  const [takenOver, setTakenOver] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)
  const inView = useInView(blockRef, { amount: 0.4 })
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (takenOver || !inView || reduceMotion) return
    const timer = setTimeout(() => setSelected((id) => (id === 'standard' ? 'simple' : 'standard')), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [selected, takenOver, inView, reduceMotion])
  const pick = (id: ScreeningId) => {
    setTakenOver(true)
    setSelected(id)
  }
  const current = SCREENINGS.find((item) => item.id === selected) ?? SCREENINGS[0]

  return (
    /* 받치던 흰 카드를 뺐다 — 두 장이 서로 앞뒤로 교차하는 게 이 블록이
       보여 줄 전부라, 그걸 담는 상자는 그림을 가두기만 했다. 구역 바탕 위에
       그림자만으로 떠 있는 편이 교차가 더 잘 보인다. */
    <div ref={blockRef} className="w-full">
      <div ref={ref} className="w-full overflow-hidden" style={{ height: DESIGN_HEIGHT * scale }}>
        {/* 가운데 맞춤. useFitScale 은 배율을 1 로 묶어 두므로, 무대(1142)가
            담는 칸(1208)보다 좁은 넓은 화면에서는 왼쪽에 붙어 33px 쯤 왼쪽으로
            치우쳐 보였다. 좌우 여백을 반반씩 나눠 갖게 한다 — translateX(-50%)
            와 origin top center 를 같이 써야 배율이 1 보다 작아질 때도
            가운데가 유지된다. */}
        <div
          className="relative overflow-hidden"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            marginLeft: '50%',
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {SCREENINGS.map((screening) => {
            const isSelected = screening.id === selected
            const slot = isSelected ? SLOTS.front : SLOTS.back
            return (
              /* 뒤에 깔린 장을 눌러도 앞으로 올라온다 — 두 장이 포개져 있으면
                 뒤엣것을 누르는 게 먼저 떠오르지, 위의 문장을 찾아가지 않는다.
                 키보드로 바꾸는 길은 그 문장의 이름 버튼이 맡으므로 여기는
                 마우스를 위한 지름길이다. */
              <motion.div
                key={screening.id}
                role="img"
                aria-label={screening.alt}
                onClick={isSelected ? undefined : () => pick(screening.id)}
                animate={slot}
                transition={CARD_SWAP}
                style={{ position: 'absolute', width: SHOT_WIDTH, height: SHOT_HEIGHT }}
                className={`overflow-hidden rounded-card border border-[#eceef2] shadow-[0px_4px_24px_0px_rgba(32,40,45,0.12)] ${isSelected ? '' : 'cursor-pointer'}`}
              >
                <div
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    transform: `scale(${SHOT_SCALE})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <screening.Screen active={isSelected} />
                </div>
              </motion.div>
            )
          })}


          {/* 조작기를 따로 두지 않고 문장 안의 이름이 곧 스위치다. 아래
              묶음들이 알약 탭이라 여기까지 탭이면 한 화면에 고르는 줄이
              셋인데, 고를 것은 둘뿐이고 그 둘의 차이는 결국 이 한 문장이다 —
              이름을 누르면 문장과 그림이 같이 반대쪽으로 넘어간다.

              높이를 34 로 못박아 두는 이유는, 문구가 바뀔 때 줄 수가 달라지면
              아래 그림이 들썩이기 때문이다. */}
          <div className="absolute left-0 top-[12px] z-10 flex h-[34px] w-full items-center justify-center gap-2 px-10">
            {/* 문장 왼쪽에 서는 작은 스위치. 홈은 구역 바탕(#f6fafc)에서 한
                톤만 내려, 조작기가 글줄 옆에서 튀지 않게 한다. 고른 칸은
                아래 전형 운영 탭과 같은 회색(#f1f0ee)이다 — 한 구역 안에서
                "고른 것" 의 색이 둘이면 신호가 흐려진다. */}
            <div
              className="relative flex shrink-0 items-center rounded-full bg-white p-[3px] shadow-soft"
              role="group"
              aria-label="전형 방식 선택"
            >
              <motion.span
                aria-hidden
                initial={false}
                animate={{ x: SCREENINGS.findIndex((item) => item.id === selected) * PILL_CELL_WIDTH }}
                transition={SWAP}
                className="absolute left-[3px] top-[3px] h-[calc(100%-6px)] rounded-full bg-[#eceff3]"
                style={{ width: PILL_CELL_WIDTH }}
              />
              {SCREENINGS.map((screening) => {
                const isSelected = screening.id === selected
                return (
                  <button
                    key={screening.id}
                    type="button"
                    onClick={() => pick(screening.id)}
                    aria-pressed={isSelected}
                    style={{ width: PILL_CELL_WIDTH }}
                    className={`relative z-10 cursor-pointer whitespace-nowrap rounded-full py-[3px] text-[14px] font-semibold tracking-[-0.07px] transition-colors duration-200 ${
                      isSelected ? 'text-title' : 'text-sub hover:text-body'
                    }`}
                  >
                    {screening.label}
                  </button>
                )
              })}
            </div>

            {/* 칸 하나에 "자" 와 "창" 을 포갠다.

                자: 두 문장을 모두 그려 두되 보이지 않게 둔다. 칸이 둘 중
                넓은 쪽에 맞춰지므로 묶음 전체 폭이 고정되고, 가운데 정렬이어도
                스위치가 제자리에 선다 — 전에는 문장이 17px 짧아지면 스위치가
                그 절반만큼(8.5px) 오른쪽으로 밀렸다.

                창: overflow-hidden 한 칸 안에서 옛 문장이 위로 빠져나가고 새
                문장이 아래에서 올라온다. 두 장이 같은 시각에 움직여야 한 줄이
                감겨 올라가는 것으로 보이므로 mode 를 주지 않는다(동시 진행).
                110% 는 글자 아랫단(디센더)까지 창 밖으로 내보내는 거리다. */}
            <div className="grid shrink-0">
              {SCREENINGS.map((screening) => (
                <p
                  key={screening.id}
                  aria-hidden
                  className="invisible col-start-1 row-start-1 text-left text-[20px] font-medium leading-[1.5] tracking-[-0.1px]"
                >
                  {screening.note}
                </p>
              ))}
              <div className="relative col-start-1 row-start-1 overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.p
                    key={selected}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-110%' }}
                    transition={SWAP}
                    className="absolute inset-x-0 top-0 text-left text-[20px] font-medium leading-[1.5] tracking-[-0.1px] text-body"
                  >
                    {current.note}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 점 둘. 뒤엣장을 눌러 넘길 수 있다는 건 눌러 보기 전엔 모르는데,
          점은 "넘길 게 둘 있고 지금은 이쪽" 이라는 걸 그 전에 말해 준다.
          무대(scale) 바깥에 둔다 — 안에 넣으면 좁은 화면에서 점까지 같이
          줄어들어 누를 자리가 사라진다. */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {SCREENINGS.map((screening) => {
          const isSelected = screening.id === selected
          return (
            <button
              key={screening.id}
              type="button"
              onClick={() => pick(screening.id)}
              aria-label={`${screening.label} 보기`}
              aria-current={isSelected}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                isSelected ? 'w-6 bg-[#4f6272]' : 'w-2 bg-[#d3d9df] hover:bg-[#9aa5b1]'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
