import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cardSkin, type CardId } from '../../lib/cardTheme'
import { Container } from '../ui/Container'
import { FitZoom } from '../ui/FitZoom'
import { Section } from '../ui/Section'
import { Hero2AnalyticsMockup } from './Hero2AnalyticsMockup'
import { Hero2SeoBrowserMockup } from './Hero2SeoBrowserMockup'

interface CardData {
  id: CardId
  title: string
  description: string
  visual: ReactNode
}

const CARDS: CardData[] = [
  {
    id: 'seo',
    title: 'SEO 설정',
    description: '채용사이트가 검색에 잘 노출되도록 주요 키워드, 사이트 제목 · 설명 등의 정보를 설정할 수 있습니다.',
    visual: <Hero2SeoBrowserMockup />,
  },
  {
    id: 'analytics',
    title: '애널리틱스 / 태그 설정',
    description: '채용 사이트 방문자의 데이터를 수집하여 지원자의 유입 채널을 분석하여 다음 채용 전략에 활용할 수 있습니다.',
    visual: <Hero2AnalyticsMockup />,
  },
]

/**
 * Figma node 2255:96 — "Hero 2-Feature cards". Two-column feature grid
 * (SEO settings / analytics & tag settings). Both inner mockups used to be
 * flattened screenshots; they are now real DOM (Hero2SeoBrowserMockup /
 * Hero2AnalyticsMockup) so they stay crisp at any display scale and animate
 * as the section scrolls in.
 */
export function Hero2SeoAnalyticsGrid() {
  return (
    <Section className="content-pt bg-white">
      <Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {CARDS.map((card, i) => {
            const skin = cardSkin(card.id)
            return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
              // 휴대폰에서는 그림이 줄어 고정 높이(335) 아래로 빈칸이 남았다 — 높이를 내용에 맡겨 그림이 바닥에 붙게 한다.
              className="flex flex-col items-center overflow-hidden rounded-card md:h-[335px]"
              style={skin.style}
            >
              <div className="flex w-full flex-col gap-3 p-8">
                <h3 className="type-card-title">
                  {card.title}
                </h3>
                <p className="type-card-body">{card.description}</p>
              </div>
              <FitZoom width={480} className="flex-1 items-start overflow-hidden">
                {card.visual}
              </FitZoom>
            </motion.div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
