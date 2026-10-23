import applicantPhoto from '../../assets/sections/hero2-application-builder/applicant-photo.webp'
import starEmpty from '../../assets/sections/hero2-application-builder/icon-star-empty.svg'
import starFilled from '../../assets/sections/hero2-application-builder/icon-star-filled.svg'
import type { Field, FormSection, Group } from './Hero2FormBuilderData'

/**
 * 지원자 뷰. 관리자가 만든 양식을 지원자가 실제로 보게 되는 입력 화면으로
 * 보여 준다 — Basic/Retro 와 같은 FORM_SECTIONS 를 받아 같은 내용을 입력
 * 필드 모양으로 다시 그린다.
 *
 * 보여 주기만 하는 화면이라 진짜 input 은 쓰지 않는다. 호출 쪽에서
 * pointer-events 를 꺼 두므로 눌리지도 않는다.
 */

/** 작성 가이드는 전체가 아니라 예시로 두 항목에만 붙인다. */
const GUIDES: Record<string, string> = {
  personal:
    '이름, 성별, 생년월일, 주소, 연락처(이메일, 휴대전화, 비상연락망 등)는 지원자의 인적사항을 알아보기 위한 정보이므로 주민등록에 기재된 것을 기준으로 작성합니다.',
  bonus:
    '가산점의 허위기재 및 잘못된 입력으로 인해 발생된 불이익은 응시자 본인에게 책임이 있으니 가산점 등록 시 유의하시기 바랍니다.',
}

/** 입력창 아래 파란 안내문도 예시로 두 개만. */
const HINTS: Record<string, string> = {
  '희망 연봉': '만원 단위로 입력해 주세요.',
  '직전 연봉': '만원 단위로 입력해 주세요.',
}

const PROFILE_FIELDS: Field[] = [
  { label: '이름', value: '홍길동' },
  { label: '영문 이름', value: 'HONG GILDONG' },
  { label: '휴대폰 번호', value: '+82) 010-1234-5678' },
  { label: '이메일', value: 'honggildong@nhr.kr' },
  { label: '긴급 연락처', value: '+82)010-1234-5678' },
  { label: '생년월일', value: '1996.12.31' },
  { label: '성별', value: '남' },
  { label: '취미', value: '독서,영화감상' },
  { label: '특기', value: '축구' },
  { label: '병역', value: '[군필] 공군 병장 / 만기제대' },
  { label: '주소', value: '(07727) 서울 강서구 까치산로 23, NHR Tower' },
]

function FieldInput({ field }: { field: Field }) {
  const hint = HINTS[field.label]

  return (
    <div className="flex flex-col">
      {/* 항목명은 입력창 테두리에 걸터앉는다 — 흰 바탕을 깔아 글자 뒤의
          테두리를 지운다(노치). 그래서 라벨이 상자 위로 7px 솟고,
          그만큼 상자를 아래로 내려 윗줄과 겹치지 않게 한다. */}
      <div className="relative mt-[7px] rounded-ui border border-[#d2d6db] bg-white px-3 py-[9px]">
        <span className="absolute -top-[7px] left-[9px] bg-white px-1 text-[11px] leading-[14px] text-[#8e949e]">
          {field.label} <span className="text-[#e5484d]">*</span>
        </span>
        <p className="truncate text-[13px] leading-[19px] text-[#212121]">{field.value}</p>
      </div>
      {/* 안내문 왼쪽 끝은 입력창 안의 값과 같은 자리(px-3)에서 시작한다. */}
      {hint && <p className="mt-1 whitespace-nowrap pl-3 text-[11px] leading-[16px] text-[#3379f3]">{hint}</p>}
    </div>
  )
}

function GroupBlock({ group }: { group: Group }) {
  const heading = [group.dateRange, group.title, group.badge].filter(Boolean).join('  ·  ')

  return (
    <div className="rounded-ui border border-[#e5e7eb] bg-white p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="flex size-[15px] items-center justify-center rounded-[3px] bg-[#0042b7]">
          <svg aria-hidden viewBox="0 0 24 24" className="size-[11px]">
            <path d="M5.5 12.5 10 17 18.5 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
        <p className="text-[13px] font-semibold leading-[19px] text-[#212121]">{heading}</p>
      </div>
      {/* 그룹 상자는 좌우로 나뉘기도 해서 폭이 들쭉날쭉하다 — 칸 수를 고정하지
          않고 110px 이 확보되는 만큼만 나눈다. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-2">
        {group.fields.map((field) => (
          <FieldInput key={field.label} field={field} />
        ))}
      </div>
    </div>
  )
}

function StarRow({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <img loading="lazy" decoding="async" key={n} src={n <= stars ? starFilled : starEmpty} alt="" className="size-[13px]" />
      ))}
    </span>
  )
}

/** Basic 뷰의 FormPreviewCard 와 짝을 이루는 지원자 뷰 렌더러. */
export function FormApplicantCard({ section }: { section: FormSection }) {
  const body = section.body
  if (!body) return null

  const guide = GUIDES[section.id]

  return (
    <div className="mt-3 w-full overflow-hidden rounded-ui border border-[#e5e7eb] bg-white first:mt-0">
      <div className="bg-[#f3f4f6] px-4 py-[9px]">
        <p className="text-[14px] font-semibold leading-[21px] text-[#212121]">{section.label}</p>
      </div>

      {guide && (
        <div className="border-b border-[#f3f4f6] px-4 py-3">
          <p className="mb-1 flex items-center gap-1 text-[12px] font-medium leading-[18px] text-[#4d5761]">
            작성 가이드
            <svg aria-hidden viewBox="0 0 24 24" className="size-[11px]">
              <path d="M6 14.5 12 8.5 18 14.5" fill="none" stroke="#8e949e" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </p>
          <p className="text-[12px] leading-[18px] text-[#6c737f]">{guide}</p>
        </div>
      )}

      <div className="p-4">
        {body.kind === 'profile' && (
          <>
            <img
              loading="lazy"
              decoding="async"
              src={applicantPhoto}
              alt="지원자 증명사진"
              className="mx-auto mb-4 h-[104px] w-[80px] rounded-ui object-cover shadow-[0px_2px_10px_0px_rgba(32,40,45,0.2)]"
            />
            <div className="grid grid-cols-3 gap-2">
              {PROFILE_FIELDS.map((field) => (
                <FieldInput key={field.label} field={field} />
              ))}
            </div>
          </>
        )}

        {body.kind === 'fields' && (
          <div className="grid grid-cols-3 gap-2">
            {body.fields.map((field) => (
              <FieldInput key={field.label} field={field} />
            ))}
          </div>
        )}

        {body.kind === 'groups' && (
          <div className={body.columns === 2 ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
            {body.groups.map((group) => (
              <GroupBlock key={group.title ?? group.dateRange} group={group} />
            ))}
          </div>
        )}

        {body.kind === 'ratings' && (
          <div className="grid grid-cols-2 gap-3">
            {body.languages.map((language) => (
              <div key={language.name} className="rounded-ui border border-[#e5e7eb] bg-white p-3">
                <p className="mb-1.5 text-[13px] font-semibold leading-[19px] text-[#212121]">{language.name}</p>
                {language.levels.map((level) => (
                  <div key={level.label} className="flex items-center justify-between py-1">
                    <span className="text-[12px] leading-[18px] text-[#8e949e]">{level.label}</span>
                    <StarRow stars={level.stars} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
