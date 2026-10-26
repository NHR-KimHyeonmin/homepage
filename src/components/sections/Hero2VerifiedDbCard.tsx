import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import iconChevron from '../../assets/sections/hero2-db-og-mobile/icon-chevron.svg'
import logoUnivcert from '../../assets/sections/hero2-db-og-mobile/logo-univcert.png'
import logoYbm from '../../assets/sections/hero2-db-og-mobile/logo-ybm.png'
import { useSequence, useTyped } from '../../hooks/useStepSequence'
import { cardSkin } from '../../lib/cardTheme'

/**
 * "검증된 DB 기반 지원서" 카드.
 *
 * 전에는 두 로고가 왼쪽에 나란히 붙어 있고 오른쪽에 입력 카드 두 장이
 * 떨어져 있어서, 어느 로고가 어느 칸을 채우는지도, 애초에 무슨 기능인지도
 * 읽히지 않았다. 그래서 출처를 각 입력 카드 바로 위에 세로로 세우고 점선
 * 으로 묶은 다음, 섹션에 들어오면 "조회 → 목록 → 선택" 순서를 실제로
 * 재생한다 — 지원자가 손으로 적는 게 아니라 DB에서 골라 담는다는 게
 * 움직임으로 보여야 설명문을 안 읽어도 전달된다.
 */
interface DbField {
  label: string
  /**
   * select 는 DB 가 내려 준 목록에서 고르는 칸(첫 항목이 고르는 값),
   * type 은 지원자가 직접 적는 칸이다. 점수·주전공처럼 목록이 길거나
   * 자유 입력인 칸은 목록을 열면 아래 카드에 가려지기도 하고, 애초에
   * 고르는 동작이 아니라 적는 동작이라 타이핑으로 보여 준다.
   */
  kind: 'select' | 'type'
  options: string[]
  chip?: string
}

interface DbSource {
  logo: string
  alt: string
  source: string
  note: string
  title: string
  fields: [DbField, DbField]
}

const SOURCES: DbSource[] = [
  {
    logo: logoYbm,
    alt: 'YBM',
    source: 'YBM 어학성적',
    note: '응시 이력을 그대로 불러옵니다',
    title: '외국어시험',
    fields: [
      { label: '시험명', kind: 'select', options: ['TOEIC', 'TOEIC Speaking', 'TEPS'] },
      { label: '점수', kind: 'type', options: ['880'] },
    ],
  },
  {
    logo: logoUnivcert,
    alt: '대학알리미',
    source: '대학알리미 학교 · 학과',
    note: '실제 개설된 학과만 고를 수 있습니다',
    title: '대학교',
    fields: [
      { label: '학교명', kind: 'select', options: ['서울대학교', '서울과학기술대학교', '서울시립대학교'], chip: '본교' },
      { label: '주전공', kind: 'type', options: ['경영학과'] },
    ],
  },
]

/**
 * 한 칸씩 넘어가는 연출의 단계. 두 열이 각자 처음부터 끝까지 도는 게 아니라,
 * **먼저 두 출처를 다 세우고 나서** 입력이 차례로 들어간다.
 *
 *   1 YBM 칩 → 2 YBM 점선 → 3 대학알리미 칩 → 4 대학알리미 점선
 *   → 5 시험명 목록 → 6 시험명 선택 → 7 점수 입력 → 8 점수 완료
 *   → 9 학교명 목록 → 10 학교명 선택 → 11 주전공 입력 → 12 주전공 완료
 *
 * 출처 둘을 먼저 깔아 두는 편이 "어느 DB 가 무엇을 채우는가" 라는 구도를
 * 먼저 보여 준다. 한 열씩 끝내고 넘어가면 오른쪽 열은 한참 비어 있어서,
 * 왼쪽이 다 끝날 때까지 그 자리가 무엇인지 알 수 없다.
 */
const STEP_DELAYS = [260, 420, 300, 420, 520, 1100, 520, 1100, 520, 1100, 520, 1100]

/** 각 열이 쓰는 단계 번호. 위 주석의 순서를 그대로 옮긴 것이다. */
interface ColumnSteps {
  chip: number
  line: number
  /** [목록 열림, 고르기 완료] */
  first: [number, number]
  /** [입력 시작, 입력 완료] */
  second: [number, number]
}

const COLUMN_STEPS: ColumnSteps[] = [
  { chip: 1, line: 2, first: [5, 6], second: [7, 8] },
  { chip: 3, line: 4, first: [9, 10], second: [11, 12] },
]

