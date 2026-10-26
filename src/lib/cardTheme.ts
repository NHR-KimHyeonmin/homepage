import type { CSSProperties } from 'react'

/**
 * Hero 2 기능 카드 일곱 장의 배경.
 *
 * 카드는 두 구역에 나뉘고, 구역마다 색이 하나씩이다.
 *
 *   지원자 모집 — 연한 하늘 198°      (SEO · 애널리틱스 · OG설정 · 공고 홍보)
 *   서류 접수   — 한 단계 진한 파랑 210° (검증된 DB · 모바일 반응형 · 회원·비회원)
 *
 * 구역 안에서는 전부 같은 색이다. 색이 구분하는 건 카드가 아니라 구역이라,
 * 한 구역 안에서 색을 흘리면 그 안에 또 순서가 있는 것처럼 읽힌다. 섹션이
 * 여러 개로 쪼개져 있어도 어디서 어디까지가 한 이야기인지 색만 보고 알 수
 * 있으면 된다 — 색이 장식이 아니라 묶음을 말한다.
 *
 * 두 구역을 색상각이 아니라 **진하기**로 가른다. 전에는 접수 쪽을 보라
 * (234°~284°)로 띄웠는데, 카드 안 목업에 커리어링크 브랜드 블루가 그대로
 * 들어 있어서 보라 바탕과 서로 밀어냈다. 같은 파랑 계열에 머물면서 명도만
 * 세 단계 내리면(93% → 90%) 브랜드색과 다투지 않고도 구역은 갈린다.
 *
 * 카드는 단색이다. 그라데이션은 메인 배너에서만 쓴다.
 *
 * 섹션 바탕은 tokens.css 의 `bg-group-recruit`(아주 옅은 하늘) /
 * `bg-group-intake`(흰색)다. 접수 쪽을 흰색으로 비운 건, 카드가 한 단계
 * 진해진 만큼 바탕까지 물들면 구역 전체가 무거워지기 때문이다.
 */

/** 여기 없는 카드는 모두 "지원자 모집" 쪽이다. */
const INTAKE: readonly string[] = ['db', 'mobile', 'member']

export type CardId = 'seo' | 'analytics' | 'og' | 'promo' | 'db' | 'mobile' | 'member'

/** 구역 바탕 class. 해당 구역에 속한 섹션은 모두 이걸 쓴다. */
export const GROUP_BG = {
  recruit: 'bg-group-recruit',
  intake: 'bg-group-intake',
} as const

/** [색상각, 명도]. 채도는 두 구역이 같다 — 흰 목업을 얹어도 눌리지 않고
 *  글자 대비(#0a1128 기준 13:1 이상)도 넉넉한 값이다. */
const SATURATION = 58
const RECRUIT = [198, 93] as const
const INTAKE_TONE = [210, 90] as const

export interface CardSkin {
  style: CSSProperties
  /** 제목 / 본문 글자색 */
  title: string
  body: string
}

/** 어느 틴트 위에서도 대비가 충분한 잉크. 순검정 대신 네이비 쪽으로 틀어
 *  두면 틴트와 같은 계열로 묶여 글자가 종이에 얹힌 것처럼 보인다. */
const INK = { title: 'text-[#0a1128]', body: 'text-[#0a1128]/60' }

export function cardSkin(id: CardId): CardSkin {
  const [hue, lightness] = INTAKE.includes(id) ? INTAKE_TONE : RECRUIT
  return { ...INK, style: { backgroundColor: `hsl(${hue} ${SATURATION}% ${lightness}%)` } }
}
