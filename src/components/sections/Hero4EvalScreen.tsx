import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { useSequence } from '../../hooks/useStepSequence'
import { POINTER_SKIN } from '../../lib/demoCursor'
import {
  IconCake,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconFileText,
  IconHash,
  IconInfoCircle,
  IconLayoutColumns,
  IconLayoutGrid,
  IconMail,
  IconMinus,
  IconMoodNeutral,
  IconMoodSad,
  IconMoodSmile,
  IconNote,
  IconPhone,
  IconPlus,
  IconRefresh,
  IconSparkles,
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react'
import photoApplicant from '../../assets/sections/hero4-eval/photo-applicant.png'
import { useFitScale } from '../../hooks/useFitScale'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

/**
 * 평가 화면 한 장을 DOM 으로 그린 것 — 왼쪽 지원서(Basic 뷰), 가운데 평가
 * 입력, 오른쪽 지원자 목록.
 *
 * 스크린샷을 쓰지 않는 이유는 이 페이지의 다른 관리자 화면과 같다. 원본이
 * 1900px 안팎인데 본문 단 폭으로 띄우면 고해상도 화면에서 2배율 픽셀이
 * 모자라 글자가 뿌옇게 풀린다. 설계 좌표를 원본과 같게 두고 보여 줄 폭에
 * 맞춰 통째로 줄인다.
 */
const W = 1902

/**
 * 서류 접수의 양식 편집기(1280x710)와 같은 비율이다 — 두 구간의 주인공
 * 그림이 폭도 비율도 같아야 페이지를 내려올 때 같은 크기의 판이 이어진다.
 *
 * 원본 스크린샷보다 깊어진 만큼은 문서가 더 보이는 데 쓴다. 지원서는 원래
 * 스크롤되는 긴 글이라, 아래가 창에 잘려 있는 편이 맞다.
 */
const H = Math.round((W * 710) / 1280)

/** 세 칸의 폭. 합이 W 다. */
const DOC = 1268
const PANEL = 444
const RAIL = W - DOC - PANEL

/**
 * 서류 접수 구간의 양식 편집기와 같은 그림자. y=0 이라 사방으로 고르게
 * 번지고, 퍼짐은 음수 spread 로 조인다.
 *
 * 카드가 아니라 바깥 래퍼에 건다. 카드는 설계 폭 그대로 두고 scale 로
 * 줄이는 구조라 넘치는 부분을 래퍼가 잘라내는데, 카드에 그림자를 걸면 그
 * 잘림에 같이 걸려 사라진다. 쉼표로 여러 겹을 넣으므로 Tailwind 임의값이
 * 아니라 인라인 style 로 줘야 한다.
 */
const CARD_SHADOW = [
  '0 0 80px -18px rgba(116, 173, 231, 0.5)',
  '0 0 34px -8px rgba(120, 191, 226, 0.38)',
  '0 0 12px 0 rgba(129, 166, 207, 0.16)',
].join(', ')

/**
 * 아이콘은 Tabler 한 벌로만 쓴다 — 직접 그린 path 는 굵기도 꼭짓점 처리도
 * 제각각이라, 한 화면에 여러 손글씨가 섞인 꼴이 된다.
 *
 * 굵기 1.8 은 Tabler 기본(2)보다 한 단계 얇다. 이 목업은 설계 폭 1902 를
 * 본문 단 폭으로 줄여 그리므로 선이 그만큼 두꺼워 보인다 — 기본값으로 두면
 * 작은 아이콘이 뭉개진다.
 */
const STROKE = 1.8

const P = {
  chevron: IconChevronDown,
  plus: IconPlus,
  minus: IconMinus,
  refresh: IconRefresh,
  check: IconCheck,
  info: IconInfoCircle,
  doc: IconFileText,
  grid: IconLayoutGrid,
  compare: IconLayoutColumns,
  spark: IconSparkles,
  memo: IconNote,
  hash: IconHash,
  phone: IconPhone,
  mail: IconMail,
  cake: IconCake,
}

/**
 * Basic 뷰의 카드 한 장 — 회색 머리띠에 제목, 그 아래 흰 본문.
 *
 * 인적정보 카드는 제목 없이 띠만 둔다. 사진이 그 띠를 타고 올라앉는 자리라,
 * 글자가 있으면 사진이 글자를 덮는다.
 */
function DocCard({ title, bandHeight, children }: { title?: string; bandHeight?: number; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[#e4e7ea] bg-white">
      {(title || bandHeight) && (
        <div className="absolute inset-x-0 top-0 bg-[#edeff2]" style={{ height: bandHeight ?? 52 }} />
      )}
      {title && (
        <div className="relative flex h-[52px] items-center px-6 text-[18px] font-semibold text-ink">{title}</div>
      )}
      <div className="relative">{children}</div>
    </div>
  )
}

/** 값 한 칸: 작은 회색 이름표 위, 값 아래. Basic 뷰는 표가 아니라 이 꼴이다. */
function Field({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[15px] text-[#8b919a]">{label}</p>
      <p className="mt-1.5 text-[18px] text-ink">{value}</p>
    </div>
  )
}

/** 요약정보 막대그래프의 가로축. */
const YEARS = Array.from({ length: 15 }, (_, i) => 2013 + i)
const AXIS_W = 1100
const at = (year: number) => ((year - 2013) * AXIS_W) / 14

function Bar({
  from,
  to,
  height,
  color,
  chip,
  chipColor,
  label,
  above,
}: {
  from: number
  to: number
  height: number
  color: string
  chip: string
  chipColor: string
  label: string
  /** 막대가 좁아 글자가 안 들어가는 경우(경력). 이름을 칩 위쪽에 따로 올린다. */
  above?: boolean
}) {
  return (
    <div className="absolute bottom-0" style={{ left: at(from), width: at(to) - at(from) }}>
      <div className="absolute bottom-full left-0 flex items-center whitespace-nowrap pb-1.5 text-[16px] text-ink">
        {above && <span className="absolute bottom-full right-0 pb-1">{label}</span>}
        <span
          className="rounded-[4px] px-1.5 py-[2px] text-[15px] font-semibold text-white"
          style={{ backgroundColor: chipColor }}
        >
          {chip}
        </span>
        {!above && <span className="ml-2">{label}</span>}
      </div>
      <div style={{ height, backgroundColor: color }} />
    </div>
  )
}

function Toggle() {
  return (
    <span className="flex h-[20px] w-[36px] items-center rounded-full bg-[#dcdfe4] px-[2px]">
      <span className="size-[16px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
    </span>
  )
}

const RAIL_GROUPS = [
  {
    title: '6월 1일 오전 (7명)',
    people: [
      { name: '김민재', dot: '#22c55e', on: true },
      { name: '김민준', dot: '#c8ccd2' },
      { name: '김윤서', dot: '#f87171' },
      { name: '이서현', dot: '#f87171' },
      { name: '조유빈', dot: '#c8ccd2' },
      { name: '조유준', dot: '#f87171' },
      { name: '한민지', dot: '#f87171' },
    ],
  },
  {
    title: '6월 1일 오후 (3명)',
    people: [
      { name: '박세훈', dot: '#c8ccd2' },
      { name: '서지현', dot: '#f87171' },
      { name: '오준혁', dot: '#f87171' },
    ],
  },
]

const GRADES = [
  { label: '적극추천', Face: IconMoodSmile, on: true },
  { label: '심사보류', Face: IconMoodNeutral },
  { label: '기준미달', Face: IconMoodSad },
]

const CONTACT = [
  { Icon: P.phone, text: '010-1234-5678' },
  { Icon: P.mail, text: 'careerlink006@careerlink.kr' },
  { Icon: P.cake, text: '1997.05.30 (만 29세)' },
]

const TABS = ['평가내용', '과거 지원 이력', '전체 평가자 결과']

/**
 * 손가락 시늉이 밟는 순서. 탭을 하나씩 눌러 보이는 것이 전부라, 각 칸은
 * "어디로 가는가(at)" 와 "거기서 누르는가(press)" 두 가지만 들고 있다.
 *
 * hold 는 그 칸이 켜진 뒤 다음까지 기다리는 ms 다. 누른 직후는 짧게, 내용이
 * 바뀐 뒤는 길게 — 바뀐 화면을 읽을 틈이 있어야 누른 보람이 있다.
 *
 * 평가내용은 들어오자마자 보이는 첫 화면이라 누르지 않고, 과거 지원 이력
 * 부터 시작한다. 이미 보고 있는 것을 다시 누르는 건 아무 말도 하지 않는다.
 */
type DemoFrame = { at: string; press?: boolean; set?: { panel?: number; tab?: number }; hold: number }

const DEMO: DemoFrame[] = [
  { at: 'tab1', hold: 700 },
  { at: 'tab1', press: true, set: { tab: 1 }, hold: 1500 },
  { at: 'tab2', hold: 480 },
  { at: 'tab2', press: true, set: { tab: 2 }, hold: 1700 },
  { at: 'stats', hold: 480 },
  { at: 'stats', press: true, set: { panel: 1 }, hold: 1900 },
  { at: 'eval', hold: 480 },
  { at: 'eval', press: true, set: { panel: 0, tab: 0 }, hold: 800 },
]

/** useSequence 는 모듈 상수 배열을 받아야 한다 — 렌더마다 새로 만들면
 *  타이머가 다시 깔려 연출이 처음으로 되감긴다. */
const DEMO_DELAYS = DEMO.map((frame) => frame.hold)

const FITS = ['우수', '보통', '미흡']

/** 별점으로 매기는 항목. 별 하나가 2점이라 다섯 개면 만점 10점이다. */
const STARS = [
  { label: '성실성', filled: 3 },
  { label: '전문성', filled: 4 },
]

/** 이 지원자가 받은 평가 건수. 아래 통계가 전부 이 수를 바탕으로 한다. */
const REVIEW_COUNT = 2

const STAT_MAX = 10
const STAT_TICKS = [0, 2, 4, 6, 8, 10]
const MINE = '#1d4ed8'
const ALL = '#2e9e4f'

/** 항목별 평균 — 내가 준 점수와 전체 평가자 평균을 나란히 둔다. */
const AVERAGES = [
  { label: '직무적합도', mine: 10, all: 7.5 },
  { label: '성실성', mine: 6, all: 7 },
  { label: '전문성', mine: 8, all: 6.5 },
]

/** 등급별 비율. 개수는 받은 평가 2건을 나눠 가진다. */
const RATIOS = [
  {
    label: '직무적합도',
    rows: [
      { grade: '우수', count: 1, mine: '50%', all: '40%' },
      { grade: '보통', count: 1, mine: '50%', all: '40%' },
      { grade: '미흡', count: 0, mine: '0%', all: '20%' },
    ],
  },
  {
    label: '성실성',
    rows: [
      { grade: '우수', count: 0, mine: '0%', all: '28%' },
      { grade: '보통', count: 2, mine: '100%', all: '52%' },
      { grade: '미흡', count: 0, mine: '0%', all: '20%' },
    ],
  },
  {
    label: '전문성',
    rows: [
      { grade: '우수', count: 1, mine: '50%', all: '35%' },
      { grade: '보통', count: 1, mine: '50%', all: '45%' },
      { grade: '미흡', count: 0, mine: '0%', all: '20%' },
    ],
  },
]

/** 직무적합도 10 + 별점 두 항목 = 30점 만점. */
const TOTAL = 10 + STARS.length * 10
const SCORED = 10 + STARS.reduce((sum, row) => sum + row.filled * 2, 0)

/** 같은 지원자가 전에 넣었던 공고. */
const HISTORY = [
  {
    date: '2026.05.29',
    title: '커리어링크 UX·UI 디자이너 경력 채용',
    path: '커리어링크 > UX/UI디자인',
    stage: '최종결과',
    result: '불합격',
  },
  {
    date: '2026.04.28',
    title: '2026 상반기 신입 공개채용',
    path: '커리어링크 개발 > IT개발',
    stage: '서류전형',
  },
]

/** 같은 지원자를 본 다른 평가자들의 결과. */
const REVIEWS = [
  {
    name: '박준영',
    grade: '적극추천',
    at: '2026/06/24 14:44:23',
    fit: 0,
    score: 10,
    note: null,
    tags: [],
  },
  {
    name: '정태호',
    grade: '적극추천',
    at: '2026/06/24 14:41:37',
    fit: 1,
    score: 5,
    note: ['-개발 경험이 있으나 짧음', '-My SQL 사용 경험이 있음', '-유창한 영어 실력'],
    tags: ['영어', '유학', 'LLM에 관심 있음'],
  },
]

const MAJOR = [
  { label: '주전공', value: 'AI·컴퓨터공학과' },
  { label: '학교소재지', value: '서울' },
  { label: '학점', value: '4.32/4.5' },
  { label: '본/분교', value: '본교' },
]

/** 직무적합도 한 줄과 총점 — 평가내용 탭과 평가자별 결과가 같이 쓴다. */
function FitBlock({
  fit,
  score,
  sum = score,
  total = 10,
  stars,
}: {
  fit: number
  /** 직무적합도 한 항목의 점수. */
  score: number
  /** 모든 항목을 더한 점수. 별점 항목이 없으면 score 와 같다. */
  sum?: number
  total?: number
  stars?: typeof STARS
}) {
  return (
    <>
      <p className="text-[16px] font-semibold text-ink">직무적합도</p>
      <div className="mt-2.5 flex items-center gap-3">
        <div className="flex flex-1 overflow-hidden rounded-[6px] border border-[#cfd4da] text-[16px]">
          {FITS.map((label, index) => (
            <span
              key={label}
              className={clsx(
                'flex-1 py-[8px] text-center',
                index > 0 && 'border-l border-[#cfd4da]',
                index === fit ? 'bg-[#1d4ed8] font-semibold text-white' : 'text-[#4d5761]',
              )}
            >
              {label}
            </span>
          ))}
        </div>
        <span className="w-[28px] text-right text-[18px] font-bold text-[#1d4ed8]">{score}</span>
      </div>

      {stars?.map((row) => (
        <div key={row.label} className="mt-4 flex items-center gap-3">
          <p className="flex-1 text-[16px] font-semibold text-ink">{row.label}</p>
          <span className="flex gap-[3px] text-[#f5a623]">
            {Array.from({ length: 5 }, (_, index) =>
              index < row.filled ? (
                <IconStarFilled key={index} size={20} />
              ) : (
                <IconStar key={index} size={20} stroke={STROKE} className="text-[#d6dade]" />
              ),
            )}
          </span>
          <span className="w-[28px] text-right text-[18px] font-bold text-[#1d4ed8]">{row.filled * 2}</span>
        </div>
      ))}

      <div className="mt-4 flex items-center justify-between border-b border-[#eceef1] pb-3 text-[16px]">
        <span className="font-semibold text-ink">총점</span>
        <span className="text-[18px] font-bold text-[#1d4ed8]">
          {sum} / {total}
        </span>
      </div>
    </>
  )
}

function EvalTab() {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="rounded-[5px] bg-[#e7effc] px-2.5 py-[4px] text-[15px] font-medium text-[#1d4ed8]">
          6월 1일 오전
        </span>
        <span className="text-[19px] font-bold text-ink">김민재</span>
      </div>

      <span className="flex items-center gap-2 text-[15px] text-[#4d5761]">
        <P.info size={16} stroke={STROKE} className="text-[#9aa3af]" />
        서류평가 기준
      </span>

      <div className="flex flex-col rounded-[10px] border border-[#e4e7ea] p-5">
        <FitBlock fit={0} score={10} sum={SCORED} total={TOTAL} stars={STARS} />

        <p className="mt-4 text-[16px] font-semibold text-ink">총평</p>
        <div className="mt-2.5 rounded-[6px] border border-[#dfe3e8] p-3 text-[15px] leading-[1.5] text-ink">
          직무 관련 프로젝트 경험이 구체적이고 맡은 역할과 사용 기술이 분명하게
          드러납니다. 협업 이력도 충분해, 면접에서 문제 해결 과정을 한 번 더
          확인하면 좋겠습니다.
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-[10px] border border-[#e4e7ea] p-4">
        <p className="text-[16px] font-semibold text-ink">최종 등급</p>
        <div className="flex flex-1 justify-end gap-2">
          {GRADES.map((grade) => (
            <span
              key={grade.label}
              className={`flex w-[66px] flex-col items-center gap-1 rounded-[8px] border py-2 text-[14px] ${
                grade.on
                  ? 'border-[#34a853] bg-[#f3fbf5] font-semibold text-[#1f7a3d]'
                  : 'border-[#dfe3e8] text-[#6c737f]'
              }`}
            >
              <grade.Face size={22} stroke={STROKE} />
              {grade.label}
            </span>
          ))}
        </div>
      </div>

      <span className="flex items-center gap-2 text-[15px] text-[#4d5761]">
        <P.info size={16} stroke={STROKE} className="text-[#9aa3af]" />
        다른 평가자와 공유하고 싶은 내용을 입력해 주세요. (선택)
      </span>

      <div className="rounded-[10px] border border-[#e4e7ea] p-4">
        <div className="flex items-center gap-2.5 border-b border-[#dfe3e8] pb-2.5 text-[16px] text-[#b3b9c2]">
          <P.hash size={18} stroke={STROKE} className="text-[#4d5761]" />
          태그
        </div>
        <div className="mt-3 flex gap-2 text-[14px] text-[#4d5761]">
          <span className="rounded-full border border-[#dfe3e8] px-3 py-[4px]">영어</span>
          <span className="rounded-full border border-[#dfe3e8] px-3 py-[4px]">유학</span>
          <span className="rounded-full border border-[#dfe3e8] px-3 py-[4px]">LLM에 관심 있음</span>
        </div>
      </div>

      <span className="mt-auto flex h-[50px] items-center justify-center gap-2.5 rounded-[8px] bg-[#1b3f9e] text-[18px] font-semibold text-white">
        <P.check size={19} stroke={STROKE} />
        평가완료
      </span>
    </>
  )
}

/** 가로 막대 한 줄. 길이는 10점 만점에 대한 비율이다. */
function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="flex h-[22px] min-w-[26px] items-center justify-center rounded-r-[2px] text-[13px] font-bold text-white"
      style={{ width: `${(value / STAT_MAX) * 100}%`, backgroundColor: color }}
    >
      {value}
    </div>
  )
}

/** "평가 통계" 탭 — 이 지원자가 항목마다 몇 점을 받았는지, 등급이 어떻게
 *  갈렸는지. 내 점수만 보면 후하게 줬는지 박하게 줬는지를 알 수 없어
 *  전체 평균을 늘 옆에 세운다. */
function StatsPanel() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[15px] text-[#4d5761]">
          <P.info size={16} stroke={STROKE} className="text-[#9aa3af]" />
          평균 점수
        </span>
        <span className="text-[14px] text-[#9aa3af]">받은 평가 {REVIEW_COUNT}개</span>
      </div>

      <div className="rounded-[10px] border border-[#e4e7ea] p-4">
        {AVERAGES.map((item) => (
          <div key={item.label} className="flex items-center">
            <span className="w-[86px] shrink-0 pr-2.5 text-right text-[14px] text-ink">{item.label}</span>
            <div className="flex flex-1 flex-col gap-1 border-l border-[#d6dade] py-2.5">
              <StatBar value={item.mine} color={MINE} />
              <StatBar value={item.all} color={ALL} />
            </div>
          </div>
        ))}

        <div className="flex">
          <span className="w-[86px] shrink-0" />
          <div className="relative h-[28px] flex-1 border-t border-[#d6dade] text-[13px] text-[#6c737f]">
            {STAT_TICKS.map((tick) => (
              <span
                key={tick}
                className="absolute top-0 -translate-x-1/2 pt-1.5"
                style={{ left: `${(tick / STAT_MAX) * 100}%` }}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-5 text-[14px] text-ink">
          <span className="flex items-center gap-1.5">
            <span className="size-[9px] rounded-full" style={{ backgroundColor: MINE }} />
            내 점수
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-[9px] rounded-full" style={{ backgroundColor: ALL }} />
            전체 점수
          </span>
        </div>
      </div>

      <span className="flex items-center gap-2 text-[15px] text-[#4d5761]">
        <P.info size={16} stroke={STROKE} className="text-[#9aa3af]" />
        등급별 비율
      </span>

      <div className="overflow-hidden rounded-[8px] border border-[#d6dade] text-[14px]">
        <div className="flex bg-[#1b3f9e] font-semibold text-white">
          {['항목', '등급', '개수', '내 비율', '전체 비율'].map((head) => (
            <span key={head} className="flex-1 py-[9px] text-center">
              {head}
            </span>
          ))}
        </div>
        {RATIOS.map((group) => (
          <div key={group.label} className="flex border-t border-[#d6dade]">
            {/* 항목 이름은 세 줄을 묶는 칸이라 한가운데 한 번만 적는다. */}
            <span className="flex flex-1 items-center justify-center border-r border-[#e4e7ea] px-1 text-center text-ink">
              {group.label}
            </span>
            <div className="flex flex-[4] flex-col">
              {group.rows.map((row, index) => (
                <div
                  key={row.grade}
                  className={clsx('flex', index > 0 && 'border-t border-[#e4e7ea]')}
                >
                  <span className="flex-1 py-[9px] text-center text-ink">{row.grade}</span>
                  <span className="flex-1 py-[9px] text-center font-semibold text-[#1d4ed8]">{row.count}</span>
                  <span className="flex-1 bg-[#eef4fe] py-[9px] text-center text-ink">{row.mine}</span>
                  <span className="flex-1 bg-[#eefaf0] py-[9px] text-center text-ink">{row.all}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function HistoryTab() {
  return (
    <>
      <span className="flex items-center gap-2 text-[15px] text-[#4d5761]">
        <P.info size={16} stroke={STROKE} className="text-[#9aa3af]" />
        과거 지원 이력이 <b className="font-bold text-ink">{HISTORY.length}회</b> 있습니다.
      </span>

      {HISTORY.map((item) => (
        <div key={item.date} className="flex gap-3 rounded-[10px] border border-[#e4e7ea] p-4">
          <div className="flex-1">
            <p className="text-[14px] text-[#9aa3af]">지원일 : {item.date}</p>
            <p className="mt-2 text-[17px] font-medium text-ink">{item.title}</p>
            <p className="mt-1.5 text-[15px] text-[#4d5761]">{item.path}</p>
          </div>
          <div className="flex w-[104px] shrink-0 flex-col items-center justify-center gap-2">
            <p className="text-[15px] font-semibold text-ink">{item.stage}</p>
            {item.result && (
              <span className="rounded-full bg-[#fdecec] px-3 py-[3px] text-[14px] font-medium text-[#d93b3b]">
                {item.result}
              </span>
            )}
            <span className="rounded-[6px] border border-[#cfd4da] px-3 py-[5px] text-[14px] text-[#4d5761]">
              지원서 비교
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

function ResultsTab() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[15px] text-[#4d5761]">
          <P.info size={16} stroke={STROKE} className="text-[#9aa3af]" />
          전체 평균 : <b className="font-bold text-ink">7.5</b>
        </span>
        <span className="flex items-center gap-1.5 rounded-[6px] border border-[#cfd4da] px-3 py-[6px] text-[14px] text-[#4d5761]">
          다른 전형 결과 보기
          <IconChevronUp size={15} stroke={STROKE} />
        </span>
      </div>

      {REVIEWS.map((review) => (
        <div key={review.name} className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold text-ink">{review.name}</span>
            <span className="rounded-full bg-[#eaf7ee] px-2.5 py-[3px] text-[13px] font-medium text-[#1f7a3d]">
              {review.grade}
            </span>
            <span className="ml-auto text-[14px] text-[#9aa3af]">{review.at}</span>
            <IconChevronUp size={16} stroke={STROKE} className="text-[#9aa3af]" />
          </div>

          <div className="rounded-[10px] border border-[#e4e7ea] p-4">
            <FitBlock fit={review.fit} score={review.score} />

            <p className="mt-4 text-[16px] font-semibold text-ink">총평</p>
            {review.note ? (
              <div className="mt-2 flex flex-col gap-1 text-[15px] text-[#1d4ed8]">
                {review.note.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[15px] italic text-[#b3b9c2]">미입력</p>
            )}

            {review.tags.length > 0 && (
              <div className="mt-3 flex gap-2 text-[14px] text-[#4d5761]">
                {review.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#dfe3e8] px-3 py-[4px]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

export function Hero4EvalScreen() {
  const { ref, scale } = useFitScale(W)
  const reduceMotion = useReducedMotion()
  /** 사람이 고른 칸. 연출이 도는 동안은 쓰이지 않는다. */
  const [picked, setPicked] = useState({ panel: 0, tab: 0 })
  /** 사람이 직접 누르면 연출은 거기서 손을 뗀다 — 읽는 중에 화면이
   *  바뀌어 버리면 보여 주려던 것이 오히려 안 보인다. */
  const [held, setHeld] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.4 })
  const step = useSequence(DEMO_DELAYS, inView && !reduceMotion && !held)
  const frame = step > 0 && step <= DEMO.length ? DEMO[step - 1] : null
  const demoLive = !held && step > 0 && step < DEMO.length
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null)

  /** 섹션을 벗어나면 손을 뗀 기록도 지운다 — 다시 들어왔을 때 연출이
   *  처음부터 돌아야 해서다(useSequence 도 같은 자리에서 0 으로 되감긴다). */
  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect -- 화면 밖으로 나갔다는 외부 사건에 맞추는 일이다
    if (!inView) setHeld(false)
  }, [inView])

  /** 지금까지 연출이 누른 것들을 겹쳐 올린 상태. */
  const played = DEMO.slice(0, step).reduce(
    (state, item) => ({ ...state, ...item.set }),
    { panel: 0, tab: 0 },
  )
  const { panel, tab } = held ? picked : played

  /** 커서가 갈 자리를 단계마다 실측한다. 무대에 scale 이 걸려 있으므로
   *  화면 px 을 설계 px 로 되돌려야 absolute 좌표와 맞는다. */
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || !frame) return
    const base = stage.getBoundingClientRect()
    if (!base.width) return
    const target = stage.querySelector(`[data-demo="${frame.at}"]`)
    if (!target) return
    const rect = target.getBoundingClientRect()
    const k = W / base.width
    setSpot({
      x: (rect.left - base.left + rect.width / 2) * k,
      y: (rect.top - base.top + rect.height / 2) * k,
    })
  }, [frame])

  return (
    <Section className="bg-surface-page pb-12 pt-6 md:pb-24 md:pt-16">
      <Container>
        <div
          ref={ref}
          className="w-full overflow-hidden rounded-card"
          style={{ height: H * scale, boxShadow: CARD_SHADOW }}
        >
          <div
            ref={stageRef}
            data-eval-screen
            className="relative overflow-hidden rounded-card border border-[#e1e4e8] bg-white font-sans"
            style={{
              width: W,
              height: H,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              cursor: POINTER_SKIN,
            }}
          >
            <div className="flex h-full">
              {/* ── 왼쪽: 지원서(Basic 뷰) ─────────────────────────── */}
              <div className="flex flex-col" style={{ width: DOC }}>
                <div className="flex h-[60px] shrink-0 items-center gap-3 border-b border-[#e8eaed] px-4 text-[#4d5761]">
                  <span className="flex size-[30px] items-center justify-center rounded-[6px] border border-[#1d4ed8] text-[#1d4ed8]">
                    <P.doc size={18} stroke={STROKE} />
                  </span>
                  <span className="flex size-[30px] items-center justify-center rounded-[6px] border border-[#e1e4e8]">
                    <P.grid size={18} stroke={STROKE} />
                  </span>
                  <span className="flex size-[30px] items-center justify-center rounded-[6px] border border-[#e1e4e8]">
                    <P.compare size={18} stroke={STROKE} />
                  </span>
                  <span className="ml-1 flex items-center rounded-[7px] bg-[#f1f3f5] p-[3px] text-[16px]">
                    <span className="rounded-[5px] border border-[#d6dade] bg-white px-3.5 py-[4px] font-semibold text-ink">
                      Basic
                    </span>
                    <span className="px-3.5 py-[4px] text-[#6c737f]">Retro</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[16px] text-[#6c737f]">
                    <P.minus size={17} stroke={STROKE} />
                    100%
                    <P.plus size={17} stroke={STROKE} />
                  </span>
                  <span className="flex-1 text-center text-[17px] text-ink">
                    커리어링크 신입/경력 채용 - 서류전형
                  </span>
                  <span className="flex items-center rounded-[7px] border border-[#dfe3e8]">
                    <span className="px-3 py-[5px] text-[16px] tabular-nums text-ink">00:29:26</span>
                    <span className="rounded-r-[6px] bg-[#eef1f4] px-3 py-[5px] text-[16px] text-ink">로그인 연장</span>
                  </span>
                  <P.refresh size={19} stroke={STROKE} />
                </div>

                {/* 카드가 깔리는 바닥. 문서는 원래 스크롤되는 긴 글이라
                    아래가 창에 잘려 있는 편이 맞다. */}
                <div className="relative flex-1 overflow-hidden bg-[#f5f6f8] p-4">
                  <div className="flex flex-col gap-4" style={{ width: DOC - 32 - 26 }}>
                    <DocCard title="지원정보">
                      <div className="px-6 py-6">
                        <Field label="지원 직무" value="커리어링크 개발 > IT개발" />
                      </div>
                    </DocCard>

                    <DocCard>
                      <div className="flex items-center gap-10 bg-[#edeff2] px-7 py-6">
                        <p className="w-[220px] shrink-0 text-[28px] font-bold tracking-[-0.3px] text-ink">
                          김민재 <span className="font-semibold">(남)</span>
                        </p>
                        <div className="flex flex-1 flex-col gap-1.5 text-[18px] text-ink">
                          {CONTACT.map((line) => (
                            <span key={line.text} className="flex items-center gap-3">
                              <line.Icon size={20} stroke={STROKE} className="text-[#6c737f]" />
                              {line.text}
                            </span>
                          ))}
                        </div>
                        <img
                          src={photoApplicant}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-[168px] w-[134px] shrink-0 rounded-[6px] border border-[#e4e7ea] object-cover"
                        />
                      </div>
                      <div className="border-t border-[#eceef1] px-6 py-6">
                        <Field label="주소" value="(07727) 서울 강서구 까치산로 23 (화곡동, NHR타워), 201동 103호" />
                      </div>
                    </DocCard>

                    <DocCard title="요약정보">
                      <div className="px-6 pb-5 pt-16">
                        <div className="relative" style={{ width: AXIS_W, height: 150 }}>
                          <Bar from={2013} to={2016.2} height={62} color="#a9c6f2" chip="고등" chipColor="#4a7fd4" label="강서고등학교" />
                          <Bar from={2016.3} to={2023.6} height={74} color="#8ed3c6" chip="대학교" chipColor="#2f9e8c" label="서울시립대학교" />
                          <Bar from={2025} to={2026.25} height={140} color="#f08080" chip="경력" chipColor="#e04a4a" label="엔에이치알" above />
                        </div>
                        <div className="relative" style={{ width: AXIS_W, height: 34 }}>
                          {YEARS.map((year) => (
                            <span
                              key={year}
                              className="absolute top-0 -translate-x-1/2 pt-2.5 text-[15px] text-[#6c737f]"
                              style={{ left: at(year) }}
                            >
                              <span className="absolute left-1/2 top-0 h-[7px] w-px bg-[#c8ccd2]" />
                              {year}
                            </span>
                          ))}
                        </div>
                      </div>
                    </DocCard>

                    <DocCard title="대학교">
                      <div className="flex gap-7 px-6 py-6">
                        <div className="w-[200px] shrink-0 text-center">
                          <p className="text-[16px] text-[#1d4ed8]">2016.03.01 ~ 2023.08.31</p>
                          <p className="mt-1.5 text-[16px] text-[#4d5761]">졸업</p>
                        </div>
                        <div className="flex-1 rounded-[8px] border border-[#e4e7ea] px-6 py-5">
                          <p className="text-[20px] font-bold text-ink">서울시립대학교</p>
                          <div className="mt-4 flex gap-8">
                            {MAJOR.map((item) => (
                              <Field key={item.label} label={item.label} value={item.value} className="flex-1" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </DocCard>
                  </div>

                  {/* 문서 오른쪽에 붙는 스크롤 띠와 구역 표시 점. */}
                  <div className="absolute right-[10px] top-1 h-[330px] w-[8px] rounded-full bg-[#b6bcc4]" />
                  <div className="absolute right-[26px] top-[340px] flex flex-col gap-[42px]">
                    {Array.from({ length: 8 }, (_, index) => (
                      <span key={index} className="size-[5px] rounded-full bg-[#5b626b]" />
                    ))}
                  </div>

                  {/* 떠 있는 두 버튼 — AI 요약과 메모. */}
                  <div className="absolute bottom-7 right-[46px] flex flex-col gap-2.5 text-[#1d4ed8]">
                    <span className="flex size-[38px] items-center justify-center rounded-[9px] border border-[#cddcf7] bg-white shadow-[0_1px_4px_rgba(32,40,45,0.12)]">
                      <P.spark size={21} stroke={STROKE} />
                    </span>
                    <span className="flex size-[38px] items-center justify-center rounded-[9px] border border-[#cddcf7] bg-white shadow-[0_1px_4px_rgba(32,40,45,0.12)]">
                      <P.memo size={21} stroke={STROKE} />
                    </span>
                  </div>
                </div>
              </div>

              {/* ── 가운데: 평가 입력 ───────────────────────────────── */}
              <div className="flex flex-col border-l border-[#e8eaed]" style={{ width: PANEL }}>
                <div className="flex h-[60px] shrink-0 border-b border-[#e8eaed] text-[17px]">
                  {['지원자 평가', '평가 통계'].map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      data-demo={index === 0 ? 'eval' : 'stats'}
                      aria-pressed={index === panel}
                      onClick={() => {
                        setPicked({ panel: index, tab })
                        setHeld(true)
                      }}
                      className={clsx(
                        'flex flex-1 cursor-pointer items-center justify-center transition-colors',
                        index === panel
                          ? 'border-b-2 border-ink font-semibold text-ink'
                          : 'text-[#9aa3af] hover:text-[#4d5761]',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-1 flex-col overflow-hidden p-3.5">
                  {/* 위 칸 전환은 AnimatePresence 하나로 묶는다. 패널마다 따로
                      두면 나가는 쪽과 들어오는 쪽이 같은 칸에 함께 쌓여,
                      통계가 잔상처럼 남은 채 평가 화면이 올라온다. */}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={panel}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className={clsx('flex min-h-0 flex-1 flex-col', panel === 1 ? 'gap-4' : 'gap-5')}
                    >
                      {panel === 1 ? (
                        <StatsPanel />
                      ) : (
                    <>
                      <div className="flex w-full shrink-0 text-[15px]">
                    {TABS.map((label, index) => (
                      <button
                        key={label}
                        type="button"
                        data-demo={`tab${index}`}
                        aria-pressed={index === tab}
                        onClick={() => {
                          setPicked({ panel, tab: index })
                          setHeld(true)
                        }}
                        className={clsx(
                          'flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-y border-r py-[9px] transition-colors',
                          index === 0 && 'rounded-l-[7px] border-l',
                          index === TABS.length - 1 && 'rounded-r-[7px]',
                          index === tab
                            ? 'border-[#cfd4da] bg-[#eef1f4] font-semibold text-ink'
                            : 'border-[#dfe3e8] text-[#4d5761] hover:bg-[#f7f8fa]',
                        )}
                      >
                        {label}
                        {index === 1 && (
                          <span className="flex size-[17px] items-center justify-center rounded-full bg-[#e5484d] text-[12px] font-bold text-white">
                            {HISTORY.length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.26, ease: 'easeOut' }}
                      className="flex min-h-0 flex-1 flex-col gap-5"
                    >
                      {tab === 0 ? <EvalTab /> : tab === 1 ? <HistoryTab /> : <ResultsTab />}
                        </motion.div>
                      </AnimatePresence>
                    </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ── 오른쪽: 지원자 목록 ─────────────────────────────── */}
              <div className="flex flex-col gap-3 border-l border-[#e8eaed] bg-white p-2.5" style={{ width: RAIL }}>
                <span className="flex h-[32px] items-center justify-center rounded-[6px] border border-[#f5c2c2] bg-[#fdecec] text-[16px] font-semibold text-[#d93b3b]">
                  완료 : 1 / 7
                </span>

                <div className="flex items-center justify-between text-[15px] text-ink">
                  불참 3명 제외
                  <Toggle />
                </div>
                <div className="flex items-center justify-between text-[15px] text-ink">
                  완료 제외
                  <Toggle />
                </div>

                {/* 라벨이 테두리 위에 걸친다. 흰 바탕을 깔아 그 구간의
                    선만 지우는 방식이라, 선을 끊어 그릴 필요가 없다. */}
                <div className="relative rounded-[6px] border border-[#cfd4da] bg-white px-2.5 py-[9px]">
                  <span className="absolute -top-[9px] left-2 bg-white px-1 text-[13px] text-[#9aa3af]">그룹</span>
                  <span className="flex items-center justify-between text-[15px] text-ink">
                    전체
                    <P.chevron size={16} stroke={STROKE} className="text-[#9aa3af]" />
                  </span>
                </div>

                <div className="flex rounded-[6px] border border-[#cfd4da] text-[15px]">
                  <span className="flex-1 rounded-l-[5px] border-r border-[#cfd4da] bg-[#eef1f4] py-[6px] text-center font-semibold text-ink">
                    이름순
                  </span>
                  <span className="flex-1 py-[6px] text-center text-[#6c737f]">총점순</span>
                </div>

                {RAIL_GROUPS.map((group) => (
                  <div key={group.title} className="flex flex-col">
                    <span className="mb-1 self-center rounded-full border border-[#cfd4da] px-3 py-[4px] text-[15px] text-[#4d5761]">
                      {group.title}
                    </span>
                    {group.people.map((person) => (
                      <span
                        key={person.name}
                        className={`flex h-[48px] items-center justify-center gap-2.5 rounded-[5px] px-2.5 text-[16px] ${
                          person.on ? 'bg-[#e9eef5] font-semibold text-ink' : 'text-[#4d5761]'
                        }`}
                      >
                        <span className="size-[8px] rounded-full" style={{ backgroundColor: person.dot }} />
                        {person.name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 손가락 시늉. 자리는 실측해 두었다가 x/y 로만 옮기므로 밑에
                깔린 칸들은 밀리지 않는다. 눌릴 때만 살짝 쪼그라든다. */}
            {spot && (
              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  x: spot.x,
                  y: spot.y,
                  opacity: demoLive ? 1 : 0,
                  scale: demoLive && frame?.press ? 0.72 : 1,
                }}
                transition={{
                  x: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.16 },
                }}
                className="pointer-events-none absolute left-0 top-0 z-50 -ml-[17px] -mt-[17px] size-[34px] rounded-full bg-[rgba(77,87,97,0.7)] ring-2 ring-white"
              />
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
