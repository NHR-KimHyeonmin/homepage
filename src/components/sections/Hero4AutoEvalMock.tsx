import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { IconChevronDown, IconDownload, IconFilter, IconPlusMinus, IconX } from '@tabler/icons-react'
import { useFitScale } from '../../hooks/useFitScale'

/** 설계 좌표. 이 크기로 그려 두고 담길 칸에 맞춰 통째로 줄인다. */
const DESIGN_WIDTH = 684
const DESIGN_HEIGHT = 448

type Tab = '필터형' | '가산점형'

const TABS = [
  { id: '필터형', Icon: IconFilter },
  { id: '가산점형', Icon: IconPlusMinus },
] as const

/** 지원자는 평가 화면 목업(Hero4EvalScreen)과 같은 사람들이다. */
const APPLICANTS = [
  { name: '김민재', job: '커리어링크 개발 > IT개발', filter: 'Pass', bonus: 4 },
  { name: '김민준', job: '커리어링크 개발 > IT개발', filter: 'Fail', bonus: 0 },
  { name: '김윤서', job: '서비스 기획 > 프로덕트', filter: 'Pass', bonus: 3 },
  { name: '이서현', job: '서비스 기획 > 프로덕트', filter: 'Pass', bonus: 2 },
  { name: '조유빈', job: '디자인 > UX/UI', filter: 'Pass', bonus: 4 },
  { name: '조유준', job: '디자인 > UX/UI', filter: 'Fail', bonus: 0 },
  { name: '한민지', job: '마케팅 > 콘텐츠', filter: 'Pass', bonus: 3 },
]

/** 커서가 누르러 가는 자리. 무대 안의 설계 좌표다. */
const AT_START = { x: 360, y: 240 }
const AT_BONUS = { x: 165, y: 39 }
const AT_RUN = { x: 626, y: 409 }

interface Scene {
  tab: Tab
  view: 'template' | 'result'
  cursor: { x: number; y: number }
  cursorShown: boolean
  down: boolean
  toast: boolean
  /** 필터형결과 / 가산점형결과가 채워진 줄 수. */
  filter: number
  bonus: number
}

const FIRST: Scene = {
  tab: '필터형',
  view: 'template',
  cursor: AT_START,
  cursorShown: true,
  down: false,
  toast: false,
  filter: 0,
  bonus: 0,
}

/** [이 장면을 머무는 시간(ms), 앞 장면에서 바뀌는 것] */
const STEPS: [number, Partial<Scene>][] = [
  // 필터형이 선택된 채로 시작하고, 한 바퀴를 돌면 이 상태로 돌아온다.
  [1900, {}],
  [650, { cursor: AT_BONUS }],
  [170, { down: true, tab: '가산점형' }],
  [2100, { down: false }],
  [750, { cursor: AT_RUN }],
  [170, { down: true }],
  [500, { down: false, cursorShown: false, view: 'result', toast: true }],
  // 필터형결과를 다 채운 뒤에 가산점형결과로 넘어간다 — 두 칸이 같이
  // 차오르면 어느 쪽이 어떤 유형의 결과인지 눈으로 따라가기 어렵다.
  ...APPLICANTS.map((_, i): [number, Partial<Scene>] => [240, { filter: i + 1 }]),
  [260, {}],
  ...APPLICANTS.map((_, i): [number, Partial<Scene>] => [240, { bonus: i + 1 }]),
  [2400, {}],
]

const SCENES = STEPS.reduce<Scene[]>((scenes, [, patch]) => {
  scenes.push({ ...(scenes.at(-1) ?? FIRST), ...patch })
  return scenes
}, [])

/** 운영 화면의 윗변 라벨이 달린 입력 칸. 그림이라 실제 input 은 아니다. */
function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`relative flex h-[38px] items-center rounded-[6px] border border-[#d2d6db] bg-white px-3 text-[14px] text-ink ${className ?? ''}`}>
      <span className="absolute -top-[7px] left-2 bg-white px-1 text-[11px] leading-none text-[#6c737f]">{label}</span>
      {children}
    </div>
  )
}

