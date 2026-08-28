import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import iconChevronSelect from '../../assets/sections/hero1/icons/icon-chevron-select.svg'
import iconNavAdminSite from '../../assets/sections/hero1/icons/icon-nav-admin-site.svg'
import iconNavApplicants from '../../assets/sections/hero1/icons/icon-nav-applicants.svg'
import iconNavCareerSite from '../../assets/sections/hero1/icons/icon-nav-career-site.svg'
import iconNavEvaluation from '../../assets/sections/hero1/icons/icon-nav-evaluation.svg'
import iconNavHiringProcess from '../../assets/sections/hero1/icons/icon-nav-hiring-process.svg'
import iconNavInquiry from '../../assets/sections/hero1/icons/icon-nav-inquiry.svg'
import iconNavPrivacyLog from '../../assets/sections/hero1/icons/icon-nav-privacy-log.svg'
import iconNavSend from '../../assets/sections/hero1/icons/icon-nav-send.svg'
import iconNavSiteBuilder from '../../assets/sections/hero1/icons/icon-nav-site-builder.svg'
import iconNavSiteShortcut from '../../assets/sections/hero1/icons/icon-nav-site-shortcut.svg'
import logoCareerlink from '../../assets/sections/hero1/icons/logo-careerlink.png'
import { BulletIcon, ChevronIcon, DashboardIcon, JobPostingsIcon } from './Hero1SidebarIcons'

export type Hero1MainView = 'home' | 'jobPostings'

interface Hero1SidebarProps {
  activeNav: Hero1MainView
  jobsExpanded: boolean
  onSelectHome: () => void
  onToggleJobs: () => void
  onSelectJobPostings: () => void
  className?: string
}

/** Static (always-gray, decorative-only) top-level nav rows, in exact Figma order. */
const STATIC_NAV_ITEMS = [
  { label: '채용 사이트 빌더', icon: iconNavSiteBuilder, chevron: false },
  { label: '채용 사이트 바로가기', icon: iconNavSiteShortcut, chevron: false },
] as const

const STATIC_NAV_ITEMS_AFTER_JOBS = [
  { label: '채용 전형 관리', icon: iconNavHiringProcess },
  { label: '지원자 관리', icon: iconNavApplicants },
  { label: '발송 관리', icon: iconNavSend },
  { label: '1:1 문의', icon: iconNavInquiry },
  { label: '채용 사이트', icon: iconNavCareerSite },
  { label: '평가 관리', icon: iconNavEvaluation },
  { label: '관리자 사이트', icon: iconNavAdminSite },
  { label: '개인정보 로그', icon: iconNavPrivacyLog },
] as const

/** Sub-items under "채용 공고 관리"; only "채용 공고 현황" is wired to a real action. */
const JOB_POSTING_SUBITEMS = ['공고 등록', '동의서/서약서 관리', '직무 관리', '지원서 양식 관리', '채용 코드 관리'] as const

// `<button>` gets `cursor: default` from the browser's own UA stylesheet,
// which breaks inheritance of the custom dashboard-card cursor set on an
// ancestor — `cursor-[inherit]` forces it back to whatever the ancestor set.
// (Tailwind's built-in cursor scale has no "inherit" keyword, so this must
// be an arbitrary value, not the bare `cursor-inherit` utility class.)
const ROW_BASE = 'flex h-11 w-full items-center rounded-lg pl-6 pr-4 text-left text-sm transition-colors cursor-[inherit]'
const ROW_ACTIVE = 'bg-[#e6ecf8]/50 font-medium text-[#0042b7]'
const ROW_INACTIVE = 'font-normal text-[#4d5761]'
const ROW_HOVERABLE = 'hover:bg-[#e6ecf8]/50 hover:text-[#0042b7]'

