import type { CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import {
  IconArrowsDiagonal,
  IconChevronDown,
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconDownload,
  IconFilter2,
  IconLayoutColumns,
  IconProgressCheck,
  IconRefresh,
  IconSearch,
  IconSelector,
  IconUser,
} from '@tabler/icons-react'

/** 판(1920x1080) 기준 절대 좌표 상자 — 캡처에서 잰 값을 그대로 쓴다. */
function Box({ x, y, w, h, className, style, children }: { x: number; y: number; w?: number; h?: number; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div className={clsx('absolute', className)} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  )
}

const card = 'rounded-[8px] border border-[#eceef1] bg-white'

/** 테두리 선택칸(▼). legend 가 있으면 위 테두리에 걸친 작은 라벨. */
function Select({ x, w, y = 489, legend, text, muted }: { x: number; w: number; y?: number; legend?: string; text: string; muted?: boolean }) {
  return (
    <Box x={x} y={y} w={w} h={34} className="flex items-center rounded-[6px] border border-[#e4e6e9] bg-white pr-[10px] pl-[11px] text-[14px]">
      {legend && <span className="absolute -top-[7px] left-[12px] bg-white px-[3px] text-[11px] leading-[12px] text-[#6c737f]">{legend}</span>}
      <span className={muted ? 'text-[#8e949e]' : 'text-[#212121]'}>{text}</span>
      <IconChevronDown className="ml-auto size-[18px] text-[#4d5761]" stroke={1.8} />
    </Box>
  )
}

const Check = ({ y }: { y: number }) => <Box x={345} y={y} w={15} h={15} className="rounded-[3px] border-[1.5px] border-[#a9adb4] bg-white" />

/** 표 열: 머리글 가운데 x, 칸 가운데 x(이메일은 왼쪽 정렬 시작 x). */
const COLS: { head: string; hx: number; dx: number }[] = [
  { head: '부서명', hx: 481, dx: 493.5 },
  { head: '평가자', hx: 680, dx: 690.5 },
  { head: '이메일', hx: 899.5, dx: 799 },
  { head: '평균 부여점수 / 만점', hx: 1118.5, dx: 1129 },
  { head: '평가완료', hx: 1298, dx: 1309 },
  { head: '평가대상자', hx: 1457, dx: 1468 },
  { head: '상태', hx: 1616.5, dx: 1627.5 },
  { head: '평가보기', hx: 1786, dx: 1787 },
]
const ROWS = [
  ['인사팀', '인사 담당자', 'hr@nhr.kr', '5 / 10', '3', '10'],
  ['영업팀', '영업 실무자', 'sales@nhr.kr', '7.5 / 10', '2', '11'],
]

/** 가운데 x 에 맞춰 놓는 글자. */
const At = ({ x, y, className, children }: { x: number; y: number; className?: string; children: ReactNode }) => (
  <Box x={x} y={y} className={clsx('-translate-x-1/2 whitespace-nowrap', className)}>
    {children}
  </Box>
)

/** 평균 점수 그래프: 0~10 점, 세 그룹. */
const PLOT = { x0: 1146, x1: 1850, y0: 418, unit: 16.3 }
const BARS = [
  { label: '6월 1일 면접3', v: 10 },
  { label: '6월 1일 면접1', v: 5 },
  { label: '6월 1일 면접2', v: 5 },
]

function Chart() {
  const gw = (PLOT.x1 - PLOT.x0) / BARS.length
  const yOf = (v: number) => PLOT.y0 - v * PLOT.unit
  return (
    <>
      <svg className="absolute top-0 left-0" width={1920} height={460}>
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={PLOT.x0} x2={PLOT.x1} y1={Math.round(yOf(i + 1)) + 0.5} y2={Math.round(yOf(i + 1)) + 0.5} stroke="#ececec" />
        ))}
        <line x1={PLOT.x0} x2={PLOT.x1} y1={418.5} y2={418.5} stroke="#e4e4e4" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={PLOT.x0 + i * gw + 0.5} x2={PLOT.x0 + i * gw + 0.5} y1={418} y2={424} stroke="#e4e4e4" />
        ))}
        {BARS.map((b, i) => (
          <rect key={i} x={PLOT.x0 + (i + 0.5) * gw - 10} y={yOf(b.v)} width={20} height={b.v * PLOT.unit} fill="#feb019" />
        ))}
        <line x1={PLOT.x0} x2={PLOT.x1} y1={320.5} y2={320.5} stroke="#9ea2a9" />
      </svg>
      {Array.from({ length: 11 }, (_, v) => (
        <Box key={v} x={1110} y={yOf(v) - 10} w={26} className="text-right text-[10px] leading-[14px] text-[#4d5761]">
          {v}
        </Box>
      ))}
      {BARS.map((b, i) => {
        const cx = PLOT.x0 + (i + 0.5) * gw
        return (
          <div key={i}>
            <At x={cx} y={yOf(b.v / 2) - 7} className="text-[9px] leading-[14px] font-bold text-white">
              {b.v}
            </At>
            <At x={cx} y={429} className="text-[12px] leading-[16px] text-[#212121]">
              {b.label}
            </At>
          </div>
        )
      })}
      <Box x={1777} y={307} className="text-[11px] leading-[14px] text-[#212121]">
        전체 평균(6.00)
      </Box>
    </>
  )
}

