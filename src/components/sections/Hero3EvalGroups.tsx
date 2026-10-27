import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { IconCalendar, IconChevronDown } from '@tabler/icons-react'
import { useFitScale } from '../../hooks/useFitScale'
import { POINTER_SKIN } from '../../lib/demoCursor'
import { useSequence } from '../../hooks/useStepSequence'

// Figma node 2320:25679 — "전형운영>평가그룹".
/** 담는 흰 카드와 같은 폭. 1142 로 두면 카드 오른쪽에 66px 이 빈 채로 남아,
 *  입력란만 왼쪽으로 쏠려 보였다. */
const DESIGN_WIDTH = 1208
/** 다른 탭(커스텀 대시보드·마이페이지)과 같은 박스 높이. 640 으로 두면
 *  흰 상자 아래가 54px 비어 패널만 짧아 보였다. */
const DESIGN_HEIGHT = 694
const MAX_GROUPS = 6
const TOAST_MS = 2500

const EVALUATORS = ['인사담당자', '1팀 팀장', '2팀 팀장', '경영진']

interface EvalGroup {
  id: number
  name: string
  evaluators: string[]
  candidates: string[]
  date: string
  place: string
}

/** 이미 만들어 둔 그룹 석 장. 칸보다 길어서 목록이 스크롤된다 — 그룹을
 *  여러 개 굴리는 화면이라는 게 스크롤로 먼저 보인다. 평가자 이름은
 *  EVALUATORS 에서 가져와, 오른쪽 폼에서 고르는 것과 같은 사람들이다. */
const SEED_GROUPS: EvalGroup[] = [
  { id: 1, name: '11월 20일 면접', evaluators: ['인사담당자', '1팀 팀장'], candidates: [], date: '2027-11-20', place: '본사 3층' },
  { id: 2, name: '11월 24일 면접', evaluators: ['1팀 팀장', '2팀 팀장', '경영진'], candidates: [], date: '2027-11-24', place: '본사 5층' },
  { id: 3, name: '11월 26일 면접', evaluators: ['인사담당자', '2팀 팀장'], candidates: [], date: '2027-11-26', place: '수원 연구소' },
]

/** 오른쪽 시트에 깔아 두는 지원자 아홉 명. 엑셀에서 받아 올린 명단을
 *  그대로 보고 있다는 상황이라, 번호·이름·메일·직무만 있으면 된다. */
const APPLICANTS = [
  { id: 1, code: 'AP20271118001', name: '노은채', email: 'eunchae.noh@example.com', job: '클라우드 엔지니어' },
  { id: 2, code: 'AP20271118002', name: '박서윤', email: 'seoyun.park@example.com', job: '서비스 기획' },
  { id: 3, code: 'AP20271118003', name: '이도현', email: 'dohyun.lee@example.com', job: '백엔드 개발' },
  { id: 4, code: 'AP20271118004', name: '최유진', email: 'yujin.choi@example.com', job: '프로덕트 디자인' },
  { id: 5, code: 'AP20271118005', name: '정우성', email: 'woosung.jung@example.com', job: '데이터 분석' },
  { id: 6, code: 'AP20271118006', name: '한지안', email: 'jian.han@example.com', job: '프론트엔드 개발' },
  { id: 7, code: 'AP20271118007', name: '오세진', email: 'sejin.oh@example.com', job: '마케팅' },
  { id: 8, code: 'AP20271118008', name: '류하람', email: 'haram.ryu@example.com', job: 'HR' },
  { id: 9, code: 'AP20271118009', name: '배준호', email: 'junho.bae@example.com', job: 'QA' },
]

/** 시트 한 줄의 생김새. tint 는 업로드 양식이 쓰는 머리글 색을 그대로 따라간
 *  것으로, 지원자를 가리키는 열(파랑)과 받아 적은 값(노랑)을 나눈다. */
const SHEET_COLUMNS = [
  { key: 'code', letter: 'A', label: '지원자번호', width: 140, tint: 'bg-[#dde8f3]' },
  { key: 'group', letter: 'B', label: '그룹명', width: 120, tint: 'bg-[#dde8f3]' },
  { key: 'name', letter: 'C', label: '지원자명', width: 72, tint: 'bg-[#dde8f3]' },
  { key: 'email', letter: 'D', label: 'Email', width: 180, tint: 'bg-[#fdf3d4]' },
  { key: 'job', letter: 'E', label: '직무', width: 112, tint: 'bg-[#fdf3d4]' },
] as const

