import { Fragment } from 'react'
import applicantPhoto from '../../assets/sections/hero2-application-builder/applicant-photo.webp'
import type { Field, FormSection, Group } from './Hero2FormBuilderData'

/**
 * Retro(표) 뷰. Basic 카드 뷰와 같은 FORM_SECTIONS 를 그대로 받아, 같은
 * 내용을 라벨/값 표로 다시 그린다 — 사이드바 스위치로 꺼진 항목은 호출
 * 쪽에서 이미 걸러져 들어오므로 여기서는 신경 쓰지 않는다.
 *
 * 표는 윗변만 진한 선, 나머지는 연한 회색 — 구형 ATS 지원서 출력물의
 * 생김새다. 라벨 칸은 회색 바탕, 값 칸은 흰 바탕.
 */
const TABLE = 'w-full table-fixed border-collapse border-t-[1.5px] border-[#212121] text-[13px]'
const TH = 'border-b border-[#b9bcc2] bg-[#e5e7eb] px-2 py-[9px] text-center font-medium leading-[19px] text-[#212121]'
const TD = 'border-b border-[#c8ccd2] bg-white px-2 py-[9px] text-center leading-[19px] text-[#4d5761]'

/** 대학원처럼 항목이 많은 그룹은 한 띠에 이만큼씩 끊어 머리행/값행으로 쌓는다. */
const BAND = 4

/** 라벨/값 두 쌍씩 한 줄. 홀수면 첫 항목이 한 줄을 통째로 쓴다 —
 *  지원정보의 "지원 직무" 처럼 긴 값이 맨 위에서 넓게 잡힌다. */
function pairRows(fields: Field[]) {
  const list = [...fields]
  const rows: Field[][] = []
  if (list.length % 2 === 1) rows.push([list.shift() as Field])
  for (let i = 0; i < list.length; i += 2) rows.push(list.slice(i, i + 2))
  return rows
}

function chunk(fields: Field[], size: number) {
  const bands: Field[][] = []
  for (let i = 0; i < fields.length; i += size) bands.push(fields.slice(i, i + size))
  return bands
}

/** 제목 열을 지정한 자리에 끼워 넣는다. */
function insertAt(list: string[], item: string, index: number) {
  const next = [...list]
  next.splice(index, 0, item)
  return next
}

function Cols() {
  return (
    <colgroup>
      <col className="w-[21%]" />
      <col />
      <col className="w-[21%]" />
      <col />
    </colgroup>
  )
}

function PairRows({ fields }: { fields: Field[] }) {
  return (
    <>
      {pairRows(fields).map((row) => (
        <tr key={row.map((field) => field.label).join('|')}>
          {row.map((field) => (
            <Fragment key={field.label}>
              <th className={TH}>{field.label}</th>
              <td className={TD} colSpan={row.length === 1 ? 3 : 1}>
                {field.value}
              </td>
            </Fragment>
          ))}
        </tr>
      ))}
    </>
  )
}

/** 기간 · 제목 · 배지를 한 줄짜리 회색 머리행으로 묶는다. */
function groupHeading(group: Group) {
  return [group.dateRange, group.title, group.badge].filter(Boolean).join('  ·  ')
}

/**
 * 가산점 꼴 — 회색 제목 칸이 세로로 합쳐져 왼쪽에 서고, 오른쪽에 머리행 /
 * 값행 / 체크행이 쌓인다. 두 그룹이 좌우로 나란히 놓인다.
 */
