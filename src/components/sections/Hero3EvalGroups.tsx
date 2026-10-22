import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { useFitScale } from '../../hooks/useFitScale'

// Figma node 2320:25679 — "전형운영>평가그룹".
const DESIGN_WIDTH = 1142
const DESIGN_HEIGHT = 640
const MAX_GROUPS = 4
const TOAST_MS = 2500

const EVALUATORS = ['인사담당자', '1팀 팀장', '2팀 팀장', '경영진']
const CANDIDATES = ['김소현', '이진희', '서강호', '안지윤']

interface EvalGroup {
  id: number
  name: string
  evaluators: string[]
  candidates: string[]
  date: string
  place: string
}

const SEED_GROUPS: EvalGroup[] = [
  { id: 1, name: '6월 1일 면접', evaluators: ['한민지', '박서준'], candidates: ['김소현', '이진희', '서강호'], date: '', place: '' },
  { id: 2, name: '6월 5일 면접', evaluators: ['박준호', '이수민', '정하늘'], candidates: ['김소현', '이진희', '서강호', '안지윤'], date: '', place: '' },
]

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
          <svg viewBox="0 0 20 20" fill="none" aria-hidden className="absolute right-3 top-1/2 size-5 -translate-y-1/2">
            <path d="M6 8L10 12L14 8" stroke="#6c737f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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

function GroupCard({ group, onDelete }: { group: EvalGroup; onDelete: () => void }) {
  const [lead, ...rest] = group.evaluators
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full shrink-0 rounded-ui border border-[#e5e7eb] bg-white"
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
            className="cursor-pointer whitespace-nowrap rounded-chip border border-[#d2d6db] px-2.5 py-1 text-[13px] text-[#4d5761] transition-colors hover:bg-[#f9fafb]"
          >
            그룹 삭제
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-5 py-4">
        <p className="text-[13px] text-[#6c737f]">대상자</p>
        <p className="text-sm font-semibold text-[#212121] underline">{group.candidates.length}명</p>
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
  const [name, setName] = useState('')
  const [evaluators, setEvaluators] = useState<string[]>([])
  const [candidates, setCandidates] = useState<string[]>([])
  const [date, setDate] = useState('')
  const [place, setPlace] = useState('')
  const [toast, setToast] = useState('')
  const nextId = useRef(SEED_GROUPS.length + 1)

  const canCreate = name.trim() !== '' && evaluators.length > 0 && candidates.length > 0

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  const createGroup = () => {
    if (!canCreate) return
    if (groups.length >= MAX_GROUPS) {
      setToast('그룹은 최대 4개까지 생성할 수 있습니다.')
      return
    }
    setGroups((current) => [
      ...current,
      { id: nextId.current++, name: name.trim(), evaluators, candidates, date, place: place.trim() },
    ])
    setName('')
    setEvaluators([])
    setCandidates([])
    setDate('')
    setPlace('')
  }

  return (
    <div className="w-full overflow-hidden rounded-card bg-white shadow-card">
      <div ref={ref} className="w-full overflow-hidden" style={{ height: DESIGN_HEIGHT * scale }}>
      <div
        className="relative"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Created groups (node 2320:25780) */}
        <div className="absolute left-8 top-9 h-[568px] w-[731px] rounded-card bg-[#f9fafb] px-[67px] py-[66px]">
          <div className="flex h-full flex-col gap-2 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <AnimatePresence initial={false}>
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
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
        <div className="absolute left-[784px] top-[56px] flex w-[324px] flex-col gap-4">
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
          <ChipPicker label="면접 대상자" options={CANDIDATES} selected={candidates} onChange={setCandidates} />

          <div className="relative rounded-chip border border-[#d2d6db]">
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              aria-label="면접 일자 (선택)"
              className="w-full cursor-pointer bg-transparent px-3.5 py-2.5 text-sm text-[#212121] outline-none"
            />
          </div>

          <div className="rounded-chip border border-[#d2d6db] px-3.5 py-2.5">
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="장소(선택)"
              aria-label="장소 (선택)"
              className="w-full bg-transparent text-sm text-[#212121] outline-none placeholder:text-[#9ca3af]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={createGroup}
              disabled={!canCreate}
              className={clsx(
                'w-[100px] rounded-ui py-2.5 text-sm font-medium transition-colors',
                canCreate
                  ? 'cursor-pointer bg-[#0042b7] text-white hover:bg-[#00379b]'
                  : 'cursor-default bg-[#e5e7eb] text-[#9ca3af]',
              )}
            >
              그룹 생성
            </button>
          </div>
        </div>

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
