import type { ComponentType, ReactNode } from 'react'
import {
  IconArrowRight,
  IconCalendarEvent,
  IconCalendarUser,
  IconChevronDown,
  IconChevronUp,
  IconCircleDashedCheck,
  IconClipboardPlus,
  IconCornerDownRight,
  IconDotsVertical,
  IconEye,
  IconFileUpload,
  IconFilterCheck,
  IconGripVertical,
  IconListCheck,
  IconListDetails,
  IconPlugConnected,
  IconPlus,
  IconSend,
  IconUser,
  IconUserCheck,
  IconUserEdit,
  IconUserSearch,
} from '@tabler/icons-react'

type Icon = ComponentType<{ size?: number; stroke?: number; className?: string }>

const GREEN = '#2ea043'
const RED = '#ef2b2b'
const GRAY_DOT = '#d5d8de'

/** 전형 관리 — 일반/상시 토글, 공고 선택, 전형 단계 카드. */
export function HiringProcessView() {
  return (
    <div className="h-[1100px] w-[1621px] rounded-t-[8px] bg-white px-[16px] pt-[15px] text-[#212121]">
      {/* 첫 줄: 토글 · 공고 선택 · 버튼 */}
      <div className="flex h-[33px] items-stretch gap-[10px]">
        <div className="flex w-[108px] overflow-hidden rounded-[6px] border border-[#d9dbdf] text-[14px]">
          <span className="flex w-[54px] items-center justify-center border-r border-[#b9babd] bg-[#f0f1f3] font-semibold shadow-[inset_0_0_0_1px_#b9babd]">
            일반
          </span>
          <span className="flex flex-1 items-center justify-center text-[#6c737f]">상시</span>
        </div>
        <div className="relative flex w-[1195px] items-center rounded-[6px] border border-[#e3e5e8] pr-[7px] pl-[11px] text-[14px]">
          <span className="absolute -top-[7px] left-[12px] bg-white px-[3px] text-[10px] leading-[12px] text-[#8e949e]">
            채용공고 목록
          </span>
          <span className="flex-1">(샘플) 커리어링크 신입/경력 채용</span>
          <IconChevronDown size={22} stroke={1.6} className="text-[#4d5761]" />
        </div>
        <OutlineButton className="w-[76px]">
          <IconEye size={19} stroke={1.8} />
          MY
        </OutlineButton>
        <OutlineButton className="w-[74px]">채용종료</OutlineButton>
        <button className="flex w-[100px] cursor-[inherit] items-center justify-center gap-[6px] rounded-[6px] bg-[#003db5] text-[14px] font-semibold text-white">
          <IconPlus size={17} stroke={2} />
          전형 추가
        </button>
      </div>

      {/* 둘째 줄: 공고 정보 */}
      <div className="mt-[16px] flex h-[25px] items-center text-[14px]">
        <span className="flex h-[25px] w-[49px] items-center justify-center rounded-full bg-[#e8eef9] text-[13px] text-[#2f62c9]">
          접수중
        </span>
        <span className="ml-[9px] text-[14.3px]">2026.04.16 (목) 00:00:00 ~ 2026.12.01 (화) 15:00:59</span>
        <IconUserCheck size={16} stroke={1.7} className="ml-[18px]" />
        <span className="ml-[6px] font-medium underline decoration-[#8e949e] underline-offset-[3px]">최종제출 12명</span>
        <IconUserEdit size={16} stroke={1.7} className="ml-[18px]" />
        <span className="ml-[6px] font-medium underline decoration-[#8e949e] underline-offset-[3px]">임시저장 0명</span>
      </div>

      <div className="mt-[15px] flex flex-col gap-[8px]">
        <Stage Icon={IconListCheck} title="서류전형" autoEval>
          <Card title="평가 대상" menu>
            <Box>
              <Line Icon={IconUserCheck} label="최종제출" value="12" unit="명" strong />
              <Line dot={GREEN} label="참석" value="5" unit="명" />
              <Line dot={RED} label="불참석" value="3" unit="명" />
              <Line dot={GRAY_DOT} label="미등록" value="4" unit="명" />
            </Box>
          </Card>
          <Card title="자동 평가" menu>
            <Box className="py-[6px]">
              <Line Icon={IconFilterCheck} label="필터형" badge />
            </Box>
            <Box className="mt-[8px] py-[6px]">
              <Line Icon={IconClipboardPlus} label="가산점형" badge />
            </Box>
            <p className="mt-[8px] ml-[8px] flex h-[16px] items-center gap-[2px] text-[12px] text-[#4d5761]">
              자동 평가 결과 <IconArrowRight size={12} stroke={1.8} />
            </p>
          </Card>
          <Card title="평가 세팅">
            <Box>
              <Line Icon={IconCalendarEvent} label="평가 기간" />
              <p className="pl-[8px] text-[12.2px] leading-[28px] text-[#4d5761]">2026.06.15(월) ~ 2026.07.15(수)</p>
            </Box>
            <Box className="mt-[8px] py-[4px]">
              <Line Icon={IconCalendarUser} label="평가 그룹" value="3" unit="개" strong />
              <Line sub label="미할당 대상자" value="1" unit="명" />
            </Box>
          </Card>
          <Card title="평가 현황">
            <Box>
              <Line Icon={IconCircleDashedCheck} label="완료율" value="5 / 21" unit="건" strong />
              <Progress pct={23.8} />
              <div className="my-[4px] border-t border-[#e9ebee]" />
              <Line Icon={IconUser} label="평가자" value="2" unit="명" strong />
            </Box>
          </Card>
          <Card title="전형 결과">
            <Box>
              <Line dot={GREEN} label="합격" value="4" unit="명" />
              <Line dot={RED} label="불합격" value="2" unit="명" />
              <Line dot={GRAY_DOT} label="미등록" value="6" unit="명" />
            </Box>
          </Card>
        </Stage>

        <Stage Icon={IconPlugConnected} title="외부 자료 연동" grip>
          <Card title="연동 대상" menu>
            <Box>
              <Line Icon={IconUserSearch} label="대상자" value="9" unit="명" strong />
            </Box>
          </Card>
          <Card title="업로드 현황">
            <Box>
              <Line Icon={IconCircleDashedCheck} label="완료율" value="7 / 9" unit="명" strong />
              <Progress pct={77.8} />
              <Line dot={GREEN} label="업로드" value="7" unit="명" />
              <Line dot={RED} label="미업로드" value="2" unit="명" />
            </Box>
          </Card>
          <Card title="전형 결과">
            <div className="flex flex-col items-center pt-[34px]">
              <p className="text-[13px] text-[#4d5761]">전형 결과를 등록해 주세요.</p>
              <button className="mt-[16px] h-[32px] w-[84px] cursor-[inherit] rounded-[6px] bg-[#003db5] text-[13px] font-semibold text-white">
                결과 등록
              </button>
            </div>
          </Card>
        </Stage>

        <Stage Icon={IconFileUpload} title="추가자료 제출" grip>
          <Card title="제출 대상" menu>
            <Box>
              <Line Icon={IconUserSearch} label="대상자" value="12" unit="명" strong />
            </Box>
          </Card>
          <Card title="자료 구성">
            <Box>
              <Line Icon={IconCalendarEvent} label="제출 기간" />
              <p className="pl-[20px] text-[12px] leading-[28px] text-[#4d5761]">2026.07.01(수) ~ 2026.07.31(금)</p>
            </Box>
          </Card>
          <Card title="제출 현황">
            <Box>
              <Line Icon={IconCircleDashedCheck} label="완료율" value="0 / 12" unit="명" strong />
              <Progress pct={0} />
              <Line dot={GREEN} label="제출완료" value="0" unit="명" />
            </Box>
          </Card>
        </Stage>
      </div>
    </div>
  )
}

