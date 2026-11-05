import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useInView } from 'framer-motion'
import {
  IconArrowAutofitHeight,
  IconBriefcase,
  IconCaretDownFilled,
  IconChevronLeft,
  IconChevronRight,
  IconCircleMinus,
  IconCirclePlus,
  IconLetterB,
  IconLocationOff,
  IconMail,
  IconNote,
  IconPhone,
} from '@tabler/icons-react'
import photo1 from '../../assets/sections/hero4-cards/compare-photo-1.webp'
import photo2 from '../../assets/sections/hero4-cards/compare-photo-2.webp'
import photo3 from '../../assets/sections/hero4-cards/compare-photo-3.webp'
import photo4 from '../../assets/sections/hero4-cards/compare-photo-4.webp'
import { useFitScale } from '../../hooks/useFitScale'
import { StagePointer, type Point } from './Hero4MemoMock'

/** 설계 좌표. 네 칸이 한 창에 들어가야 해서 다른 목업보다 크게 그려 줄인다. */
const DESIGN_WIDTH = 1120
const DESIGN_HEIGHT = 734

const STROKE = 1.8
const MAX_COUNT = 4
const MIN_COUNT = 2

interface Applicant {
  name: string
  order: string
  prev?: string
  next: string
  job: string
  phone: string
  mail: string
  birth: string
  hobby: string
  skill: string
  photo: string
  highSchool: { name: string; period: string }
  school: { name: string; period: string; major: string; gpa: string }
}

const APPLICANTS: Applicant[] = [
  {
    name: '조유빈 (여)',
    order: '1 / 9',
    next: '김민준',
    job: '커리어링크 영업 > 세일즈',
    phone: '+82)010-0303-0303',
    mail: 'joyubin@careerlink.kr',
    birth: '2001.10.22 (만 25세)',
    hobby: '독서',
    skill: '프레젠테이션',
    photo: photo1,
    highSchool: { name: '경기고등학교', period: '2017.03 ~ 2020.02' },
    school: { name: '성균관대학교', period: '2020.03.01 ~ 2024.02.15', major: '(국제)글로벌경영학과', gpa: '4.10/4.5' },
  },
  {
    name: '김민준 (남)',
    order: '2 / 9',
    prev: '조유빈',
    next: '이서현',
    job: '커리어링크 기획 > 디자인',
    phone: '+82)010-1111-1111',
    mail: 'kimminjun@careerlink.kr',
    birth: '1998.02.03 (만 28세)',
    hobby: '러닝',
    skill: '데이터 분석',
    photo: photo2,
    highSchool: { name: '동성고등학교', period: '2013.03 ~ 2016.02' },
    school: { name: '한양대학교', period: '2016.03.02 ~ 2022.08.31', major: 'AI경영학과', gpa: '3.00/4.5' },
  },
  {
    name: '김지윤 (여)',
    order: '4 / 9',
    prev: '이서현',
    next: '윤수빈',
    job: '커리어링크 개발 > IT개발',
    phone: '+82)010-9999-9999',
    mail: 'kimjiyun@careerlink.kr',
    birth: '1996.05.15 (만 30세)',
    hobby: '요리',
    skill: '영상 편집',
    photo: photo3,
    highSchool: { name: '서울여자고등학교', period: '2012.03 ~ 2015.02' },
    school: { name: '고려대학교', period: '2015.03.03 ~ 2020.02.02', major: '전기전자컴퓨터공학과', gpa: '4.30/4.5' },
  },
  {
    name: '박세훈 (남)',
    order: '8 / 9',
    prev: '윤민석',
    next: '오준혁',
    job: '커리어링크 개발 > IT개발',
    phone: '+82)010-7777-7777',
    mail: 'parksehun@careerlink.kr',
    birth: '1994.06.14 (만 32세)',
    hobby: '등산',
    skill: '코딩',
    photo: photo4,
    highSchool: { name: '부산고등학교', period: '2009.03 ~ 2012.02' },
    school: { name: '서울시립대학교', period: '2014.03.03 ~ 2019.02.02', major: '컴퓨터공학과', gpa: '2.30/4.5' },
  },
]

interface Scene {
  cursor: 'start' | 'minus'
  shown: boolean
  down: boolean
  count: number
}

const FIRST: Scene = { cursor: 'start', shown: true, down: false, count: MAX_COUNT }

/** [이 장면을 머무는 시간(ms), 앞 장면에서 바뀌는 것] */
const STEPS: [number, Partial<Scene>][] = [
  [1200, {}],
  [750, { cursor: 'minus' }],
  [240, { down: true }],
  [1500, { down: false, count: 3 }],
  [240, { down: true }],
  [1800, { down: false, count: 2 }],
  [1500, { shown: false }],
]

