import type { ReactNode } from 'react'
import { useFitScale } from '../../hooks/useFitScale'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

/**
 * 평가 화면 한 장을 DOM 으로 그린 것 — 왼쪽 지원서(Retro 뷰), 가운데 평가
 * 입력, 오른쪽 지원자 목록.
 *
 * 스크린샷을 쓰지 않는 이유는 이 페이지의 다른 관리자 화면과 같다. 원본이
 * 1902px 인데 본문 단 폭으로 띄우면 고해상도 화면에서 2배율 픽셀이 모자라
 * 글자가 뿌옇게 풀린다. 설계 좌표를 원본과 같게 두고 보여 줄 폭에 맞춰
 * 통째로 줄인다.
 */
const W = 1902
const H = 896

/** 세 칸의 폭. 가운데 띠(14) 까지 더하면 W 다. */
const DOC = 1282
const PANEL = 435
const RAIL = W - DOC - PANEL

/**
 * 서류 접수 구간의 양식 편집기와 같은 그림자 — 다만 그쪽은 흰 바탕이라
 * 푸른 기를 띠고, 이 구간은 #fafafa 회색 바탕이라 같은 색을 쓰면 바탕 위에
 * 파란 테가 뜬다. 겹 구성과 y=0(사방으로 고르게 번짐)은 그대로 두고 색만
 * 바탕에 맞춰 중성 회색으로 옮겼다.
 *
 * 카드가 아니라 바깥 래퍼에 건다. 카드는 설계 폭 그대로 두고 scale 로
 * 줄이는 구조라 넘치는 부분을 래퍼가 잘라내는데, 카드에 그림자를 걸면 그
 * 잘림에 같이 걸려 사라진다. 쉼표로 여러 겹을 넣으므로 Tailwind 임의값이
 * 아니라 인라인 style 로 줘야 한다.
 */
const CARD_SHADOW = [
  '0 0 80px -18px rgba(86, 94, 104, 0.34)',
  '0 0 34px -8px rgba(86, 94, 104, 0.22)',
  '0 0 12px 0 rgba(86, 94, 104, 0.10)',
].join(', ')

