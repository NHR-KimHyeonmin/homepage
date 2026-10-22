import { motion } from 'framer-motion'
import arrowNext from '../../assets/sections/hero7/arrow-next.svg'
import arrowPrev from '../../assets/sections/hero7/arrow-prev.svg'
import badge from '../../assets/sections/hero7/badge.png'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

export function Hero7() {
  return (
    <Section className="flex flex-col items-center bg-[#f8f9fa] py-12 md:py-24">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-4"
        >
          <p className="text-xl font-semibold tracking-[-0.1px] text-black/55">후기</p>
          <h2 className="text-[40px] font-bold leading-[1.4] tracking-[-1.12px] text-black md:text-[48px]">
            실제 고객들의
            <br />
            사용 후기
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="flex w-full flex-col items-end gap-4 pt-0 md:w-[563px] md:pt-[46px]"
        >
          <div className="flex w-full flex-col gap-5 rounded-card">
            <div className="flex flex-col gap-3">
              <h5 className="text-[28px] font-semibold leading-[1.4] tracking-[-0.56px] text-black">
                &quot;전형 리드타임 단축 및 높은 사용자 편의성&quot;
              </h5>
              <p className="text-lg leading-[1.58] tracking-[-0.36px] text-black/55">
                도입 이후 지원자가 90% 상승했습니다. 실시간 대응과 일부 커스터마이징 가능한 항목이 있어 전형
                리드타임이 단축되었고, 고졸 채용 시 자동 평점 계산이 큰 도움이 되었습니다. 사용해 본 ATS 중 최고의
                디자인과 사용자 편의성, 계속되는 업데이트가 매우 만족스럽습니다.
              </p>
            </div>
            <img src={badge} alt="대학내일ES" className="h-8 w-[106px] object-contain" />
          </div>

          <div className="flex items-start gap-4">
            <button
              type="button"
              aria-label="이전 후기"
              className="flex size-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-70"
            >
              <img src={arrowPrev} alt="" className="size-7" />
            </button>
            <button
              type="button"
              aria-label="다음 후기"
              className="flex size-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-70"
            >
              <img src={arrowNext} alt="" className="size-7" />
            </button>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
