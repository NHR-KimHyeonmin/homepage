import logoRow1 from '../../assets/sections/hero2-logo-marquee/logo-row-1.webp'
import logoRow2 from '../../assets/sections/hero2-logo-marquee/logo-row-2.webp'
import logoRow3 from '../../assets/sections/hero2-logo-marquee/logo-row-3.webp'
import { Section } from '../ui/Section'

const ROWS = [logoRow1, logoRow2, logoRow3]

/**
 * Figma node 2331:12885 — three 1000x57 client-logo strips laid end to end.
 * Rendered twice back-to-back so the shared `marquee` keyframe (0 → -50%)
 * loops seamlessly: at -50% the second copy sits exactly where the first
 * one started.
 */
export function Hero2LogoMarquee() {
  return (
    <Section id="hero2-logo-marquee" className="overflow-hidden bg-white py-4">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
            {ROWS.map((row, index) => (
              <img
                key={row}
                src={row}
                alt={copy === 0 && index === 0 ? '커리어링크 고객사 로고' : ''}
                className="h-[57px] w-[1000px] max-w-none"
              />
            ))}
          </div>
        ))}
      </div>
    </Section>
  )
}
