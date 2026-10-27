import { useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ScrollNav } from './components/layout/ScrollNav'
import { CtaBanner } from './components/sections/CtaBanner'
import { FaqList } from './components/sections/FaqList'
import { Hero00Screening } from './components/sections/Hero00Screening'
import { Hero1 } from './components/sections/Hero1'
import { Hero2ApplicationBuilder } from './components/sections/Hero2ApplicationBuilder'
import { Hero2ApplicationCards } from './components/sections/Hero2ApplicationCards'
import { Hero2ApplicationTitle } from './components/sections/Hero2ApplicationTitle'
import { Hero2ClientShowcase } from './components/sections/Hero2ClientShowcase'
import { Hero2DbOgMobileGrid } from './components/sections/Hero2DbOgMobileGrid'
import { Hero2Headline } from './components/sections/Hero2Headline'
import { Hero2Highlight } from './components/sections/Hero2Highlight'
import { Hero2LogoMarquee } from './components/sections/Hero2LogoMarquee'
import { Hero2SeoAnalyticsGrid } from './components/sections/Hero2SeoAnalyticsGrid'
import { Hero2ThemeShowcase } from './components/sections/Hero2ThemeShowcase'
import { Hero3Dashboard } from './components/sections/Hero3Dashboard'
import { Hero4EvalScreen } from './components/sections/Hero4EvalScreen'
import { Hero4FeatureCards } from './components/sections/Hero4FeatureCards'
import { Hero6FeatureGallery } from './components/sections/Hero6FeatureGallery'
import { Hero7 } from './components/sections/Hero7'
import { Hero8Gallery } from './components/sections/Hero8Gallery'
import { Testimonials } from './components/sections/Testimonials'
import { SectionTitle } from './components/ui/SectionTitle'

function App() {
  // A deep link's own scroll fires before React has rendered the page, so the
  // browser finds no #target to jump to and the visitor lands on the hero
  // instead. Re-run it once the sections exist. `instant` opts out of the
  // global smooth scrolling — a deep link should already be at its target
  // rather than gliding down to it.
  useEffect(() => {
    const target = window.location.hash.slice(1)
    if (!target) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-surface-page">
      <Header />
      <ScrollNav />
      <main>
        <Hero1 />
        <Hero2LogoMarquee />
        <Hero2Headline />
        <Hero2ThemeShowcase />
        <Hero2Highlight />
        <Hero2SeoAnalyticsGrid />
        <Hero2ApplicationCards />
        <Hero2ClientShowcase />
        <Hero2ApplicationTitle />
        <Hero2ApplicationBuilder />
        <Hero2DbOgMobileGrid />

        {/* "전형 운영"은 "지원자 모집"과 같은 하늘색 톤으로 돌아온다 —
            청보라를 쓰는 "서류 접수" 구간을 사이에 두고 색이 번갈아
            나오면서, 스크롤을 내리는 동안 이야기가 바뀌는 자리가 보인다.

            이 제목은 바로 아래 오는 "일반 / 간편 전형" 블록을 가리킨다.
            그 아래 탭 묶음에는 Hero3Dashboard 가 자기 제목을 따로 들고 있다 —
            두 덩어리가 다른 이야기라 제목도 따로 선다. */}
        <SectionTitle
          eyebrow="전형 운영"
          heading={['채용 규모에 따라 선택하는', '전형관리 방식']}
          background="bg-group-recruit"
        />
        <Hero3Dashboard />

        <SectionTitle
          id="evaluation"
          eyebrow="평가"
          heading={['번거로운 채용 루틴', '평가를 손쉽게']}
          body="지원서를 보면서 바로 점수와 총평을 남기고, 평가자별 결과는 한곳에 모아 확인해보세요."
        />
        <Hero4EvalScreen />
        <Hero4FeatureCards />

        <SectionTitle
          eyebrow="외부 검사 연동"
          heading={['지원자 검토를 더욱 정밀하게']}
          background="bg-surface-blue"
        />
        <Hero00Screening />

        {/* Testimonials still carries its own embedded title in Figma — no standalone SectionTitle here. */}
        <Testimonials />

        <SectionTitle id="support" eyebrow="운영 지원" heading={['안정적인 채용을', '도와드립니다']} />
        <Hero6FeatureGallery />

        <SectionTitle
          heading={['채용을 더 완벽하게']}
          body="채용과 관련된 NHR의 더 많은 서비스를 함께 확인해보세요."
          align="left"
          bodyTone="gray"
        />
        <Hero8Gallery />

        {/* Hero7 still carries its own embedded title in Figma — no standalone SectionTitle here. */}
        <Hero7 />

        <SectionTitle id="faq" eyebrow="FAQ" heading={['커리어링크에 대해', '무엇이든지 물어보세요']} />
        <FaqList />

        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}

export default App
