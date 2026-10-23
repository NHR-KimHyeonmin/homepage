import { useState } from 'react'
import clsx from 'clsx'
import rightPanel from '../../assets/sections/hero2-application-builder/builder-right-panel.webp'
import toolbar from '../../assets/sections/hero2-application-builder/builder-toolbar.webp'
import chevron from '../../assets/sections/hero2-application-builder/icon-row-chevron.svg'
import chevronDisabled from '../../assets/sections/hero2-application-builder/icon-row-chevron-disabled.svg'
import { useFitScale } from '../../hooks/useFitScale'
import { FormPreviewCard } from './Hero2FormBuilderCards'
import { FORM_SECTIONS, type FormSection } from './Hero2FormBuilderData'

// The Figma frame (node 2337:13686) is laid out at exactly this size; the
// whole mockup is scaled as one block to fit narrower viewports.
/**
 * 카드 그림자. 회색이 아니라 색을 머금은 하늘빛·민트다 — #fafafa 바탕 위에
 * 회색 그림자를 쓰면 때가 탄 것처럼 탁해 보이는데, 색이 있으면 떠 있는
 * 느낌만 남는다. 넓게 퍼지는 겹 + 중간 겹 + 바짝 붙는 겹, 세 장을 겹쳤다.
 *
 * y 오프셋은 0 이다. 아래로 내리면 카드가 바닥에 놓인 것처럼 보이는데,
 * 이 목업은 판 위에 떠 있는 쪽이 맞아 사방으로 고르게 번지게 했다
 * (퍼짐은 음수 spread 로 조인다).
 *
 * Tailwind 의 shadow-[...] 로는 못 쓴다 — 쉼표로 여러 겹을 넣으면 임의값
 * 파서가 삼켜서 그림자가 통째로 사라진다. 그래서 인라인 style 로 준다.
 *
 * 카드가 아니라 그 바깥 래퍼에 건다. 카드는 설계 폭(1280) 그대로 두고
 * scale 로 줄이는 구조라, 넘치는 부분을 래퍼가 overflow-hidden 으로
 * 잘라낸다 — 카드에 그림자를 걸면 그 잘림에 같이 걸려 사라진다.
 * 요소 자신의 overflow-hidden 은 자기 그림자를 자르지 않으므로 래퍼에
 * 걸면 온전히 보인다. 래퍼 박스는 축소된 카드와 정확히 같은 크기라
 * (w-full x DESIGN_HEIGHT*scale) 모양도 어긋나지 않는다.
 *
 * Container(mx-auto w-full px-5) 에 걸지 않는 이유: 좌우 거터(20/32px)
 * 까지 박스에 들어가 그림자가 카드보다 그만큼 넓게 퍼진다.
 */
const CARD_SHADOW = [
  '0 0 80px -18px rgba(124, 180, 230, 0.5)',
  '0 0 34px -8px rgba(134, 201, 192, 0.38)',
  '0 0 12px 0 rgba(130, 185, 205, 0.16)',
].join(', ')

const DESIGN_WIDTH = 1280
const DESIGN_HEIGHT = 710
const TOOLBAR_HEIGHT = 57.5

/** Figma node 2337:13763 — 40x24 track, 16px thumb, both at 50% opacity. */
function Switch({ on, disabled }: { on: boolean; disabled?: boolean }) {
  const color = disabled ? '#d2d6db' : on ? '#0042b7' : '#d2d6db'

  return (
    <span aria-hidden className="relative flex h-6 w-10 shrink-0 items-center px-[7px]">
      <span className="h-2.5 w-full rounded-chip opacity-50" style={{ backgroundColor: color }} />
      <span
        className="absolute top-1 size-4 rounded-ui shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)] transition-[left,background-color] duration-200"
        style={{ left: on ? 20 : 4, backgroundColor: color }}
      />
    </span>
  )
}

