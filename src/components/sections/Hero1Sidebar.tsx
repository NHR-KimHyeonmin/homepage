import type { ComponentType } from 'react'
import clsx from 'clsx'
import iconChevronSelect from '../../assets/sections/hero1/icons/icon-chevron-select.svg'
import iconNavAdminSite from '../../assets/sections/hero1/icons/icon-nav-admin-site.svg'
import iconNavCareerSite from '../../assets/sections/hero1/icons/icon-nav-career-site.svg'
import iconNavEvaluation from '../../assets/sections/hero1/icons/icon-nav-evaluation.svg'
import iconNavInquiry from '../../assets/sections/hero1/icons/icon-nav-inquiry.svg'
import iconNavPrivacyLog from '../../assets/sections/hero1/icons/icon-nav-privacy-log.svg'
import iconNavSiteShortcut from '../../assets/sections/hero1/icons/icon-nav-site-shortcut.svg'
import logoCareerlink from '../../assets/sections/hero1/icons/logo-careerlink.png'
import { ApplicantsIcon, DashboardIcon, HiringProcessIcon, JobPostingsIcon, SendIcon, SiteBuilderIcon } from './Hero1SidebarIcons'

export type Hero1MainView = 'home' | 'jobPostings' | 'hiringProcess' | 'applicants' | 'sending' | 'siteBuilder'

interface Hero1SidebarProps {
  activeNav: Hero1MainView
  onSelectView: (view: Hero1MainView) => void
  className?: string
}

interface NavItem {
  label: string
  /** Present = this row is wired to a real view and renders as a button;
   *  absent = still a placeholder row (not clickable yet), shown at 30%
   *  opacity. */
  view?: Hero1MainView
  /** Static (always-gray) rows render this raster icon directly — it can
   *  never change color, so it doesn't matter that it's not clickable. */
  icon?: string
  /** Clickable rows render this `currentColor` icon component instead, so
   *  the glyph turns blue right alongside the label on hover/active. */
  Icon?: ComponentType<{ className?: string }>
}

/** Flat (1-depth) nav rows, in exact Figma order — "채용 공고 관리" used to
 *  expand into a submenu; that's gone now, it's a plain row like the rest. */
const NAV_ITEMS_BEFORE_JOBS: NavItem[] = [
  { label: '채용 사이트 빌더', Icon: SiteBuilderIcon, view: 'siteBuilder' },
  { label: '채용 사이트 바로가기', icon: iconNavSiteShortcut },
]

const NAV_ITEMS_AFTER_JOBS: NavItem[] = [
  { label: '채용 전형 관리', Icon: HiringProcessIcon, view: 'hiringProcess' },
  { label: '지원자 관리', Icon: ApplicantsIcon, view: 'applicants' },
  { label: '발송 관리', Icon: SendIcon, view: 'sending' },
  { label: '1:1 문의', icon: iconNavInquiry },
  { label: '채용 사이트', icon: iconNavCareerSite },
  { label: '평가 관리', icon: iconNavEvaluation },
  { label: '관리자 사이트', icon: iconNavAdminSite },
  { label: '개인정보 로그', icon: iconNavPrivacyLog },
]

/**
 * 사이드바에 보이는 순서(위 → 아래)대로 나열한, 누를 수 있는 화면들.
 * Hero1 의 자동 순회가 이 배열을 따른다 — 렌더에 쓰는 배열에서 그대로
 * 뽑으므로, 여기서 메뉴 순서를 바꾸면 자동 순회도 같이 따라간다.
 * (MAIN_IMAGES 의 키 순서를 쓰면 사이드바 배치와 어긋난다.)
 */
export const NAV_VIEW_ORDER: Hero1MainView[] = [
  'home',
  ...NAV_ITEMS_BEFORE_JOBS.flatMap((item) => (item.view ? [item.view] : [])),
  'jobPostings',
  ...NAV_ITEMS_AFTER_JOBS.flatMap((item) => (item.view ? [item.view] : [])),
]