const CELL = 'flex h-7 shrink-0 items-center border-r border-[#d6dade] px-2 text-[12px]'

/**
 * 손가락 시늉이 밟는 순서. 숫자는 그 단계가 켜진 뒤 다음까지 기다리는 ms 다.
 *
 *   0  오른쪽 가운데에서 커서가 떠오른다
 *   2  "그룹 생성" 으로 날아가 3 에서 누르고, 손을 뗀 4 에서 카드가 붙는다
 *      — 누르는 중에 카드가 먼저 나오면 버튼과 무관하게 생긴 것처럼 보인다
 *   5  박서윤의 그룹명 칸으로 내려가 6 에서 눌러 목록을 연다
 *   7  목록을 한 번에 쓱 훑어 내려 맨 아래 12월 1일 에 멈춘다 — 줄마다
 *      멈춰 세우면 네 번을 따로 고르는 것처럼 보인다
 *   8  12월 1일 을 눌러 박서윤을 그 그룹에 넣는다 — 왼쪽 카드의 대상자가
 *       그 자리에서 한 명 늘어난다
 *
 * 폼으로 그룹을 만들고 그 그룹을 시트에서 지원자에게 붙인다 — 두 칸이 한
 * 가지 일의 앞뒤라는 걸 글로 적는 대신 한 번 해 보인다.
 */
const DEMO_STEPS = [480, 540, 1150, 150, 480, 900, 360, 620, 760]

/** 단계별 이동 시간(초). 첫 걸음은 길게 — 커서가 어디서 나와 어디로 가는지
 *  눈이 따라붙을 틈이 있어야 한다. 7 은 목록 위에서 맨 아래까지 한 번에
 *  내려가는 구간이다. */
const TRAVEL: Record<number, number> = { 2: 1.05, 7: 0.55 }

/** 시트에서 연출이 건드리는 줄(박서윤). */
const DEMO_APPLICANT = 2

/** 처음부터 테두리가 잡혀 있는 칸(박서윤). 엑셀에서 칸을 고른 모양 그대로라,
 *  아홉 줄 중 어디를 눌러 볼 수 있는지 메뉴를 띄우지 않고도 보인다. */
const FOCUS_ROW = 2

/** 오른쪽 폼은 한 건을 막 적어 둔 상태로 열린다 — 빈 칸만 늘어서 있으면
 *  무엇을 적는 화면인지 읽는 데 시간이 걸린다. */
const DRAFT = {
  name: '12월 1일 면접',
  evaluators: ['인사담당자'],
  date: '2027-12-01',
  place: '수원 연구소',
}

/** Floating-label field frame shared by every input in the right-hand form. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-chip border border-[#d2d6db] px-3.5 pb-2 pt-2.5">
      <span className="absolute -top-[7px] left-[10px] bg-white px-1 text-[11px] leading-none text-[#6c737f]">{label}</span>
      {children}
    </div>
  )
}

/** Click-to-open picker whose chosen entries become deletable chips. Anything
 *  already picked drops out of the menu. */
function ChipPicker({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const available = options.filter((option) => !selected.includes(option))

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={wrapperRef} className="relative">
      <Field label={label}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`${label} 선택`}
          className="flex min-h-[24px] w-full cursor-pointer items-center gap-1.5 pr-6 text-left"
        >
          <span className="flex flex-1 flex-wrap items-center gap-1.5">
            {selected.length === 0 && <span className="text-sm text-[#9ca3af]">선택</span>}
            {selected.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1 rounded-full bg-[#f3f4f6] py-0.5 pl-2 pr-1 text-[13px] text-[#212121]"
              >
                {name}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`${name} 삭제`}
                  onClick={(event) => {
                    event.stopPropagation()
                    onChange(selected.filter((item) => item !== name))
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.stopPropagation()
                      onChange(selected.filter((item) => item !== name))
                    }
                  }}
                  className="flex size-4 cursor-pointer items-center justify-center rounded-full bg-[#6c737f] text-[10px] leading-none text-white"
                >
                  ×
                </span>
              </span>
            ))}
          </span>
          <IconChevronDown
            size={20}
            stroke={1.6}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c737f]"
          />
        </button>
      </Field>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-ui border border-[#e5e7eb] bg-white py-1 shadow-[0px_8px_16px_-4px_rgba(32,41,57,0.12)]">
          {available.length === 0 ? (
            <p className="px-3.5 py-2 text-sm text-[#9ca3af]">모두 선택했습니다.</p>
          ) : (
            available.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange([...selected, option])
                  setOpen(false)
                }}
                className="block w-full cursor-pointer px-3.5 py-2 text-left text-sm text-[#212121] hover:bg-[#f4f8ff]"
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}


