import es from '../../assets/sections/hero2-showcase/es.webp'
import hyundai from '../../assets/sections/hero2-showcase/hyundai.webp'
import mbc from '../../assets/sections/hero2-showcase/mbc.webp'
import samsungMedicine from '../../assets/sections/hero2-showcase/samsung-medicine.webp'
import sbs from '../../assets/sections/hero2-showcase/sbs.webp'
import { Section } from '../ui/Section'

interface ShowcaseCard {
  name: string
  label: string
  image: string
  href?: string
}

const CARDS: ShowcaseCard[] = [
  { name: 'sbs', label: '  SBS', image: sbs },
  { name: 'mbc', label: '  iMBC', image: mbc, href: 'https://imbc.careerlink.kr/' },
  { name: 'es', label: '  대학내일ES', image: es },
  { name: 'hyundai', label: '  현대그룹', image: hyundai },
  { name: 'samsung-medicine', label: '  삼성메디슨', image: samsungMedicine },
]

// Duplicated once so the track can loop seamlessly from -50% back to 0%.
const MARQUEE_CARDS = [...CARDS, ...CARDS]

function ShowcaseCardItem({ card }: { card: ShowcaseCard }) {
  const image = <img src={card.image} alt={card.label.trim()} className="size-full rounded-2xl object-cover" />

  return (
    <div className="flex w-[360px] max-w-full shrink-0 flex-col items-start gap-2">
      {card.href ? (
        <a
          href={card.href}
          target="_self"
          className="block h-[220px] w-full shrink-0 overflow-hidden rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]"
        >
          {image}
        </a>
      ) : (
        <div className="h-[220px] w-full shrink-0 overflow-hidden rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]">
          {image}
        </div>
      )}
      <p className="w-full whitespace-pre-wrap text-base font-semibold tracking-[-0.08px] text-gray-250">{card.label}</p>
    </div>
  )
}

export function Hero2ClientShowcase() {
  return (
    <Section id="hero2-client-showcase" className="overflow-hidden bg-surface py-20">
      <div className="group [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]">
          {MARQUEE_CARDS.map((card, index) => (
            <ShowcaseCardItem key={`${card.name}-${index}`} card={card} />
          ))}
        </div>
      </div>
    </Section>
  )
}
