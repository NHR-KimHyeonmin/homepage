import { motion } from 'framer-motion'
import iconBattery from '../../assets/sections/hero2-application-cards/icon-battery.svg'
import iconPlus from '../../assets/sections/hero2-application-cards/icon-plus.svg'
import iconSignal from '../../assets/sections/hero2-application-cards/icon-signal.svg'
import iconSmiley from '../../assets/sections/hero2-application-cards/icon-smiley.svg'
import iconWifi from '../../assets/sections/hero2-application-cards/icon-wifi.svg'
import jobPromoChannels from '../../assets/sections/hero2-application-cards/job-promo-channels.webp'
import ogPreviewImage from '../../assets/sections/hero2-application-cards/og-preview-image.webp'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

/**
 * Figma node 2287:3751 — "Hero 2-Feature cards". Two-column card grid:
 * Card 1 ("공고별 OG설정") has a full phone-frame mockup of a KakaoTalk-style
 * share sheet with a live OG preview card; Card 2 ("채용 공고 홍보") shows the
 * "공고 홍보하기" menu wired to the external job channels (Figma node
 * 2337:13527).
 */
export function Hero2ApplicationCards() {
  return (
    <Section className="bg-white pb-12 pt-6 md:pb-24 md:pt-6">
      <Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center overflow-hidden rounded-card bg-card"
          >
            <div className="flex w-full flex-col gap-3 p-8">
              <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">공고별 OG설정</h3>
              <p className="text-lg leading-[1.45] tracking-[-0.09px] text-black/55">
                공고별 오픈그래프 이미지를 설정해 SNS·메신저에 채용 공고가 공유될 때 자사의 채용 이미지를 보여줄 수 있습니다.
              </p>
            </div>

            <div className="relative h-[409px] w-[370px] shrink-0 rounded-t-[40px] border-x-[10px] border-t-[10px] border-white bg-[#cfe2f0]">
              {/* status bar */}
              <div className="flex items-center justify-between px-9 pt-5">
                <p className="text-[18px] font-semibold tracking-[-0.09px] text-black">17:21</p>
                <div className="flex items-center gap-1.5">
                  <img loading="lazy" decoding="async" src={iconSignal} alt="" className="h-[13px] w-[9px]" />
                  <img loading="lazy" decoding="async" src={iconWifi} alt="" className="h-[16px] w-[16px]" />
                  <img loading="lazy" decoding="async" src={iconBattery} alt="" className="h-[16px] w-[16px]" />
                </div>
              </div>

              {/* OG share preview card */}
              <div className="absolute right-[13px] top-[76px] h-[193px] w-[236px] overflow-hidden rounded-ui bg-white shadow-card">
                <img loading="lazy" decoding="async"
                  src={ogPreviewImage}
                  alt="NHR 신규 채용 오픈그래프 미리보기 이미지"
                  className="h-[124px] w-full object-cover"
                />
                <div className="flex flex-col gap-1.5 px-[13px] pt-3">
                  <p className="text-[13px] font-medium leading-[1.4] text-black">NHR 신규 채용</p>
                  <p className="text-[11px] leading-[1.4] text-[#6b6f78]">2026년 정규직 대규모 채용 (AE마케팅, 디자인)</p>
                  <p className="text-[10px] leading-[1.4] tracking-[-0.05px] text-[#3d96ef] underline">careers.nhr.kr</p>
                </div>
              </div>

              {/* url bar + send control */}
              <div className="absolute bottom-0 left-0 flex w-[350px] flex-col gap-3 bg-white px-[9px] pb-2 pt-[13px]">
                <p className="truncate text-[16px] font-light tracking-[-0.08px] text-ink">
                  https://careers.nhr.kr/jobs/RC202310181234
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img loading="lazy" decoding="async" src={iconPlus} alt="" className="size-6" />
                    <img loading="lazy" decoding="async" src={iconSmiley} alt="" className="size-6" />
                  </div>
                  <button
                    type="button"
                    className="min-w-16 rounded-chip bg-[#ffeb00] px-[15px] py-[6px] text-[14px] font-medium text-ink"
                  >
                    전송
                  </button>
                </div>
              </div>
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
              <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">채용 공고 홍보</h3>
              <p className="text-lg leading-[1.45] tracking-[-0.09px] text-black/55">
                인디스워크, 캐치, 디맨드 등의 홍보 채널에 공고 정보가 연동되어 손쉽게 채용공고를 게재할 수 있습니다.
              </p>
            </div>

            {/* Figma node 2337:13527 — 공고 목록의 "공고 홍보하기" 메뉴에서 외부
                채널(인디스워크·캐치·디맨드·페이스북)로 연동되는 흐름. */}
            <div className="flex w-full flex-1 items-end justify-center overflow-hidden px-6">
              <img loading="lazy" decoding="async"
                src={jobPromoChannels}
                alt="공고 홍보하기 메뉴에서 인디스워크 · 캐치 · 디맨드 · 페이스북 채널로 공고가 연동되는 화면"
                className="w-full max-w-[528px] object-contain"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