function CheckGroupTable({ group }: { group: Group }) {
  const span = group.fields.length

  return (
    <table className={TABLE}>
      <tbody>
        <tr>
          <th className={`${TH} w-[40%] whitespace-nowrap`} rowSpan={group.badge ? 3 : 2}>
            {group.title}
          </th>
          {group.fields.map((field) => (
            <th key={field.label} className={TH}>
              {field.label}
            </th>
          ))}
        </tr>
        <tr>
          {group.fields.map((field) => (
            <td key={field.label} className={TD}>
              {field.value}
            </td>
          ))}
        </tr>
        {group.badge && (
          <tr>
            <td className={TD} colSpan={span}>
              <span className="inline-flex items-center gap-1">
                <svg aria-hidden viewBox="0 0 24 24" className="size-[11px]">
                  <path d="M5.5 12.5 10 17 18.5 7.5" fill="none" stroke="#4d5761" strokeWidth="3" strokeLinecap="round" />
                </svg>
                {group.badge}
              </span>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

/**
 * 대학원 꼴 — 학교명이 왼쪽 한 칸을 세로로 다 쓰고, 나머지 항목은 네 개씩
 * 끊어 머리행 / 값행 띠로 쌓인다. 기간과 졸업 상태는 Basic 뷰에서 카드
 * 머리에 붙던 값인데, 표에서는 머리가 없으니 항목으로 내려 보낸다.
 */
function BandTable({ group, titleColumn }: { group: Group; titleColumn: string }) {
  const fields: Field[] = [
    ...group.fields,
    ...(group.badge ? [{ label: '졸업 구분', value: group.badge }] : []),
    ...(group.dateRange ? [{ label: '재학기간', value: group.dateRange }] : []),
  ]
  const bands = chunk(fields, BAND)

  return (
    <table className={TABLE}>
      <tbody>
        <tr>
          <th className={`${TH} w-[19%]`}>{titleColumn}</th>
          {bands[0].map((field) => (
            <th key={field.label} className={TH}>
              {field.label}
            </th>
          ))}
        </tr>
        {bands.map((band, index) => (
          <Fragment key={band[0].label}>
            {index > 0 && (
              <tr>
                {band.map((field, cell) => (
                  <th key={field.label} className={TH} colSpan={cell === band.length - 1 ? BAND - band.length + 1 : 1}>
                    {field.label}
                  </th>
                ))}
              </tr>
            )}
            <tr>
              {index === 0 && (
                <td className={`${TD} align-middle`} rowSpan={bands.length * 2 - 1}>
                  {group.title}
                </td>
              )}
              {band.map((field, cell) => (
                <td key={field.label} className={TD} colSpan={cell === band.length - 1 ? BAND - band.length + 1 : 1}>
                  {field.value}
                </td>
              ))}
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  )
}

function ProfileTable() {
  return (
    <table className={TABLE}>
      <Cols />
      <tbody>
        <tr>
          <th className={TH}>이름</th>
          <td className={TD}>홍길동</td>
          <th className={TH} rowSpan={3}>
            사진
          </th>
          <td className={`${TD} align-middle`} rowSpan={3}>
            <img
              loading="lazy"
              decoding="async"
              src={applicantPhoto}
              alt="지원자 증명사진"
              className="mx-auto h-[104px] w-[80px] rounded-[2px] object-cover shadow-[0px_2px_10px_0px_rgba(32,40,45,0.2)]"
            />
          </td>
        </tr>
        <tr>
          <th className={TH}>영문 이름</th>
          <td className={TD}>HONG GILDONG</td>
        </tr>
        <tr>
          <th className={TH}>휴대폰 번호</th>
          <td className={TD}>+82) 010-1234-5678</td>
        </tr>
        <PairRows
          fields={[
            { label: '이메일', value: 'honggildong@nhr.kr' },
            { label: '긴급 연락처', value: '+82)010-1234-5678' },
            { label: '생년월일', value: '1996.12.31 (만 29세)' },
            { label: '성별', value: '남' },
            { label: '취미', value: '독서,영화감상' },
            { label: '특기', value: '축구' },
            { label: '병역', value: '[군필]공군 병장 정보 (2015.01.01~2016.12.30) 만기제대' },
            { label: '주소', value: '(07727) 서울 강서구 까치산로 23, NHR Tower' },
          ]}
        />
      </tbody>
    </table>
  )
}

/** Basic 뷰의 FormPreviewCard 와 짝을 이루는 Retro 뷰 렌더러. */
export function FormRetroTable({ section }: { section: FormSection }) {
  const body = section.body
  if (!body) return null

  return (
    <section className="mt-7 first:mt-0">
      <h4 className="mb-2 text-[15px] font-bold leading-[22px] text-[#212121]">{section.label}</h4>

      {body.kind === 'profile' && <ProfileTable />}

      {body.kind === 'fields' && (
        <table className={TABLE}>
          <Cols />
          <tbody>
            <PairRows fields={body.fields} />
          </tbody>
        </table>
      )}

      {body.kind === 'groups' &&
        (body.titleRowSpan && body.columns === 2 ? (
          <div className="grid grid-cols-2 items-start">
            {body.groups.map((group) => (
              <CheckGroupTable key={group.title} group={group} />
            ))}
          </div>
        ) : body.titleRowSpan ? (
          body.groups.map((group) => (
            <BandTable key={group.title} group={group} titleColumn={body.titleColumn ?? '구분'} />
          ))
        ) : body.titleColumn ? (
          /* 그룹마다 항목이 같은 섹션(외국어시험·자격증)은 머리행이 있는 열 표. */
          <table className={TABLE}>
            <tbody>
              <tr>
                {insertAt(
                  body.groups[0].fields.map((field) => field.label),
                  body.titleColumn,
                  body.titleColumnAt ?? 0,
                ).map((label) => (
                  <th key={label} className={TH}>
                    {label}
                  </th>
                ))}
              </tr>
              {body.groups.map((group) => (
                <tr key={group.title}>
                  {insertAt(
                    group.fields.map((field) => field.value),
                    group.title ?? '-',
                    body.titleColumnAt ?? 0,
                  ).map((value, index) => (
                    <td key={index} className={TD}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className={TABLE}>
            <Cols />
            <tbody>
              {body.groups.map((group) => (
                <Fragment key={group.title ?? group.dateRange}>
                  <tr>
                    <th className={`${TH} text-left`} colSpan={4}>
                      {groupHeading(group)}
                    </th>
                  </tr>
                  <PairRows fields={group.fields} />
                </Fragment>
              ))}
            </tbody>
          </table>
        ))}

      {body.kind === 'ratings' && (
        <table className={TABLE}>
          <tbody>
            <tr>
              <th className={TH}>언어명</th>
              {body.languages[0].levels.map((level) => (
                <th key={level.label} className={TH}>
                  {level.label}
                </th>
              ))}
            </tr>
            {body.languages.map((language) => (
              <tr key={language.name}>
                <td className={TD}>{language.name}</td>
                {language.levels.map((level) => (
                  <td key={level.label} className={TD}>
                    {level.stars}/5
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
