/**
 * The 14 rows of the 지원서 양식 편집기 sidebar (Figma node 2337:13686), and
 * the preview card each enabled row shows in the centre column.
 *
 * Only the first seven rows are wired up in the design; the rest are drawn
 * disabled, with no preview card behind them.
 */
export interface Field {
  label: string
  value: string
}

export interface Group {
  /** Bold heading inside the bordered sub-card (e.g. "TOEIC", "장애 여부"). */
  title?: string
  dateRange?: string
  badge?: string
  fields: Field[]
}

type CardBody =
  | { kind: 'fields'; fields: Field[] }
  | { kind: 'profile' }
  /**
   * titleColumn 이 있으면 Retro 뷰에서 라벨/값 짝이 아니라 머리행이 있는
   * 열 표로 그린다 — 그룹마다 같은 항목을 되풀이하는 외국어시험·자격증은
   * 세로로 쌓는 것보다 한 줄씩 쌓는 쪽이 읽힌다. titleColumnAt 은 그
   * 제목 열이 몇 번째에 오는지다(기본 0).
   */
  | {
      kind: 'groups'
      columns: 1 | 2
      groups: Group[]
      titleColumn?: string
      titleColumnAt?: number
      /** 항목이 한 줄에 다 안 들어가는 대학원처럼, 제목을 세로로 합친 왼쪽
       *  칸에 두고 나머지를 머리행/값행 띠로 쌓는다. */
      titleRowSpan?: boolean
    }
  | { kind: 'ratings'; languages: { name: string; levels: { label: string; stars: number }[] }[] }

export interface FormSection {
  id: string
  label: string
  /** Disabled rows are greyed out and their switch does nothing. */
  disabled?: boolean
  body?: CardBody
}

export const FORM_SECTIONS: FormSection[] = [
  {
    id: 'apply',
    label: '지원정보',
    body: {
      kind: 'fields',
      fields: [
        { label: '지원 직무', value: '인사팀 > 인재영입파트' },
        { label: '희망 근무지', value: '서울' },
        { label: '지원 경로', value: '커리어톡' },
        { label: '희망 연봉', value: '5000 만원' },
        { label: '직전 연봉', value: '3500 만원' },
        { label: '희망직급', value: '대리' },
        { label: '입사가능일자', value: '2026.12.31' },
      ],
    },
  },
  { id: 'personal', label: '인적정보', body: { kind: 'profile' } },
  {
    id: 'bonus',
    label: '가산점',
    body: {
      kind: 'groups',
      columns: 2,
      titleRowSpan: true,
      groups: [
        {
          title: '장애 여부',
          badge: '대상',
          fields: [
            { label: '장애정도', value: '경증' },
            { label: '장애내용', value: '지체장애' },
          ],
        },
        {
          title: '보훈 대상 여부',
          badge: '대상',
          fields: [{ label: '관계', value: '아버지' }],
        },
      ],
    },
  },
  {
    id: 'graduate',
    label: '대학원',
    body: {
      kind: 'groups',
      columns: 1,
      titleColumn: '학교명',
      titleRowSpan: true,
      groups: [
        {
          dateRange: '2021.03.02 ~ 2024.01.25',
          badge: '졸업',
          title: '서울대학교 대학원',
          fields: [
            { label: '대학원 구분', value: '석사' },
            { label: '전공계열', value: '공학계열' },
            { label: '주전공', value: 'AI융합 교육학과' },
            { label: '학교소재지', value: '서울' },
            { label: '학점', value: '4.30/4.5' },
            { label: '지도교수', value: '김길동' },
            { label: 'Lab명', value: 'Human Interface' },
            { label: '주/야간', value: '주간' },
            { label: '본/분교', value: '본교' },
          ],
        },
      ],
    },
  },
  {
    id: 'language-test',
    label: '외국어시험',
    body: {
      kind: 'groups',
      columns: 2,
      titleColumn: '시험명',
      titleColumnAt: 1,
      groups: [
        {
          title: 'TOEIC',
          fields: [
            { label: '언어구분', value: '영어' },
            { label: '점수', value: '900' },
          ],
        },
        {
          title: 'TEPS',
          fields: [
            { label: '언어구분', value: '영어' },
            { label: '점수', value: '900' },
          ],
        },
      ],
    },
  },
  {
    id: 'certificate',
    label: '자격증',
    body: {
      kind: 'groups',
      columns: 2,
      titleColumn: '자격증명',
      groups: [
        {
          title: '1급방화관리자수첩',
          fields: [
            { label: '발행처', value: '한국소방안전원' },
            { label: '취득시기', value: '2020.03.01' },
          ],
        },
        {
          title: 'FIFA에이전트',
          fields: [
            { label: '발행처', value: '대한축구협회' },
            { label: '취득시기', value: '2020.03.01' },
          ],
        },
      ],
    },
  },
  {
    id: 'language-skill',
    label: '외국어활용 능력',
    body: {
      kind: 'ratings',
      languages: [
        {
          name: '영어',
          levels: [
            { label: '회화수준', stars: 4 },
            { label: '작문수준', stars: 2 },
            { label: '독해수준', stars: 1 },
          ],
        },
        {
          name: '일본어',
          levels: [
            { label: '회화수준', stars: 5 },
            { label: '작문수준', stars: 2 },
            { label: '독해수준', stars: 1 },
          ],
        },
      ],
    },
  },
  { id: 'education', label: '교육사항', disabled: true },
  { id: 'it-skill', label: 'IT활용 능력', disabled: true },
  { id: 'experience', label: '경험사항', disabled: true },
  { id: 'career', label: '경력사항', disabled: true },
  { id: 'extra', label: '추가정보(파일/링크)', disabled: true },
  { id: 'career-doc', label: '경력기술서', disabled: true },
  { id: 'cover-letter', label: '자기소개서', disabled: true },
]
