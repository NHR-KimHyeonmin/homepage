import type { CSSProperties } from 'react'

export type CardId = 'seo' | 'analytics' | 'og' | 'promo' | 'db' | 'mobile' | 'member'

/** Hero 2 기능 카드의 면. 구역과 상관없이 브랜드 하늘색 한 가지다. */
export function cardSkin(_id: CardId): { style: CSSProperties } {
  return { style: { backgroundColor: 'var(--color-brand-100)' } }
}
