import { motion } from 'framer-motion'
import clsx from 'clsx'
import { cardSkin } from '../../lib/cardTheme'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { Hero2MemberGuestApply } from './Hero2MemberGuestApply'
import { Hero2MobileFormPhone } from './Hero2MobileFormPhone'
import { Hero2VerifiedDbCard } from './Hero2VerifiedDbCard'

/**
 * Figma node 2230:275 — "Hero 2-Feature cards". A verified-DB application
 * card (full width, real DOM field previews) followed by a two-column row
 * (mobile-responsive application / member·non-member document submission).
 * 두 칸은 2:3 으로 나눈다 — 왼쪽은 폰 한 대(370px)만 들어가면 되고,
 * 오른쪽은 로그인 창과 비회원 창이 나란히 설 폭이 필요하다.
 */
export function Hero2DbOgMobileGrid() {
  const mobileSkin = cardSkin('mobile')
  const memberSkin = cardSkin('member')

  return (
    <Section className="bg-group-intake pb-12 pt-6 md:pb-24 md:pt-16">
      <Container className="flex flex-col gap-6">
        <Hero2VerifiedDbCard />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="relative flex flex-col items-center overflow-hidden rounded-card"
            style={mobileSkin.style}
          >
            <div className="flex w-full flex-col gap-3 p-8 pb-0">
              <h3 className={clsx('text-[32px] font-bold leading-[1.2] tracking-[-0.64px]', mobileSkin.title)}>
                모바일 반응형 지원서
              </h3>
              <p className={clsx('text-[18px] leading-[1.45] tracking-[-0.08px]', mobileSkin.body)}>
                PC와 모바일 기기에 상관없이 언제 어디에서나 지원서를 작성하고 제출할 수 있습니다.
              </p>
            </div>

            <Hero2MobileFormPhone />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col items-center overflow-hidden rounded-card"
            style={memberSkin.style}
          >
            <div className="flex w-full flex-col gap-3 p-8">
              <h3 className={clsx('text-[32px] font-bold leading-[1.2] tracking-[-0.64px]', memberSkin.title)}>
                회원 · 비회원 서류접수
              </h3>
              <p className={clsx('text-[18px] leading-[1.45] tracking-[-0.08px]', memberSkin.body)}>
                회원전용 공고 또는 비회원전용 공고로 구분하여 공고를 생성할 수 있습니다. 지원자는 로그인해 회원으로
                지원하거나, 로그인 없이 이름·휴대폰 번호만 넣고 바로 작성을 시작할 수 있습니다.
              </p>
            </div>

            <Hero2MemberGuestApply />
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
