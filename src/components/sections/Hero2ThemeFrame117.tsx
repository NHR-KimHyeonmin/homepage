import clsx from 'clsx'
import iconCheckbox from '../../assets/sections/hero2-theme-showcase/icon-checkbox.svg'
import iconChevronDown from '../../assets/sections/hero2-theme-showcase/icon-chevron-down.svg'
import iconEyeToggle from '../../assets/sections/hero2-theme-showcase/icon-eye-toggle.svg'
import iconRailBuilder from '../../assets/sections/hero2-theme-showcase/icon-rail-builder.svg'
import iconRailOff from '../../assets/sections/hero2-theme-showcase/icon-rail-off.svg'
import iconRailPage from '../../assets/sections/hero2-theme-showcase/icon-rail-page.svg'
import iconRailTheme from '../../assets/sections/hero2-theme-showcase/icon-rail-theme.svg'
import iconUndo from '../../assets/sections/hero2-theme-showcase/icon-undo.svg'
import logoCareerlinkWhite from '../../assets/sections/hero2-theme-showcase/logo-careerlink-white.png'
import { getThemeShades } from '../../lib/colorShades'

interface Hero2ThemeFrame117Props {
  /** Currently-selected palette color, e.g. "#6E23D7". */
  color: string
}

const TRANSITION = 'transition-colors duration-300'

const RAIL_ITEMS = [
  { icon: iconRailBuilder, label: '빌더', active: false },
  { icon: iconRailPage, label: '페이지', active: false },
  { icon: iconRailTheme, label: '테마', active: true },
  { icon: iconRailOff, label: 'OFF', active: false },
]

const NAV_LINKS = ['회사소개', '직무소개', '복리후생', '채용정보']

const JOB_CARDS = [
  { title: 'IT직군 상시 채용 (FE/BE)' },
  { title: '광고 사업 서비스 기획 인턴 채용' },
]

