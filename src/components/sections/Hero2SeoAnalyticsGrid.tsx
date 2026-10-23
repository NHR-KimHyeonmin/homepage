import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { Hero2AnalyticsMockup } from './Hero2AnalyticsMockup'
import { Hero2SeoBrowserMockup } from './Hero2SeoBrowserMockup'

interface CardData {
  title: string
  description: string
  visual: ReactNode
}

const CARDS: CardData[] = [
  {
    title: 'SEO 설정',
    description: '채용사이트가 검색에 잘 노출되도록 주요 키워드, 사이트 제목 · 설명 등의 정보를 설정할 수 있습니다.',
    visual: <Hero2SeoBrowserMockup />,
  },
  {
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
    <Section className="bg-surface-page pt-12 md:pt-[120px]">
      <Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
              className="flex h-[335px] flex-col items-center overflow-hidden rounded-card bg-card"
            >
              <div className="flex w-full flex-col gap-3 p-8">
                <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">{card.title}</h3>
                <p className="text-base leading-[1.45] tracking-[-0.08px] text-black/55">{card.description}</p>
              </div>
              <div className="flex w-full flex-1 items-start justify-center overflow-hidden">
                {card.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
