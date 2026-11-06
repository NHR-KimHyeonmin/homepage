import type { ComponentType, ReactNode } from 'react'
import clsx from 'clsx'
import {
  IconBell,
  IconBookmark,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconHelpCircle,
  IconHome,
  IconSearch,
  IconSpeakerphone,
  IconUserStar,
} from '@tabler/icons-react'
import iconNavAdminSite from '../../../assets/sections/hero1/icons/icon-nav-admin-site.svg?raw'
import iconNavCareerSite from '../../../assets/sections/hero1/icons/icon-nav-career-site.svg?raw'
import iconNavEvaluation from '../../../assets/sections/hero1/icons/icon-nav-evaluation.svg?raw'
import iconNavInquiry from '../../../assets/sections/hero1/icons/icon-nav-inquiry.svg?raw'
import iconNavPrivacyLog from '../../../assets/sections/hero1/icons/icon-nav-privacy-log.svg?raw'
import iconNavSiteShortcut from '../../../assets/sections/hero1/icons/icon-nav-site-shortcut.svg?raw'
import chatbotButton from '../../../assets/sections/hero1/chatbot-button.webp'
import logoCareerlink from '../../../assets/sections/hero1/icons/logo-careerlink.png'
import {
  ApplicantsIcon,
  DashboardIcon,
  HiringProcessIcon,
  JobPostingsIcon,
  SendIcon,
  SiteBuilderIcon,
} from '../Hero1SidebarIcons'

/**
 * 커리어링크 관리자 화면의 공통 틀(상단 바 · 왼쪽 메뉴 · 브레드크럼 바).
 *
 * 1920 x 1080 화면을 그대로 옮긴 좌표계로 그린다 — 히어로 카드가 이 판을
 * zoom 으로 줄여 보여 주므로, 숫자는 운영 화면 캡처를 1920 폭으로 맞춘
 * 값을 그대로 쓴다. 틀은 화면이 바뀌어도 움직이지 않고 본문만 바뀐다.
 */
export const FRAME_WIDTH = 1920
export const FRAME_HEIGHT = 1080
export const HEADER_HEIGHT = 58
export const NAV_WIDTH = 259

export type AdminView =
  | 'home'
  | 'siteBuilder'
  | 'jobPostings'
  | 'hiringProcess'
  | 'applicants'
  | 'sending'
  | 'evaluation'

type IconComponent = ComponentType<{ className?: string }>

interface NavItem {
  label: string
  /** 있으면 누를 수 있는 메뉴, 없으면 흐리게 둔 비활성 메뉴. */
  view?: AdminView
  Icon?: IconComponent
  /** Figma 에서 내보낸 SVG 원문(?raw). */
  svg?: string
  /** 하위 메뉴가 있는 그룹 — 오른쪽에 펼침 화살표가 붙는다. */
  group?: boolean
  /** 이 행 아래에 구분선을 긋는다. */
  dividerAfter?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: '대시보드', view: 'home', Icon: DashboardIcon },
  { label: '채용 사이트 빌더', view: 'siteBuilder', Icon: SiteBuilderIcon },
  { label: '채용 사이트 바로가기', svg: iconNavSiteShortcut, dividerAfter: true },
  { label: '채용 공고 관리', view: 'jobPostings', Icon: JobPostingsIcon, group: true },
  { label: '채용 전형 관리', view: 'hiringProcess', Icon: HiringProcessIcon, group: true },
  { label: '지원자 관리', view: 'applicants', Icon: ApplicantsIcon, group: true },
  { label: '발송 관리', view: 'sending', Icon: SendIcon, group: true },
  { label: '평가 관리', view: 'evaluation', svg: iconNavEvaluation, group: true },
  { label: '1:1 문의', svg: iconNavInquiry, group: true },
  { label: '채용 사이트', svg: iconNavCareerSite, group: true },
  { label: '관리자 사이트', svg: iconNavAdminSite, group: true },
  { label: '개인정보 로그', svg: iconNavPrivacyLog, group: true },
]

/** 메뉴에 보이는 순서(위 → 아래) 그대로의 화면 목록. 자동 순회가 따른다. */
export const VIEW_ORDER: AdminView[] = NAV_ITEMS.flatMap((item) => (item.view ? [item.view] : []))

export const VIEW_LABELS = Object.fromEntries(
  NAV_ITEMS.flatMap((item) => (item.view ? [[item.view, item.label]] : [])),
) as Record<AdminView, string>

