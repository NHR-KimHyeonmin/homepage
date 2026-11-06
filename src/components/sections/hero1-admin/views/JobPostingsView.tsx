import type { ReactNode } from 'react'
import clsx from 'clsx'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconClipboardList,
  IconColumns3,
  IconDots,
  IconExternalLink,
  IconFilter2,
  IconPlus,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react'
import { Chip, IconGroup, LINK } from './HomeView'

/** 채용 공고 현황 본문. 좌표는 본문 박스(판 기준 x 279, y 139) 좌상단 기준 px. */

const TABS = ['전체', '임시저장', '접수대기', '접수중', '접수마감', '채용종료']
const TAB_CENTERS = [32, 109, 197.5, 280, 363, 452]

/** 열 폭. 머리줄의 칸 사이에는 짧은 세로 막대가 있다. */
const COLS = [249, 100, 122, 100, 101, 100, 101, 120, 200, 201, 200]
const HEADS = ['공고명', '전형관리방식', '링크 / 전형관리', '최종제출', '임시저장', '조회수', '상태', '노출 범위', '서류 접수 시작', '서류 접수 마감', '공고 노출 시작']

const ROWS = [
  { title: '(샘플) 커리어링크 경력 채용', easy: true, n: 9, views: 48, done: true, dim: [0], dates: ['2026-04-16 (목) 00:00:00', '2026-08-29 (토) 15:00:59'] },
  { title: '(샘플) 커리어링크 신입/경력 채용', easy: false, n: 12, views: 79, done: false, dim: [], dates: ['2026-04-16 (목) 00:00:00', '2026-12-01 (화) 15:00:59'] },
]

function Cells({ cells, head }: { cells: ReactNode[]; head?: boolean }) {
  return (
    <>
      {COLS.map((w, i) => (
        <div
          key={i}
          className={clsx('relative flex shrink-0 items-center', i === 0 && !head ? 'pl-[10px]' : 'justify-center', i === 2 ? 'pl-[7px]' : head && 'pr-[18px]', head ? 'pb-[3px]' : 'pb-px')}
          style={{ width: w }}
        >
          {cells[i]}
          {head && i < COLS.length - 1 && <span className="absolute right-0 top-[15px] h-[18px] w-[2px] bg-[#e4e6e9]" />}
        </div>
      ))}
    </>
  )
}