const STATUS = [
  { label: '평가완료', n: 0, bg: '#eaf6ea', dot: '#2ba329' },
  { label: '평가중', n: 2, bg: '#fef3e6', dot: '#f57c1f' },
  { label: '평가전', n: 0, bg: '#ffe7e9', dot: '#ee2a3c' },
]

export function EvaluationView() {
  return (
    <div className="relative size-full overflow-hidden">
      {/* 본문 박스 좌상단(279,139)을 판 원점으로 되돌려 판 좌표를 그대로 쓴다 */}
      <div className="absolute -top-[139px] -left-[279px] h-[1080px] w-[1920px]">
        <Box x={279} y={139} w={1621} h={686} className="rounded-[8px] bg-white" />

        {/* 평가 기간 */}
        <Box x={295} y={156} w={786} h={100} className={card} />
        <Box x={312} y={181} className="text-[14px] leading-[20px] text-[#4d5761]">
          평가 시작일 :&nbsp; 2026-06-15 (월) 00:00
        </Box>
        <Box x={312} y={212} className="text-[14px] leading-[20px] text-[#4d5761]">
          평가 종료일 :&nbsp; 2026-07-15 (수) 18:00
        </Box>
        <Box x={915} y={173} w={150} h={66} className="flex items-center justify-center rounded-[6px] border border-[#e8eaee] bg-[#f6f7f9] text-[16px] font-bold text-[#212121]">
          평가 종료
        </Box>

        {/* 평가자 · 완료율 */}
        <Box x={295} y={263} w={786} h={193} className={card} />
        <Box x={689} y={264} w={1} h={191} className="bg-[#eceef1]" />
        <Box x={311} y={283} className="flex items-center gap-[7px] text-[16px] leading-[20px] font-semibold text-[#212121]">
          <IconUser className="size-[18px]" stroke={1.8} />
          평가자
        </Box>
        <Box x={645} y={283} className="text-[15px] leading-[20px] text-[#212121]">
          <b>2</b> <span className="text-[13px] text-[#4d5761]">명</span>
        </Box>
        {STATUS.map((s, i) => (
          <Box key={s.label} x={312} y={328 + i * 34} w={360} h={31} className="flex items-center rounded-[4px] pr-[11px] pl-[13px] text-[12px] font-semibold text-[#212121]" style={{ background: s.bg }}>
            <span className="mr-[10px] size-[5px] rounded-full" style={{ background: s.dot }} />
            {s.label}
            <span className="ml-auto text-[13px] font-medium">
              {s.n} <span className="text-[12px]">명</span>
            </span>
          </Box>
        ))}
        <Box x={706} y={283} className="flex items-center gap-[8px] text-[16px] leading-[20px] font-semibold text-[#212121]">
          <IconProgressCheck className="size-[18px]" stroke={1.8} />
          완료율
        </Box>
        <At x={884} y={351} className="text-[13px] leading-[18px] text-[#6c737f]">
          23.8%
        </At>
        <Box x={706} y={378} w={359} h={10} className="overflow-hidden rounded-full bg-[#e5e7eb]">
          <div className="h-full w-[84px] bg-[#2ba329]" />
        </Box>
        <Box x={706} y={393} className="text-[13px] leading-[18px] text-[#4d5761]">
          완료 <b className="text-[#212121]">5</b> 건
        </Box>
        <Box x={1008} y={393} className="text-[13px] leading-[18px] text-[#4d5761]">
          전체 <b className="text-[#212121]">21</b> 건
        </Box>

        {/* 평균 점수 그래프 */}
        <Box x={1090} y={156} w={786} h={300} className={card} />
        <Box x={1107} y={176} className="text-[16px] leading-[20px] font-semibold text-[#212121]">
          평균 점수
        </Box>
        <Box x={1107} y={205} className="text-[14px] leading-[18px] text-[#6c737f]">
          상위 10개 그룹까지 표시됩니다.
        </Box>
        <IconArrowsDiagonal className="absolute top-[178px] left-[1836px] size-[17px] text-[#4d5761]" stroke={1.8} />
        <Chart />

        {/* 필터 + 표 */}
        <Box x={295} y={473} w={1589} h={336} className={card} />
        <Box x={312} y={489} w={80} h={34} className="flex items-center gap-[6px] rounded-[6px] border border-[#e4e6e9] pl-[9px] text-[14px] font-medium text-[#212121]">
          <IconRefresh className="size-[16px]" stroke={2} />
          초기화
        </Box>
        <Box x={401} y={489} w={111} h={34} className="flex overflow-hidden rounded-[6px] border border-[#e4e6e9] text-[14px]">
          <span className="flex w-[54px] items-center justify-center border border-[#bebfc0] bg-[#f2f3f5] font-semibold text-[#212121] rounded-l-[6px] -m-px">일반</span>
          <span className="flex flex-1 items-center justify-center text-[#6c737f]">상시</span>
        </Box>
        <Select x={519} w={958} legend="채용공고 목록" text="(샘플) 커리어링크 신입/경력 채용" />
        <Select x={1485} w={382} legend="전형명" text="서류전형" />
        <Box x={312} y={539} w={1555} h={1} className="bg-[#f3f4f6]" />

        <Box x={312} y={556} w={186} h={33} className="flex items-center gap-[8px] rounded-[6px] border border-[#acc1e7] pl-[13px] text-[14px] font-medium text-[#0042b7]">
          <IconDownload className="size-[16px]" stroke={2} />
          평가 결과 엑셀 다운로드
        </Box>
        <Select x={886} y={555} w={199} text="평가상태" muted />
        <Box x={1094} y={555} w={687} h={34} className="flex items-center gap-[10px] rounded-[6px] border border-[#e2e5e9] pl-[12px] text-[13px] text-[#c4c8ce]">
          <IconSearch className="size-[16px] text-[#4d5761]" stroke={1.8} />
          부서명, 평가자, 이메일
        </Box>
        <IconSelector className="absolute top-[563px] left-[1793px] size-[18px] text-[#4d5761]" stroke={1.8} />
        <IconLayoutColumns className="absolute top-[563px] left-[1819px] size-[18px] text-[#4d5761]" stroke={1.6} />
        <IconFilter2 className="absolute top-[563px] left-[1845px] size-[18px] text-[#4d5761]" stroke={1.8} />

        {/* 표 */}
        <Box x={312} y={605} w={1555} h={139} className="overflow-hidden rounded-[6px] border border-[#eceef1]">
          <div className="h-[49px] border-b border-[#eceef1] bg-[#f9fafb]" />
          <div className="h-[44px] border-b border-[#eceef1]" />
        </Box>
        {[589, 788, 1026, 1225, 1385, 1545, 1704].map((x) => (
          <Box key={x} x={x} y={618} w={2} h={20} className="bg-[#e7e9ec]" />
        ))}
        <Check y={622} />
        {COLS.map((c) => (
          <At key={c.head} x={c.hx} y={619} className="text-[13px] leading-[20px] font-semibold text-[#212121]">
            {c.head}
          </At>
        ))}
        {ROWS.map((r, i) => {
          const y = 667 + i * 44
          return (
            <div key={i} className="text-[14px] leading-[20px] text-[#212121]">
              <Check y={y + 2} />
              {[0, 1, 3, 4].map((k) => (
                <At key={k} x={COLS[k].dx} y={y}>
                  {r[k]}
                </At>
              ))}
              <Box x={799} y={y}>{r[2]}</Box>
              <At x={COLS[5].dx} y={y} className="text-[#2f6fe0] underline underline-offset-[2px]">
                {r[5]}
              </At>
              <At x={COLS[6].dx} y={y - 2} className="flex h-[24px] w-[50px] items-center justify-center rounded-full bg-[#fef3e6] text-[12px] text-[#f5762b]">
                평가중
              </At>
              <At x={COLS[7].dx} y={y - 4} className="flex h-[28px] w-[64px] items-center justify-center rounded-[6px] border border-[#e1e3e7] bg-white text-[12px] font-semibold">
                평가보기
              </At>
            </div>
          )
        })}

        {/* 페이지네이션 */}
        <Box x={320} y={756} className="flex items-center text-[14px] leading-[20px] text-[#212121]">
          10
          <IconChevronDown className="mr-[11px] ml-[9px] size-[14px]" stroke={2} />
          전체 결과 2개
        </Box>
        <IconChevronLeftPipe className="absolute top-[759px] left-[1005px] size-[17px] text-[#8e949e]" stroke={1.8} />
        <IconChevronLeft className="absolute top-[759px] left-[1043px] size-[17px] text-[#8e949e]" stroke={1.8} />
        <Box x={1074} y={752} w={32} h={32} className="flex items-center justify-center rounded-[4px] bg-[#eef0f2] text-[13px] text-[#212121]">
          1
        </Box>
        <IconChevronRight className="absolute top-[759px] left-[1119px] size-[17px] text-[#8e949e]" stroke={1.8} />
        <IconChevronRightPipe className="absolute top-[759px] left-[1157px] size-[17px] text-[#8e949e]" stroke={1.8} />
      </div>
    </div>
  )
}