function Field({ field, busy, done }: { field: DbField; busy: boolean; done: boolean }) {
  const value = field.options[0]
  const typing = field.kind === 'type'
  const typedCount = useTyped(value, typing && busy, typing && done)
  const shown = typing ? value.slice(0, typedCount) : value

  return (
    <div className="relative">
      <span className="absolute -top-[9px] left-[14px] z-10 bg-white px-1 text-[10px] leading-[17px] text-[#6c737f]">
        {field.label}
        <span className="text-primary"> *</span>
      </span>

      <div
        className={clsx(
          'flex h-9 items-center justify-between rounded-chip border px-2.5 transition-colors duration-300',
          busy || done ? 'border-primary' : 'border-[#d2d6db]',
        )}
      >
        <span className="flex items-center gap-1.5 text-sm">
          <span
            className={clsx(
              'text-[#212121] transition-opacity duration-300',
              typing || done ? 'opacity-100' : 'opacity-0',
            )}
          >
            {shown}
          </span>
          {/* 적는 중에만 깜빡이는 커서 */}
          {typing && busy && !done && (
            <span className="inline-block h-[15px] w-px bg-primary [animation:hero1-cursor-blink_1s_steps(1,end)_infinite]" />
          )}
          {field.chip && (
            <span
              className={clsx(
                'rounded-full bg-primary-lightest px-1.5 py-0.5 text-[9px] font-medium text-primary transition-opacity duration-300',
                done ? 'opacity-100' : 'opacity-0',
              )}
            >
              {field.chip}
            </span>
          )}
        </span>
        {/* 직접 적는 칸에는 펼침 화살표가 없다. */}
        {!typing && (
          <img
            loading="lazy"
            decoding="async"
            src={iconChevron}
            alt=""
            className={clsx('size-5 transition-transform duration-300', busy && 'rotate-180')}
          />
        )}
      </div>

      {/* DB 가 내려 준 후보 목록. 자리를 차지하지 않고 떠 있다. */}
      {!typing && (
        <div
          className={clsx(
            'absolute left-0 right-0 top-[38px] z-20 overflow-hidden rounded-chip border border-[#e5e7eb] bg-white shadow-[0_6px_18px_rgba(15,26,61,0.12)] transition-all duration-200',
            busy ? 'opacity-100' : 'pointer-events-none -translate-y-1 opacity-0',
          )}
        >
          {field.options.map((option, index) => (
            <p
              key={option}
              className={clsx(
                'px-2.5 py-1.5 text-[13px] leading-[19px] transition-colors duration-200',
                index === 0 ? 'bg-primary-lightest font-medium text-primary' : 'text-[#6c737f]',
              )}
            >
              {option}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

/** 단계 진행은 카드 하나가 통째로 쥔다 — 두 열이 번갈아 움직여야 해서
 *  열이 각자 타이머를 굴리면 순서를 맞출 수 없다. */
function SourceColumn({ source, steps, step }: { source: DbSource; steps: ColumnSteps; step: number }) {
  return (
    <div className="flex w-full flex-col items-center md:max-w-[440px]">
      {/* 출처 칩 — 어느 DB 가 이 칸을 채우는지 바로 위에 둔다. */}
      <div
        className={clsx(
          'flex items-center gap-4 rounded-full border border-[#e5e7eb] bg-white py-2 pl-3.5 pr-4 shadow-[0_2px_8px_rgba(15,26,61,0.07)] transition-all duration-500',
          step >= steps.chip ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        )}
      >
        <img loading="lazy" decoding="async" src={source.logo} alt={source.alt} className="h-5 w-auto shrink-0" />
        <span className="flex flex-col">
          <span className="text-[13px] font-semibold leading-[18px] text-[#212121]">{source.source}</span>
          <span className="text-[11px] leading-[15px] text-black/40">{source.note}</span>
        </span>
      </div>

      {/* 점선 연결. 위에서 아래로 그어지며 출처와 입력칸을 한 덩어리로 묶는다. */}
      <span
        className={clsx(
          'h-6 w-px origin-top transition-transform duration-500',
          step >= steps.line ? 'scale-y-100' : 'scale-y-0',
        )}
        style={{ backgroundImage: 'linear-gradient(to bottom, #3379f3 50%, transparent 50%)', backgroundSize: '1px 6px' }}
      />

      <div className="w-full max-w-[440px] overflow-visible rounded-ui bg-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.08)]">
        <div className="rounded-t-ui bg-[#f9fafb] px-4 py-2.5">
          <p className="text-base text-[#212121]">{source.title}</p>
        </div>
        <div className="flex flex-col gap-3.5 px-4 pb-4 pt-3.5">
          <Field field={source.fields[0]} busy={step === steps.first[0]} done={step >= steps.first[1]} />
          <Field field={source.fields[1]} busy={step === steps.second[0]} done={step >= steps.second[1]} />
        </div>
      </div>
    </div>
  )
}

export function Hero2VerifiedDbCard() {
  const skin = cardSkin('db')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const reduceMotion = useReducedMotion()
  const step = useSequence(STEP_DELAYS, inView, 0, !!reduceMotion)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex w-full flex-col gap-8 rounded-card p-8"
      style={skin.style}
    >
      <div className="flex flex-col gap-3">
        <h3 className={clsx('text-[32px] font-bold leading-[1.2] tracking-[-0.64px]', skin.title)}>
          검증된 DB 기반 지원서
        </h3>
        <p className={clsx('text-[18px] leading-[1.45] tracking-[-0.08px]', skin.body)}>
          인증된 학교·학과명, 어학성적 데이터를 제공하여, 표기 차이 없이 정확한 지원자 정보를 수집할 수 있습니다.
        </p>
      </div>

      {/* 두 열을 폭에 맞춰 늘리지 않고 가운데로 모은다 — 늘리면 카드는
          제자리인데 사이만 벌어져 한 덩어리로 안 읽힌다. */}
      <div
        className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-14"
      >
        {SOURCES.map((source, index) => (
          <SourceColumn key={source.source} source={source} steps={COLUMN_STEPS[index]} step={step} />
        ))}
      </div>
    </motion.div>
  )
}