/** Figma 에서 내보낸 SVG 를 글자색(currentColor)으로 칠해 그대로 넣는다. */
function SvgIcon({ svg, className }: { svg: string; className?: string }) {
  const markup = svg.replace(/#4D5761/gi, 'currentColor').replace(/width="[^"]*" height="[^"]*"/, 'width="100%" height="100%"')
  return <span aria-hidden className={clsx('inline-block', className)} dangerouslySetInnerHTML={{ __html: markup }} />
}

const ACTIVE = '#0042b7'

function NavRow({ item, active, onSelect }: { item: NavItem; active: boolean; onSelect: (view: AdminView) => void }) {
  const icon = item.Icon ? <item.Icon className="size-5" /> : <SvgIcon svg={item.svg!} className="size-5" />
  const body = (
    <>
      <span className="flex w-5 shrink-0 items-center justify-center">{icon}</span>
      <span className="ml-[18px] flex-1 text-left">{item.label}</span>
      {item.group && <IconChevronDown size={16} stroke={1.8} className="mr-[3px]" />}
    </>
  )
  const base = 'flex h-11 w-full items-center rounded-[6px] pl-[22px] pr-[14px] text-[14.5px] leading-none tracking-[-0.2px]'

  if (!item.view) {
    // 히어로에서는 열리지 않는 메뉴 — 누를 수 없다는 걸 흐린 색으로 알린다.
    return (
      <div aria-disabled className={clsx(base, 'text-[#4d5761] opacity-35')}>
        {body}
      </div>
    )
  }
  const view = item.view
  return (
    <button
      type="button"
      onClick={() => onSelect(view)}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        base,
        'cursor-[inherit] transition-colors',
        // 하위 메뉴가 있는 그룹은 글자색만 바뀌고, 단일 메뉴는 바탕도 물든다.
        active ? (item.group ? '' : 'bg-[#f2f5fb]') : 'text-[#4d5761] hover:bg-[#f2f5fb] hover:text-[#0042b7]',
      )}
      style={active ? { color: ACTIVE } : undefined}
    >
      {body}
    </button>
  )
}