function Select({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex h-[38px] items-center justify-between gap-1 rounded-[6px] border border-[#d2d6db] bg-white px-3 text-[14px] text-ink ${className ?? ''}`}>
      <span className="truncate">{children}</span>
      <IconChevronDown size={15} stroke={1.8} className="shrink-0 text-[#6c737f]" />
    </div>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#f1f3f5] py-0.5 pl-2 pr-1 text-[12px] text-ink">
      {children}
      <span className="flex size-3.5 items-center justify-center rounded-full bg-[#212121] text-white">
        <IconX size={9} stroke={2.6} />
      </span>
    </span>
  )
}

/** 그룹 한 칸. 왼쪽의 파란 선이 운영 화면에서 그룹을 가르는 표시다. */
function FilterGroup({ name, item, chips, nested }: { name: string; item: string; chips: string[]; nested?: boolean }) {
  return (
    <div className={`rounded-[8px] border border-l-[3px] border-[#e8eaed] border-l-[#0042b7] bg-white p-2.5 ${nested ? 'ml-6' : ''}`}>
      <Field label="그룹명">{name}</Field>
      <div className="mt-2 rounded-[8px] bg-[#f5f6f8] px-3 py-2">
        <p className="pb-1.5 text-[12px] font-semibold text-[#4d5761]">평가항목 1</p>
        <div className="flex items-center gap-2">
          <Select className="w-[200px] shrink-0">{item}</Select>
          <Field label="조건 선택" className="min-w-0 flex-1 gap-1.5">
            {chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </Field>
          <IconX size={15} stroke={1.8} className="shrink-0 text-[#4d5761]" />
        </div>
      </div>
    </div>
  )
}

function FilterTemplate() {
  return (
    <div className="flex flex-col gap-2">
      <FilterGroup name="그룹 1" item="대학교 > 졸업 구분" chips={['졸업', '졸업예정']} />
      <FilterGroup name="그룹 1-1" item="인적정보 > 국적" chips={['대한민국']} nested />
    </div>
  )
}

function BonusTemplate() {
  return (
    <div className="rounded-[8px] border border-l-[3px] border-[#e8eaed] border-l-[#0042b7] bg-white p-2.5">
      <div className="flex items-center gap-2 pb-3">
        <span className="text-[14px] font-bold text-ink">[학점]</span>
        <span className="text-[13px] text-[#4d5761]">4점</span>
        <span className="rounded-full bg-[#e8f0fe] px-2 py-0.5 text-[12px] text-[#0042b7]">학점(GPA 표준 환산)</span>
      </div>
      <div className="flex gap-2">
        <Field label="그룹명" className="flex-1">
          학점
        </Field>
        <Field label="최대점수" className="w-[110px] shrink-0">
          4
        </Field>
      </div>
      <div className="mt-2 rounded-[8px] bg-[#f5f6f8] px-3 py-2">
        <p className="pb-1.5 text-[12px] font-semibold text-[#4d5761]">평가항목 1</p>
        <div className="flex gap-2">
          <Select className="min-w-0 flex-1">대학교 &gt; 학점(GPA 표준 환산)</Select>
          <div className="flex shrink-0 flex-col gap-2.5">
            {['4.0', '3.0', '2.0'].map((score, i) => (
              <div key={score} className="flex items-center gap-1.5">
                <Field label="조건값" className="w-[68px]">
                  {score}
                </Field>
                <span className="text-[13px] text-[#4d5761]">점</span>
                <Select className="w-[78px]">이상</Select>
                <Field label="가점" className="w-[56px] font-semibold">
                  {4 - i}
                </Field>
                <IconX size={15} stroke={1.8} className="text-[#4d5761]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** 채워지기 전에도 자리를 잡아 둬서, 값이 들어올 때 칸이 흔들리지 않는다. */
function ResultCell({ filled, children }: { filled: boolean; children: ReactNode }) {
  return (
    <div className="flex h-[36px] w-[140px] shrink-0 items-center justify-center border-l border-[#f6e6d8] bg-[#fdf3ea] text-[14px] text-ink">
      <motion.span
        initial={false}
        animate={{ opacity: filled ? 1 : 0, scale: filled ? 1 : 0.7 }}
        transition={{ type: 'spring', stiffness: 520, damping: 26 }}
      >
        {children}
      </motion.span>
    </div>
  )
}

function ResultView({ scene }: { scene: Scene }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[17px] font-bold text-ink">자동 평가 결과 확인</p>
        <IconX size={18} stroke={1.8} className="text-[#4d5761]" />
      </div>
      <div className="flex items-center gap-2 pt-4 text-[13px]">
        <span className="rounded-[6px] border border-[#d2d6db] px-2.5 py-1.5 text-ink">적용된 양식 보기</span>
        <span className="rounded-[6px] border border-[#d2d6db] px-2.5 py-1.5 text-ink">실행 내역</span>
        <span className="flex items-center gap-1 rounded-[6px] border border-[#0042b7] px-2.5 py-1.5 text-[#0042b7]">
          <IconDownload size={15} stroke={1.8} />
          엑셀 다운로드
        </span>
      </div>
      <div className="mt-4 overflow-hidden rounded-[8px] border border-[#e8eaed]">
        <div className="flex h-[42px] items-center bg-[#f5f6f8] text-center text-[13px] font-semibold text-[#4d5761]">
          <span className="w-[116px] shrink-0">이름</span>
          <span className="min-w-0 flex-1">직무</span>
          <span className="w-[140px] shrink-0">필터형결과</span>
          <span className="w-[140px] shrink-0">가산점형결과</span>
        </div>
        {APPLICANTS.map((person, i) => (
          <div key={person.name} className="flex items-center border-t border-[#eceef0] text-center text-[14px]">
            <span className="w-[116px] shrink-0 text-ink">{person.name}</span>
            <span className="min-w-0 flex-1 text-[#4d5761]">{person.job}</span>
            <ResultCell filled={i < scene.filter}>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
                  person.filter === 'Pass' ? 'bg-[#e4f6ea] text-[#1a7f45]' : 'bg-[#fde8e6] text-[#d92d20]'
                }`}
              >
                {person.filter}
              </span>
            </ResultCell>
            <ResultCell filled={i < scene.bonus}>{person.bonus}</ResultCell>
          </div>
        ))}
      </div>
    </>
  )
}

/**
 * "자동평가" 의 그림 자리를 대신하는 연출. 설정 팝업이 필터형 양식으로 열려
 * 있다가 가산점형을 눌러 양식이 바뀌고, [실행] 을 누르면 결과 확인 팝업으로
 * 넘어가 표의 결과 칸이 차례로 채워진다.
 *
 * 장면을 STEPS 한 표에 모아 둔 이유는 타이머를 여기저기 걸지 않기 위해서다 —
 * 순서나 시간을 고칠 때 이 표만 보면 된다. 화면에 처음 들어온 뒤부터 돈다.
 */
export function Hero4AutoEvalMock() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [step, setStep] = useState(0)
  const scene = SCENES[step]

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => setStep((s) => (s + 1) % SCENES.length), STEPS[step][0])
    return () => clearTimeout(timer)
  }, [inView, step])

  const isResult = scene.view === 'result'

  return (
    <div
      ref={ref}
      role="img"
      aria-label="필터형과 가산점형 자동평가 양식을 고르고 실행하면 지원자별 결과가 채워지는 화면"
      className="w-full"
      style={{ height: DESIGN_HEIGHT * scale }}
    >
      <div
        className="relative font-sans"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* 팝업 */}
        <div className="absolute inset-0 overflow-hidden rounded-[12px] bg-white shadow-[0_12px_32px_-12px_rgba(13,82,140,0.22)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isResult ? 'result' : 'template'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0 p-5"
            >
              {isResult ? (
                <ResultView scene={scene} />
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-[38px] shrink-0 divide-x divide-[#d2d6db] overflow-hidden rounded-[6px] border border-[#d2d6db] bg-white">
                      {TABS.map(({ id, Icon }) => (
                        <span
                          key={id}
                          className={`flex w-[96px] items-center justify-center gap-1.5 text-[13px] font-semibold transition-colors duration-200 ${
                            id === scene.tab ? 'bg-[#f1f3f5] text-ink' : 'text-[#9499a2]'
                          }`}
                        >
                          <Icon size={15} stroke={1.8} />
                          {id}
                        </span>
                      ))}
                    </div>
                    <Field label="양식명" className="min-w-0 flex-1">
                      평가 템플릿_{scene.tab}
                    </Field>
                    <IconX size={18} stroke={1.8} className="shrink-0 text-[#4d5761]" />
                  </div>
                  <div className="mt-3">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={scene.tab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {scene.tab === '필터형' ? <FilterTemplate /> : <BonusTemplate />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <span
                    className={`absolute bottom-5 right-5 flex h-[38px] w-[76px] items-center justify-center rounded-[6px] text-[14px] font-semibold text-white transition-[background-color,scale] duration-100 ${
                      scene.down && scene.cursor === AT_RUN ? 'scale-[0.95] bg-[#00265f]' : 'bg-[#0042b7]'
                    }`}
                  >
                    실행
                  </span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 -bottom-5 flex justify-center">
          <AnimatePresence>
            {scene.toast && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex h-11 items-center whitespace-nowrap rounded-[8px] bg-[#292c30] px-5 text-[14px] font-medium text-white shadow-[0_8px_20px_-6px_rgba(13,82,140,0.5)]"
              >
                자동평가 실행이 완료되었습니다.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 데모 커서. 다른 목업(Hero2FormBuilderMockup)과 같은 꼴이다. */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-20 transition-[left,top,opacity] duration-[600ms] ease-in-out"
          style={{
            left: scene.cursor.x,
            top: scene.cursor.y,
            opacity: scene.cursorShown ? 1 : 0,
            transitionDuration: scene.cursor === AT_START ? '0ms, 0ms, 250ms' : undefined,
          }}
        >
          <span
            className={`block size-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#4d5761]/70 shadow-[0_2px_10px_rgba(10,17,40,0.3)] transition-transform duration-150 ${
              scene.down ? 'scale-[0.7]' : ''
            }`}
          />
        </div>
      </div>
    </div>
  )
}
