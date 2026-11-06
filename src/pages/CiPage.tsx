import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { IconDownload } from '@tabler/icons-react'
import logoAiZip from '../assets/sections/ci/Careerlink_Brand_Logo_RGB_AI.zip?url'
import logoPngZip from '../assets/sections/ci/Careerlink_Brand_Logo_RGB_PNG.zip?url'
import clearSpaceM from '../assets/sections/ci/clear-space-m.png'
import clearSpacePc from '../assets/sections/ci/clear-space-pc.png'
import colorLogosM from '../assets/sections/ci/color-logos-m.png'
import colorM from '../assets/sections/ci/color-m.png'
import colorPc from '../assets/sections/ci/color-pc.png'
import partnershipsM from '../assets/sections/ci/partnerships-m.png'
import partnershipsPc from '../assets/sections/ci/partnerships-pc.png'
import signatureM from '../assets/sections/ci/signature-m.png'
import signaturePc from '../assets/sections/ci/signature-pc.png'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { Container } from '../components/ui/Container'
import { Section } from '../components/ui/Section'
import { SectionEyebrow } from '../components/ui/SectionEyebrow'

/**
 * /ci — 커리어링크 CI 소개.
 *
 * 브랜드 가이드 문서(시그니처 로고 → 여백 → 파트너십 → 컬러)를 순서 그대로
 * 옮기되, 홈페이지와 같은 바탕(연한 하늘색 판, 둥근 모서리, 같은 글자 규격)
 * 위에 다시 앉혔다.
 *
 * 가이드 그림은 디자인팀 원본(PC·모바일 두 벌)을 그대로 쓰고, 768px 아래에서는
 * 모바일용으로 바꿔 끼운다. 제목·설명 글은 DOM 으로 다시 써서 홈과 같은 글자
 * 규격을 따른다.
 */

const FILES = { ai: logoAiZip, png: logoPngZip }

const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

/** 가이드 그림. 좁은 화면에서는 세로로 다시 짠 모바일 그림을 쓴다. */
function Figure({ pc, mobile, alt }: { pc: string; mobile: string[]; alt: string }) {
  return (
    <>
      <img src={pc} alt={alt} loading="lazy" decoding="async" className="hidden w-full md:block" />
      <div className="flex flex-col md:hidden">
        {mobile.map((src, i) => (
          <img key={src} src={src} alt={i === 0 ? alt : ''} loading="lazy" decoding="async" className="w-full" />
        ))}
      </div>
    </>
  )
}

/** 가이드 한 꼭지 — 번호, 제목, 설명, 그리고 그림 판. */
function Block({ index, title, children, body }: { index: string; title: string; body: ReactNode; children: ReactNode }) {
  return (
    <motion.section {...REVEAL} className="flex flex-col gap-10 border-t border-brand-100 py-20 md:py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-16">
        <div className="flex shrink-0 items-baseline gap-3 md:w-[320px]">
          <span className="text-[15px] font-bold text-brand-500">{index}</span>
          <h2 className="text-[28px] font-bold leading-[1.3] tracking-[-0.6px] text-title md:text-[32px]">{title}</h2>
        </div>
        <div className="type-card-body max-w-[720px] leading-[1.7]">{body}</div>
      </div>
      {children}
    </motion.section>
  )
}