function OutlineButton({ className, children }: { className: string; children: ReactNode }) {
  return (
    <button
      className={`flex cursor-[inherit] items-center justify-center gap-[6px] rounded-[6px] border border-[#e3e5e8] text-[14px] font-medium ${className}`}
    >
      {children}
    </button>
  )
}

/** 전형 단계 하나 — 머리줄(제목 · 버튼)과 카드 줄. */
function Stage({
  Icon,
  title,
  grip,
  autoEval,
  children,
}: {
  Icon: Icon
  title: string
  grip?: boolean
  autoEval?: boolean
  children: ReactNode
}) {
  return (
    <section className="h-[312px] rounded-[8px] border border-[#eceef1] px-[20px] pt-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex h-[34px] items-center pl-[4px]">
        {grip && <IconGripVertical size={16} stroke={1.6} className="mr-[6px] text-[#8e949e]" />}
        <Icon size={20} stroke={1.7} />
        <h3 className="ml-[8px] text-[16px] font-semibold">{title}</h3>
        <div className="ml-auto flex h-full items-center gap-[10px] text-[14px]">
          {autoEval && (
            <span className="flex h-full w-[148px] items-center justify-center gap-[8px] rounded-[6px] bg-[#f3f4f6] font-medium">
              <span className="size-[6px] rounded-full bg-[#0042b7]" />
              자동평가 ON
              <IconChevronDown size={16} stroke={1.8} />
            </span>
          )}
          <OutlineButton className="h-full w-[48px]">
            <IconSend size={18} stroke={1.7} />
          </OutlineButton>
          <OutlineButton className="h-full w-[103px]">
            <IconListDetails size={18} stroke={1.7} />
            발송 내역
          </OutlineButton>
          <IconDotsVertical size={18} stroke={1.8} className="ml-[5px]" />
          <IconChevronUp size={18} stroke={1.8} className="mr-px ml-px" />
        </div>
      </div>
      <div className="mt-[20px] flex gap-[9.5px]">{children}</div>
    </section>
  )
}

