import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { useFitScale } from '../../hooks/useFitScale'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { Hero2ThemeColorPicker } from './Hero2ThemeColorPicker'
import { Hero2ThemeFrame117 } from './Hero2ThemeFrame117'

/**
 * 테마 스와치. 왼쪽 끝을 하늘색으로 열고 오른쪽으로 가며 보라 → 핑크 →
 * 코랄로 따뜻해진다 — 스카이 / 브랜드 퍼플 / 바이올렛 / 핑크 / 코랄.
 *
 * 첫 칸은 틸(#0D9488, 175°)이 아니라 스카이(#0284C7, 200°)다. 틸은 초록에
 * 가까워 옆칸 보라(265°)와 멀어지는데, 스카이는 그 사이를 이어 준다.
 * 밝은 시안(#06B6D4)도 아니다 — 칩이 놓이는 유리 알약 바탕(#d3e4fa)에서
 * 대비가 1.88 까지 떨어져 혼자 흐려 보인다. 이 색은 3.17 로 나머지
 * (코랄 2.84 / 바이올렛 3.06 / 핑크 3.56) 사이에 들어간다.
 *
 * 밝고 선명한 쪽을 택했다. 판과의 대비를 끌어올리려 명도를 내려 본 적이
 * 있는데 채도는 그대로인데도 탁해 보였다 — 스와치는 장식 요소라 본문
 * 텍스트 대비 기준을 맞출 필요가 없다. 묻힘은 색이 아니라 바탕으로
 * 해결했다(아래 유리 알약).
 *
 * 보라는 커리어링크 브랜드색이자 목업의 "메인 색상" 으로 노출되므로
 * 반드시 남는다.
 *
 * 색은 이 판 위에서만 쓰이는 게 아니라 getThemeShades 를 통해 목업 전체
 * 테마(네비게이션 바탕, 버튼)를 만든다.
 */
const PALETTE = ['#0284C7', '#6E23D7', '#A855F7', '#DB2777', '#F43F5E']
/** 가운데 칸에서 시작해 양옆으로 도는 편이 줄 전체가 눈에 들어온다. */
const DEFAULT_COLOR = PALETTE[2]

/**
 * 색상 피커와 목업을 담는 패널 배경. tana.inc 의 FeatureVisuals_panel 처럼
 * 그라데이션 판 위에 흰 카드를 얹어 목업을 페이지 배경에서 떼어 놓는다.
 *
 * 위가 블루(#9ec4f5), 아래로 내려가며 민트(#aedcd5) 로 풀린다 — 메인 배너가
 * 위에서 아래로 보라에서 파랑으로 흐르므로, 그 끝색인 파랑을 이 판의
 * 시작색으로 받아 두 섹션이 이어지게 했다. 흰 카드를 끼고 있으니 배너보다
 * 한 단계 밝은 구간을 쓴다.
 */
const PANEL_GRADIENT = 'linear-gradient(170deg, #9ec4f5, #bcd4ef 45%, #aedcd5)'

/** 목업(Frame 117)이 설계된 폭. 카드가 이보다 좁으면 통째로 축소된다. */
const MOCKUP_WIDTH = 1000

/** 떠 있는 색상 피커 팝업만 목업보다 한 단계 작게 — 원래 Figma 크기대로
 *  두면 뒤의 테마 설정 패널을 거의 다 덮는다. */
const PICKER_SCALE = 0.8

/** 손대지 않아도 색이 바뀌는 간격. 목업 전체가 다시 칠해지는 걸 보여준다. */
const AUTOPLAY_MS = 2500

/**
 * Figma node 2230:178 — "Hero 2-Feature cards". A theme-customization
 * admin-panel mockup: a row of clickable theme-color swatches (radio-button
 * behavior) above a browser-chrome card that shows the theme editor
 * (Frame 117, node 2255:299) with a floating color-picker popup
 * (Frame 131, node 2280:639) overlapping its bottom-left corner.
 *
 * Both mockups are real DOM (see Hero2ThemeFrame117 / Hero2ThemeColorPicker)
 * so every `#6e23d7`-family element recolors live, together, when a
 * different swatch is selected.
 *
 * 스와치 줄과 목업은 그라데이션 패널 한 장에 함께 들어간다. 패널이
 * `overflow-hidden` 이므로 목업 카드는 아래 모서리를 둥글리지 않고 판
 * 바닥까지 내려가 잘린다 — 레퍼런스의 panelDone 과 같은 처리다.
 */