function SidebarRow({
  section,
  on,
  isActive,
  onToggle,
}: {
  section: FormSection
  on: boolean
  isActive: boolean
  onToggle: () => void
}) {
  const disabled = section.disabled

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      aria-pressed={disabled ? undefined : on}
      className={clsx(
        'flex w-full items-center border py-2 pr-[3.667px] text-left transition-colors',
        disabled ? 'cursor-default border-[#f3f4f6]' : 'cursor-pointer',
        !disabled && (isActive ? 'rounded-ui border-[#0042b7] bg-[#e6ecf8]' : 'border-[#f3f4f6] hover:bg-[#f9fafb]'),
      )}
    >
      <span className="flex h-[28px] w-[27.33px] shrink-0 items-center justify-center">
        <img loading="lazy" decoding="async" src={disabled ? chevronDisabled : chevron} alt="" className="size-[18px]" />
      </span>
      <span
        className="flex-1 pl-1 text-[16px] leading-6"
        style={{ color: disabled ? '#d2d6db' : '#212121' }}
      >
        {section.label}
      </span>
      <Switch on={on} disabled={disabled} />
    </button>
  )
}

/**
 * Figma node 2337:13686 — the "지원서 양식 편집기" admin screen, rebuilt as
 * real DOM so its sidebar switches actually work: flipping a row off pulls
 * that section's card out of the centre preview, and the cards below slide
 * up into view. The seven greyed-out rows are `disabled` exactly as in the
 * design and have no preview card behind them.
 *
 * The static chrome (top toolbar, right-hand settings panel) stays as
 * exported screenshots — nothing there reacts to the toggles.
 *
 * NOTE: the preview cards below the design's own 620px scroll viewport
 * (가산점 and everything after it) could not be exported from Figma — it
 * refuses to render nodes clipped out of view — so those are rebuilt from
 * the design's text and structure rather than traced from a render.
 */
export function Hero2FormBuilderMockup() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const [activeId, setActiveId] = useState(FORM_SECTIONS[0].id)

  const toggle = (section: FormSection) => {
    if (section.disabled) return
    setActiveId(section.id)
    setHidden((current) => ({ ...current, [section.id]: !current[section.id] }))
  }

  return (
    <div
      ref={ref}
      className="w-full overflow-hidden rounded-card"
      style={{ height: DESIGN_HEIGHT * scale, boxShadow: CARD_SHADOW }}
    >
      <div
        className="overflow-hidden rounded-card bg-white"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <img loading="lazy" decoding="async" src={toolbar} alt="" className="block w-full" style={{ height: TOOLBAR_HEIGHT }} />

        <div className="flex" style={{ height: DESIGN_HEIGHT - TOOLBAR_HEIGHT }}>
          {/* Sidebar — the interactive part */}
          <div className="flex w-[350px] shrink-0 flex-col bg-white">
            <div className="w-[319px] shrink-0 border-r-[0.667px] border-[#f9fafb] px-4 py-2">
              <div className="inline-flex rounded-ui">
                <span className="rounded-l-ui border-y-[0.667px] border-l-[0.667px] border-[#929294] bg-[#f3f4f6] px-[9px] py-[3px] text-[13px] font-medium leading-[19.5px] text-black">
                  전체보기
                </span>
                <span className="rounded-r-ui border-[0.667px] border-[#929294] bg-white px-[8.667px] py-[2.667px] text-[13px] font-medium leading-[19.5px] text-[#6c737f]">
                  활성보기
                </span>
              </div>
            </div>
            <div className="w-[319px] flex-1 overflow-y-auto overflow-x-clip overscroll-contain border-r-[0.667px] border-[#f9fafb] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex flex-col pl-[7.67px] pr-2 pt-2">
                {FORM_SECTIONS.map((section) => (
                  <SidebarRow
                    key={section.id}
                    section={section}
                    on={!section.disabled && !hidden[section.id]}
                    isActive={activeId === section.id}
                    onToggle={() => toggle(section)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Centre preview — cards appear/disappear with the switches */}
          <div className="w-[580px] shrink-0 p-2">
            <div className="size-full bg-white p-2">
              <div className="size-full overflow-y-auto overscroll-contain bg-[#f9fafb] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-[548.33px] flex-col pb-2">
                  {FORM_SECTIONS.filter((section) => section.body && !hidden[section.id]).map((section) => (
                    <FormPreviewCard key={section.id} section={section} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <img loading="lazy" decoding="async" src={rightPanel} alt="" className="block w-[350px] shrink-0 self-start" />
        </div>
      </div>
    </div>
  )
}
