import { useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
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

        <SectionTitle
          eyebrow="전형 운영"
          heading={['반복되는 채용업무를', '보다 간결하게']}
          background="bg-surface-blue"
        />
        <Hero3Dashboard />

        <SectionTitle eyebrow="평가" heading={['번거로운 채용 루틴', '평가를 손쉽게']} />
        <Hero4FeatureCards />

        <SectionTitle
          eyebrow="외부 검사 연동"
          heading={['지원자 검토를 더욱 정밀하게']}
          background="bg-surface-blue"
        />
        <Hero00Screening />

        {/* Testimonials still carries its own embedded title in Figma — no standalone SectionTitle here. */}
        <Testimonials />

        <SectionTitle eyebrow="운영 지원" heading={['안정적인 채용을', '도와드립니다']} />
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

        <SectionTitle eyebrow="FAQ" heading={['커리어링크에 대해', '무엇이든지 물어보세요']} />
        <FaqList />

        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}

export default App