export function Hero1Sidebar({
  activeNav,
  jobsExpanded,
  onSelectHome,
  onToggleJobs,
  onSelectJobPostings,
  className,
}: Hero1SidebarProps) {
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
          <div className="flex items-center justify-between rounded-lg border border-[#d2d6db] py-[7px] pl-[14px] pr-[9px]">
            <span className="text-[16px] text-[#212121]">커리어링크</span>
            <img src={iconChevronSelect} alt="" className="size-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-[10px] pb-10">
        <button
          type="button"
          onClick={onSelectHome}
          className={clsx('group', ROW_BASE, activeNav === 'home' ? ROW_ACTIVE : clsx(ROW_INACTIVE, ROW_HOVERABLE))}
        >
          <span className="mr-4 flex w-5 shrink-0 items-center justify-center">
            <DashboardIcon
              className={clsx('size-5', activeNav === 'home' ? 'text-[#0042b7]' : 'text-[#4d5761] group-hover:text-[#0042b7]')}
            />
          </span>
          <span className="flex-1">대시보드</span>
        </button>

        {STATIC_NAV_ITEMS.map((item) => (
          <div key={item.label} className={clsx(ROW_BASE, ROW_INACTIVE)}>
            <span className="mr-4 flex w-5 shrink-0 items-center justify-center">
              <img src={item.icon} alt="" className="size-5" />
            </span>
            <span className="flex-1">{item.label}</span>
          </div>
        ))}

        <button
          type="button"
          onClick={onToggleJobs}
          aria-expanded={jobsExpanded}
          className={clsx('group', ROW_BASE, jobsExpanded ? ROW_ACTIVE : clsx(ROW_INACTIVE, ROW_HOVERABLE))}
        >
          <span className="mr-4 flex w-5 shrink-0 items-center justify-center">
            <JobPostingsIcon
              className={clsx('size-5', jobsExpanded ? 'text-[#0042b7]' : 'text-[#4d5761] group-hover:text-[#0042b7]')}
            />
          </span>
          <span className="flex-1">채용 공고 관리</span>
          <motion.span
            animate={{ rotate: jobsExpanded ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="ml-2 flex w-4 shrink-0 items-center justify-center"
          >
            <ChevronIcon
              className={clsx('size-4', jobsExpanded ? 'text-[#0042b7]' : 'text-[#4d5761] group-hover:text-[#0042b7]')}
            />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {jobsExpanded && (
            <motion.div
              key="job-postings-submenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1 py-1">
                <button
                  type="button"
                  onClick={onSelectJobPostings}
                  className={clsx(
                    'group flex h-11 w-full items-center rounded-lg pl-12 pr-4 text-left text-sm transition-colors cursor-[inherit]',
                    activeNav === 'jobPostings' ? ROW_ACTIVE : clsx(ROW_INACTIVE, ROW_HOVERABLE),
                  )}
                >
                  <span className="mr-3 flex w-[6px] shrink-0 items-center justify-center">
                    <BulletIcon
                      className={clsx(
                        'size-[6px]',
                        activeNav === 'jobPostings' ? 'text-[#0042b7]' : 'text-[#4d5761] group-hover:text-[#0042b7]',
                      )}
                    />
                  </span>
                  <span className="flex-1">채용 공고 현황</span>
                </button>

                {JOB_POSTING_SUBITEMS.map((label) => (
                  <div key={label} className="flex h-11 w-full items-center rounded-lg pl-12 pr-4 text-left text-sm font-normal text-[#4d5761]">
                    <span className="mr-3 flex w-[6px] shrink-0 items-center justify-center">
                      <BulletIcon className="size-[6px] text-[#4d5761]" />
                    </span>
                    <span className="flex-1">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {STATIC_NAV_ITEMS_AFTER_JOBS.map((item) => (
          <div key={item.label} className={clsx(ROW_BASE, ROW_INACTIVE)}>
            <span className="mr-4 flex w-5 shrink-0 items-center justify-center">
              <img src={item.icon} alt="" className="size-5" />
            </span>
            <span className="flex-1">{item.label}</span>
            <span className="ml-2 flex w-4 shrink-0 items-center justify-center">
              <ChevronIcon className="size-4 text-[#4d5761]" />
            </span>
          </div>
        ))}
      </div>
    </nav>
  )
}
