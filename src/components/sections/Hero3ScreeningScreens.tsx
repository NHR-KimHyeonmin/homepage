import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { motion } from 'framer-motion'

/**
 * "일반 / 간편 전형" 두 화면을 DOM 으로 그린 것.
 *
 * 전에는 1640x996 스크린샷 두 장이었는데, 화면에 1040px 로 띄우면서 고해상도
 * 디스플레이에서 원본 픽셀이 모자라 뿌옇게 풀렸다(2배율에 2080px 이 필요한데
 * 원본이 1640px). 더 큰 배율로 다시 내보내지 않고도 선명하게 두려면 그림이
 * 아니라 글자와 상자로 그리는 수밖에 없다.
 *
 * 설계 좌표는 원본과 같은 1640x996 이다. 쓰는 쪽(Hero3ScreeningToggle)이
 * 그 폭을 기준으로 통째로 축소하므로, 그림이던 시절의 배치 계산을 그대로
 * 쓸 수 있다.
 */
export const SCREEN_WIDTH = 1640
export const SCREEN_HEIGHT = 996

const CARD = 'rounded-[14px] border border-[#eceef2] bg-white'
const PANEL = 'rounded-[12px] border border-[#eceef2] bg-[#fbfbfc] p-5'
const GHOST = 'flex h-[44px] items-center gap-2 rounded-[10px] border border-[#e1e4e8] bg-white px-4 text-[18px] text-[#3f4652]'