function Card({ title, menu, children }: { title: string; menu?: boolean; children: ReactNode }) {
  return (
    <div className={`h-[220px] w-[253px] rounded-[8px] border border-[#eceef1] bg-[#f9fafb] px-[16px] ${menu ? 'pt-[19px]' : 'pt-[17px]'}`}>
      <div className={`${menu ? 'mb-[15px]' : 'mb-[13px]'} flex h-[20px] items-center justify-between px-[4px] text-[14px] font-semibold`}>
        {title}
        {menu && <IconDotsVertical size={16} stroke={1.8} className="text-[#4d5761]" />}
      </div>
      {children}
    </div>
  )
}

function Box({ className = 'py-[4px]', children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-[8px] border border-[#e9ebee] bg-white px-[12px] ${className}`}>{children}</div>
}

/** 상자 안 한 줄 — 왼쪽 아이콘/점/꺾은 화살표 + 이름, 오른쪽 숫자 또는 실행완료 칩. */
function Line({
  Icon,
  dot,
  sub,
  label,
  value,
  unit,
  strong,
  badge,
}: {
  Icon?: Icon
  dot?: string
  sub?: boolean
  label: string
  value?: string
  unit?: string
  strong?: boolean
  badge?: boolean
}) {
  return (
    <div className={`flex h-[28px] items-center text-[13px] ${strong || Icon ? 'text-[#212121]' : 'text-[#4d5761]'}`}>
      {Icon && <Icon size={15} stroke={1.7} className="mr-[8px] shrink-0" />}
      {dot && <span className="mr-[13px] ml-[4px] size-[5px] shrink-0 rounded-full" style={{ background: dot }} />}
      {sub && <IconCornerDownRight size={14} stroke={1.6} className="mr-[8px] ml-[6px] shrink-0 text-[#4d5761]" />}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-[#e3f4e5] px-[8px] py-[3px] text-[12px] text-[#38a148]">실행완료</span>
      )}
      {value && (
        <span>
          <b className={strong ? 'text-[14px] font-semibold text-[#212121]' : 'font-normal'}>{value}</b>{' '}
          <span className="text-[12px] text-[#6c737f]">{unit}</span>
        </span>
      )}
    </div>
  )
}

function Progress({ pct }: { pct: number }) {
  return (
    <div className="flex h-[28px] items-center gap-[10px] text-[11px] text-[#8e949e]">
      <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GREEN }} />
      </div>
      {pct}%
    </div>
  )
}
