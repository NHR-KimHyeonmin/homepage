import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import rightPanel from '../../assets/sections/hero2-application-builder/builder-right-panel.webp'
import toolbar from '../../assets/sections/hero2-application-builder/builder-toolbar.webp'
import chevron from '../../assets/sections/hero2-application-builder/icon-row-chevron.svg'
import chevronDisabled from '../../assets/sections/hero2-application-builder/icon-row-chevron-disabled.svg'
import { useFitScale } from '../../hooks/useFitScale'
import { FormApplicantCard } from './Hero2FormBuilderApplicant'
import { FormPreviewCard } from './Hero2FormBuilderCards'
import { FORM_SECTIONS, type FormSection } from './Hero2FormBuilderData'
import { FormRetroTable } from './Hero2FormBuilderRetro'

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

/**
 * Basic | Retro | 지원자 전환 탭. 툴바는 통째로 내보낸 스크린샷이라 그 안의
 * 탭은 눌리지 않는다 — 이미지 속 탭 자리에 같은 모양의 DOM 탭을 덮어
 * 그린다. 좌표는 builder-toolbar.webp(2560x115)에서 테두리 픽셀을 직접
 * 읽어 구한 값을 설계 좌표(1280x57.5)로 환산한 것이다: 묶음 x 596~981,
 * y 17~96 → 절반.
 *
 */
/**
 * 데모가 끝난 뒤 사용자의 마우스 포인터를 데모 커서와 같은 동그라미로
 * 바꾼다. 커서 이미지는 무대의 scale 을 따라가지 않으므로, 화면에 찍히는
 * 크기(30px * 0.95)에 맞춰 32x32 로 그렸다.
 */
const POINTER_SKIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='13' fill='rgba(77,87,97,0.7)' stroke='white' stroke-width='2'/%3E%3C/svg%3E\") 16 16, auto"

