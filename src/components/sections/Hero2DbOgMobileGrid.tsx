import { motion } from 'framer-motion'
import memberGuestApply from '../../assets/sections/hero2-db-og-mobile/member-guest-apply.webp'
import phoneMobileForm from '../../assets/sections/hero2-db-og-mobile/phone-mobile-form.webp'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { Hero2VerifiedDbCard } from './Hero2VerifiedDbCard'

/**
 * Figma node 2230:275 — "Hero 2-Feature cards". A verified-DB application
 * card (full width, real DOM field previews) followed by a two-column row
 * (mobile-responsive application / member·non-member document submission).
 * Phone UI mockups are flattened screenshots; card shells, headings, copy
 * and CTA pills are real markup.
 */
export function Hero2DbOgMobileGrid() {
  return (
    <Section className="bg-surface-page pb-12 pt-6 md:pb-24 md:pt-16">
      <Container className="flex flex-col gap-6">
        <Hero2VerifiedDbCard />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="relative flex flex-col items-center overflow-hidden rounded-card bg-card"
          >
            <div className="flex w-full flex-col gap-3 p-8 pb-0">
              <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">모바일 반응형 지원서</h3>
              <p className="text-base leading-[1.45] tracking-[-0.08px] text-black/55">
                PC와 모바일 기기에 상관없이 어디에서나 지원서를 작성할 수 있습니다.
              </p>
              <p className="text-sm tracking-[-0.07px] text-black/30">*2025년 모바일 기기 접속률 15% 이상 (출처: 커리어링크)</p>
            </div>

            {/* Zero-height wrapper: the phone hangs out of the flow and is
                clipped by the card, so this card takes its height from its
                sibling (회원 · 비회원) instead of driving the grid row. */}
            <div className="relative mt-6 h-0 w-[370px]">
              <img loading="lazy" decoding="async"
                src={phoneMobileForm}
                alt="모바일 화면에서 작성하는 지원서 미리보기"
                className="absolute left-0 top-0 w-full max-w-none"
              />
            </div>

            {/* Buttons ride the card's bottom edge rather than the phone's, so
                they stay fully visible however far the phone is cropped.
                `50% - 140px` lines them up with the phone's right margin. */}
            <div
              className="absolute bottom-6 flex flex-col items-end gap-2"
              style={{ right: 'calc(50% - 140px)' }}
            >
              <button
                type="button"
                className="min-w-16 rounded-ui bg-[#d1dae4] px-[22px] py-[8px] text-[15px] font-medium text-text shadow-card"
              >
                임시저장
              </button>
              <button
                type="button"
                className="min-w-16 rounded-ui bg-primary px-[22px] py-[8px] text-[15px] font-medium text-white shadow-card"
              >
                최종제출
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col items-center overflow-hidden rounded-card bg-card"
          >
            <div className="flex w-full flex-col gap-3 p-8">
              <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">회원 · 비회원 서류접수</h3>
              <p className="text-base leading-[1.45] tracking-[-0.08px] text-black/55">
                회원전용 공고 또는 비회원전용 공고로 구분하여 공고를 생성할 수 있습니다.
              </p>
            </div>
            <img loading="lazy" decoding="async"
              src={memberGuestApply}
              alt="회원 로그인 화면과 비회원용 지원서 작성 창으로 나뉘는 서류접수 흐름"
              className="w-full max-w-[587px]"
            />
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
