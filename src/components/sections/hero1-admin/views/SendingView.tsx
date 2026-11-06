import type { ReactNode } from 'react'
import clsx from 'clsx'
import {
  IconAlignLeft,
  IconBold,
  IconCalendarEvent,
  IconChevronDown,
  IconClearFormatting,
  IconHighlight,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconPhoto,
  IconSelector,
  IconStrikethrough,
  IconTextColor,
  IconUnderline,
  type Icon,
} from '@tabler/icons-react'

const SEGMENTS = ['임시저장 지원자', '전형별 대상자', '개별 대상자', '엑셀 업로드', '평가자']
/** 에디터 툴바 아이콘과 가운데 x(툴바 왼쪽 기준). */
const TOOLS: [Icon, number][] = [
  [IconBold, 19.5], [IconItalic, 47.5], [IconUnderline, 75.5], [IconStrikethrough, 104], [IconLink, 131.5],
  [IconTextColor, 173], [IconHighlight, 201.5], [IconListNumbers, 242], [IconList, 269.5], [IconAlignLeft, 310.5],
  [IconPhoto, 531.5], [IconClearFormatting, 574.5],
]
const TAGS = ['회사명', '공고명', '직무', '이름', '경력구분', '고용형태', '제출일']

/** 폼 한 줄: 왼쪽 라벨 + 오른쪽 입력칸. top 은 본문 박스 기준. */
function Row({ top, label, children }: { top: number; label: string; children: ReactNode }) {
  return (
    <div className="absolute left-[24px] flex h-[40px] items-center" style={{ top }}>
      <span className="w-[262px] text-[14px] text-[#212121]">{label}</span>
      {children}
    </div>
  )
}

/** 테두리 입력칸. legend 가 있으면 위 테두리에 걸친 작은 라벨을 단다. */
function Field({ width = 701, legend, filled, children }: { width?: number; legend?: string; filled?: boolean; children: ReactNode }) {
  return (
    <div
      className={clsx(
        'relative flex h-[40px] items-center rounded-[6px] border pr-[7px] pl-[13px] text-[16px] text-[#212121]',
        filled ? 'border-[#dfe5ef] bg-[#e8f0fe]' : 'border-[#e4e6e9] bg-white',
      )}
      style={{ width }}
    >
      {legend && <span className="absolute -top-[8px] left-[9px] bg-white px-[4px] text-[11px] leading-[14px] text-[#8e949e]">{legend}</span>}
      {children}
    </div>
  )
}

/** 본문 매핑 태그(#공고명 등) — 굵게 + 옅은 파란 바탕. */
const T = ({ children }: { children: string }) => <b className="bg-[#d3eafd] font-bold">{children}</b>