function Sidebar({ active, onSelect }: { active: AdminView; onSelect: (view: AdminView) => void }) {
  return (
    <nav
      aria-label="관리자 메뉴"
      className="absolute bottom-0 left-0 flex flex-col bg-white"
      style={{ top: HEADER_HEIGHT, width: NAV_WIDTH }}
    >
      {/* 기업 선택 */}
      <div className="relative ml-[24px] mt-[10px] h-[39px] w-[223px] rounded-[6px] border border-[#e4e6e9]">
        <span className="absolute -top-[7px] left-[10px] bg-white px-1 text-[11px] leading-none text-[#6c737f]">
          기업 선택
        </span>
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[15px] leading-none text-[#212121]">
          커리어링크
        </span>
        <IconChevronDown size={18} stroke={1.8} className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#4d5761]" />
      </div>

      <div className="mt-[8px] flex flex-col gap-1 px-[8px]">
        {NAV_ITEMS.map((item) => (
          <div key={item.label}>
            <NavRow item={item} active={active === item.view} onSelect={onSelect} />
            {item.dividerAfter && <div className="mx-[14px] my-[6px] h-px bg-[#eef0f2]" />}
          </div>
        ))}
      </div>

      <div className="mt-auto pb-[2px]">
        <div className="mx-[12px] h-px bg-[#eef0f2]" />
        {[
          { label: '공지사항', Icon: IconSpeakerphone },
          { label: '이용자 가이드', Icon: IconHelpCircle },
        ].map(({ label, Icon }) => (
          <div key={label} className="flex h-[50px] items-center pl-[22px] text-[14.5px] text-[#4d5761] opacity-35">
            <Icon size={18} stroke={1.6} />
            <span className="ml-[18px]">{label}</span>
          </div>
        ))}
      </div>

      {/* 메뉴 접기 버튼 — 사이드바 경계에 반쯤 걸쳐 있다. */}
      <span className="absolute right-[-15px] top-[61px] flex size-[28px] items-center justify-center rounded-full border border-[#e9ecf2] bg-[#f6f7fa] text-[#b4bac4]">
        <IconChevronLeft size={16} stroke={1.8} />
      </span>
    </nav>
  )
}

function TopBar() {
  return (
    <header className="absolute inset-x-0 top-0 flex items-center bg-white" style={{ height: HEADER_HEIGHT }}>
      <img src={logoCareerlink} alt="careerlink" className="absolute left-[20px] top-[21px] h-auto w-[175px]" />

      <div className="absolute left-[1055px] top-[11px] flex h-[34px] w-[497px] items-center rounded-[6px] border border-[#e4e6e9] pl-[12px] text-[14px] text-[#b4bac4]">
        <IconSearch size={17} stroke={1.8} className="text-[#8e949e]" />
        <span className="ml-[22px]">모든 지원자(이름, 이메일, 전화번호)와 공고를 검색해보세요.</span>
      </div>

      {[IconBell, IconBookmark, IconUserStar].map((Icon, i) => (
        <span
          key={i}
          className="absolute top-[11px] flex h-[33px] w-[31px] items-center justify-center rounded-[6px] border border-[#c9d6ef] text-[#0042b7]"
          style={{ left: 1571 + i * 38 }}
        >
          <Icon size={19} stroke={1.7} />
        </span>
      ))}

      <div className="absolute left-[1693px] top-[11px] flex h-[34px] items-center rounded-[6px] bg-[#e6edf9] pl-[8px] pr-[4px]">
        <span className="text-[13px] font-medium text-[#0042b7]">00:27:46</span>
        <span className="ml-[10px] rounded-[5px] bg-white px-[10px] py-[6px] text-[13px] font-medium leading-none text-[#212121]">
          로그인 연장
        </span>
      </div>

      <span className="absolute left-[1856px] top-[15px] flex size-[27px] items-center justify-center rounded-full bg-[#0042b7] text-[13px] font-bold text-white">
        김
      </span>
      <IconChevronDown size={14} stroke={2.4} className="absolute left-[1887px] top-[22px] text-[#6c737f]" />
    </header>
  )
}

/** 메뉴명 + 북마크, 오른쪽에 홈 > 상위 > 현재. 대시보드에는 없다. */
export interface Crumbs {
  title: string
  trail: [string, string]
}

function BreadcrumbBar({ crumbs }: { crumbs: Crumbs }) {
  return (
    <div
      className="absolute flex h-[52px] items-center justify-between rounded-[8px] bg-white pl-[16px] pr-[16px]"
      style={{ left: NAV_WIDTH + 20, right: CONTENT_RIGHT_GAP, top: HEADER_HEIGHT + 20, boxShadow: '0 2px 6px rgba(30, 50, 90, 0.06)' }}
    >
      <span className="flex items-center gap-[8px] text-[14px] font-medium text-[#212121]">
        {crumbs.title}
        <IconBookmark size={17} stroke={1.6} className="text-[#4d5761]" />
      </span>
      <span className="flex items-center gap-[10px] text-[12.5px] text-[#4d5761]">
        <IconHome size={16} stroke={1.7} />
        {crumbs.trail.map((label) => (
          <span key={label} className="flex items-center gap-[10px]">
            <IconChevronRight size={14} stroke={1.6} className="text-[#8e949e]" />
            {label}
          </span>
        ))}
      </span>
    </div>
  )
}

/**
 * 본문 영역의 위치. 브레드크럼이 있으면 그 아래부터, 없으면(대시보드)
 * 상단 바 바로 아래 여백부터 시작한다. 각 화면은 이 박스를 꽉 채워 그린다.
 */
export const CONTENT_LEFT = NAV_WIDTH + 20
export const CONTENT_RIGHT_GAP = 20
export const CONTENT_TOP_WITH_CRUMBS = HEADER_HEIGHT + 20 + 52 + 9
export const CONTENT_TOP_PLAIN = HEADER_HEIGHT + 20

export function AdminFrame({
  active,
  onSelect,
  crumbs,
  children,
}: {
  active: AdminView
  onSelect: (view: AdminView) => void
  crumbs?: Crumbs
  children: ReactNode
}) {
  return (
    <div
      className="relative overflow-hidden bg-[#eff2f8] font-sans text-[#212121]"
      style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
    >
      <div
        className="absolute bottom-0"
        style={{ left: CONTENT_LEFT, right: CONTENT_RIGHT_GAP, top: crumbs ? CONTENT_TOP_WITH_CRUMBS : CONTENT_TOP_PLAIN }}
      >
        {children}
      </div>
      {crumbs && <BreadcrumbBar crumbs={crumbs} />}
      <TopBar />
      <Sidebar active={active} onSelect={onSelect} />
      {/* 오른쪽 아래에 떠 있는 상담 버튼 — 로고 그림이라 캡처에서 잘라 쓴다. */}
      <img src={chatbotButton} alt="" className="absolute left-[1843px] top-[1002px] size-[55px] rounded-[17px]" />
    </div>
  )
}
