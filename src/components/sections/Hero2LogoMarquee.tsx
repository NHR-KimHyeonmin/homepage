import logoStrip from '../../assets/sections/hero2-logo-marquee/logo-strip.webp'
import { Section } from '../ui/Section'

/**
 * 고객사 로고 한 줄(원본 6319x168)을 높이 73 으로 줄여(→ 2746) 두 벌 이어
 * 흘린다. 공용 `marquee` 키프레임(0 → -50%)이라 -50% 에서 둘째 벌이 첫 벌의
 * 출발 자리에 정확히 놓여 이음매가 없다. 그림 양 끝 여백(49+49)이 로고 사이
 * 간격(≈90)과 같아 이어 붙여도 틈이 고르다.
 *
 * 이 띠는 자기 배경색을 따로 갖지 않고 흰 바탕 그대로 쓴다.
 */
export function Hero2LogoMarquee() {
  return (
    <Section id="hero2-logo-marquee" className="overflow-hidden bg-white py-4">
      {/* 전에는 3900px 를 60초에 흘렸다 — 줄 길이가 줄어 같은 속도(≈65px/초)가 되도록 시간을 맞춘다. */}
      <div className="flex w-max animate-marquee" style={{ animationDuration: '42s' }}>
        {[0, 1].map((copy) => (
          <img
            loading="lazy"
            decoding="async"
            key={copy}
            src={logoStrip}
            alt={copy === 0 ? '커리어링크 고객사 로고' : ''}
            aria-hidden={copy === 1}
            className="h-[73px] w-[2746px] max-w-none shrink-0"
          />
        ))}
      </div>
    </Section>
  )
}