function SliderRow({
  label,
  value,
  percent,
  hint,
}: {
  label: string
  value: string
  percent: number
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm leading-5 text-[#212121]">{label}</p>
      <div className="rounded-lg border border-[#f3f4f6] bg-[#f9fafb] px-4 py-1.5">
        <div className="relative flex h-[30px] items-center justify-between">
          <div className="relative h-1 flex-1 rounded-xl bg-[#e5e7eb]">
            <div className="absolute inset-y-0 left-0 rounded-xl bg-[#0042b7]" style={{ width: `${percent}%` }} />
            <div
              className="absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-[#0042b7]"
              style={{ left: `calc(${percent}% - 10px)` }}
            />
          </div>
          <span className="min-w-[48px] pl-4 text-center text-sm leading-5 text-[#212121]">{value}</span>
        </div>
      </div>
      {hint ? <p className="text-xs leading-5 text-[#1769db]">{hint}</p> : null}
    </div>
  )
}

/**
 * Figma node 2255:299 — "Frame 117". The theme-editor admin panel with its
 * live careerlink job-site preview, previously a flattened screenshot
 * (now-deleted `dashboard-screenshot.webp`). Rebuilt as real DOM so every
 * `#6e23d7` element (and its tint/shade relatives) can be recolored live
 * from the `color` prop via the shared ramp in `lib/colorShades.ts`.
 *
 * The top admin toolbar (breadcrumb, undo/zoom/search cluster, save button)
 * and the left icon rail are all static brand-blue (#0042b7) admin chrome —
 * verified against Figma, none of it is purple — so those pieces keep fixed
 * Tailwind values. Only the "테마 설정" panel and the live preview's purple
 * UI (nav bar, CTA buttons, job-card badge + link) are dynamic.
 */
export function Hero2ThemeFrame117({ color }: Hero2ThemeFrame117Props) {
  const shades = getThemeShades(color)

  return (
    <div className="w-full overflow-x-auto bg-white">
      <div className="flex min-w-[1000px] flex-col">
        {/* Admin toolbar */}
        <div className="flex h-[57px] w-full shrink-0 items-center justify-between border-b border-gray-150 px-4">
          <div className="flex items-center gap-4">
            <span className="whitespace-nowrap text-sm text-text">01 기본형 (A Type)_신규</span>
            <div className="flex items-center gap-1 text-gray-300">
              <img src={iconUndo} alt="" className="size-5 opacity-60" />
              <img src={iconUndo} alt="" className="size-5 -scale-x-100 opacity-60" />
              <span className="ml-2 text-xs">100%</span>
            </div>
            <input
              readOnly
              value="id-zhq3Bqk2-Vs3E-4gbC-avoH-GpVDQI1hN53r"
              aria-label="페이지 ID"
              className="hidden w-[220px] rounded-lg border border-[#d2d6db] px-3 py-2 text-xs text-gray-300 outline-none xl:block"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden whitespace-nowrap text-xs text-gray-300 md:inline">23시간 전 저장됨</span>
            <span className="flex size-[34px] items-center justify-center rounded-full border-2 border-white bg-[#00a0c8] text-sm text-white shadow-[0_0_0_2px_#0042b7]">
              김
            </span>
            <button
              type="button"
              className="whitespace-nowrap rounded-lg bg-[#0042b7] px-4 py-2 text-sm font-medium text-white"
            >
              변경사항 저장하기
            </button>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Icon rail */}
          <div className="flex w-[61px] shrink-0 flex-col items-center gap-1 border-r border-[#f9fafb] p-1">
            {RAIL_ITEMS.map((item) => (
              <div
                key={item.label}
                className={clsx(
                  'flex size-[52px] flex-col items-center justify-center gap-1 rounded-lg',
                  item.active && 'bg-[#e6ecf8]',
                )}
              >
                <img src={item.icon} alt="" className="size-5" />
                <span className={clsx('text-[11px]', item.active ? 'font-bold text-[#0042b7]' : 'text-gray-300')}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* 테마 설정 panel */}
          <div className="w-[240px] shrink-0 border-r border-gray-100 px-2 py-3">
            <p className="px-2 pb-3 text-base font-medium text-[#212121]">테마 설정</p>
            <div className="flex flex-col gap-4 px-2">
              <div className="flex items-center">
                <div
                  className={clsx('size-10 shrink-0 rounded-full border', TRANSITION)}
                  style={{ backgroundColor: shades.base, borderColor: shades.dark1 }}
                />
                <div className="pl-2">
                  <p className="text-sm leading-5 text-[#212121]">메인 색상</p>
                  <p className={clsx('text-xs leading-5 text-[#212121]', TRANSITION)}>{shades.base}</p>
                </div>
              </div>

              <SliderRow label="모서리 둥글기" value="4px" percent={11.3} />

              <div className="flex flex-col gap-1">
                <p className="text-sm leading-5 text-[#212121]">테마 폰트</p>
                <div className="flex items-center justify-between rounded-lg border border-[#d2d6db] px-3.5 py-2">
                  <span className="text-base leading-[23px] text-[#212121]">Pretendard</span>
                  <img src={iconChevronDown} alt="" className="size-5" />
                </div>
              </div>

              <SliderRow label="데스크톱 섹션 최대 폭" value="1280px" percent={93.7} hint="권장 : 1280px" />
              <SliderRow
                label="모바일 뷰 전환 기준 폭"
                value="720px"
                percent={27.1}
                hint="창 크기에 따라 변환됩니다. 권장 : 720px"
              />

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm leading-5 text-[#212121]">테마 미리보기</p>
                  <img src={iconEyeToggle} alt="" className="size-[18px]" />
                </div>
                <div className="relative flex flex-col gap-4 rounded-lg border border-[#e5e7eb] bg-white p-3 shadow-[0px_8px_16px_-4px_rgba(32,41,57,0.08)]">
                  <div className="relative flex h-10 items-center rounded border border-[#d2d6db] px-3.5">
                    <span className="text-sm text-[#6c737f]">입력영역</span>
                    <span className={clsx('pl-1 text-sm', TRANSITION)} style={{ color: shades.base }}>
                      *
                    </span>
                  </div>
                  <div className="relative flex h-10 items-center rounded border border-[#d2d6db] px-3.5">
                    <span className="text-sm text-[#6c737f]">선택영역</span>
                    <img src={iconChevronDown} alt="" className="absolute right-2 size-5" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={clsx('rounded-full border px-3 py-1.5 text-[13px] text-white', TRANSITION)}
                      style={{ backgroundColor: shades.base, borderColor: shades.base }}
                    >
                      정규직
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[#6c737f] px-3 py-1.5 text-[13px] text-[#6c737f]"
                    >
                      계약직
                    </button>
                  </div>
                  <div className="flex overflow-hidden rounded">
                    <button
                      type="button"
                      className={clsx('flex-1 border py-2 text-[15px] font-medium', TRANSITION)}
                      style={{ backgroundColor: shades.light2, borderColor: shades.base, color: shades.base }}
                    >
                      군필
                    </button>
                    <button
                      type="button"
                      className={clsx('flex-1 border bg-white py-2 text-[15px] font-medium text-[#6c737f]', TRANSITION)}
                      style={{ borderColor: shades.base }}
                    >
                      미필
                    </button>
                  </div>
                  <label className="flex items-center gap-2">
                    <img src={iconCheckbox} alt="" className="size-6" />
                    <span className="text-base text-[#212121]">동의합니다.</span>
                  </label>
                  <button
                    type="button"
                    className={clsx('rounded py-2 text-[15px] font-medium text-white', TRANSITION)}
                    style={{ backgroundColor: shades.base }}
                  >
                    버튼
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live job-site preview */}
          <div className="flex-1 bg-[#f4f8ff] p-4">
            <div className="overflow-hidden rounded-lg border border-gray-150 bg-white shadow-[0px_2px_14px_0px_rgba(32,40,45,0.08)]">
              <nav className={clsx('flex items-center justify-between px-8 py-4', TRANSITION)} style={{ backgroundColor: shades.base }}>
                <img src={logoCareerlinkWhite} alt="careerlink" className="h-[26px]" />
                <div className="hidden items-center gap-6 text-[15px] font-medium text-white md:flex">
                  {NAV_LINKS.map((link) => (
                    <span key={link}>{link}</span>
                  ))}
                </div>
              </nav>

              <div className="flex flex-col items-center px-8 py-10 text-center">
                <p className="text-lg font-bold text-[#212121]">Recruit</p>
                <h3 className="pt-4 text-3xl font-bold text-[#212121]">채용공고</h3>
                <p className="max-w-[420px] pt-3 text-sm leading-5 text-[#6c737f]">
                  커리어링크와 함께 하실 분을 모집합니다.
                  <br />
                  채용 브랜딩부터 지원자 관리까지 지원자와 기업 모두에게 편리한 채용 솔루션을 제공합니다.
                  <br />
                  커리어링크에서 현재 진행중인 채용공고를 확인해보세요.
                </p>
                <div className="flex gap-2 pt-5">
                  <button
                    type="button"
                    className={clsx('rounded px-4 py-1.5 text-[13px] font-medium text-white', TRANSITION)}
                    style={{ backgroundColor: shades.base }}
                  >
                    채용공고
                  </button>
                  <button
                    type="button"
                    className={clsx('rounded border px-4 py-1.5 text-[13px] font-medium', TRANSITION)}
                    style={{ borderColor: `${shades.base}aa`, color: shades.base }}
                  >
                    지원하기
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 px-8 pb-8 sm:grid-cols-2">
                {JOB_CARDS.map((card) => (
                  <div key={card.title} className="rounded-lg border-0 p-8 shadow-[0px_2px_14px_0px_rgba(32,40,45,0.16)]">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-[#212121]">커리어링크</span>
                      <span
                        className={clsx('rounded-full px-3 py-1.5 text-[11px] font-medium text-white', TRANSITION)}
                        style={{ backgroundColor: shades.base, borderColor: shades.base }}
                      >
                        신입 / 계약직
                      </span>
                    </div>
                    <p className="pt-2 text-lg font-medium text-[#212121]">{card.title}</p>
                    <p className={clsx('pt-8 text-base font-bold', TRANSITION)} style={{ color: shades.base }}>
                      상시채용
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
