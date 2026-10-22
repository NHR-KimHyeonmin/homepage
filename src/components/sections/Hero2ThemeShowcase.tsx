import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useFitScale } from '../../hooks/useFitScale'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { Hero2ThemeColorPicker } from './Hero2ThemeColorPicker'
import { Hero2ThemeFrame117 } from './Hero2ThemeFrame117'

/**
 * 테마 스와치. 웹에서 흔히 쓰는 고채도 브랜드 컬러(Tailwind 600 계열)로
 * 맞췄다 — 로즈 / 오렌지 / 그린 / 스카이 / 브랜드 퍼플.
 *
 * 한 번은 판과의 대비를 끌어올리려고 명도를 내려 봤는데(#C65C10, #108E5A
 * 등) 채도는 그대로인데도 탁해 보였다. 어두운 고채도색은 선명하게
 * 읽히지 않는다 — 스와치는 장식 요소라 본문 텍스트 기준을 맞추기보다
 * 밝고 선명한 쪽이 맞다. 대신 비선택 스와치의 투명도를 75% 로 올리고
 * 선택 표시를 테두리 대신 체크+그림자로 둬서 판에 묻히지 않게 했다.
 *
 * 보라는 커리어링크 브랜드색이자 목업의 "메인 색상" 으로 노출되므로
 * 바꾸지 않는다.
 *
 * 색은 이 판 위에서만 쓰이는 게 아니라 getThemeShades 를 통해 목업 전체
 * 테마(네비게이션 바탕, 버튼)를 만든다.
 */
const PALETTE = ['#E11D48', '#F97316', '#16A34A', '#0EA5E9', '#6E23D7']
const DEFAULT_COLOR = '#6E23D7'

/**
 * 색상 피커와 목업을 담는 패널 배경. tana.inc 의 FeatureVisuals_panel 처럼
 * 그라데이션 판 위에 흰 카드를 얹어 목업을 페이지 흰 배경에서 떼어 놓는다.
 * 색은 메인 배너의 베이스 그라데이션(블루그레이 → 라벤더 → 민트)과 같은
 * 세 지점을 쓰되 한 단계 낮춰 잡았다 — 배너는 화면 전체를 덮으니 옅어도
 * 되지만, 이 판은 흰 카드를 끼고 있어 그 명도로는 카드 가장자리가 묻힌다.
 * 카드에 테두리를 두르지 않고 이 명도 차만으로 윤곽을 만든다.
 */
const PANEL_GRADIENT = 'linear-gradient(135deg, #b4c6e8, #cdc7ee 45%, #b2dcda)'

/** 목업(Frame 117)이 설계된 폭. 카드가 이보다 좁으면 통째로 축소된다. */
const MOCKUP_WIDTH = 1000

/** 떠 있는 색상 피커 팝업만 목업보다 한 단계 작게 — 원래 Figma 크기대로
 *  두면 뒤의 테마 설정 패널을 거의 다 덮는다. */
const PICKER_SCALE = 0.8

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
  // The mockup is real DOM. It is always laid out at MOCKUP_WIDTH and then
  // scaled to whatever the card gives it, rather than being allowed to
  // stretch fluidly — stretching would keep every element at full size and
  // only widen the gaps between them, which is the opposite of what the
  // panel's generous side gutter is for.
  const { ref: fitRef, scale } = useFitScale(MOCKUP_WIDTH)

  return (
    <Section className="flex flex-col items-center overflow-hidden bg-white pb-12 pt-6 md:pb-24 md:pt-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative flex w-full flex-col items-center gap-10 overflow-hidden rounded-media px-6 pt-10 md:aspect-[5/3] md:px-[120px] md:pt-14"
          style={{ backgroundImage: PANEL_GRADIENT }}
        >
          <div className="flex items-center gap-[2px]">
            {PALETTE.map((hex) => {
              const isSelected = hex.toLowerCase() === selectedColor.toLowerCase()
              return (
                <button
                  key={hex}
                  type="button"
                  aria-label={`테마 색상 ${hex} 선택`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedColor(hex)}
                  className="flex size-[58px] items-center justify-center rounded-full"
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