const TAB_BOX = { left: 298, top: 8.5, width: 192.5, height: 39.5 }
const TABS = [
  { view: 'basic' as const, label: 'Basic', width: 63 },
  { view: 'retro' as const, label: 'Retro', width: 64 },
  { view: 'applicant' as const, label: '지원자', width: 65.5 },
]

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
  demo,
}: {
  section: FormSection
  on: boolean
  isActive: boolean
  onToggle: () => void
  /** 데모 커서가 겨냥하는 행을 찾기 위한 표시. */
  demo?: string
}) {
  const disabled = section.disabled

  return (
    <button
      type="button"
      data-demo={demo}
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
  const [view, setView] = useState<'basic' | 'retro' | 'applicant'>('basic')

  // 데모 커서. 섹션에 들어오면 1.5초 뒤에 지원정보 스위치를 껐다 켜고,
  // Retro → 지원자 → Basic 순으로 탭을 눌러 보인 다음 사라진다. 한 번
  // 돌고 멈추지만, 섹션을 벗어났다 돌아오면 처음부터 다시 돈다.
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.45 })
  const reduceMotion = useReducedMotion()
  const [cursor, setCursor] = useState<{ x: number; y: number; down: boolean } | null>(null)
  // 사람이 직접 누르면 그 자리에서 멈춘다 — 손으로 고른 상태를 데모가
  // 빼앗는 건 고장으로 읽힌다. 섹션을 다시 들어오면 풀린다.
  const [takenOver, setTakenOver] = useState(false)
  // 데모가 끝나면(또는 사람이 가로채면) 목업 안에서 실제 포인터가 데모와
  // 같은 동그라미가 된다. 섹션을 벗어나면 원래대로 돌아간다.
  const [pointerSkin, setPointerSkin] = useState(false)
  // 데모가 끝나는 순간 "이제 직접 해 보라"는 말을 한 번 띄우고 지운다.
  const [hint, setHint] = useState(false)

  useEffect(() => {
    if (!inView) {
      setTakenOver(false)
      setPointerSkin(false)
      setCursor(null)
      setHint(false)
      return
    }
    if (takenOver || reduceMotion) {
      // 사람이 직접 누른 순간 데모 커서와 안내막은 바로 걷는다 — 손을
      // 올린 자리에 유령 커서가 남아 있으면 자기 커서와 헷갈린다.
      setCursor(null)
      setHint(false)
      setPointerSkin(true)
      return
    }

    let cancelled = false
    const timers: number[] = []
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })

    /** 목표 요소의 한 점을 설계 좌표(1280 기준)로 환산한다. */
    const pointAt = (selector: string, bias = 0.5) => {
      const stage = stageRef.current
      const target = stage?.querySelector<HTMLElement>(selector)
      if (!stage || !target) return null
      const base = stage.getBoundingClientRect()
      const rect = target.getBoundingClientRect()
      const k = base.width / DESIGN_WIDTH
      return {
        x: (rect.left + rect.width * bias - base.left) / k,
        y: (rect.top + rect.height / 2 - base.top) / k,
      }
    }

    const moveTo = async (selector: string, bias?: number) => {
      const point = pointAt(selector, bias)
      if (point) setCursor({ ...point, down: false })
      await sleep(620)
    }

    const press = async (action: () => void) => {
      setCursor((current) => (current ? { ...current, down: true } : current))
      await sleep(170)
      action()
      setCursor((current) => (current ? { ...current, down: false } : current))
      await sleep(430)
    }

    const run = async () => {
      await sleep(1500)
      if (cancelled) return

      // 스위치는 행 오른쪽 끝에 있으므로 가운데가 아니라 그쪽을 겨냥한다.
      await moveTo('[data-demo="first-row"]', 0.9)
      if (cancelled) return
      await press(() => toggle(FORM_SECTIONS[0]))
      if (cancelled) return
      // 카드가 빠진 화면을 한 박자 보여 주고 다시 켠다.
      await sleep(800)
      if (cancelled) return
      await press(() => toggle(FORM_SECTIONS[0]))
      if (cancelled) return

      for (const next of ['retro', 'applicant', 'basic'] as const) {
        await moveTo(`[data-demo="tab-${next}"]`)
        if (cancelled) return
        await press(() => setView(next))
        if (cancelled) return
        await sleep(900)
        if (cancelled) return
      }

      setCursor(null)
      setPointerSkin(true)
      setHint(true)
      await sleep(2400)
      if (cancelled) return
      setHint(false)
    }

    void run()

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
    // toggle 은 매 렌더 새로 만들어지지만 하는 일이 같아 의존성에서 뺀다 —
    // 넣으면 데모가 매 렌더 처음부터 다시 돈다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, takenOver, reduceMotion])

  // 두 뷰가 같은 목록을 본다 — 사이드바에서 끈 항목은 Retro 표에서도 빠진다.
  const visible = FORM_SECTIONS.filter((section) => section.body && !hidden[section.id])

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
        ref={stageRef}
        onPointerDownCapture={() => setTakenOver(true)}
        className={clsx(
          'relative overflow-hidden rounded-card bg-white',
          // 버튼마다 걸린 cursor-pointer 가 이기므로 안쪽을 전부 상속으로 돌린다.
          pointerSkin && '[&_*]:cursor-[inherit]',
        )}
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          cursor: pointerSkin ? POINTER_SKIN : undefined,
        }}
      >
        <div className="relative">
          <img loading="lazy" decoding="async" src={toolbar} alt="" className="block w-full" style={{ height: TOOLBAR_HEIGHT }} />
          <div
            className="absolute flex overflow-hidden rounded-ui border-[0.667px] border-[#d2d6db] bg-white"
            style={TAB_BOX}
          >
            {TABS.map((tab, index) => {
              const isActive = tab.view === view
              return (
                <button
                  key={tab.label}
                  type="button"
                  data-demo={`tab-${tab.view}`}
                  onClick={() => setView(tab.view)}
                  aria-pressed={isActive}
                  className={clsx(
                    'h-full cursor-pointer text-[13.5px] leading-none transition-colors',
                    index > 0 && 'border-l-[0.667px] border-[#d2d6db]',
                    isActive
                      ? 'bg-[#f3f4f6] font-semibold text-[#111]'
                      : 'bg-white font-medium text-[#6c737f] hover:text-[#212121]',
                  )}
                  style={{ width: tab.width }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

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
                {FORM_SECTIONS.map((section, index) => (
                  <SidebarRow
                    key={section.id}
                    demo={index === 0 ? 'first-row' : undefined}
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
          <div className={clsx('w-[580px] shrink-0 p-2', view === 'retro' && 'bg-[#f9fafb]')}>
            {/* Retro 는 표가 스크롤 영역 끝까지 가므로, 테두리처럼 남는 흰 띠를
                안쪽 바탕과 같은 회색으로 채운다. */}
            <div className={clsx('size-full p-2', view === 'retro' ? 'bg-[#f9fafb]' : 'bg-white')}>
              <div className="size-full overflow-y-auto overscroll-contain bg-[#f9fafb] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* 지원자 뷰는 보여 주기만 하는 화면이라 통째로 입력을 막는다. */}
                <div
                  className={clsx(
                    'flex w-[548.33px] flex-col',
                    view === 'retro' && 'py-5',
                    view === 'applicant' && 'select-none py-3 [&_*]:pointer-events-none',
                    view === 'basic' && 'pb-2',
                  )}
                >
                  {visible.map((section) => {
                    if (view === 'retro') return <FormRetroTable key={section.id} section={section} />
                    if (view === 'applicant') return <FormApplicantCard key={section.id} section={section} />
                    return <FormPreviewCard key={section.id} section={section} />
                  })}
                </div>
              </div>
            </div>
          </div>

          <img loading="lazy" decoding="async" src={rightPanel} alt="" className="block w-[350px] shrink-0 self-start" />
        </div>

        {/* 데모가 끝난 뒤 한 번 지나가는 안내막. 늘 자리에 있고 투명도만
            오가므로 나타날 때도 사라질 때도 부드럽게 넘어간다. */}
        <div
          aria-hidden={!hint}
          className={clsx(
            'pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/40 transition-opacity duration-700',
            hint ? 'opacity-100' : 'opacity-0',
          )}
        >
          <p className="text-[19px] font-medium tracking-[-0.2px] text-white drop-shadow-[0_2px_10px_rgba(10,17,40,0.5)]">
            지원서 양식을 직접 수정해보세요.
          </p>
        </div>

        {/* 데모 커서. 목표 좌표는 설계 좌표라 이 무대 안에 그대로 올린다. */}
        {cursor && (
          <div
            aria-hidden
            className="pointer-events-none absolute z-20 transition-[left,top] duration-[600ms] ease-in-out"
            style={{ left: cursor.x, top: cursor.y }}
          >
            <span
              className={clsx(
                'block size-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#4d5761]/70 shadow-[0_2px_10px_rgba(10,17,40,0.3)] transition-transform duration-150',
                cursor.down && 'scale-[0.7]',
              )}
            />
            {cursor.down && (
              <span className="absolute left-0 top-0 size-[30px] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[#4d5761]/30" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
