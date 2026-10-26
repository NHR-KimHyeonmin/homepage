import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { useFitScale } from '../../hooks/useFitScale'
import { SCREEN_HEIGHT, SCREEN_WIDTH, SimpleScreen, StandardScreen } from './Hero3ScreeningScreens'

// Figma node 2320:25550 — "전형운영>일반/간편전형", laid out at this size.
const DESIGN_WIDTH = 1142
const DESIGN_HEIGHT = 894

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
 * 앞장의 top 128 은 스위치(6~59)와 그 아래 안내 문구(74~108) 다음 자리다.
 * 60 에 두었을 때는 알약 바로 아래에 그림이 맞붙어, 스위치가 그림에 달린
 * 머리띠처럼 보였다.
 *
 * 좌우 여백은 그림자(blur 24) 가 설 자리다. 앞장을 무대 오른쪽
 * 끝(102 + 1040 = 1142)에 딱 맞춰 뒀더니 overflow-hidden 에 오른쪽 그림자만
 * 잘려, 그 변만 칼로 자른 것처럼 각이 섰다. 아래도 같은 이유로 무대 높이에
 * 그림자 몫을 더해 둔다.
 */
const SLOTS = {
  front: { left: 78, top: 128, zIndex: 2, opacity: 1 },
  back: { left: 24, top: 238, zIndex: 1, opacity: 0.3 },
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

type ScreeningId = (typeof SCREENINGS)[number]['id']

/**
 * The "일반/간편 전형" tab of the 전형 운영 section. The segmented control is
 * real markup; picking a type brings that screenshot to the front slot at
 * full opacity and sends the other one back to 30%, swapping places.
 */
export function Hero3ScreeningToggle() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const [selected, setSelected] = useState<ScreeningId>('standard')

  return (
    /* 받치던 흰 카드를 뺐다 — 두 장이 서로 앞뒤로 교차하는 게 이 블록이
       보여 줄 전부라, 그걸 담는 상자는 그림을 가두기만 했다. 구역 바탕 위에
       그림자만으로 떠 있는 편이 교차가 더 잘 보인다. */
    <div className="w-full">
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
            const slot = screening.id === selected ? SLOTS.front : SLOTS.back
            return (
              <motion.div
                key={screening.id}
                role="img"
                aria-label={screening.alt}
                animate={slot}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', width: SHOT_WIDTH, height: SHOT_HEIGHT }}
                className="overflow-hidden rounded-card border border-[#eceef2] shadow-[0px_4px_24px_0px_rgba(32,40,45,0.12)]"
              >
                <div
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    transform: `scale(${SHOT_SCALE})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <screening.Screen active={screening.id === selected} />
                </div>
              </motion.div>
            )
          })}

          {/* Figma node 2320:25554 */}
          {/* 알약 꼴 전환 스위치. 고른 쪽만 흰 알약으로 떠오르고 나머지는
              회색 홈에 가라앉는다 — 둘 중 하나라는 걸 모양으로 말한다.
              가운데에 두는 이유는 뒤의 두 장이 좌우로 엇갈려 놓여서, 한쪽에
              붙이면 그 장에 딸린 조작기처럼 보이기 때문이다. */}
          <div className="absolute left-1/2 top-[6px] z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#eceef2] p-[5px]">
            {/* 흰 알약은 칸마다 켜고 끄는 게 아니라 한 장이 좌우로 미끄러진다.
                칸마다 배경색을 바꾸면 두 칸이 동시에 흐려졌다 진해져 "사라지고
                나타난다" 로 보이는데, 한 장이 움직이면 고른 자리가 저쪽에서
                이쪽으로 옮겨 왔다는 게 눈에 그려진다.

                자리는 layoutId 대신 x 로 직접 민다 — 이 블록은 scale 이 걸린
                무대 안에 있어서, 실측으로 자리를 잡는 layout 애니메이션은
                그 배율까지 끌어안아 어긋난다. 칸 폭 132 + 사이 4 = 136. */}
            <motion.span
              aria-hidden
              initial={false}
              animate={{ x: SCREENINGS.findIndex((item) => item.id === selected) * 136 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              className="absolute left-[5px] top-[5px] h-[calc(100%-10px)] w-[132px] rounded-full bg-white shadow-[0_1px_3px_rgba(32,40,45,0.2)]"
            />
            {SCREENINGS.map((screening) => {
              const isSelected = screening.id === selected
              return (
                <button
                  key={screening.id}
                  type="button"
                  onClick={() => setSelected(screening.id)}
                  aria-pressed={isSelected}
                  className={clsx(
                    'relative z-10 w-[132px] cursor-pointer rounded-full px-4 py-2 text-[18px] font-semibold leading-[1.5] tracking-[-0.09px] transition-colors duration-200',
                    isSelected ? 'text-ink' : 'text-black/40 hover:bg-[#dfe2e8] hover:text-black/60',
                  )}
                >
                  {screening.label}
                </button>
              )
            })}
          </div>

          {/* 고른 전형이 무엇인지 한 줄로 받쳐 준다. 그림만으로는 두 화면이
              어떻게 다른지가 읽히지 않는다 — 한쪽은 전형을 세워 두고 운영하는
              쪽, 한쪽은 지원자를 옮기며 진행하는 쪽이다.

              높이를 34 로 못박아 두는 이유는, 문구가 바뀔 때 줄 수가 달라지면
              아래 그림이 들썩이기 때문이다. */}
          <div className="absolute left-0 top-[74px] z-10 flex h-[34px] w-full items-center justify-center px-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={selected}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="text-center text-[20px] font-medium tracking-[-0.1px] text-black/55"
              >
                {SCREENINGS.find((item) => item.id === selected)?.note}
              </motion.p>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}
