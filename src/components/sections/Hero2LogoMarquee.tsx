import logoRow1 from '../../assets/sections/hero2-logo-marquee/logo-row-1.webp'
import logoRow2 from '../../assets/sections/hero2-logo-marquee/logo-row-2.webp'
import logoRow3 from '../../assets/sections/hero2-logo-marquee/logo-row-3.webp'
import { Section } from '../ui/Section'

const ROWS = [logoRow1, logoRow2, logoRow3]

/**
 * Figma node 2331:12885 — three client-logo strips laid end to end, drawn
 * at 1.3x the Figma size (1000x56 → 1300x73). Rendered twice back-to-back
 * so the shared `marquee` keyframe (0 → -50%) loops seamlessly: at -50% the
 * second copy sits exactly where the first one started.
 *
 * The exports carried a 1px grey hairline along their bottom edge, which
 * read as a divider under the whole section — it was cropped out of the
 * .webp files rather than masked here.
 *
 * 이 띠는 자기 배경색을 따로 갖지 않고 아래 "지원자 모집" 구역의 바탕을
 * 그대로 쓴다. 전에는 #fafafa 였는데, 위는 배너 그라데이션이고 아래는
 * #f6fafc 라서 혼자 다른 색인 흰 띠 한 줄로 떠 보였다. 로고 줄은 지원자
 * 모집 이야기의 첫머리이므로 그 구역 바탕에 얹히는 게 맞다.
 */
export function Hero2LogoMarquee() {
  return (
    <Section id="hero2-logo-marquee" className="overflow-hidden bg-group-recruit py-4">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
            {ROWS.map((row, index) => (
              <img loading="lazy" decoding="async"
                key={row}
                src={row}
                alt={copy === 0 && index === 0 ? '커리어링크 고객사 로고' : ''}
                className="h-[73px] w-[1300px] max-w-none"
              />
            ))}
          </div>
        ))}
      </div>
    </Section>
  )
}