const SCENES = STEPS.reduce<Scene[]>((scenes, [, patch]) => {
  scenes.push({ ...(scenes.at(-1) ?? FIRST), ...patch })
  return scenes
}, [])

function RailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 border-t border-[#eceef0] py-2 text-[#4d5761] first:border-t-0">
      <span className="flex items-center gap-1">{children}</span>
      <span className="whitespace-nowrap text-[10px] leading-none tracking-[-0.2px]">{label}</span>
    </div>
  )
}

/** 머리띠가 달린 칸. */
function Block({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border-b border-[#eceef0] bg-white">
      {title && <p className="flex h-[38px] items-center bg-[#eceef1] px-3.5 text-[14px] font-bold text-ink">{title}</p>}
      {children}
    </div>
  )
}

function SchoolFacts({ person }: { person: Applicant }) {
  const facts = [
    ['주전공', person.school.major],
    ['학교소재지', '서울'],
    ['학점', person.school.gpa],
    ['본/분교', '본교'],
  ]
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-2 pt-2.5">
      {facts.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <p className="text-[11px] text-[#8b919a]">{label}</p>
          <p className="truncate text-[13px] text-ink">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ApplicantColumn({ person }: { person: Applicant }) {
  return (
    <div className="relative flex h-full min-w-[270px] flex-col gap-2 bg-[#f7f8fa]">
      <div className="flex h-[44px] shrink-0 items-center justify-center gap-2 border-b border-[#e8eaed] bg-white px-2 text-[12px] text-[#4d5761]">
        {person.prev && <span className="whitespace-nowrap">{person.prev}</span>}
        <IconChevronLeft size={14} stroke={STROKE} className={person.prev ? '' : 'text-[#c8ccd2]'} />
        <span className="whitespace-nowrap font-bold text-ink">{person.name.slice(0, 3)}</span>
        <span className="flex items-center gap-1 whitespace-nowrap rounded-[6px] border border-[#d2d6db] px-2 py-0.5 text-ink">
          {person.order}
          <IconCaretDownFilled size={10} />
        </span>
        <IconChevronRight size={14} stroke={STROKE} />
        <span className="whitespace-nowrap">{person.next}</span>
      </div>

      <Block title="지원정보">
        <div className="flex items-center justify-between gap-2 px-3.5 py-3 text-[13px]">
          <span className="text-[12px] text-[#8b919a]">지원 직무</span>
          <span className="truncate text-ink">{person.job}</span>
        </div>
      </Block>

      <Block>
        <div className="flex flex-col gap-2.5 bg-[#eef0f3] px-3.5 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="whitespace-nowrap text-[16px] font-medium text-ink">{person.name}</p>
            <img src={person.photo} alt="" className="h-[100px] w-[77px] shrink-0 rounded-[6px] object-cover" />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5 text-[12px] text-ink">
            {(
              [
                [IconPhone, person.phone],
                [IconMail, person.mail],
                [IconBriefcase, person.birth],
              ] as const
            ).map(([Icon, text]) => (
              <p key={text} className="flex items-center gap-1.5 whitespace-nowrap">
                <Icon size={14} stroke={STROKE} className="shrink-0 text-[#4d5761]" />
                {text}
              </p>
            ))}
          </div>
        </div>
        <div className="flex gap-6 px-3.5 py-3 text-[13px] text-ink">
          <p className="flex min-w-0 flex-1 gap-3">
            <span className="shrink-0 text-[#8b919a]">취미</span>
            <span className="truncate">{person.hobby}</span>
          </p>
          <p className="flex min-w-0 flex-1 gap-3">
            <span className="shrink-0 text-[#8b919a]">특기</span>
            <span className="truncate">{person.skill}</span>
          </p>
        </div>
      </Block>

      <Block title="대학교">
        <div className="m-2.5 rounded-[8px] border border-[#e8eaed] p-3">
          <p className="text-[16px] text-ink">{person.school.name}</p>
          <span className="text-[12px] text-[#1d5fd0]">
            {person.school.period} <span className="ml-1.5">졸업</span>
          </span>
          <SchoolFacts person={person} />
        </div>
      </Block>

      <Block title="고등학교">
        <div className="m-2.5 rounded-[8px] border border-[#e8eaed] p-3">
          <p className="text-[16px] text-ink">{person.highSchool.name}</p>
          <span className="text-[12px] text-[#1d5fd0]">
            {person.highSchool.period} <span className="ml-1.5">졸업</span>
          </span>
        </div>
      </Block>

      <span className="absolute bottom-4 right-4 flex size-[36px] items-center justify-center rounded-[8px] border border-[#c9d3ee] bg-[#eef2fd] text-[#0042b7]">
        <IconNote size={20} stroke={STROKE} />
      </span>
    </div>
  )
}

/**
 * "지원자 비교" 의 그림 자리. 지원서를 칸으로 나눠 그려서, 한 칸이 빠지면 남은
 * 칸의 폭이 늘어난다(글자는 커지지 않는다). 오른쪽 도구 버튼은 칸에 맞춰 줄이면
 * 읽을 수 없어 배율 밖에 둔다.
 *
 * 포인터 연출이 돌다가, 사람이 직접 누르면 연출을 멈추고 그 값을 따른다.
 */
export function Hero4CompareView() {
  const { ref: fitRef, scale } = useFitScale(DESIGN_WIDTH)
  const rootRef = useRef<HTMLDivElement>(null)
  const minusRef = useRef<HTMLButtonElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.4 })
  const [step, setStep] = useState(0)
  const [manual, setManual] = useState<number | null>(null)
  const [minusPoint, setMinusPoint] = useState<Point | null>(null)
  const scene = SCENES[step]
  const count = manual ?? scene.count

  useEffect(() => {
    const root = rootRef.current
    const minus = minusRef.current
    if (!root || !minus) return
    const measure = () => {
      const base = root.getBoundingClientRect()
      const r = minus.getBoundingClientRect()
      // 좁은 화면에서는 도구 버튼을 숨기므로 포인터도 띄우지 않는다.
      setMinusPoint(r.width ? { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top } : null)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || manual !== null) return
    const timer = setTimeout(() => setStep((s) => (s + 1) % SCENES.length), STEPS[step][0])
    return () => clearTimeout(timer)
  }, [inView, manual, step])

  const showPointer = manual === null && minusPoint !== null
  const pointer = scene.cursor === 'minus' ? minusPoint : { x: 340, y: 210 }

  return (
    <div ref={rootRef} className="relative w-full">
      <div
        ref={fitRef}
        role="img"
        aria-label={`지원자 ${count}명의 지원서를 나란히 놓고 비교하는 화면`}
        className="overflow-hidden rounded-[12px] bg-white shadow-[0_12px_32px_-12px_rgba(32,40,45,0.22)] md:mr-[34px]"
        style={{ height: DESIGN_HEIGHT * scale }}
      >
        <div
          className="flex font-sans"
          style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {APPLICANTS.map((person, i) => (
            <div
              key={person.name}
              // 빠지는 칸은 폭이 0 으로 접히고, 그만큼 남은 칸이 나눠 갖는다.
              // 연출이 처음으로 돌아갈 때는 움직임 없이 바로 네 칸이 된다.
              className={`min-w-0 overflow-hidden border-r border-[#e1e4e8] last:border-r-0 ${
                manual === null && step === 0 ? '' : 'transition-[flex-grow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
              }`}
              style={{ flexGrow: i < count ? 1 : 0, flexBasis: 0, borderRightWidth: i < count - 1 ? 1 : 0 }}
            >
              <ApplicantColumn person={person} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-5 top-3 hidden w-[58px] flex-col rounded-[10px] border border-[#e1e4e8] bg-white px-1 py-0.5 shadow-[0_8px_20px_-8px_rgba(32,40,45,0.35)] md:flex">
        <RailItem label="100%">
          <IconCircleMinus size={15} stroke={STROKE} />
          <IconCirclePlus size={15} stroke={STROKE} />
        </RailItem>
        <RailItem label="Basic">
          <IconLetterB size={17} stroke={STROKE} />
        </RailItem>
        <RailItem label={`${count}개`}>
          <button
            ref={minusRef}
            type="button"
            aria-label="비교할 지원서 줄이기"
            disabled={count <= MIN_COUNT}
            onClick={() => setManual(count - 1)}
            className="flex cursor-pointer disabled:cursor-default disabled:text-[#c8ccd2]"
          >
            <IconCircleMinus size={15} stroke={STROKE} />
          </button>
          <button
            type="button"
            aria-label="비교할 지원서 늘리기"
            disabled={count >= MAX_COUNT}
            onClick={() => setManual(count + 1)}
            className="flex cursor-pointer disabled:cursor-default disabled:text-[#c8ccd2]"
          >
            <IconCirclePlus size={15} stroke={STROKE} />
          </button>
        </RailItem>
        <RailItem label="전체 스크롤">
          <IconArrowAutofitHeight size={17} stroke={STROKE} />
        </RailItem>
        <RailItem label="바로가기">
          <IconLocationOff size={17} stroke={STROKE} />
        </RailItem>
      </div>

      {showPointer && pointer && (
        <StagePointer point={pointer} move={scene.cursor === 'start' ? 0 : 650} shown={scene.shown} down={scene.down} />
      )}
    </div>
  )
}
