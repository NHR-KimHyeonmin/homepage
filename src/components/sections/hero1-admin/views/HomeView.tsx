import type { ComponentType, CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsDown,
  IconClipboardList,
  IconClipboardSearch,
  IconExternalLink,
  IconListDetails,
  IconMessages,
  IconUser,
  IconUsers,
} from '@tabler/icons-react'

/** 대시보드 본문. 좌표는 본문 박스(판 기준 x 279, y 78) 좌상단 기준 px. */

type TablerIcon = ComponentType<{ size?: number; stroke?: number; className?: string }>

const CARD = 'absolute rounded-[8px] border border-[#eceef0] bg-white shadow-[0_2px_4px_rgba(30,40,60,0.04)]'

export function Chip({ tone, children }: { tone: 'blue' | 'gray' | 'green' | 'orange'; children: ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex h-[24px] items-center rounded-full px-[10px] text-[12.5px] leading-none',
        tone === 'blue' && 'bg-[#e6ecf8] text-[#0042b7]',
        tone === 'gray' && 'bg-[#f3f4f6] text-[#212121]',
        tone === 'green' && 'bg-[#eaf6ea] text-[#2fa52d]',
        tone === 'orange' && 'bg-[#fff1e6] text-[#f2711c]',
      )}
    >
      {children}
    </span>
  )
}

/** 테두리로 이어 붙인 작은 아이콘 버튼 묶음. dim 은 흐린(비활성) 칸의 번호. */
export function IconGroup({ items, dim = [] }: { items: (TablerIcon | 'ab')[]; dim?: number[] }) {
  return (
    <span className="inline-flex h-[29px] overflow-hidden rounded-[6px] border border-[#e1e4e8] bg-white">
      {items.map((Icon, i) => (
        <span
          key={i}
          className={clsx(
            'flex w-[28px] items-center justify-center',
            i > 0 && 'border-l border-[#e1e4e8]',
            dim.includes(i) ? 'text-[#c4c8ce]' : 'text-[#4d5761]',
          )}
        >
          {Icon === 'ab' ? (
            <span className="text-[10px] font-bold tracking-[-0.3px]">A|B</span>
          ) : (
            <Icon size={17} stroke={1.6} />
          )}
        </span>
      ))}
    </span>
  )
}

export const LINK = 'text-[#1769db] underline underline-offset-[3px] decoration-[#1769db]'

function StatCard({ left, label, value, Icon, iconBg, iconColor, extra }: {
  left: number
  label: string
  value: string
  Icon: TablerIcon
  iconBg: string
  iconColor: string
  extra?: ReactNode
}) {
  return (
    <div className={CARD} style={{ left, top: 17, width: 392, height: 127 }}>
      <span className="absolute left-[24px] top-[29px] text-[15px] leading-none text-[#4d5761]">{label}</span>
      <span className="absolute left-[24px] top-[59px] flex items-center gap-[9px]">
        <span className="text-[34.5px] font-bold leading-[40px] text-[#212121] underline decoration-[#9b9b9c] decoration-[2px] underline-offset-[4px]">
          {value}
        </span>
        {extra}
      </span>
      <span
        className="absolute right-[25px] top-[24px] flex size-[36px] items-center justify-center rounded-[6px]"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={20} stroke={1.7} />
      </span>
    </div>
  )
}

/** 열 폭과 정렬. 같은 배열로 머리줄과 본문 칸을 그린다. */
type Col = { w: number; align?: 'left' }

function Row({ cols, cells, head, className, style }: {
  cols: Col[]
  cells: ReactNode[]
  head?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={clsx('flex', className)} style={style}>
      {cols.map((c, i) => (
        <div
          key={i}
          className={clsx(
            'flex shrink-0 items-center',
            c.align === 'left' && !head ? 'justify-start pl-[9px]' : 'justify-center',
          )}
          style={{ width: c.w }}
        >
          {cells[i]}
        </div>
      ))}
    </div>
  )
}

const TABLE = 'absolute overflow-hidden rounded-[8px] border border-[#eceef0] text-[14px] text-[#4d5761]'
const HEAD = 'h-[48px] bg-[#f9fafb] font-semibold text-[#212121]'
const BODY_ROW = 'h-[47px] border-t border-[#eff1f3]'

const POST_COLS: Col[] = [
  { w: 62 }, { w: 98 }, { w: 254, align: 'left' }, { w: 118 }, { w: 102 }, { w: 119 },
  { w: 201 }, { w: 201 }, { w: 201 }, { w: 200 },
]

