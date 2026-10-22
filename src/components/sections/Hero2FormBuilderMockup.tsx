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
        <img src={disabled ? chevronDisabled : chevron} alt="" className="size-[18px]" />
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
    <div ref={ref} className="w-full overflow-hidden" style={{ height: DESIGN_HEIGHT * scale }}>
      <div
        className="overflow-hidden rounded-card border border-[#e5e7eb] bg-white shadow-[0px_2px_14px_0px_rgba(32,40,45,0.08)]"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <img src={toolbar} alt="" className="block w-full" style={{ height: TOOLBAR_HEIGHT }} />

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

          <img src={rightPanel} alt="" className="block w-[350px] shrink-0 self-start" />
        </div>
      </div>
    </div>
  )
}
