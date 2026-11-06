import type { ReactNode } from 'react'
import clsx from 'clsx'
import {
  IconSelector,
  IconChevronDown,
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconColumns3,
  IconCopy,
  IconDots,
  IconExternalLink,
  IconFilter2,
  IconHelpCircle,
  IconPencil,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react'
import previewPc from '../../../../assets/sections/hero1/builder-preview-pc.webp'
import previewMobile from '../../../../assets/sections/hero1/builder-preview-mobile.webp'

/** 판 좌표 그대로 놓는 절대 배치 상자(본문 박스 좌상단 기준). */
function At({ x, y, w, h, className, children }: { x: number; y: number; w?: number; h?: number; className?: string; children?: ReactNode }) {
  return (
    <div className={clsx('absolute', className)} style={{ left: x, top: y, width: w, height: h }}>
      {children}
    </div>
  )
}

/** 큰 것은 상단 설정 줄, small 은 표 안(꺼짐 트랙이 더 진하다). */
function Toggle({ on, small }: { on: boolean; small?: boolean }) {
  return (
    <span className={clsx('relative inline-block', small ? 'h-[16px] w-[30px]' : 'h-[16px] w-[36px]')}>
      <span
        className={clsx(
          'absolute rounded-full',
          small ? 'inset-x-[1px] inset-y-[3px]' : 'inset-x-[2px] inset-y-[1px]',
          on ? 'bg-[#7fa0db]' : small ? 'bg-[#9e9e9e]' : 'bg-[#d4d6da]',
        )}
      />
      <span
        className={clsx(
          'absolute rounded-full',
          small ? 'top-0 size-[16px]' : 'top-[-2px] size-[20px]',
          on ? 'right-0 bg-[#0042b7]' : 'left-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]',
        )}
      />
    </span>
  )
}

const CHIP = {
  수정: 'bg-[#f1f2f4] text-[#4d5761]',
  활성: 'bg-[#e5f5e7] text-[#3c9b4c]',
  비활성: 'bg-[#ffe7e9] text-[#f0444f]',
} as const

const HISTORY: [number, keyof typeof CHIP, string, string][] = [
  [8, '수정', '김현민', '2026-06-08 13:05:59'],
  [7, '수정', '김주원', '2026-04-27 14:25:18'],
  [6, '활성', '김용준', '2026-04-22 14:04:22'],
  [5, '비활성', '김용준', '2026-04-22 14:01:30'],
  [4, '수정', '김주원', '2026-04-15 09:31:21'],
  [3, '활성', '박상곤', '2026-04-14 17:02:39'],
  [2, '수정', '김주원', '2026-04-13 15:23:53'],
  [1, '수정', '김주원', '2026-04-13 15:23:15'],
]
const HISTORY_COLS = [86, 87, 188, 145]

const DESIGNS = [
  ['기본 디자인', '2026-04-09 13:48:04', '2026-06-08 13:05:59', true],
  ['01 기본형 (A Type)_신규', '2026-09-01 09:50:38', '2026-09-01 09:57:58', false],
] as const
const DESIGN_COLS = [397, 400, 399, 223, 135]

const card = 'rounded-[8px] border border-[#eceef1] bg-white'

export function SiteBuilderView() {
  return (
    <div className="relative size-full text-[#212121]">
      <div className="absolute inset-y-0 left-0 w-[1621px] rounded-t-[8px] bg-white" />

      {/* 위 카드: 사이트 설정 · 기본 디자인 · 변경이력 */}
      <At x={15} y={16} w={1591} h={627} className={card} />
      <At x={16} y={87} w={1589} h={1} className="bg-[#f1f2f4]" />
      <At x={810} y={17} w={1} h={70} className="bg-[#f1f2f4]" />
      <At x={1063} y={88} w={1} h={554} className="bg-[#f0f1f4]" />

      <At x={32} y={42} h={22} className="flex items-center text-[16px] font-medium">
        사이트 활성
        <span className="ml-[13px] mr-[17px]"><Toggle on /></span>
        <span className="font-bold underline decoration-[#c4c8ce] underline-offset-[3px]">guidance.careerlink.kr</span>
      </At>
      <At x={827} y={42} h={22} className="flex items-center text-[16px] font-medium">
        <IconHelpCircle size={18} stroke={1.6} className="mr-[7px] text-[#4d5761]" />
        그룹사 디자인 적용
        <span className="ml-[9px] mr-[23px]"><Toggle on={false} /></span>
        <span className="font-bold underline decoration-[#c4c8ce] underline-offset-[3px]">sample.careerlink.kr</span>
        <IconExternalLink size={18} stroke={1.6} className="ml-[13px] text-[#4d5761]" />
        <IconCopy size={18} stroke={1.6} className="ml-[18px] text-[#4d5761]" />
      </At>

      <At x={32} y={111} h={22} className="flex items-center text-[16px] font-bold">기본 디자인</At>
      <At x={883} y={104} w={78} h={32} className="flex items-center gap-[8px] rounded-[6px] border border-[#dfe1e5] pl-[11px] text-[14px] text-[#212121]">
        <IconCopy size={18} stroke={1.6} />
        복제
      </At>
      <At x={969} y={104} w={78} h={32} className="flex items-center gap-[8px] rounded-[6px] border border-[#a6bde6] pl-[12px] text-[14px] text-[#0042b7]">
        <IconPencil size={18} stroke={1.6} />
        수정
      </At>
      <At x={32} y={145} w={758} h={481} className="overflow-hidden rounded-[4px] border border-[#eceef1]">
        <img src={previewPc} alt="" className="size-full" />
      </At>
      <At x={807} y={145} w={242} h={481} className="overflow-hidden rounded-[4px] border border-[#eceef1]">
        <img src={previewMobile} alt="" className="size-full" />
      </At>

      <At x={1081} y={110} h={22} className="flex items-baseline gap-[8px] text-[16px] font-bold">
        사이트 변경이력
        <span className="text-[14px] font-normal text-[#6c737f]">(최근 100건)</span>
      </At>
      <At x={1081} y={145} w={508} className="overflow-hidden rounded-[8px] border border-[#e9eaed] text-[14px]">
        <div className="flex h-[37px] items-center bg-[#f9fafb] font-medium">
          {['순번', '내용', '작업자', '보기 / 복제'].map((t, i) => (
            <span key={t} className="text-center" style={{ width: HISTORY_COLS[i] }}>{t}</span>
          ))}
        </div>
        {HISTORY.map(([n, chip, name, at]) => (
          <div key={n} className="flex h-[52.6px] items-center border-t border-[#eceef0]">
            <span className="text-center text-[#4d5761]" style={{ width: HISTORY_COLS[0] }}>{n}</span>
            <span className="flex justify-center" style={{ width: HISTORY_COLS[1] }}>
              <span className={clsx('-translate-y-[1px] rounded-full px-[9px] py-[4px] text-[13px] font-medium leading-none', CHIP[chip])}>{chip}</span>
            </span>
            <span className="flex -translate-y-[2px] flex-col items-center leading-[21px]" style={{ width: HISTORY_COLS[2] }}>
              <span className="text-[14px] text-[#4d5761]">{name}</span>
              <span className="text-[12.5px] text-[#6c737f]">{at}</span>
            </span>
            <span className="flex justify-center" style={{ width: HISTORY_COLS[3] }}>
              <span className="flex h-[30px] overflow-hidden rounded-[6px] border border-[#e4e6e9] text-[#4d5761]">
                <span className="flex w-[29px] items-center justify-center"><IconExternalLink size={18} stroke={1.7} /></span>
                <span className="flex w-[29px] items-center justify-center border-l border-[#e4e6e9]"><IconCopy size={18} stroke={1.7} /></span>
              </span>
            </span>
          </div>
        ))}
      </At>

      {/* 아래 카드: 디자인 목록 */}
      <At x={15} y={659} w={1591} h={264} className={card} />
      <At x={32} y={676} w={118} h={34} className="flex items-center justify-center gap-[6px] rounded-[6px] bg-[#0042b7] text-[14px] font-semibold text-white">
        <IconPlus size={18} stroke={1.8} />
        디자인 생성
      </At>
      <At x={815} y={676} w={688} h={34} className="flex items-center rounded-[6px] border border-[#dfe1e5] pl-[13px] text-[14px] text-[#b4bac4]">
        <IconSearch size={17} stroke={1.7} className="mr-[12px] text-[#4d5761]" />
        제목
      </At>
      <At x={1514} y={684} className="flex gap-[8px] text-[#4d5761]">
        <IconSelector size={18} stroke={1.6} />
        <IconColumns3 size={18} stroke={1.6} />
        <IconFilter2 size={18} stroke={1.6} />
      </At>
      <At x={32} y={726} w={1556} className="overflow-hidden rounded-[8px] border border-[#eceef1] text-[14px]">
        <div className="flex h-[48px] items-center bg-[#f9fafb] font-medium">
          {['제목', '생성일', '최근 변경일', '게시여부', ''].map((t, i) => (
            <span key={i} className="relative -translate-y-[3px] text-center" style={{ width: DESIGN_COLS[i] }}>
              <span className="relative left-[-8px]">{t}</span>
              {i < 4 && <span className="absolute right-[-1px] top-[-7px] h-[22px] w-[2px] bg-[#e5e7eb]" />}
            </span>
          ))}
        </div>
        {DESIGNS.map(([title, created, updated, on], r) => (
          <div key={title} className={clsx('flex items-center border-t border-[#eceef0] pb-[4px] text-[#4d5761]', r ? 'h-[41px]' : 'h-[42px]')}>
            <span className="pl-[8px] text-[#3c5fd7] underline underline-offset-[3px]" style={{ width: DESIGN_COLS[0] }}>{title}</span>
            <span className="pl-[4px] text-center" style={{ width: DESIGN_COLS[1] }}>{created}</span>
            <span className="pl-[6px] text-center" style={{ width: DESIGN_COLS[2] }}>{updated}</span>
            <span className="flex justify-center" style={{ width: DESIGN_COLS[3] }}><span className="ml-[5px] mt-[5px]"><Toggle on={on} small /></span></span>
            <span className="flex justify-center pl-[10px] text-[#8e949e]" style={{ width: DESIGN_COLS[4] }}><IconDots size={16} stroke={1.6} /></span>
          </div>
        ))}
      </At>
      <At x={40} y={869} h={22} className="flex items-center text-[14px]">
        10
        <IconChevronDown size={16} stroke={1.6} className="ml-[8px] mr-[11px] text-[#4d5761]" />
        전체 결과 2개
      </At>
      <At x={725} y={865} h={32} className="flex items-center text-[#8e949e]">
        <IconChevronLeftPipe size={16} stroke={1.6} />
        <IconChevronLeft size={16} stroke={1.6} className="ml-[22px]" />
        <span className="ml-[16px] flex size-[32px] items-center justify-center rounded-[4px] bg-[#ebebeb] text-[14px] text-[#212121]">1</span>
        <IconChevronRight size={16} stroke={1.6} className="ml-[13px]" />
        <IconChevronRightPipe size={16} stroke={1.6} className="ml-[21px]" />
      </At>
    </div>
  )
}