export function JobPostingsView() {
  return (
    <div className="absolute inset-x-0 top-0 h-[397px] rounded-[8px] bg-white text-[#212121]">
      {/* 일반 / 인재 Pool 토글 */}
      <div className="absolute left-[15px] top-[16px] flex h-[33px] rounded-[6px] border border-[#e1e4e8] text-[14px]">
        <span className="flex w-[130px] items-center justify-center rounded-[6px] border border-[#b9bcc1] bg-[#f3f4f6] font-semibold -m-px">
          일반 채용 공고
        </span>
        <span className="flex w-[131px] items-center justify-center text-[#4d5761]">인재 Pool 및 상시</span>
      </div>

      {/* 상태 탭 */}
      <div className="absolute left-[15px] right-[16px] top-[62px] h-[45px] border-b border-[#eceef0] text-[14px] text-[#8e949e]">
        {TABS.map((t, i) => (
          <span
            key={t}
            className={clsx('absolute top-[-3px] -translate-x-1/2 leading-[45px]', i === 0 && 'font-semibold text-[#0042b7]')}
            style={{ left: TAB_CENTERS[i] }}
          >
            {t}
          </span>
        ))}
        <span className="absolute bottom-[-1px] left-0 h-[3px] w-[64px] bg-[#0042b7]" />
      </div>

      {/* 공고 등록 · 검색 · 도구 */}
      <span className="absolute left-[15px] top-[122px] flex h-[34px] w-[106px] items-center justify-center gap-[8px] rounded-[6px] bg-[#0042b7] text-[14px] font-semibold text-white">
        <IconPlus size={16} stroke={2} />
        공고 등록
      </span>
      <div className="absolute left-[816px] top-[122px] flex h-[33px] w-[707px] items-center rounded-[6px] border border-[#e1e4e8] pl-[13px] text-[13.5px] text-[#c4c8ce]">
        <IconSearch size={17} stroke={1.8} className="text-[#4d5761]" />
        <span className="ml-[13px]">공고명, 공고번호</span>
      </div>
      <span className="absolute left-[1535px] top-[129px] flex items-center gap-[8px] text-[#4d5761]">
        <IconSelector size={18} stroke={1.6} />
        <IconColumns3 size={19} stroke={1.6} />
        <IconFilter2 size={18} stroke={1.6} />
      </span>

      {/* 가로 스크롤 표 — 오른쪽 끝 '…' 칸은 고정 */}
      <div className="absolute left-[15px] top-[172px] h-[160px] w-[1594px] overflow-hidden rounded-[8px] border border-[#eceef0] text-[14px] text-[#4d5761]">
        <div className="absolute inset-y-0 left-0 right-[60px] overflow-hidden">
          <div className="flex h-[48px] w-max bg-[#f9fafb] font-semibold text-[#212121]">
            <Cells head cells={HEADS} />
          </div>
          {ROWS.map((r) => (
            <div key={r.title} className="flex h-[47px] w-max border-t border-[#eff1f3]">
              <Cells
                cells={[
                  <span className={LINK}>{r.title}</span>,
                  <Chip tone={r.easy ? 'orange' : 'gray'}>{r.easy ? '간편' : '기본'}</Chip>,
                  <IconGroup items={[IconExternalLink, IconClipboardList]} dim={r.dim} />,
                  <span className={LINK}>{r.n}</span>,
                  <span className={LINK}>0</span>,
                  r.views,
                  <Chip tone={r.done ? 'green' : 'blue'}>{r.done ? '접수마감' : '접수중'}</Chip>,
                  '채용사이트',
                  ...r.dates,
                  '2026-04-16 (목) 00:00:00',
                ]}
              />
            </div>
          ))}
        </div>
        {/* 고정 칸 */}
        <div className="absolute right-0 top-0 w-[60px]">
          <div className="h-[48px] bg-[#f9fafb]" />
          {ROWS.map((r) => (
            <div key={r.title} className="flex h-[47px] items-center justify-center border-t border-[#eff1f3] bg-white text-[#8e949e]">
              <IconDots size={16} stroke={1.6} />
            </div>
          ))}
        </div>
        {/* 가로 스크롤바 */}
        <div className="absolute inset-x-0 bottom-0 h-[15px] border-t border-[#eff1f3] bg-[#f7f8f9]">
          <span className="absolute left-[5px] top-[2px] h-[8px] w-[1134px] rounded-full bg-[#d9d9d9]" />
        </div>
      </div>

      {/* 페이지 크기 · 결과 수 · 페이지 번호 */}
      <span className="absolute left-[24px] top-[344px] flex h-[20px] items-center text-[13.5px]">
        10
        <IconChevronDown size={16} stroke={1.8} className="ml-[8px] text-[#4d5761]" />
        <span className="ml-[10px]">전체 결과 2개</span>
      </span>
      <span className="absolute left-[728px] top-[339px] flex items-center text-[#8e949e]">
        <IconChevronLeftPipe size={16} stroke={1.6} />
        <IconChevronLeft size={16} stroke={1.6} className="ml-[22px]" />
        <span className="ml-[15px] flex h-[32px] w-[31px] items-center justify-center rounded-[4px] bg-[#eef0f2] text-[13.5px] text-[#212121]">
          1
        </span>
        <IconChevronRight size={16} stroke={1.6} className="ml-[15px]" />
        <IconChevronRightPipe size={16} stroke={1.6} className="ml-[21px]" />
      </span>
    </div>
  )
}