// `<button>` gets `cursor: default` from the browser's own UA stylesheet,
// which breaks inheritance of the custom dashboard-card cursor set on an
// ancestor — `cursor-[inherit]` forces it back to whatever the ancestor set.
// (Tailwind's built-in cursor scale has no "inherit" keyword, so this must
// be an arbitrary value, not the bare `cursor-inherit` utility class.)
const ROW_BASE = 'flex h-11 w-full items-center rounded-ui pl-6 pr-4 text-left text-sm transition-colors cursor-[inherit]'
const ROW_ACTIVE = 'bg-[#e6ecf8]/50 font-medium text-[#0042b7]'
const ROW_INACTIVE = 'font-normal text-[#4d5761]'
const ROW_HOVERABLE = 'hover:bg-[#e6ecf8]/50 hover:text-[#0042b7]'
const ICON_ACTIVE = 'text-[#0042b7]'
const ICON_INACTIVE = 'text-[#4d5761] group-hover:text-[#0042b7]'

function StaticRow({ item }: { item: NavItem }) {
  return (
    <div className={clsx(ROW_BASE, ROW_INACTIVE, 'opacity-30')}>
      <span className="mr-4 flex w-5 shrink-0 items-center justify-center">
        <img src={item.icon} alt="" className="size-5" />
      </span>
      <span className="flex-1">{item.label}</span>
    </div>
  )
}

function ClickableRow({ item, isActive, onSelect }: { item: NavItem; isActive: boolean; onSelect: (view: Hero1MainView) => void }) {
  const Icon = item.Icon!
  return (
    <button
      type="button"
      onClick={() => onSelect(item.view!)}
      className={clsx('group', ROW_BASE, isActive ? ROW_ACTIVE : clsx(ROW_INACTIVE, ROW_HOVERABLE))}
    >
      <span className="mr-4 flex w-5 shrink-0 items-center justify-center">
        <Icon className={clsx('size-5', isActive ? ICON_ACTIVE : ICON_INACTIVE)} />
      </span>
      <span className="flex-1">{item.label}</span>
    </button>
  )
}

function NavRow({ item, activeNav, onSelectView }: { item: NavItem; activeNav: Hero1MainView; onSelectView: (view: Hero1MainView) => void }) {
  return item.view ? (
    <ClickableRow item={item} isActive={activeNav === item.view} onSelect={onSelectView} />
  ) : (
    <StaticRow item={item} />
  )
}

export function Hero1Sidebar({ activeNav, onSelectView, className }: Hero1SidebarProps) {
  return (
    <nav
      aria-label="대시보드 사이드바"
      className={clsx('flex h-full flex-col overflow-y-auto bg-white [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
    >
      <div className="flex h-[60px] shrink-0 items-center pl-4">
        <img src={logoCareerlink} alt="careerlink" className="h-[22px] w-auto" />
      </div>

      <div className="px-[10px] pb-2 pt-[10px]">
        <div className="relative">
          <span className="absolute -top-[8px] left-[14px] z-10 bg-white px-1 text-[11px] leading-none text-[#6c737f]">
            기업 선택
          </span>
          <div className="flex items-center justify-between rounded-ui border border-[#d2d6db] py-[7px] pl-[14px] pr-[9px]">
            <span className="text-[16px] text-[#212121]">커리어링크</span>
            <img src={iconChevronSelect} alt="" className="size-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-[10px] pb-10">
        <button
          type="button"
          onClick={() => onSelectView('home')}
          className={clsx('group', ROW_BASE, activeNav === 'home' ? ROW_ACTIVE : clsx(ROW_INACTIVE, ROW_HOVERABLE))}
        >
          <span className="mr-4 flex w-5 shrink-0 items-center justify-center">
            <DashboardIcon className={clsx('size-5', activeNav === 'home' ? ICON_ACTIVE : ICON_INACTIVE)} />
          </span>
          <span className="flex-1">대시보드</span>
        </button>

        {NAV_ITEMS_BEFORE_JOBS.map((item) => (
          <NavRow key={item.label} item={item} activeNav={activeNav} onSelectView={onSelectView} />
        ))}

        <button
          type="button"
          onClick={() => onSelectView('jobPostings')}
          className={clsx('group', ROW_BASE, activeNav === 'jobPostings' ? ROW_ACTIVE : clsx(ROW_INACTIVE, ROW_HOVERABLE))}
        >
          <span className="mr-4 flex w-5 shrink-0 items-center justify-center">
            <JobPostingsIcon className={clsx('size-5', activeNav === 'jobPostings' ? ICON_ACTIVE : ICON_INACTIVE)} />
          </span>
          <span className="flex-1">채용 공고 관리</span>
        </button>

        {NAV_ITEMS_AFTER_JOBS.map((item) => (
          <NavRow key={item.label} item={item} activeNav={activeNav} onSelectView={onSelectView} />
        ))}
      </div>
    </nav>
  )
}