export function SendingView() {
  return (
    <div className="relative size-full">
      <div className="absolute top-0 left-0 h-[1100px] w-[1621px] rounded-[8px] bg-white">
        {/* 탭 */}
        <div className="absolute top-[19px] left-[16px] flex h-[47px] w-[1589px] border-b border-[#eef0f3] text-[14px]">
          {['Email', 'SMS', '알림톡'].map((t, i) => (
            <span
              key={t}
              className={clsx(
                'flex items-center px-[20px] pb-[8px]',
                i === 0 ? '-mb-px border-b-[3px] border-[#0042b7] font-medium text-[#0042b7]' : 'text-[#6c737f]',
              )}
            >
              {t}
            </span>
          ))}
        </div>

        <Row top={89} label="발송 대상자">
          <div className="flex h-[40px] w-[701px] overflow-hidden rounded-[6px] border border-[#e4e6e9]">
            {SEGMENTS.map((s, i) => (
              <span key={s} className={clsx('flex flex-1 items-center justify-center text-[15px] text-[#6c737f]', i > 0 && 'border-l border-[#e4e6e9]')}>
                {s}
              </span>
            ))}
          </div>
        </Row>
        <Row top={145} label="발신 번호">
          <Field legend="주소">
            noreply@careerlink.kr
            <IconChevronDown className="ml-auto size-[20px] text-[#4d5761]" stroke={1.8} />
          </Field>
        </Row>
        <Row top={201} label="제목">
          <Field filled>[커리어링크] 서류전형 결과 안내</Field>
        </Row>
        <Row top={257} label="발송 예약일">
          <Field width={285}>
            2026/12/31 12:00
            <IconCalendarEvent className="mr-[3px] ml-auto size-[19px] text-[#4d5761]" stroke={1.8} />
          </Field>
        </Row>
        <Row top={313} label="양식">
          <Field legend="양식명">
            [결과발표] 합격 안내
            <IconChevronDown className="ml-auto size-[20px] text-[#4d5761]" stroke={1.8} />
          </Field>
        </Row>

        {/* 에디터 + 매핑 항목 */}
        <div className="absolute top-[377px] left-[16px] flex h-[535px] w-[1590px] rounded-[8px] border border-[#eceef1]">
          <div className="mt-[16px] ml-[16px] h-[501px] w-[1315px] overflow-hidden rounded-[6px] border border-[#e8eaec]">
            <div className="relative h-[39px] border-b border-[#e8eaec] bg-[#f9fafb] text-[14px] text-[#212121]">
              {TOOLS.map(([Icon, x], i) => (
                <Icon key={i} className="absolute top-[11px] size-[17px]" style={{ left: x - 8.5 }} stroke={i < 5 ? 2 : 1.8} />
              ))}
              {(
                [
                  ['기본크기', 349],
                  ['줄간격 1.5', 428],
                ] as const
              ).map(([t, x]) => (
                <span key={t} className="absolute top-[9px] flex items-center gap-[5px] leading-[20px]" style={{ left: x }}>
                  {t}
                  <IconSelector className="size-[13px]" stroke={2.2} />
                </span>
              ))}
            </div>
            <div className="px-[14px] pt-[6px] text-[16px] leading-[24px] text-[#212121]">
              <p><T>#공고명</T></p>
              <p>전형 결과 안내드립니다.</p>
              <br />
              <p>안녕하세요, <T>#이름</T>님,</p>
              <p><T>#회사명</T>입니다.</p>
              <br />
              <p><T>#공고명</T> 전형에 합격하셨습니다.</p>
              <p>전형에 합격하신 것을 진심으로 축하 드리며, 저희 <T>#회사명</T>에 지원해주셔서 다시 한 번 감사 드립니다.</p>
              <p>다음 전형 일정은 개별 안내드리도록 하겠습니다.</p>
              <br />
              <p>감사합니다.</p>
              <br />
              <p className="text-center"><T>#회사명</T> 드림</p>
            </div>
          </div>
          <div className="ml-[16px] w-[242px] border-l border-[#eceef1] pt-[18px] pl-[16px]">
            <p className="text-[14px] leading-[18px] font-bold text-[#212121]">매핑 항목</p>
            <p className="mt-[2px] text-[12px] leading-[20px] text-[#6c737f]">
              아래 매핑 항목을 클릭하면 에디터 커서
              <br />
              위치에 항목이 삽입되며, 대상자별 데이터로
              <br />
              변환되어 발송됩니다.
              <br />
              매핑 항목은 본문에만 삽입 가능하며
              <br />
              제목에는 적용이 불가합니다.
            </p>
            <div className="mt-[9px] flex w-[180px] flex-wrap gap-x-[10px] gap-y-[12px]">
              {TAGS.map((t) => (
                <span key={t} className="flex h-[24px] min-w-[68px] items-center justify-center rounded-[6px] bg-[#f3f4f6] px-[10px] text-[13px] font-semibold text-[#212121]">
                  # {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* 아래로 이어지는 다음 블록(화면 밖으로 잘림) */}
        <div className="absolute top-[928px] left-[16px] h-[200px] w-[1590px] rounded-[8px] border border-[#eceef1]" />
      </div>
    </div>
  )
}
