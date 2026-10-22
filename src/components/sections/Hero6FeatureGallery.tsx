import { motion } from 'framer-motion'
import card1Onboarding from '../../assets/sections/hero6-feature-gallery/card1-onboarding.webp'
import card2Guidebook from '../../assets/sections/hero6-feature-gallery/card2-guidebook.webp'
import card3Manager from '../../assets/sections/hero6-feature-gallery/card3-manager.webp'
import card4Livechat from '../../assets/sections/hero6-feature-gallery/card4-livechat.webp'
import card5Security from '../../assets/sections/hero6-feature-gallery/card5-security.webp'
import card6Ga from '../../assets/sections/hero6-feature-gallery/card6-ga.webp'
import card7Homepage from '../../assets/sections/hero6-feature-gallery/card7-homepage.webp'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

const DESCRIPTION = '검색에 잘 노출되도록 검색 키워드를 설정할 수 있습니다.'

interface GalleryCard {
  title: string
  image: string
  /** Image height in px, matching each card's Figma frame — a masonry
   *  layout, so every card's image is a different height. */
  imageHeight: number
}

// Figma node 2320:26198 — three-column masonry gallery (7 cards total).
const COLUMN_1: GalleryCard[] = [
  { title: '온보딩 교육 지원', image: card1Onboarding, imageHeight: 270 },
  { title: '가이드북 제공', image: card2Guidebook, imageHeight: 219 },
]
const COLUMN_2: GalleryCard[] = [
  { title: '전담 담당자 지정', image: card3Manager, imageHeight: 190 },
  { title: '실시간 채팅 상담', image: card4Livechat, imageHeight: 200 },
  { title: '보안 점검 지원', image: card5Security, imageHeight: 131 },
]
const COLUMN_3: GalleryCard[] = [
  { title: 'GA 대시보드 제공', image: card6Ga, imageHeight: 196 },
  { title: '홈페이지 제작 지원', image: card7Homepage, imageHeight: 260 },
]

function GalleryCardItem({ card, index }: { card: GalleryCard; index: number }) {
  const delay = index * 0.06
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className="flex w-full flex-col overflow-hidden rounded-card bg-card"
    >
      <div className="w-full overflow-hidden" style={{ height: card.imageHeight }}>
        <img loading="lazy" decoding="async" src={card.image} alt="" className="size-full object-cover" />
      </div>
      <div className="flex flex-col gap-2 p-8">
        <h3 className="text-2xl font-semibold tracking-[-0.48px] text-black">{card.title}</h3>
        <p className="text-lg font-medium tracking-[-0.09px] text-black/55">{DESCRIPTION}</p>
      </div>
    </motion.div>
  )
}

export function Hero6FeatureGallery() {
  return (
    <Section className="flex flex-col items-center pb-12 pt-6 md:pb-24 md:pt-10">
      <Container className="flex w-full flex-col gap-5 md:flex-row">
        <div className="flex w-full flex-col gap-5 md:w-[304px] md:shrink-0">
          {COLUMN_1.map((card, i) => (
            <GalleryCardItem key={card.title} card={card} index={i} />
          ))}
        </div>
        <div className="flex w-full flex-1 flex-col gap-5">
          {COLUMN_2.map((card, i) => (
            <GalleryCardItem key={card.title} card={card} index={COLUMN_1.length + i} />
          ))}
        </div>
        <div className="flex w-full flex-1 flex-col gap-5">
          {COLUMN_3.map((card, i) => (
            <GalleryCardItem key={card.title} card={card} index={COLUMN_1.length + COLUMN_2.length + i} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
