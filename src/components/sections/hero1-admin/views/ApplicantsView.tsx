import type { ReactNode } from 'react'
import {
  IconAB,
  IconChevronDown,
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconChevronsDown,
  IconClipboardList,
  IconDots,
  IconDownload,
  IconFileSearch,
  IconFilter2,
  IconLayoutColumns,
  IconPlus,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react'

const ROWS: [string, string, number, string, string, string, string][] = [
  ['김윤서', '여', 26, '기획 > 디자인', '2026-05-11 15:06:55', '서울대학교', '졸업'],
  ['서지현', '여', 29, '기획 > 디자인', '2026-05-04 18:02:51', '연세대학교', '졸업'],
  ['조유빈', '여', 25, '영업 > 세일즈', '2026-05-04 18:02:14', '성균관대학교', '졸업'],
  ['이서준', '남', 30, '영업 > 세일즈', '2026-04-29 17:32:05', '한국외국어대학교', '수료'],
  ['김민준', '남', 28, '개발 > IT개발', '2026-04-29 17:30:35', '중앙대학교', '졸업'],
  ['이서현', '여', 24, '영업 > 세일즈', '2026-04-29 14:20:15', '한국외국어대학교', '졸업예정'],
  ['한민지', '여', 27, '개발 > IT개발', '2026-04-29 13:55:50', '한양대학교', '졸업'],
  ['조유준', '남', 29, '영업 > 세일즈', '2026-04-28 18:37:02', '서울대학교', '졸업'],
  ['박세훈', '남', 32, '영업 > 세일즈', '2026-04-28 18:19:49', '중앙대학교', '졸업'],
  ['오준혁', '남', 27, '영업 > 세일즈', '2026-04-28 15:10:13', '서울대학교', '졸업'],
]

/** 표 머리 — [제목, 가운데 x(표 기준)]. 구분선은 SEPARATORS 위치에 긋는다. */
const HEADS: [string, number][] = [
  ['이름', 185],
  ['지원서 / MY / 평가', 346],
  ['성별', 451],
  ['나이', 531],
  ['지원직무', 661],
  ['제출상태', 826],
  ['제출일', 991],
  ['최종학력', 1156],
  ['최종학교', 1322],
  ['졸업상태', 1487],
]
const SEPARATORS = [267, 418, 498, 578, 758, 908, 1089, 1239, 1419]

/** 공고별 지원자 — 공고 선택, 탭, 검색, 지원자 표. */
export function ApplicantsView() {
  return (
    <div className="relative h-[771px] w-[1621px] rounded-[8px] bg-white text-[#212121] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* 토글 · 공고 선택 */}
      <div className="absolute top-[15px] left-[16px] flex h-[32px] w-[194px] overflow-hidden rounded-[6px] border border-[#d9dbdf] text-[14px] text-[#6c737f]">
        <span className="flex w-[55px] items-center justify-center bg-[#f0f1f3] font-semibold text-[#212121] shadow-[inset_0_0_0_1px_#b4b5b7]">
          일반
        </span>
        <span className="flex w-[83px] items-center justify-center border-r border-[#e3e5e8]">인재Pool</span>
        <span className="flex flex-1 items-center justify-center">상시</span>
      </div>
      <div className="absolute top-[14px] left-[218px] flex h-[34px] w-[1388px] items-center rounded-[6px] border border-[#e3e5e8] pr-[9px] pl-[11px] text-[14px]">
        <span className="absolute -top-[7px] left-[12px] bg-white px-[3px] text-[10px] leading-[12px] text-[#8e949e]">
          채용공고 목록
        </span>
        <span className="flex-1">(샘플) 커리어링크 신입/경력 채용</span>
        <IconChevronDown size={22} stroke={1.6} className="text-[#4d5761]" />
      </div>

      {/* 탭 */}
      <div className="absolute top-[56px] right-[16px] left-[16px] flex h-[48px] border-b border-[#eceef1] text-[14px] text-[#8e949e]">
        {['전체', '최종제출', '임시저장', '관심 지원자'].map((t, i) => (
          <span
            key={t}
            className={`-mb-px flex items-center ${i === 0 ? 'w-[62px] justify-center border-b-[3px] border-[#0042b7] pt-[3px] font-semibold text-[#0042b7]' : 'px-[21px]'}`}
          >
            {t}
          </span>
        ))}
        <button className="mt-[7px] ml-auto flex h-[34px] w-[106px] cursor-[inherit] items-center justify-center gap-[8px] rounded-[6px] border border-[#e3e5e8] text-[14px] text-[#212121]">
          <IconPlus size={16} stroke={2} />
          직접 입력
        </button>
      </div>

      {/* 엑셀 · 검색 */}
      <button className="absolute top-[120px] left-[16px] flex h-[34px] w-[130px] cursor-[inherit] items-center justify-center gap-[8px] rounded-[6px] border border-[#a8bfe7] text-[14px] font-medium text-[#0042b7]">
        <IconDownload size={16} stroke={2} />
        엑셀 다운로드
      </button>
      <div className="absolute top-[120px] left-[816px] flex h-[34px] w-[703px] items-center gap-[10px] rounded-[6px] border border-[#e6e8ea] px-[13px] text-[13px] text-[#c4c8ce]">
        <IconSearch size={16} stroke={1.8} className="text-[#4d5761]" />
        이름, 지원직무, 최종학교, 지원자번호
      </div>
      <IconSelector size={16} stroke={1.8} className="absolute top-[129px] left-[1532px] text-[#4d5761]" />
      <IconLayoutColumns size={18} stroke={1.6} className="absolute top-[128px] left-[1557px] text-[#4d5761]" />
      <IconFilter2 size={16} stroke={1.8} className="absolute top-[129px] left-[1584px] text-[#4d5761]" />

      {/* 표 */}
      <div className="absolute top-[170px] left-[16px] h-[537px] w-[1591px] overflow-hidden rounded-[8px] border border-[#eceef1] text-[14px]">
        <div className="relative h-[49px] border-b border-[#eceef1] bg-[#f9fafb] font-semibold">
          <Checkbox top={16} />
          <IconChevronsDown size={16} stroke={1.6} className="absolute top-[16px] left-[82px] text-[#b4b8be]" />
          {SEPARATORS.map((x) => (
            <span key={x} className="absolute top-[14px] h-[20px] w-[3px] rounded-full bg-[#e7e9ed]" style={{ left: x }} />
          ))}
          {HEADS.map(([t, x]) => (
            <Center key={t} x={x} className="top-[13px] text-[13px]">
              {t}
            </Center>
          ))}
        </div>
        {ROWS.map(([name, sex, age, job, date, school, grad]) => (
          <div key={date} className="relative h-[47px] border-b border-[#f1f2f4] text-[#4d5761]">
            <Checkbox top={15} />
            <IconChevronRight size={14} stroke={1.6} className="absolute top-[16px] left-[83px] text-[#b4b8be]" />
            <Center x={195} className="top-[12px]">{name}</Center>
            <div className="absolute top-[8px] left-[301px] flex h-[30px] w-[88px] rounded-[6px] border border-[#e3e5e8] text-[#4d5761]">
              <span className="flex flex-1 items-center justify-center border-r border-[#e3e5e8]">
                <IconFileSearch size={16} stroke={1.6} />
              </span>
              <span className="flex flex-1 items-center justify-center border-r border-[#e3e5e8]">
                <IconClipboardList size={16} stroke={1.6} />
              </span>
              <span className="flex flex-1 items-center justify-center">
                <IconAB size={16} stroke={1.6} />
              </span>
            </div>
            <Center x={460} className="top-[12px]">{sex}</Center>
            <Center x={541} className="top-[12px]">{age}</Center>
            <span className="absolute top-[12px] left-[589px]">커리어링크 {job}</span>
            <Center x={836} className="top-[11px]">
              <span className="block rounded-full bg-[#e3ebfa] px-[7px] py-[2px] text-[13px] font-medium text-[#2f62c9]">
                최종제출
              </span>
            </Center>
            <Center x={1001} className="top-[12px] text-[#212121]">{date}</Center>
            <Center x={1166} className="top-[12px]">대학교</Center>
            <span className="absolute top-[12px] left-[1249px]">{school}</span>
            <Center x={1496} className="top-[12px]">{grad}</Center>
            <IconDots size={16} stroke={1.6} className="absolute top-[16px] left-[1555px] text-[#b4b8be]" />
          </div>
        ))}
        <div className="absolute top-[523px] left-[5px] h-[7px] w-[1090px] rounded-full bg-[#dcdee1]" />
      </div>

      {/* 페이지 크기 · 페이지네이션 */}
      <div className="absolute top-[719px] left-[24px] flex h-[20px] items-center text-[14px] text-[#4d5761]">
        10
        <IconChevronDown size={16} stroke={1.8} className="ml-[6px]" />
        <span className="ml-[12px]">전체 결과 12개</span>
      </div>
      <div className="absolute top-[713px] left-[699px] flex h-[32px] items-center text-[14px] text-[#4d5761]">
        <Page><IconChevronLeftPipe size={16} stroke={1.6} className="text-[#b4b8be]" /></Page>
        <Page><IconChevronLeft size={16} stroke={1.6} className="text-[#b4b8be]" /></Page>
        <Page active>1</Page>
        <Page>2</Page>
        <Page><IconChevronRight size={16} stroke={1.6} /></Page>
        <Page><IconChevronRightPipe size={16} stroke={1.6} /></Page>
      </div>
    </div>
  )
}

/** x 를 가운데로 두는 절대 위치 칸. */
function Center({ x, className, children }: { x: number; className: string; children: ReactNode }) {
  return (
    <span className={`absolute -translate-x-1/2 whitespace-nowrap ${className}`} style={{ left: x }}>
      {children}
    </span>
  )
}

function Checkbox({ top }: { top: number }) {
  return <span className="absolute left-[23px] size-[16px] rounded-[3px] border-[1.5px] border-[#9da3ab]" style={{ top }} />
}

function Page({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span className={`flex size-[32px] items-center justify-center rounded-[4px] ${active ? 'bg-[#f0f1f3] text-[#212121]' : ''} mr-[6px]`}>
      {children}
    </span>
  )
}