export function Hero2ThemeShowcase() {
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR)
  const reduceMotion = useReducedMotion()
  // 한 번이라도 직접 고르면 자동 전환은 끝난다 — 사람이 보고 있는 색을
  // 타이머가 빼앗는 건 고장으로 읽힌다.
  const [takenOver, setTakenOver] = useState(false)

  useEffect(() => {
    if (takenOver || reduceMotion) return
    const timer = setInterval(() => {
      setSelectedColor((current) => {
        const next = (PALETTE.indexOf(current) + 1) % PALETTE.length
        return PALETTE[next]
      })
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [takenOver, reduceMotion])

  const pickColor = (hex: string) => {
    setTakenOver(true)
    setSelectedColor(hex)
  }

  // The mockup is real DOM. It is always laid out at MOCKUP_WIDTH and then
  // scaled to whatever the card gives it, rather than being allowed to
  // stretch fluidly — stretching would keep every element at full size and
  // only widen the gaps between them, which is the opposite of what the
  // panel's generous side gutter is for.
  const { ref: fitRef, scale } = useFitScale(MOCKUP_WIDTH)

  return (
    <Section className="flex flex-col items-center overflow-hidden bg-surface-page pb-12 pt-6 md:pb-24 md:pt-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative flex w-full flex-col items-center gap-10 overflow-hidden rounded-media px-6 pt-10 md:aspect-[5/3] md:px-[120px] md:pt-14"
          style={{ backgroundImage: PANEL_GRADIENT }}
        >
          {/* 스와치를 반투명 유리 알약 위에 올린다. 고채도 칩은 밝은 한색
              그라데이션 위에서 대비가 1.6~2.7 까지 떨어지는데, 색을 어둡게
              바꾸면 탁해지므로 색 대신 바탕을 중화했다. 흰색 55% 에서
              최소 대비가 1.61 → 2.19, 평균 2.42 → 3.30 으로 올라가면서도
              뒤 그라데이션이 비쳐 유리 느낌이 남는다. */}
          <div className="flex items-center gap-[2px] rounded-full bg-white/55 px-2 py-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65),0_8px_24px_rgba(15,26,61,0.12)] backdrop-blur-md">
            {PALETTE.map((hex) => {
              const isSelected = hex.toLowerCase() === selectedColor.toLowerCase()
              return (
                <button
                  key={hex}
                  type="button"
                  aria-label={`테마 색상 ${hex} 선택`}
                  aria-pressed={isSelected}
                  onClick={() => pickColor(hex)}
                  className="flex size-[50px] items-center justify-center rounded-full"
                >
                  {/* 선택 표시는 테두리 대신 "집어 올린 칩" — 한 칸 커지고
                      그림자가 생기며 흰 체크가 들어온다. 테두리 링은 칩
                      색마다 대비가 달라져 어떤 색에서는 잘 안 보인다. */}
                  <span
                    className={clsx(
                      'flex size-[44px] items-center justify-center rounded-full transition-all duration-300',
                      isSelected
                        ? 'scale-[1.06] shadow-[0_6px_18px_rgba(15,26,61,0.3)]'
                        : 'scale-90 opacity-75 hover:scale-95 hover:opacity-100',
                    )}
                    style={{ backgroundColor: hex }}
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className={clsx(
                        'size-[22px] transition-opacity duration-200',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      <path
                        d="M5.5 12.5 10 17 18.5 7.5"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              )
            })}
          </div>

          {/* 데스크톱에서는 판이 5:3 으로 고정되므로 카드가 남은 높이를 그대로
              가져간다. 모바일은 같은 비율을 쓰면 카드가 남는 높이 없이
              사라지므로 기존 고정 높이를 유지한다. */}
          <div className="relative h-[720px] w-full max-w-[1280px] rounded-t-media bg-white md:h-auto md:min-h-0 md:flex-1">
            <div ref={fitRef} className="size-full overflow-hidden rounded-t-media">
              <div style={{ width: MOCKUP_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <Hero2ThemeFrame117 color={selectedColor} />
              </div>
            </div>

            {/* Aligned to sit directly under the "메인 색상" swatch in the 테마
                설정 panel, top-edge matched to the "모서리 둥글기" row —
                measured against the live mockup rather than the original
                Figma popup offset, which assumed a different mockup width. */}
            <div
              className="absolute hidden drop-shadow-[0_8px_24px_rgba(15,26,61,0.16)] md:block"
              style={{
                left: 77 * scale,
                top: 161 * scale,
                transform: `scale(${scale * PICKER_SCALE})`,
                transformOrigin: 'top left',
              }}
            >
              <Hero2ThemeColorPicker color={selectedColor} />
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