function Icon({ path, className = 'size-[18px]' }: { path: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const P = {
  chevron: 'm6 9 6 6 6-6',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  refresh: 'M20 11a8 8 0 1 0-2.3 6M20 6v5h-5',
  check: 'm4 12 5 5L20 6',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4',
  grid: 'M4 5h6v6H4zM14 5h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  compare: 'M4 4h16v16H4zM12 4v16M7 9h2M7 13h2',
  spark: 'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z',
  memo: 'M5 4h14v12l-4 4H5zM15 20v-4h4',
  hash: 'M9 4 7 20M17 4l-2 16M4 9h16M3 15h16',
}

/** 지원서 표의 이름 칸. 회색 바탕에 가운데 맞춤 — 종이 양식 그대로다. */
function Cell({ label, width = 200 }: { label: string; width?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center self-stretch bg-[#f2f4f6] text-[17px] font-medium text-ink"
      style={{ width }}
    >
      {label}
    </div>
  )
}

function Value({ children }: { children?: ReactNode }) {
  return <div className="flex flex-1 items-center justify-center px-4 text-[17px] text-ink">{children}</div>
}

function DocHeading({ title }: { title: string }) {
  return <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">{title}</p>
}

/** 요약정보 막대그래프의 가로축. */
const YEARS = Array.from({ length: 15 }, (_, i) => 2013 + i)
const AXIS_W = 1150
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
      <div className="absolute bottom-full left-0 whitespace-nowrap pb-1 text-[16px] text-ink">
        {above && <span className="absolute bottom-full left-0 pb-1">{label}</span>}
        <span
          className="rounded-[4px] px-1.5 py-0.5 text-[15px] font-semibold text-white"
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
    <span className="flex h-[18px] w-[32px] items-center rounded-full bg-[#dcdfe4] px-[2px]">
      <span className="size-[14px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
    </span>
  )
}

const RAIL_GROUPS = [
  {
    title: '6월 1일 면접1 (7명)',
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
    title: '6월 1일 면접2 (3명)',
    people: [
      { name: '박세훈', dot: '#c8ccd2' },
      { name: '서지현', dot: '#f87171' },
      { name: '오준혁', dot: '#f87171' },
    ],
  },
]

const GRADES = [
  { label: '적극추천', face: 'M8 14c1 1.3 2.4 2 4 2s3-.7 4-2', on: true },
  { label: '심사보류', face: 'M9 15h6' },
  { label: '기준미달', face: 'M8 16c1-1.3 2.4-2 4-2s3 .7 4 2' },
]

export function Hero4EvalScreen() {
  const { ref, scale } = useFitScale(W)

  return (
    <Section className="bg-surface-page pb-12 pt-6 md:pb-24 md:pt-16">
      <Container>
        <div
          ref={ref}
          className="w-full overflow-hidden rounded-card"
          style={{ height: H * scale, boxShadow: CARD_SHADOW }}
        >
          <div
            role="img"
            aria-label="지원서를 보며 평가를 입력하는 평가자 화면"
            className="overflow-hidden rounded-card border border-[#e1e4e8] bg-white font-sans"
            style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          >
            <div className="flex h-full">
              {/* ── 왼쪽: 지원서(Retro 뷰) ─────────────────────────── */}
              <div className="flex flex-col" style={{ width: DOC }}>
                <div className="flex h-[42px] shrink-0 items-center gap-3 border-b border-[#e8eaed] px-3 text-[#4d5761]">
                  <span className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#1d4ed8] text-[#1d4ed8]">
                    <Icon path={P.doc} />
                  </span>
                  <span className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#e1e4e8]">
                    <Icon path={P.grid} />
                  </span>
                  <span className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#e1e4e8]">
                    <Icon path={P.compare} />
                  </span>
                  <span className="ml-1 flex items-center rounded-[6px] border border-[#e1e4e8] p-[2px] text-[15px]">
                    <span className="rounded-[4px] px-2.5 py-[3px] text-[#6c737f]">Basic</span>
                    <span className="rounded-[4px] bg-[#eef1f4] px-2.5 py-[3px] font-semibold text-ink">Retro</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[15px] text-[#6c737f]">
                    <Icon path={P.minus} className="size-[16px]" />
                    100%
                    <Icon path={P.plus} className="size-[16px]" />
                  </span>
                  <span className="flex-1 text-center text-[16px] text-ink">
                    (샘플) 커리어링크 신입/경력 채용 - 서류전형
                  </span>
                  <span className="flex items-center rounded-[6px] border border-[#e1e4e8]">
                    <span className="px-2.5 py-[4px] text-[15px] tabular-nums text-ink">00:28:21</span>
                    <span className="rounded-r-[6px] bg-[#eef1f4] px-2.5 py-[4px] text-[15px] text-ink">로그인 연장</span>
                  </span>
                  <Icon path={P.refresh} />
                </div>

                <div className="relative flex-1 overflow-hidden px-8 pt-7">
                  <DocHeading title="지원정보" />
                  <div className="mt-3 border-y-2 border-[#3f4652]">
                    <div className="flex h-[42px]">
                      <Cell label="지원 직무" />
                      <Value>커리어링크 개발 &gt; IT개발</Value>
                    </div>
                  </div>

                  <div className="mt-9">
                    <DocHeading title="인적정보" />
                  </div>
                  <div className="mt-3 border-y-2 border-[#3f4652]">
                    <div className="flex">
                      <div className="flex flex-1 flex-col divide-y divide-[#e8eaed]">
                        <div className="flex h-[42px]">
                          <Cell label="이름" />
                          <Value>김민재</Value>
                        </div>
                        <div className="flex h-[42px]">
                          <Cell label="휴대폰 번호" />
                          <Value>+82)010-6666-6666</Value>
                        </div>
                        <div className="flex h-[42px]">
                          <Cell label="이메일" />
                          <Value>careerlink006@careerlink.kr</Value>
                        </div>
                      </div>
                      <Cell label="사진" width={205} />
                      <div className="flex w-[205px] shrink-0 items-center justify-center border-l border-[#e8eaed] py-2">
                        {/* 증명사진 자리. 얼굴을 그릴 수는 없으니 틀만 세운다. */}
                        <div className="flex h-[96px] w-[76px] items-end justify-center overflow-hidden rounded-[4px] bg-[#dbe3ec]">
                          <div className="size-[30px] translate-y-[6px] rounded-t-full bg-[#9fb0c4]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex h-[42px] border-t border-[#e8eaed]">
                      <Cell label="생년월일" />
                      <Value>1997.05.30 (만 29세)</Value>
                      <Cell label="성별" width={205} />
                      <Value>남</Value>
                    </div>
                    <div className="flex h-[42px] border-t border-[#e8eaed]">
                      <Cell label="주소" />
                      <Value>(07727) 서울 강서구 까치산로 23 (화곡동, NHR타워), 201동 103호</Value>
                    </div>
                  </div>

                  <div className="mt-9">
                    <DocHeading title="요약정보" />
                  </div>
                  <div className="mt-3 border-t-2 border-[#3f4652] pt-12">
                    <div className="relative" style={{ width: AXIS_W, height: 170 }}>
                      <Bar from={2013} to={2016.2} height={74} color="#a9c6f2" chip="고등" chipColor="#4a7fd4" label="강서고등학교" />
                      <Bar from={2016.3} to={2023.6} height={84} color="#8ed3c6" chip="대학교" chipColor="#2f9e8c" label="서울시립대학교" />
                      <Bar from={2026} to={2026.2} height={158} color="#e85d5d" chip="경력" chipColor="#d93b3b" label="엔에이치알" above />
                    </div>
                    <div className="relative border-t border-[#c8ccd2]" style={{ width: AXIS_W, height: 30 }}>
                      {YEARS.map((year) => (
                        <span
                          key={year}
                          className="absolute top-0 -translate-x-1/2 pt-2 text-[15px] text-[#6c737f]"
                          style={{ left: at(year) }}
                        >
                          <span className="absolute left-1/2 top-0 h-[5px] w-px bg-[#c8ccd2]" />
                          {year}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12">
                    <DocHeading title="학력사항" />
                  </div>

                  {/* 떠 있는 두 버튼 — AI 요약과 메모. */}
                  <div className="absolute bottom-6 right-7 flex flex-col gap-2 text-[#1d4ed8]">
                    <span className="flex size-[34px] items-center justify-center rounded-[8px] border border-[#cddcf7] bg-white shadow-[0_1px_4px_rgba(32,40,45,0.12)]">
                      <Icon path={P.spark} className="size-[19px]" />
                    </span>
                    <span className="flex size-[34px] items-center justify-center rounded-[8px] border border-[#cddcf7] bg-white shadow-[0_1px_4px_rgba(32,40,45,0.12)]">
                      <Icon path={P.memo} className="size-[19px]" />
                    </span>
                  </div>
                </div>
              </div>

              {/* 문서와 평가 사이의 스크롤 띠. 점은 아직 안 본 항목 자리다. */}
              <div className="flex w-[14px] shrink-0 flex-col items-center gap-[26px] border-x border-[#eceef2] bg-[#fafbfc] pt-[52px]">
                <span className="h-[150px] w-[4px] rounded-full bg-[#c8ccd2]" />
                {Array.from({ length: 7 }, (_, index) => (
                  <span key={index} className="size-[4px] rounded-full bg-[#9aa3af]" />
                ))}
              </div>

              {/* ── 가운데: 평가 입력 ───────────────────────────────── */}
              <div className="flex flex-col" style={{ width: PANEL - 14 }}>
                <div className="flex h-[42px] shrink-0 border-b border-[#e8eaed] text-[16px]">
                  <span className="flex flex-1 items-center justify-center border-b-2 border-ink font-semibold text-ink">
                    지원자 평가
                  </span>
                  <span className="flex flex-1 items-center justify-center text-[#9aa3af]">평가 통계</span>
                </div>

                <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3">
                  <div className="flex items-center gap-1 rounded-[8px] bg-[#f4f5f7] p-[3px] text-[15px]">
                    <span className="rounded-[6px] bg-white px-3 py-[6px] font-semibold text-ink shadow-[0_1px_2px_rgba(32,40,45,0.1)]">
                      평가내용
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-[6px] text-[#6c737f]">
                      과거 지원 이력
                      <span className="flex size-[16px] items-center justify-center rounded-full bg-[#e5484d] text-[12px] font-bold text-white">
                        2
                      </span>
                    </span>
                    <span className="px-2 py-[6px] text-[#6c737f]">전체 평가자 결과</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-[5px] bg-[#e7effc] px-2 py-[3px] text-[14px] font-medium text-[#1d4ed8]">
                      6월 1일 면접1
                    </span>
                    <span className="text-[18px] font-bold text-ink">김민재</span>
                  </div>

                  <span className="flex items-center gap-1.5 text-[14px] text-[#9aa3af]">
                    <Icon path={P.info} className="size-[14px]" />
                    서류평가 기준
                  </span>

                  <div className="rounded-[10px] border border-[#e8eaed] p-3">
                    <p className="text-[15px] font-semibold text-ink">직무적합도</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex flex-1 overflow-hidden rounded-[6px] border border-[#d6dade] text-[15px]">
                        <span className="flex-1 bg-[#1e3a8a] py-[7px] text-center font-semibold text-white">우수</span>
                        <span className="flex-1 border-l border-[#d6dade] py-[7px] text-center text-[#4d5761]">보통</span>
                        <span className="flex-1 border-l border-[#d6dade] py-[7px] text-center text-[#4d5761]">미흡</span>
                      </div>
                      <span className="w-[26px] text-right text-[17px] font-bold text-[#1d4ed8]">10</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#eceef2] pt-3 text-[15px]">
                      <span className="font-semibold text-ink">총점</span>
                      <span className="text-[17px] font-bold text-[#1d4ed8]">10 / 10</span>
                    </div>

                    <p className="mt-3 text-[15px] font-semibold text-ink">총평</p>
                    <div className="mt-2 h-[96px] rounded-[6px] border border-[#d6dade] p-2 text-[14px] text-[#b3b9c2]">
                      지원자에 대한 총평을 입력해 주세요.
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-[10px] border border-[#e8eaed] p-3">
                    <p className="text-[15px] font-semibold text-ink">최종 등급</p>
                    <div className="flex flex-1 justify-end gap-2">
                      {GRADES.map((grade) => (
                        <span
                          key={grade.label}
                          className={`flex w-[62px] flex-col items-center gap-1 rounded-[8px] border py-2 text-[13px] ${
                            grade.on
                              ? 'border-[#34a853] bg-[#f1faf3] font-semibold text-[#1f7a3d]'
                              : 'border-[#e1e4e8] text-[#6c737f]'
                          }`}
                        >
                          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-[20px]">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M9 10h.01M15 10h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d={grade.face} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                          {grade.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-[14px] text-[#9aa3af]">
                    <Icon path={P.info} className="size-[14px]" />
                    다른 평가자와 공유하고 싶은 내용을 입력해 주세요. (선택)
                  </span>

                  <div className="rounded-[10px] border border-[#e8eaed] p-3">
                    <div className="flex items-center gap-2 border-b border-[#e8eaed] pb-2 text-[15px] text-[#b3b9c2]">
                      <Icon path={P.hash} className="size-[16px]" />
                      태그
                    </div>
                    <div className="mt-2 flex gap-1.5 text-[14px] text-[#4d5761]">
                      <span className="rounded-full border border-[#e1e4e8] px-2.5 py-[3px]">영어</span>
                      <span className="rounded-full border border-[#e1e4e8] px-2.5 py-[3px]">유학</span>
                      <span className="rounded-full border border-[#e1e4e8] px-2.5 py-[3px]">LLM에 관심있음</span>
                    </div>
                  </div>

                  <span className="mt-auto flex h-[46px] items-center justify-center gap-2 rounded-[8px] bg-[#1e3a8a] text-[17px] font-semibold text-white">
                    <Icon path={P.check} className="size-[18px]" />
                    평가완료
                  </span>
                </div>
              </div>

              {/* ── 오른쪽: 지원자 목록 ─────────────────────────────── */}
              <div className="flex flex-col gap-2.5 border-l border-[#e8eaed] bg-[#fcfcfd] p-2" style={{ width: RAIL }}>
                <span className="flex h-[30px] items-center justify-center rounded-[6px] border border-[#f3c0c0] bg-[#fdeeee] text-[15px] font-semibold text-[#d93b3b]">
                  완료 : 1 / 7
                </span>

                <div className="flex items-center justify-between text-[14px] text-ink">
                  불참 3명 제외
                  <Toggle />
                </div>
                <div className="flex items-center justify-between text-[14px] text-ink">
                  완료 제외
                  <Toggle />
                </div>

                <div className="relative rounded-[6px] border border-[#d6dade] bg-white px-2 pb-[6px] pt-[14px]">
                  <span className="absolute left-2 top-[2px] text-[11px] text-[#9aa3af]">그룹</span>
                  <span className="flex items-center justify-between text-[14px] text-ink">
                    전체
                    <Icon path={P.chevron} className="size-[14px] text-[#9aa3af]" />
                  </span>
                </div>

                <div className="flex rounded-[6px] border border-[#d6dade] bg-[#f4f5f7] p-[2px] text-[14px]">
                  <span className="flex-1 rounded-[4px] bg-white py-[4px] text-center font-semibold text-ink shadow-[0_1px_2px_rgba(32,40,45,0.1)]">
                    이름순
                  </span>
                  <span className="flex-1 py-[4px] text-center text-[#6c737f]">총점순</span>
                </div>

                {RAIL_GROUPS.map((group) => (
                  <div key={group.title} className="flex flex-col">
                    <span className="mb-1 rounded-[5px] bg-[#eef1f4] py-[4px] text-center text-[14px] text-[#4d5761]">
                      {group.title}
                    </span>
                    {group.people.map((person) => (
                      <span
                        key={person.name}
                        className={`flex h-[34px] items-center gap-2 rounded-[5px] px-2 text-[15px] ${
                          person.on ? 'bg-[#e9eef5] font-semibold text-ink' : 'text-[#4d5761]'
                        }`}
                      >
                        <span className="size-[7px] rounded-full" style={{ backgroundColor: person.dot }} />
                        {person.name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