const POSTS = [
  { open: false, kind: '일반', title: '(샘플) 커리어링크 경력 채용', n: 9, done: true, dim: [0], dates: ['2026-04-16 (목) 00:00:00', '2026-08-29 (토) 15:00:59', '2026-04-16 (목) 00:00:00', '2026-08-29 (토) 15:00:59'] },
  { open: true, kind: '인재Pool', title: '(샘플) 커리어링크 수시 채용', n: 11, done: false, dim: [1], dates: [] },
  { open: false, kind: '일반', title: '(샘플) 커리어링크 신입/경력 채용', n: 12, done: false, dim: [], dates: ['2026-04-16 (목) 00:00:00', '2026-12-01 (화) 15:00:59', '2026-04-16 (목) 00:00:00', '2026-12-01 (화) 15:00:59'] },
]

const APP_COLS: Col[] = [
  { w: 83 }, { w: 152 }, { w: 384, align: 'left' }, { w: 276, align: 'left' }, { w: 232 }, { w: 150, align: 'left' }, { w: 278 },
]

const APPLICANTS = [
  ['김윤서', '일반', '(샘플) 커리어링크 신입/경력 채용', '디자인', true, '서울대학교', '2026-05-11 15:06:55'],
  ['서지현', '인재Pool', '(샘플) 커리어링크 수시 채용', '디자인', false, '연세대학교', '2026-05-04 18:10:33'],
  ['조유빈', '인재Pool', '(샘플) 커리어링크 수시 채용', '세일즈', false, '성균관대학교', '2026-05-04 18:09:56'],
  ['조유빈', '일반', '(샘플) 커리어링크 경력 채용', '세일즈', true, '성균관대학교', '2026-05-04 18:09:30'],
  ['서지현', '일반', '(샘플) 커리어링크 신입/경력 채용', '디자인', true, '연세대학교', '2026-05-04 18:02:51'],
] as const

const kindTone = (k: string) => (k === '일반' ? 'blue' : 'gray')

/** 아래 테두리만 있는 입력칸/선택칸. */
const FIELD = 'absolute flex items-center rounded-[6px] border border-[#e1e4e8] bg-white text-[13.5px]'