const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * 직접 그린 달력. 브라우저가 주는 기본 날짜 선택기는 운영체제마다 생김새가
 * 달라, 이 화면만 혼자 다른 제품처럼 보인다. 한 달치 격자와 고른 날 하나만
 * 있으면 되는 자리라 직접 그리는 편이 짧다.
 */
function DatePicker({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const [year, month] = value ? value.split('-').map(Number) : []
    return year ? { year, month: month - 1 } : { year: 2027, month: 11 }
  })
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const first = new Date(view.year, view.month, 1).getDay()
  const days = new Date(view.year, view.month + 1, 0).getDate()
  const shift = (step: number) => {
    const next = new Date(view.year, view.month + step, 1)
    setView({ year: next.getFullYear(), month: next.getMonth() })
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="면접 일자 (선택)"
        className="flex w-full cursor-pointer items-center justify-between rounded-chip border border-[#d2d6db] px-3.5 py-2.5 text-left text-sm"
      >
        <span className={value ? 'text-[#212121]' : 'text-[#9ca3af]'}>{value || '날짜 선택(선택)'}</span>
        <IconCalendar size={18} stroke={1.6} className="text-[#6c737f]" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 rounded-ui border border-[#e5e7eb] bg-white p-3 shadow-[0px_12px_28px_-6px_rgba(32,41,57,0.18)]">
          <div className="flex items-center justify-between pb-2">
            <button type="button" onClick={() => shift(-1)} aria-label="이전 달" className="flex size-7 cursor-pointer items-center justify-center rounded-chip text-[#4d5761] hover:bg-[#f3f4f6]">
              ‹
            </button>
            <p className="text-sm font-semibold text-[#212121]">
              {view.year}. {String(view.month + 1).padStart(2, '0')}
            </p>
            <button type="button" onClick={() => shift(1)} aria-label="다음 달" className="flex size-7 cursor-pointer items-center justify-center rounded-chip text-[#4d5761] hover:bg-[#f3f4f6]">
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((day) => (
              <span key={day} className="py-1 text-[11px] text-[#9ca3af]">
                {day}
              </span>
            ))}
            {Array.from({ length: first }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const iso = toISO(view.year, view.month, i + 1)
              const picked = iso === value
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    onChange(iso)
                    setOpen(false)
                  }}
                  className={clsx(
                    'mx-auto flex size-7 cursor-pointer items-center justify-center rounded-full text-[13px] transition-colors',
                    picked ? 'bg-[#0042b7] font-semibold text-white' : 'text-[#212121] hover:bg-[#eef3fd]',
                  )}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 업로드한 지원자 명단을 그대로 보여 주는 웹 엑셀. 평가 그룹은 폼으로 한
 * 건씩 만드는 것 말고도 이렇게 명단에서 직접 배정하는 길이 있다 — 수십 명을
 * 나눌 때는 그룹마다 대상자를 골라 담는 것보다 이쪽이 빠르다.
 *
 * 누를 수 있는 칸은 그룹명 열 하나뿐이다. 나머지는 지원서에서 넘어온 값이라
 * 여기서 고칠 거리가 아니고, 고칠 수 있는 것처럼 보이면 다 눌러 보게 된다.
 */
function ApplicantSheet({
  groups,
  assigned,
  onAssign,
  forceOpen,
  demoHover,
}: {
  groups: EvalGroup[]
  assigned: Record<number, number>
  onAssign: (applicantId: number, groupId: number | null) => void
  /** 연출이 대신 열어 두는 줄. 사람이 누른 줄보다 우선한다. */
  forceOpen: number | null
  /** 연출 커서가 지금 올라가 있는 메뉴 칸. 사람이 올렸을 때와 같은 색으로
   *  칠해 둔다 — 커서만 지나가고 아래가 가만히 있으면 겉도는 것처럼 보인다. */
  demoHover: number | null
}) {
  const [openRow, setOpenRow] = useState<number | null>(null)
  const [focusRow, setFocusRow] = useState<number | null>(FOCUS_ROW)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (openRow === null) return
    const close = (event: MouseEvent) => {
      if (!sheetRef.current?.contains(event.target as Node)) setOpenRow(null)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [openRow])

  return (
    <div ref={sheetRef}>
      {/* 메뉴가 열려 있는 동안만 깔리는 투명 덮개. 메뉴 밖 아무 데나 눌러도
          닫히게 하는 가장 짧은 길이고, 옆 칸이 잘못 눌리는 것도 막는다. */}
      {openRow !== null && (
        <div aria-hidden onClick={() => setOpenRow(null)} className="fixed inset-0 z-30" />
      )}

      <p className="pb-2 text-[13px] text-[#6c737f]">그룹명 칸을 눌러 지원자를 평가 그룹에 배정해 보세요.</p>

      <div className="rounded-[6px] border border-[#d6dade] bg-white">
        {/* 열 머리 A·B·C — 엑셀에서 받은 파일을 그대로 열어 둔 화면이라는 걸
            이 한 줄이 말해 준다. */}
        <div className="flex border-b border-[#d6dade] bg-[#f5f6f7]">
          <span className="h-5 w-[34px] shrink-0 border-r border-[#d6dade]" />
          {SHEET_COLUMNS.map((column) => (
            <span
              key={column.key}
              style={{ width: column.width }}
              className="flex h-5 shrink-0 items-center justify-center border-r border-[#d6dade] text-[11px] text-[#6c737f] last:border-r-0"
            >
              {column.letter}
            </span>
          ))}
        </div>

        <div className="flex border-b border-[#d6dade]">
          <span className="flex h-7 w-[34px] shrink-0 items-center justify-center border-r border-[#d6dade] bg-[#f5f6f7] text-[11px] text-[#6c737f]">
            1
          </span>
          {SHEET_COLUMNS.map((column) => (
            <span
              key={column.key}
              style={{ width: column.width }}
              className={clsx(CELL, 'font-medium text-[#212121] last:border-r-0', column.tint)}
            >
              {column.label}
            </span>
          ))}
        </div>

        {APPLICANTS.map((applicant, index) => {
          const group = groups.find((item) => item.id === assigned[applicant.id])
          const open = (forceOpen ?? openRow) === applicant.id
          return (
            <div key={applicant.id} className="flex border-b border-[#eceef0] last:border-b-0">
              <span className="flex h-7 w-[34px] shrink-0 items-center justify-center border-r border-[#d6dade] bg-[#f5f6f7] text-[11px] text-[#6c737f]">
                {index + 2}
              </span>
              <span style={{ width: SHEET_COLUMNS[0].width }} className={clsx(CELL, 'text-[#212121]')}>
                {applicant.code}
              </span>

              <div style={{ width: SHEET_COLUMNS[1].width }} className="relative h-7 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setFocusRow(applicant.id)
                    setOpenRow(open ? null : applicant.id)
                  }}
                  aria-expanded={open}
                  aria-label={`${applicant.name} 평가 그룹 지정`}
                  data-demo-cell={applicant.id === DEMO_APPLICANT || undefined}
                  className={clsx(
                    'flex h-7 w-full cursor-pointer items-center gap-1 border-r border-[#d6dade] px-2 text-left text-[12px] transition-colors',
                    open || focusRow === applicant.id
                      ? 'bg-[#e4ecfd] ring-1 ring-inset ring-[#0042b7]'
                      : 'hover:bg-[#eef3fd]',
                  )}
                >
                  <span className={clsx('flex-1 truncate', group ? 'text-[#212121]' : 'text-[#b8baba]')}>
                    {group ? group.name : '그룹 선택'}
                  </span>
                  <IconChevronDown size={14} stroke={1.6} className="shrink-0 text-[#6c737f]" />
                </button>

                {open && (
                  /* 아래로 열되 무엇에도 가리지 않게 맨 위로 띄운다. 끝쪽 줄만
                     위로 뒤집는다 — 그대로 내려가면 판 밖으로 나간다. */
                  <div
                    data-demo-menu
                    className={clsx(
                      'absolute left-0 z-50 w-[180px] rounded-ui border border-[#e5e7eb] bg-white py-1 shadow-[0px_10px_24px_-6px_rgba(32,41,57,0.2)]',
                      index >= 5 ? 'bottom-full mb-1' : 'top-full mt-1',
                    )}
                  >
                    {groups.map((item, menuIndex) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onAssign(applicant.id, item.id)
                          setOpenRow(null)
                        }}
                        className={clsx(
                          'block w-full cursor-pointer truncate px-3 py-1.5 text-left text-[13px] text-[#212121] hover:bg-[#f4f8ff]',
                          demoHover === menuIndex && 'bg-[#f4f8ff]',
                        )}
                      >
                        {item.name}
                      </button>
                    ))}
                    {/* 연출이 열어 둔 메뉴에는 "배정 해제" 를 내지 않는다 —
                        막 고른 그룹 아래에 바로 해제가 따라 나오면 방금 한
                        일을 되묻는 꼴이다. 사람이 다시 열면 그때 보인다. */}
                    {group && forceOpen !== applicant.id && (
                      <button
                        type="button"
                        onClick={() => {
                          onAssign(applicant.id, null)
                          setOpenRow(null)
                        }}
                        className="block w-full cursor-pointer border-t border-[#f3f4f6] px-3 py-1.5 text-left text-[13px] text-[#d92d20] hover:bg-[#fef3f2]"
                      >
                        배정 해제
                      </button>
                    )}
                  </div>
                )}
              </div>

              <span style={{ width: SHEET_COLUMNS[2].width }} className={clsx(CELL, 'text-[#212121]')}>
                {applicant.name}
              </span>
              <span style={{ width: SHEET_COLUMNS[3].width }} className={clsx(CELL, 'truncate text-[#4d5761]')}>
                {applicant.email}
              </span>
              <span style={{ width: SHEET_COLUMNS[4].width }} className={clsx(CELL, 'truncate border-r-0 text-[#4d5761]')}>
                {applicant.job}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GroupCard({
  group,
  count,
  flash,
  onDelete,
}: {
  group: EvalGroup
  count: number
  flash: boolean
  onDelete: () => void
}) {
  const [lead, ...rest] = group.evaluators
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      data-group-id={group.id}
      className={clsx(
        'w-full shrink-0 rounded-ui border bg-white transition-[border-color,box-shadow] duration-300',
        flash ? 'border-[#0042b7] shadow-[0_0_0_3px_rgba(0,66,183,0.16)]' : 'border-[#e5e7eb]',
      )}
    >
      <div className="flex items-center justify-between border-b border-[#f3f4f6] px-5 py-4">
        <p className="text-base font-semibold text-[#212121]">{group.name}</p>
        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap text-sm text-[#4d5761]">
            {lead} 포함 {group.evaluators.length}명
          </span>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`${group.name} 그룹 삭제`}
            className="cursor-pointer whitespace-nowrap rounded-chip border border-[#f3c0c0] px-2.5 py-1 text-[13px] text-[#d92d20] transition-colors hover:bg-[#fef3f2]"
          >
            그룹 삭제
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-5 py-4">
        <p className="text-[13px] text-[#6c737f]">대상자</p>
        <p className="text-sm font-semibold text-[#212121]">{count}명</p>
        {(group.date || group.place || rest.length > 0) && (
          <p className="pt-1 text-[13px] text-[#6c737f]">
            {[group.date, group.place].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * The "평가 그룹 설정" tab of the 전형 운영 section. Fill in the form on the
 * right — name plus at least one evaluator and one candidate — and "그룹 생성"
 * adds a card on the left. Date and place are optional. Past four groups the
 * button refuses and a toast explains why; the list scrolls once the cards
 * outgrow the panel.
 */
export function Hero3EvalGroups() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const [groups, setGroups] = useState<EvalGroup[]>(SEED_GROUPS)
  const [name, setName] = useState(DRAFT.name)
  const [evaluators, setEvaluators] = useState<string[]>(DRAFT.evaluators)
  const [date, setDate] = useState(DRAFT.date)
  const [place, setPlace] = useState(DRAFT.place)
  const [toast, setToast] = useState('')
  /** 시트에서 배정한 지원자. 지원자 한 명은 그룹 하나에만 들어가므로
   *  지원자 번호 → 그룹 번호 한 장이면 충분하다. 지워진 그룹을 가리키는
   *  항목은 groups 에서 찾지 못해 저절로 사라진다. 김현민 한 명은 미리
   *  배정해 둔다 — 빈 칸만 아홉 줄이면 무엇을 하는 열인지 안 읽힌다. */
  const [assigned, setAssigned] = useState<Record<number, number>>({ 1: 1 })
  const reduceMotion = useReducedMotion()
  /** 사람이 한 번이라도 손을 대면 연출은 비킨다 — 내가 누른 것과 커서가
   *  누르는 것이 겹치면 어느 쪽이 한 일인지 알 수 없다. */
  const [demoOff, setDemoOff] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null)
  /** 방금 인원이 바뀐 그룹. 시트는 오른쪽 끝이고 카드는 왼쪽이라, 숫자만
   *  조용히 바뀌면 무엇이 반응했는지 못 본 채 지나간다. */
  const [flash, setFlash] = useState<number | null>(null)
  const step = useSequence(DEMO_STEPS, !reduceMotion && !demoOff, 0, false)
  const demoLive = !reduceMotion && !demoOff && step >= 1 && step < DEMO_STEPS.length
  const demoOpen = !reduceMotion && !demoOff && step >= 6 && step < DEMO_STEPS.length
  /** 연출이 "그룹 생성" 을 누르고 있는 순간. */
  const demoPress = !reduceMotion && !demoOff && step === 3

  /** 커서가 가야 할 자리를 단계마다 실측한다. 무대는 scale 이 걸려 있으므로
   *  화면 px 을 설계 px 로 되돌려야 absolute 좌표와 맞는다. */
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || reduceMotion || demoOff) return
    const base = stage.getBoundingClientRect()
    const k = DESIGN_WIDTH / base.width
    const at = (el: Element | null | undefined) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: (r.left - base.left + r.width / 2) * k, y: (r.top - base.top + r.height / 2) * k }
    }
    const menu = [...stage.querySelectorAll('[data-demo-menu] button')]
    const next =
      step < 2
        ? { x: DESIGN_WIDTH - 86, y: DESIGN_HEIGHT / 2 }
        : step < 5
          ? at(stage.querySelector('[data-demo-create]'))
          : step < 7
            ? at(stage.querySelector('[data-demo-cell]'))
            : at(menu[menu.length - 1])
    if (next) setSpot(next)
  }, [step, reduceMotion, demoOff])
  const nextId = useRef(SEED_GROUPS.length + 1)
  /** 새 그룹은 목록 맨 아래에 붙는데, 목록은 네 칸이 넘으면 스크롤이라
   *  만들어도 화면 밖에 생겨 "눌렸나?" 싶어진다. 늘어난 순간에만 바닥까지
   *  내려 방금 만든 카드를 보여 준다 — 처음 그려질 때는 맨 위가 맞다. */
  const listRef = useRef<HTMLDivElement>(null)
  const groupCount = useRef(groups.length)

  /** 카드에 뜨는 대상자 수 = 그룹을 만들 때 고른 사람 + 시트에서 배정한 사람. */
  const countFor = (group: EvalGroup) =>
    group.candidates.length + Object.values(assigned).filter((id) => id === group.id).length

  const assign = (applicantId: number, groupId: number | null) => {
    setFlash(groupId ?? assigned[applicantId] ?? null)
    setAssigned((current) => {
      const next = { ...current }
      if (groupId === null) delete next[applicantId]
      else next[applicantId] = groupId
      return next
    })
  }

  /** 손을 뗀 4 단계에서 진짜로 만든다 — 시늉이 아니라 실제 클릭이어야 폼에
   *  적힌 한 건이 왼쪽 카드로 넘어가는 걸 그대로 보여 줄 수 있다. */
  /** 훑기의 끝은 구경이 아니라 배정이다 — 방금 만든 그룹에 지원자를 넣어야
   *  "그룹을 만들어 지원자를 담는다" 는 한 바퀴가 닫힌다. */
  useEffect(() => {
    if (step !== 8 || reduceMotion || demoOff) return
    const made = groups[groups.length - 1]
    if (made) assign(DEMO_APPLICANT, made.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    if (step === 4 && !reduceMotion && !demoOff) createGroup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    if (flash === null) return
    const list = listRef.current
    const card = list?.querySelector<HTMLElement>(`[data-group-id="${flash}"]`)
    if (list && card) {
      // 무대에 scale 이 걸려 있어 rect 차이는 화면 px 이다 — scrollTop 은
      // CSS px 이라 그만큼 되돌려 놓아야 엉뚱한 데로 간다.
      const scale = list.getBoundingClientRect().height / list.clientHeight || 1
      const offset = (card.getBoundingClientRect().top - list.getBoundingClientRect().top) / scale
      if (offset < 0 || offset + card.clientHeight > list.clientHeight) list.scrollTop += offset - 8
    }
    const timer = setTimeout(() => setFlash(null), 1100)
    return () => clearTimeout(timer)
  }, [flash])

  const canCreate = name.trim() !== '' && evaluators.length > 0

  useEffect(() => {
    const grew = groups.length > groupCount.current
    groupCount.current = groups.length
    if (!grew) return
    // 카드가 들어오면서 layout 애니메이션이 아직 자리를 잡는 중이라, 지금
    // 읽은 scrollHeight 는 한 장 모자란다. 한 프레임 뒤에 다시 잰다.
    const frame = requestAnimationFrame(() => {
      const list = listRef.current
      if (list) list.scrollTop = list.scrollHeight
    })
    return () => cancelAnimationFrame(frame)
  }, [groups.length])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  const createGroup = () => {
    if (!canCreate) return
    if (groups.length >= MAX_GROUPS) {
      setToast(`그룹은 최대 ${MAX_GROUPS}개까지 생성할 수 있습니다.`)
      return
    }
    setGroups((current) => [
      ...current,
      { id: nextId.current++, name: name.trim(), evaluators, candidates: [], date, place: place.trim() },
    ])

    // 만들고 나서도 칸을 비우지 않고 하루 뒤로 밀어 둔다 — 면접 그룹은 날짜만
    // 바꿔 가며 연달아 만드는 일이라, 빈 칸보다 다음 건이 적혀 있는 쪽이 맞다.
    if (!date) return
    const next = new Date(`${date}T00:00:00`)
    next.setDate(next.getDate() + 1)
    setDate(toISO(next.getFullYear(), next.getMonth(), next.getDate()))
    setName(`${next.getMonth() + 1}월 ${next.getDate()}일 면접`)
  }

  return (
    <div className="w-full overflow-hidden rounded-card bg-white shadow-card">
      <div ref={ref} className="w-full overflow-hidden" style={{ height: DESIGN_HEIGHT * scale }}>
      <div
        ref={stageRef}
        onPointerDown={() => setDemoOff(true)}
        // 누를 수 있는 것들은 저마다 cursor-pointer 를 들고 있어 그대로 두면
        // 판 위에서만 모양이 갈린다. 버튼은 판의 모양을 물려받게 한다.
        className="relative [&_button]:cursor-[inherit]!"
        style={{
          cursor: POINTER_SKIN,
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Created groups (node 2320:25780) */}
        <div className="absolute left-8 top-9 flex h-[622px] w-[460px] flex-col rounded-card bg-[#f9fafb] px-5 pb-[33px] pt-[18px]">
          {/* 목록이 스크롤되면 아래 몇 장이 더 있는지 보이지 않는다 — 수를
              먼저 적어 두면 만들고 지울 때마다 눈으로 확인된다. */}
          <p className="pb-3 pl-1.5 text-[13px] text-[#6c737f]">{groups.length}개 그룹</p>

          <div
            ref={listRef}
            className="flex min-h-0 flex-1 scroll-smooth flex-col gap-2 overflow-y-auto px-1 pb-3 motion-reduce:scroll-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <AnimatePresence initial={false}>
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  count={countFor(group)}
                  flash={flash === group.id}
                  onDelete={() => setGroups((current) => current.filter((item) => item.id !== group.id))}
                />
              ))}
            </AnimatePresence>
            {groups.length === 0 && (
              <p className="pt-8 text-center text-sm text-[#b8baba]">그룹을 만들어 보세요.</p>
            )}
          </div>
        </div>

        {/* Create form (node 2320:25727) */}
        {/* 오른쪽 칸이 무엇을 하는 자리인지 짚어 준다 — 왼쪽은 이미 만든
            그룹 목록이라, 이름이 없으면 두 칸의 역할이 구분되지 않는다. */}
        <p className="absolute left-[516px] top-9 text-[18px] font-bold tracking-[-0.09px] text-[#212121]">평가 그룹 설정</p>

        <div className="absolute left-[516px] top-[78px] grid w-[660px] grid-cols-2 gap-4">
          <Field label="그룹명">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="그룹명을 입력하세요"
              aria-label="그룹명"
              className="w-full bg-transparent text-sm text-[#212121] outline-none placeholder:text-[#9ca3af]"
            />
          </Field>

          <ChipPicker label="평가자" options={EVALUATORS} selected={evaluators} onChange={setEvaluators} />

          <DatePicker value={date} onChange={setDate} />

          <div className="rounded-chip border border-[#d2d6db] px-3.5 py-2.5">
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="장소(선택)"
              aria-label="장소 (선택)"
              className="w-full bg-transparent text-sm text-[#212121] outline-none placeholder:text-[#9ca3af]"
            />
          </div>

          <div className="col-span-2">
            <button
              type="button"
              onClick={createGroup}
              disabled={!canCreate}
              data-demo-create
              className={clsx(
                'w-full rounded-ui py-2.5 text-sm font-medium transition-[background-color,scale] duration-100 ease-out',
                !canCreate && 'cursor-default bg-[#e5e7eb] text-[#9ca3af]',
                canCreate && 'cursor-pointer text-white active:scale-[0.97]',
                canCreate && (demoPress ? 'scale-[0.97] bg-[#00265f]' : 'bg-[#0042b7] hover:bg-[#00379b]'),
              )}
            >
              그룹 생성
            </button>
          </div>
        </div>

        {/* 위에서 만든 그룹이 아래 시트에서 쓰인다 — 두 칸이 따로 노는
            것처럼 보이지 않게 흐름을 한 번 짚어 준다. */}
        <div aria-hidden className="absolute left-[516px] top-[258px] flex w-[660px] justify-center text-[#c4c7ca]">
          <svg viewBox="0 0 24 24" fill="none" className="size-6">
            <path d="M12 4v15M6 13.5l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="absolute left-[516px] top-[306px] w-[660px]">
          <ApplicantSheet
            groups={groups}
            assigned={assigned}
            onAssign={assign} forceOpen={demoOpen ? DEMO_APPLICANT : null}
            demoHover={demoOpen && step >= 8 ? groups.length - 1 : null}
          />
        </div>

        {/* 손가락 시늉. 자리는 실측해 두었다가 x/y 로만 옮기므로 밑에 깔린
            칸들은 밀리지 않는다. 목록은 한 번에 쓱 내려간다 — 줄마다 세워
            두면 네 개를 하나씩 고르는 장면이 되어 버린다. */}
        {spot && (
          <motion.span
            aria-hidden
            initial={false}
            animate={{
              x: spot.x,
              y: spot.y,
              opacity: demoLive ? 1 : 0,
              scale: step === 3 || step === 6 || step === 8 ? 0.72 : 1,
            }}
            transition={{
              x: { duration: TRAVEL[step] ?? 0.7, ease: [0.16, 1, 0.3, 1] },
              y: { duration: TRAVEL[step] ?? 0.7, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.28 },
              scale: { duration: 0.16 },
            }}
            className="pointer-events-none absolute left-0 top-0 z-[60] -ml-[15px] -mt-[15px] size-[30px] rounded-full bg-[rgba(77,87,97,0.7)] ring-2 ring-white"
          />
        )}

        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              role="status"
              className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-ui bg-black/80 px-5 py-3 text-sm font-medium text-white"
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
