import { motion } from 'framer-motion'
import analyticsChartPreview from '../../assets/sections/hero2-seo-analytics/analytics-chart-preview.png'
import seoBrowserPreview from '../../assets/sections/hero2-seo-analytics/seo-browser-preview.png'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

interface CardData {
  title: string
  description: string
  image: string
  imageAlt: string
}

const CARDS: CardData[] = [
  {
    title: 'SEO 설정',
    description: '채용사이트가 검색에 잘 노출되도록 주요 키워드, 사이트 제목 · 설명 등의 정보를 설정할 수 있습니다.',
    image: seoBrowserPreview,
    imageAlt: '검색 결과에 노출된 커리어링크 채용 홈페이지 미리보기',
  },
  {
    title: '애널리틱스 / 태그 설정',
    description: '채용 사이트 방문자의 데이터를 수집하여 지원자의 유입 채널을 분석하여 다음 채용 전략에 활용할 수 있습니다.',
    image: analyticsChartPreview,
    imageAlt: '방문자 접속 기기 비율과 세션 추이를 보여주는 애널리틱스 대시보드',
  },
]

/**
 * Figma node 2255:96 — "Hero 2-Feature cards". Two-column feature grid
 * (SEO settings / analytics & tag settings). Each card's inner UI mockup is
 * a flattened screenshot; the card shell, heading and copy are real markup.
 */
export function Hero2SeoAnalyticsGrid() {
  return (
    <Section className="bg-white px-6 pt-20 md:px-16">
      <Container maxWidth={1208}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
              className="flex h-[335px] flex-col items-center overflow-hidden rounded-2xl bg-gray-150"
            >
              <div className="flex w-full flex-col gap-3 p-8">
                <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">{card.title}</h3>
                <p className="text-lg leading-[1.45] tracking-[-0.08px] text-black/55">{card.description}</p>
              </div>
              <div className="flex w-full flex-1 items-start justify-center overflow-hidden">
                <img src={card.image} alt={card.imageAlt} className="w-auto max-w-[90%] object-contain" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