export function HomeView() {
  return (
    <div className="absolute inset-y-0 left-0 rounded-[8px] bg-white" style={{ width: 1621 }}>
      <StatCard
        left={15}
        label="총 회원수"
        value="1,425"
        Icon={IconUser}
        iconBg="#e7edf8"
        iconColor="#0042b7"
        extra={
          <span className="flex h-[20px] items-center rounded-full bg-[#e8edf9] px-[8px] text-[13px] font-medium text-[#0042b7]">
            + 0
          </span>
        }
      />
      <StatCard left={415} label="접수 중 공고" value="2" Icon={IconListDetails} iconBg="#f1f2f3" iconColor="#6c737f" />
      <StatCard left={814} label="Today" value="0" Icon={IconUsers} iconBg="#fef3e5" iconColor="#f08c2e" />
      <StatCard left={1214} label="1:1 문의" value="1" Icon={IconMessages} iconBg="#e8f6e8" iconColor="#2f9a4b" />

      {/* 탭 */}
      <div className="absolute left-[15px] right-[15px] top-[161px] h-[47px] border-b border-[#eceef0] text-[14px]">
        <span className="absolute left-0 top-0 flex h-[45px] w-[92px] items-center justify-center font-semibold text-[#212121]">
          지원 현황
        </span>
        <span className="absolute bottom-[-1px] left-0 h-[3px] w-[92px] bg-[#444]" />
        <span className="absolute left-[112px] top-0 flex h-[45px] items-center text-[#8e949e]">일정</span>
      </div>

      {/* 최근 공고 */}
      <div className={CARD} style={{ left: 15, top: 224, width: 1592, height: 270 }}>
        <span className="absolute left-[17px] top-[22px] text-[15.5px] font-semibold leading-none">최근 공고</span>
        <span className="absolute right-[17px] top-[16px] flex h-[29px] w-[64px] items-center justify-center rounded-[6px] border border-[#e1e4e8] text-[12.5px] font-medium">
          더보기
        </span>
        <div className={TABLE} style={{ left: 15, top: 61, width: 1558 }}>
          <Row
            cols={POST_COLS}
            className={HEAD}
            head
            cells={[<IconChevronsDown size={16} stroke={1.8} className="text-[#6c737f]" />, '구분', '공고명', '링크 / 전형관리', '최종제출', '상태', '서류 접수 시작', '서류 접수 마감', '공고 노출 시작', '공고 노출 종료']}
          />
          {POSTS.map((p) => (
            <Row
              key={p.title}
              cols={POST_COLS}
              className={BODY_ROW}
              cells={[
                p.open ? <IconChevronDown size={15} stroke={1.8} className="text-[#4d5761]" /> : <IconChevronRight size={15} stroke={1.6} className="text-[#8e949e]" />,
                <Chip tone={kindTone(p.kind)}>{p.kind}</Chip>,
                <span className={LINK}>{p.title}</span>,
                <IconGroup items={[IconExternalLink, IconClipboardList]} dim={p.dim} />,
                <span className={LINK}>{p.n}</span>,
                <Chip tone={p.done ? 'green' : 'blue'}>{p.done ? '접수마감' : '접수중'}</Chip>,
                ...p.dates,
              ]}
            />
          ))}
        </div>
      </div>

      {/* 최근 지원자 */}
      <div className={CARD} style={{ left: 15, top: 510, width: 1592, height: 408 }}>
        <span className="absolute left-[17px] top-[22px] text-[15.5px] font-semibold leading-none">최근 지원자</span>
        <div className={TABLE} style={{ left: 15, top: 61, width: 1558 }}>
          <Row cols={APP_COLS} className={HEAD} head cells={['이름', '구분', '공고명', '지원직무', '지원서 / MY / 평가', '최종학교', '제출일']} />
          {APPLICANTS.map(([name, kind, title, job, ab, school, date], i) => (
            <Row
              key={i}
              cols={APP_COLS}
              className={BODY_ROW}
              cells={[
                name,
                <Chip tone={kindTone(kind)}>{kind}</Chip>,
                <span className={LINK}>{title}</span>,
                job,
                <IconGroup items={[IconClipboardSearch, IconClipboardList, 'ab']} dim={ab ? [] : [2]} />,
                school,
                date,
              ]}
            />
          ))}
        </div>
        {/* 페이지 크기 · 페이지 번호 */}
        <span className="absolute left-[24px] top-[357px] flex items-center gap-[12px] text-[13.5px]">
          5 <IconChevronDown size={16} stroke={1.8} className="text-[#4d5761]" />
        </span>
        <span className="absolute left-[675px] top-[354px] flex items-center text-[13.5px] text-[#4d5761]">
          <IconChevronLeft size={14} stroke={1.6} className="mr-[7px] text-[#b4bac4]" />
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <span
              key={n}
              className={clsx('flex size-[26px] items-center justify-center rounded-[4px] mx-[1px]', n === 1 && 'bg-[#f1f2f4]')}
            >
              {n}
            </span>
          ))}
          <IconChevronRight size={14} stroke={1.8} className="ml-[7px] text-[#212121]" />
        </span>
      </div>

      {/* 아래쪽 필터 줄(화면 밖으로 잘린다) */}
      <div className="absolute left-[15px] top-[932px] flex h-[34px] rounded-[6px] border border-[#e1e4e8] text-[13.5px] text-[#4d5761]">
        <span className="flex w-[55px] items-center justify-center rounded-[6px] border border-[#a9aeb6] bg-[#f3f4f6] font-semibold text-[#212121]">일반</span>
        <span className="flex w-[83px] items-center justify-center border-r border-[#e1e4e8]">인재Pool</span>
        <span className="flex w-[54px] items-center justify-center">상시</span>
      </div>
      <div className={FIELD} style={{ left: 218, top: 932, width: 1389, height: 34 }}>
        <span className="pl-[14px] text-[#6c737f]">채용공고 목록</span>
      </div>
      <div className={FIELD} style={{ left: 15, top: 973, width: 1314, height: 40 }}>
        <span className="pl-[14px] text-[#6c737f]">직무 선택</span>
        <IconChevronDown size={18} stroke={1.6} className="absolute right-[12px] text-[#4d5761]" />
      </div>
      <div className={FIELD} style={{ left: 1337, top: 973, width: 180, height: 40 }}>
        <span className="absolute -top-[6px] left-[10px] bg-white px-[3px] text-[10px] leading-none text-[#8e949e]">대상자</span>
        <span className="pl-[14px] text-[#212121]">전체</span>
        <IconChevronDown size={18} stroke={1.6} className="absolute right-[12px] text-[#4d5761]" />
      </div>
      <div
        className="absolute flex items-center justify-center rounded-[6px] bg-[#0042b7] text-[13.5px] font-semibold text-white"
        style={{ left: 1526, top: 973, width: 79, height: 40 }}
      >
        조회하기
      </div>
    </div>
  )
}