/** 얇은 선 아이콘 한 벌. 최종 배율에서 20px 안팎이라 뜻만 통하면 된다. */
function Icon({ path, className = 'size-[22px]' }: { path: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d={path} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const P = {
  list: 'M4 7h2M4 12h2M4 17h2M9 7h11M9 12h11M9 17h11',
  send: 'M21 3 10.5 13.5M21 3l-6.5 18-4-8-8-4L21 3Z',
  log: 'M4 6h5v5H4zM4 14h5v5H4zM12 7h8M12 11h5M12 16h8M12 20h5',
  dots: 'M12 5h.01M12 12h.01M12 19h.01',
  chevron: 'm6 9 6 6 6-6',
  eye: 'M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  calendar: 'M7 3v3M17 3v3M3.5 9h17M4 6.5h16v14H4z',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5Z',
  clip: 'M8 3h8v3H8zM6 6h12v15H6zM9 11h6M9 15h4',
  check: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12l2.5 2.5L16 9.5',
  grip: 'M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  comment: 'M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z',
  eyeSmall: 'M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M4 12h14M13 7l5 5-5 5',
  corner: 'M5 5v8h9',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8M15 4v6M8 14v6',
  idCard: 'M3 6h18v12H3zM8 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM6 15c.6-1.3 1.6-2 3-2s2.4.7 3 2M14 10h4M14 13h3',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  board: 'M4 4h6v16H4zM14 4h6v9h-6z',
  cards: 'M4 5h6v5H4zM4 14h6v5H4zM13 6h7M13 10h5M13 15h7M13 19h5',
}

function Dot({ color }: { color: string }) {
  return <span className="size-[8px] shrink-0 rounded-full" style={{ backgroundColor: color }} />
}

/** 공고 선택 줄 — 두 화면이 문구만 다르고 생김새는 같다. */
function TopBar({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[44px] items-center rounded-[10px] border border-[#e1e4e8] bg-white p-[3px] text-[18px]">
        <span className="rounded-[8px] bg-[#eef1f4] px-4 py-[5px] font-semibold text-ink">일반</span>
        <span className="px-4 py-[5px] text-[#9aa3af]">상시</span>
      </div>
      <div className="flex h-[44px] flex-1 items-center justify-between rounded-[10px] border border-[#e1e4e8] bg-white px-4">
        <span className="text-[19px] text-ink">{title}</span>
        <span className="text-[#9aa3af]">
          <Icon path={P.chevron} />
        </span>
      </div>
      <span className={GHOST}>
        <Icon path={P.eye} className="size-[20px]" />
        MY
      </span>
      <span className={GHOST}>채용종료</span>
      <span className="flex h-[44px] items-center gap-2 rounded-[10px] bg-[#1d4ed8] px-4 text-[18px] font-semibold text-white">
        <Icon path={P.plus} className="size-[20px]" />
        {action}
      </span>
    </div>
  )
}

function SectionHead({ icon, title, right }: { icon: string; title: string; right: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-[#4d5761]">
          <Icon path={icon} className="size-[24px]" />
        </span>
        <p className="text-[24px] font-bold tracking-[-0.12px] text-ink">{title}</p>
      </div>
      <div className="flex items-center gap-2.5 text-[#6c737f]">{right}</div>
    </div>
  )
}

function HeadActions({ autoEval }: { autoEval?: boolean }) {
  return (
    <>
      {autoEval && (
        <span className="flex h-[44px] items-center gap-2 rounded-full bg-[#f1f3f5] px-4 text-[18px] font-semibold text-ink">
          <Dot color="#1d4ed8" />
          자동평가 ON
          <Icon path={P.chevron} className="size-[18px]" />
        </span>
      )}
      <span className="flex size-[44px] items-center justify-center rounded-[10px] border border-[#e1e4e8] bg-white">
        <Icon path={P.send} className="size-[20px]" />
      </span>
      <span className={GHOST}>
        <Icon path={P.log} className="size-[20px]" />
        발송 내역
      </span>
      <Icon path={P.dots} />
      <Icon path={P.chevron} className="size-[22px] rotate-180" />
    </>
  )
}

/** 값 한 줄: 왼쪽 이름, 오른쪽 숫자 + 단위. */
function Stat({ label, value, unit, dot, bold }: { label: string; value: string; unit: string; dot?: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-[7px] text-[19px]">
      <span className="flex items-center gap-2.5 text-[#4d5761]">
        {dot && <Dot color={dot} />}
        {label}
      </span>
      <span className="text-[#6c737f]">
        <b className={bold ? 'text-[20px] font-bold text-ink' : 'font-semibold text-ink'}>{value}</b> {unit}
      </span>
    </div>
  )
}

/**
 * 전형이 한 덩어리씩 쌓인다는 걸 등장 순서로 보인다 — 서류전형이 먼저 서고,
 * 그 아래로 커리어앤, 일반 전형(평가형)이 차례로 들어온다. 이 화면이 "전형
 * 단위로 짜고 옮긴다" 는 말을 글 없이 하는 방법이다.
 */
const ROW_IN = { opacity: 1, y: 0 }
const ROW_OUT = { opacity: 0, y: 28 }

export function StandardScreen({ active = true }: { active?: boolean }) {
  return (
    <div
      className="flex flex-col gap-5 bg-[#fafbfc] px-6 py-5 font-sans"
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
    >
      <TopBar title="커리어링크 신입/경력 채용" action="전형 추가" />

      <div className="flex items-center gap-5 text-[19px] text-[#4d5761]">
        <span className="rounded-[7px] bg-[#e8f5ec] px-2.5 py-1 text-[17px] font-semibold text-[#1f9254]">접수마감</span>
        <span>2026.04.16 (목) 00:00:00 ~ 2026.07.02 (목) 15:00:59</span>
        <span className="flex items-center gap-2">
          <Icon path={P.user} className="size-[20px]" />
          <u>최종제출 13명</u>
        </span>
        <span className="flex items-center gap-2">
          <Icon path={P.user} className="size-[20px]" />
          <u>임시저장 0명</u>
        </span>
      </div>

      <div className={`${CARD} flex flex-col gap-5 p-7`}>
        <SectionHead icon={P.list} title="서류전형" right={<HeadActions autoEval />} />

        <div className="grid grid-cols-5 gap-5">
          <div className={PANEL}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[20px] font-semibold text-ink">평가 대상</p>
              <span className="text-[#9aa3af]">
                <Icon path={P.dots} className="size-[20px]" />
              </span>
            </div>
            <div className="rounded-[10px] border border-[#eceef2] bg-white px-4 py-2">
              <Stat label="최종제출" value="13" unit="명" bold />
              <Stat label="참석" value="5" unit="명" dot="#16a34a" />
              <Stat label="불참석" value="3" unit="명" dot="#ef4444" />
              <Stat label="미등록" value="5" unit="명" dot="#c8ccd2" />
            </div>
          </div>

          <div className={PANEL}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[20px] font-semibold text-ink">자동 평가</p>
              <span className="text-[#9aa3af]">
                <Icon path={P.dots} className="size-[20px]" />
              </span>
            </div>
            {[
              { icon: P.filter, label: '필터형' },
              { icon: P.clip, label: '가산점형' },
            ].map((row) => (
              <div
                key={row.label}
                className="mb-2.5 flex items-center justify-between rounded-[10px] border border-[#eceef2] bg-white px-3.5 py-3"
              >
                <span className="flex items-center gap-2.5 text-[19px] text-ink">
                  <Icon path={row.icon} className="size-[20px] text-[#6c737f]" />
                  {row.label}
                </span>
                <span className="rounded-[7px] bg-[#e8f5ec] px-2.5 py-1 text-[16px] font-semibold text-[#1f9254]">
                  실행완료
                </span>
              </div>
            ))}
            <p className="pt-1 text-[18px] text-[#6c737f]">자동 평가 결과 →</p>
          </div>

          <div className={PANEL}>
            <p className="mb-3 text-[20px] font-semibold text-ink">평가 세팅</p>
            <div className="mb-2.5 rounded-[10px] border border-[#eceef2] bg-white px-3.5 py-3">
              <span className="flex items-center gap-2.5 text-[19px] text-ink">
                <Icon path={P.calendar} className="size-[20px] text-[#6c737f]" />
                평가 기간
              </span>
              {/* 칸 폭이 좁아 18px 로는 두 줄로 접힌다 — 한 줄에 들어가는
                  크기로 낮추고 줄바꿈을 막는다. */}
              <p className="whitespace-nowrap pt-2 text-[15px] text-[#4d5761]">2026.06.15(월) ~ 2026.07.15(수)</p>
            </div>
            <div className="rounded-[10px] border border-[#eceef2] bg-white px-3.5 py-3">
              <div className="flex items-center justify-between text-[19px] text-ink">
                <span className="flex items-center gap-2.5">
                  <Icon path={P.idCard} className="size-[20px] text-[#6c737f]" />
                  평가 그룹
                </span>
                <span className="text-[#6c737f]">
                  <b className="font-bold text-ink">3</b> 개
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 text-[18px] text-[#4d5761]">
                <span className="flex items-center gap-2">
                  <Icon path={P.corner} className="size-[18px] text-[#9aa3af]" />
                  미할당 대상자
                </span>
                <span>2 명</span>
              </div>
            </div>
          </div>

          <div className={PANEL}>
            <p className="mb-3 text-[20px] font-semibold text-ink">평가 현황</p>
            <div className="rounded-[10px] border border-[#eceef2] bg-white px-4 py-3">
              <div className="flex items-center justify-between text-[19px]">
                <span className="flex items-center gap-2.5 text-ink">
                  <Icon path={P.check} className="size-[20px] text-[#6c737f]" />
                  완료율
                </span>
                <span className="text-[#6c737f]">
                  <b className="font-bold text-ink">5 / 21</b> 건
                </span>
              </div>
              <div className="flex items-center gap-3 py-3">
                <span className="h-[8px] flex-1 rounded-full bg-[#eceef2]">
                  <span className="block h-full w-[23.8%] rounded-full bg-[#16a34a]" />
                </span>
                <span className="text-[17px] text-[#6c737f]">23.8%</span>
              </div>
              <div className="flex items-center justify-between text-[19px]">
                <span className="flex items-center gap-2.5 text-ink">
                  <Icon path={P.user} className="size-[20px] text-[#6c737f]" />
                  평가자
                </span>
                <span className="text-[#6c737f]">
                  <b className="font-bold text-ink">2</b> 명
                </span>
              </div>
            </div>
          </div>

          <div className={PANEL}>
            <p className="mb-3 text-[20px] font-semibold text-ink">전형 결과</p>
            <div className="rounded-[10px] border border-[#eceef2] bg-white px-4 py-2">
              <Stat label="합격" value="4" unit="명" dot="#16a34a" />
              <Stat label="불합격" value="2" unit="명" dot="#ef4444" />
              <Stat label="미등록" value="7" unit="명" dot="#c8ccd2" />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={active ? ROW_IN : ROW_OUT}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: active ? 0.75 : 0 }}
        className={`${CARD} flex items-center justify-between px-7 py-5`}
      >
        {/* 끌어 옮기는 손잡이는 뺐다 — 위 "서류전형" 줄에는 없어서, 이 줄만
            손잡이 폭만큼 안쪽으로 밀려 제목 왼쪽이 어긋나 보였다. */}
        <div className="flex items-center gap-3">
          <span className="flex size-[36px] items-center justify-center rounded-[9px] bg-[#e8f0fe] text-[18px] font-bold text-[#1d4ed8]">
            n
          </span>
          <p className="text-[24px] font-bold tracking-[-0.12px] text-ink">커리어앤</p>
        </div>
        <div className="flex items-center gap-2.5 text-[#6c737f]">
          <span className="flex items-center gap-2 text-[19px]">
            <Icon path={P.calendar} className="size-[20px]" />
            2026.07.02(목) ~ 2026.07.10(금)
          </span>
          <Icon path={P.dots} />
          <Icon path={P.chevron} />
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={active ? ROW_IN : ROW_OUT}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: active ? 1.5 : 0 }}
        className={`${CARD} flex flex-col gap-5 p-7`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon path={P.user} className="size-[24px] text-[#4d5761]" />
            <p className="text-[24px] font-bold tracking-[-0.12px] text-ink">일반 전형 (평가형)</p>
          </div>
          <div className="flex items-center gap-2.5 text-[#6c737f]">
            <HeadActions />
          </div>
        </div>

        {/* 아직 아무것도 설정되지 않은 전형 — 빈 칸이 네 개 나란히 선다. */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { title: '평가 대상', body: <EmptyAction note="대상자를 등록해 주세요." label="대상자 등록" primary /> },
            { title: '평가 세팅', body: <EmptyAction label="평가 정보 설정" /> },
            { title: '평가 현황', body: <p className="text-[19px] text-[#b8bdc6]">데이터가 없습니다.</p> },
            { title: '전형 결과', body: <EmptyAction label="결과 등록" /> },
          ].map((panel) => (
            <div key={panel.title} className={`${PANEL} flex h-[250px] flex-col`}>
              <p className="text-[20px] font-semibold text-ink">{panel.title}</p>
              <div className="flex flex-1 flex-col items-center justify-center gap-4">{panel.body}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function EmptyAction({ note, label, primary }: { note?: string; label: string; primary?: boolean }) {
  return (
    <>
      {note && <p className="text-[19px] text-[#6c737f]">{note}</p>}
      <span
        className={
          primary
            ? 'flex items-center gap-2 rounded-[10px] bg-[#1d4ed8] px-5 py-3 text-[19px] font-semibold text-white'
            : 'rounded-[10px] bg-[#eceef2] px-5 py-3 text-[19px] font-medium text-[#b8bdc6]'
        }
      >
        {label}
        {primary && <Icon path={P.chevron} className="size-[18px]" />}
      </span>
    </>
  )
}

interface Applicant {
  name: string
  badge?: { label: string; tone: 'fail' | 'pass' }
  when: string
  role: string
  meta: string
  rows?: { label: string; range: string }[]
  counts: [number, number, number, number]
  draft?: boolean
}

/**
 * 김준서는 1차면접 칸에 있다가 임원 면접 칸으로 넘어간다 — 간편 전형이
 * 무엇을 하는 화면인지는 "카드를 다음 단계로 옮긴다" 한 장면이면 끝난다.
 * 넘어간 뒤에는 1차 면접 띠가 사라진다. 그 단계를 지났기 때문이다.
 */
const MOVER: Applicant = {
  name: '김준서',
  when: '1년 전',
  role: '서비스 기획',
  meta: '남 | 만 34세 | 부산대학교(졸업)',
  rows: [{ label: '1차 면접', range: '10.07 ~ 07.10' }],
  counts: [0, 0, 0, 0],
}

const BASE_COLUMNS: { title: string; cards: Applicant[] }[] = [
  {
    title: '서류단계',
    cards: [
      { name: '박민아', when: '1년 전', role: 'UI/UX디자인', meta: '만 29세 | 가천대학교(졸업)', counts: [0, 0, 0, 0], draft: true },
      { name: '김지호', when: '1년 전', role: '서비스 기획', meta: '여 | 만 27세', counts: [0, 0, 0, 0], draft: true },
      {
        name: '박우혁',
        when: '1년 전',
        role: '서비스 기획',
        meta: '남 | 만 24세 | 한국외국어대학교(졸업)',
        rows: [{ label: '추가자료', range: '03.21 ~ 04.12' }],
        counts: [0, 0, 0, 6],
      },
      { name: '김지우', when: '1년 전', role: 'UI/UX디자인', meta: '여 | 만 33세', counts: [2, 0, 0, 0] },
    ],
  },
  {
    title: '1차면접',
    cards: [
      {
        name: '강진희',
        badge: { label: '불합격', tone: 'fail' },
        when: '6개월 전',
        role: '서비스 기획',
        meta: '만 28세 | 가야대학교(김해)(졸업)',
        rows: [
          { label: '1차 면접', range: '01.01 ~ 02.09' },
          { label: '외부자료 연동', range: '06.06 ~ 09.09' },
        ],
        counts: [0, 0, 0, 0],
      },
      {
        name: '이다함',
        when: '1년 전',
        role: 'UI/UX디자인',
        meta: '여 | 만 36세 | 서울대학교(졸업)',
        rows: [
          { label: '1차 면접', range: '09.26 ~ 09.26' },
          { label: '○ ○ ○', range: '07.19 ~ 07.30' },
        ],
        counts: [1, 0, 0, 1],
      },
    ],
  },
  {
    title: '임원 면접',
    cards: [
      {
        name: '김현수',
        when: '9개월 전',
        role: 'UI/UX디자인',
        meta: '남 | 만 32세 | 건국대학교(졸업)',
        rows: [
          { label: '2차 면접', range: '10.07 ~ 07.10' },
          { label: '외부자료 연동', range: '06.06 ~ 09.09' },
        ],
        counts: [0, 0, 0, 0],
      },
    ],
  },
  {
    title: '최종합격',
    cards: [
      {
        name: '이수희',
        badge: { label: '최종합격', tone: 'pass' },
        when: '1년 전',
        role: '서비스 기획',
        meta: '만 30세',
        rows: [{ label: '최종 면접', range: '05.24 ~ 05.25' }],
        counts: [0, 0, 0, 0],
      },
    ],
  },
]

/**
 * 김준서가 어디에 있는지에 따른 칸 목록.
 *   before  1차면접에 있다
 *   lifting 아무 칸에도 없다 — 집어 올려져 격자 위를 날고 있다
 *   after   임원 면접에 있다. 지나온 1차 면접 띠는 떼고 선다
 */
type Phase = 'before' | 'lifting' | 'after'

function columnsFor(phase: Phase) {
  return BASE_COLUMNS.map((column) => {
    if (column.title === '1차면접') {
      const cards = phase === 'before' ? [column.cards[0], MOVER, ...column.cards.slice(1)] : column.cards
      return { ...column, cards }
    }
    if (column.title === '임원 면접') {
      const cards = phase === 'after' ? [...column.cards, { ...MOVER, rows: undefined }] : column.cards
      return { ...column, cards }
    }
    return column
  })
}

function ApplicantCard({ card, ref }: { card: Applicant; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="rounded-[12px] border border-[#eceef2] bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-[21px] font-bold text-ink">{card.name}</p>
          {card.badge && (
            <span
              className={
                card.badge.tone === 'fail'
                  ? 'rounded-[7px] bg-[#fdecec] px-2.5 py-1 text-[16px] font-semibold text-[#d93a3a]'
                  : 'rounded-[7px] bg-[#e8f5ec] px-2.5 py-1 text-[16px] font-semibold text-[#1f9254]'
              }
            >
              {card.badge.label}
            </span>
          )}
        </div>
        <span className="text-[17px] text-[#9aa3af]">{card.when}</span>
      </div>

      <p className="pt-3 text-[19px] text-ink">{card.role}</p>
      <p className="pt-2 text-[18px] text-[#6c737f]">{card.meta}</p>

      {card.rows?.map((row) => (
        <div
          key={row.label}
          className="mt-3 flex items-center justify-between rounded-[9px] bg-[#f3f4f6] px-3 py-2.5 text-[17px] text-[#4d5761]"
        >
          <span className="flex items-center gap-2">
            <Icon path={P.user} className="size-[18px] text-[#6c737f]" />
            {row.label}
          </span>
          <span>{row.range}</span>
        </div>
      ))}

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-4 text-[17px] text-[#9aa3af]">
          {[P.mail, P.comment, P.user, P.eyeSmall].map((icon, i) => (
            <span key={icon} className="flex items-center gap-1.5">
              <Icon path={icon} className="size-[18px]" />
              {card.counts[i]}
            </span>
          ))}
        </div>
        {card.draft && <span className="text-[17px] text-[#9aa3af]">임시저장</span>}
      </div>
    </div>
  )
}

export function SimpleScreen({ active = true }: { active?: boolean }) {
  /**
   * 김준서가 다음 칸으로 건너간다. 사라졌다 나타나는 게 아니라 카드가 실제로
   * 끌려가 떨어진다 — 이 화면이 하는 일이 "카드를 옮기는 것" 이라서, 옮기는
   * 장면 자체가 설명이다.
   *
   * 날아갈 거리는 실측한다. 무대 전체에 scale 이 걸려 있어 getBoundingClientRect
   * 는 배율이 섞인 값을 주므로, 같은 요소의 clientWidth(배율을 타지 않는
   * 레이아웃 값)로 나눠 설계 좌표로 되돌린 뒤 x/y 에 넣는다.
   */
  const [flight, setFlight] = useState<{
    left: number
    top: number
    width: number
    dx: number
    dy: number
  } | null>(null)
  const [moved, setMoved] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => {
      const grid = gridRef.current
      const card = cardRef.current
      const drop = dropRef.current
      if (!grid || !card || !drop) return
      const gridBox = grid.getBoundingClientRect()
      const scale = gridBox.width / grid.clientWidth || 1
      const from = card.getBoundingClientRect()
      const to = drop.getBoundingClientRect()
      setFlight({
        left: (from.left - gridBox.left) / scale,
        top: (from.top - gridBox.top) / scale,
        width: from.width / scale,
        dx: (to.left - from.left) / scale,
        dy: (to.top - from.top) / scale,
      })
    }, 1400)

    // 되감기는 정리 함수에서 한다 — 효과 본문에서 바로 state 를 바꾸면
    // 렌더가 한 번 더 도는 데다, 이 효과가 할 일은 "앞에 있는 동안"뿐이다.
    return () => {
      window.clearTimeout(timer)
      setFlight(null)
      setMoved(false)
    }
  }, [active])

  const columns = columnsFor(moved ? 'after' : flight ? 'lifting' : 'before')

  return (
    <div
      className="flex flex-col gap-4 overflow-hidden bg-white px-6 py-5 font-sans"
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
    >
      <TopBar title="2025 커리어링크 신입사원 수시채용" action="채용단계 추가" />

      <div className="flex items-center gap-8 border-b border-[#eceef2] text-[19px]">
        <span className="border-b-[3px] border-[#1d4ed8] pb-3 font-semibold text-[#1d4ed8]">채용단계 보기</span>
        <span className="pb-3 text-[#9aa3af]">전형 보기</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-[48px] items-center gap-1 rounded-[10px] border border-[#e1e4e8] bg-white p-[3px] text-[#6c737f]">
            <span className="rounded-[8px] bg-[#eef1f4] px-3 py-2 text-ink">
              <Icon path={P.board} className="size-[22px]" />
            </span>
            <span className="px-3 py-2">
              <Icon path={P.cards} className="size-[22px]" />
            </span>
          </span>
          <span className="flex h-[48px] items-center gap-2 rounded-[10px] bg-[#1d4ed8] px-5 text-[19px] font-semibold text-white">
            <Icon path={P.plus} className="size-[20px]" />
            전형 등록
          </span>
          <span className="flex h-[48px] items-center gap-2 rounded-[10px] border border-[#bcd3fa] bg-white px-5 text-[19px] font-semibold text-[#1d4ed8]">
            지원자 추가
            <Icon path={P.chevron} className="size-[18px]" />
          </span>
        </div>

        <div className="flex items-center gap-3 text-[#9aa3af]">
          <span className="flex h-[48px] w-[500px] items-center gap-3 rounded-[10px] border border-[#e1e4e8] bg-white px-4 text-[19px]">
            <Icon path={P.search} className="size-[20px]" />
            이름
          </span>
          {[P.clock, P.sliders, P.idCard].map((icon, i) => (
            <span
              key={icon}
              className="relative flex size-[48px] items-center justify-center rounded-[10px] border border-[#e1e4e8] bg-white text-[#4d5761]"
            >
              <Icon path={icon} className="size-[22px]" />
              {i === 2 && (
                <span className="absolute -right-2 -top-2 flex size-[26px] items-center justify-center rounded-full bg-[#1d4ed8] text-[15px] font-bold text-white">
                  9
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 단계별 칸. 지원자 카드가 쌓이는 쪽이 지금 붐비는 단계다.
          회색 판에 flex-1 을 줘 카드가 적은 칸도 바닥까지 내려온다 — 판이
          내용만큼만 차지하면 오른쪽 두 칸이 허공에 뜬 것처럼 보인다. */}
      <div ref={gridRef} className="relative grid flex-1 grid-cols-4 gap-5 overflow-hidden">
        {/* 집어 올린 카드는 칸 안이 아니라 격자 위에 따로 뜬다. 칸은 넘치는
            카드를 자르려고 overflow-hidden 을 쓰고 있어서, 그 안에 두면 옆
            칸으로 건너가는 도중에 잘려 나간다. 손에 들린 카드는 무엇에도
            가려지지 않아야 "들어서 옮긴다" 로 읽힌다. */}
        {flight && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute z-30 rounded-[12px]"
            style={{ left: flight.left, top: flight.top, width: flight.width }}
            initial={{ x: 0, y: 0, scale: 1, boxShadow: '0 2px 6px rgba(32,40,45,0.08)' }}
            animate={{
              x: flight.dx,
              y: flight.dy,
              scale: [1.04, 1.04, 1],
              boxShadow: '0 22px 44px rgba(32,40,45,0.26)',
            }}
            transition={{ duration: 0.85, ease: [0.32, 0, 0.2, 1], scale: { times: [0, 0.8, 1] } }}
            onAnimationComplete={() => {
              setFlight(null)
              setMoved(true)
            }}
          >
            <ApplicantCard card={MOVER} />
          </motion.div>
        )}
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center gap-3">
              <p className="text-[21px] font-semibold text-ink">{column.title}</p>
              <span className="text-[19px] font-bold text-[#4d5761]">{column.cards.length}</span>
            </div>
            <div className="flex flex-1 flex-col gap-3 rounded-[12px] bg-[#f7f8f9] p-3">
              {column.cards.map((card) => (
                /* 카드가 빠지면 아래 카드들이 빈자리를 메우며 올라온다. */
                <motion.div key={card.name} layout transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                  <ApplicantCard card={card} ref={card.name === MOVER.name ? cardRef : undefined} />
                </motion.div>
              ))}
              {/* 떨어질 자리. 높이가 없어 레이아웃에 영향을 주지 않는다. */}
              {column.title === '임원 면접' && <div ref={dropRef} className="h-0" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