export function CiPage() {
  return (
    <div className="relative overflow-x-hidden bg-white">
      <Header />

      {/* 머리말 — 홈 첫 화면과 같은 하늘색 램프를 낮게 깐다. */}
      <Section className="pb-16 pt-[160px] md:pb-24 md:pt-[200px]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: 'linear-gradient(180deg, #f5fafe 0%, #e3f1fb 55%, #ffffff 100%)' }}
        />
        <Container>
          <motion.div {...REVEAL} className="flex flex-col items-start gap-6">
            <SectionEyebrow>Brand Identity</SectionEyebrow>
            <h1 className="type-title">커리어링크 CI</h1>
            <p className="type-lead max-w-[760px]">
              빠르게 변화하는 채용 산업에서 커리어링크가 하나의 채용 전문 솔루션으로 진화하고, 복잡해지는 채용 과정에서
              지원자와 관리자를 연결하는 의미를 담았습니다.
            </p>
          </motion.div>
        </Container>
      </Section>

      <Container className="pb-24 md:pb-32">
        {/* 1. Signature Logo */}
        <Block
          index="01"
          title="Signature Logo"
          body={
            <>
              커리어링크의 브랜드 아이덴티티의 핵심 요소입니다.
              <br />
              심볼과 로고가 결합한 기본이 되는 시그니처 로고로 색상, 형태 등 변형 없이 그대로 사용해야 하며, 활용 가이드에
              맞추어 사용해야 합니다.
            </>
          }
        >
          <Figure pc={signaturePc} mobile={[signatureM]} alt="커리어링크 시그니처 로고" />
          <div className="flex flex-col items-center gap-8">
            <p className="type-card-body text-center leading-[1.7]">
              빠르게 변화하는 채용 산업에서 커리어링크가 하나의 채용 전문 솔루션으로 진화하고
              <br className="hidden md:block" />
              복잡해지는 채용 과정에서 지원자, 관리자를 연결하고 도움이 되는 의미를 내포하고 있습니다.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'AI 파일 다운로드', href: FILES.ai, file: 'Careerlink_Brand_Logo_RGB_AI.zip' },
                { label: 'PNG 파일 다운로드', href: FILES.png, file: 'Careerlink_Brand_Logo_RGB_PNG.zip' },
              ].map(({ label, href, file }) => (
                <a
                  key={label}
                  href={href || undefined}
                  download={file}
                  aria-disabled={!href}
                  className={clsx(
                    'inline-flex items-center gap-2 rounded-card bg-cta px-6 py-3.5 text-[16px] font-semibold text-white transition-colors',
                    href ? 'hover:bg-cta-hover' : 'pointer-events-none opacity-40',
                  )}
                >
                  {label}
                  <IconDownload size={18} stroke={1.8} />
                </a>
              ))}
            </div>
          </div>
        </Block>

        {/* 2. Clear Space & Scale */}
        <Block
          index="02"
          title="Clear Space & Scale"
          body={
            <>
              Clear Space는 로고가 다른 요소로부터 침범받지 않도록 최소한의 공간을 확보해 주는 가이드입니다.
              <br />
              커리어링크 로고를 적용할 때 최소 공간을 유지하며, 다른 요소나 복잡한 패턴에 의해 침범받는 경우가 없도록
              주의해야 합니다.
            </>
          }
        >
          <Figure pc={clearSpacePc} mobile={[clearSpaceM]} alt="로고 최소 여백 가이드 — 최소한의 여백은 준수하여 사용해야 합니다." />
        </Block>

        {/* 3. Partnerships */}
        <Block
          index="03"
          title="Partnerships"
          body={
            <>
              커리어링크 로고를 파트너사와 함께 표기할 경우, 아래와 같은 규정을 준수하여 표기해야 합니다.
              <br />
              또한 파트너사의 로고 형태에 따라 시각적인 보정이 필요하면 Clear Space 규정을 준수하는 범위에서 조정할 수
              있습니다.
            </>
          }
        >
          <Figure
            pc={partnershipsPc}
            mobile={[partnershipsM]}
            alt="파트너사 로고 병기 가이드 — 로고 사이 최소 여백은 careerlink 의 c 너비이며, × 로 잇고 + 로 잇지 않는다."
          />
        </Block>

        {/* 4. Color */}
        <Block
          index="04"
          title="Color"
          body={
            <>
              아래 팔레트의 컬러들을 기본 컬러로 사용해야 합니다.
              <br />
              배경색과 명도에 따라 모두가 쉽게 인지할 수 있도록 활용해주세요.
            </>
          }
        >
          <Figure pc={colorPc} mobile={[colorM, colorLogosM]} alt="커리어링크 컬러 팔레트와 배경색별 로고 사용 예" />
        </Block>
      </Container>

      <Footer />
    </div>
  )
}
