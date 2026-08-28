import { motion } from 'framer-motion'
import iconChevron from '../../assets/sections/hero2-db-og-mobile/icon-chevron.svg'
import logoUnivcert from '../../assets/sections/hero2-db-og-mobile/logo-univcert.png'
import logoYbm from '../../assets/sections/hero2-db-og-mobile/logo-ybm.png'
import phoneMobileForm from '../../assets/sections/hero2-db-og-mobile/phone-mobile-form.png'
import phoneOgShare from '../../assets/sections/hero2-db-og-mobile/phone-og-share.webp'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'

interface FieldData {
  label: string
  value: string
  chip?: string
}

function FieldCard({ title, fields }: { title: string; fields: FieldData[] }) {
  return (
    <div className="w-full max-w-[340px] shrink-0 overflow-hidden rounded-lg drop-shadow-[0_2px_5px_rgba(0,0,0,0.08)]">
      <div className="bg-[#f9fafb] px-4 py-2.5">
        <p className="text-base text-[#212121]">{title}</p>
      </div>
      <div className="flex flex-col gap-3 bg-white px-4 pb-4 pt-3">
        {fields.map((field) => (
          <div key={field.label} className="relative">
            <span className="absolute -top-[9px] left-[14px] z-10 bg-white px-1 text-[10px] leading-[17px] text-[#6c737f]">
              {field.label}
              <span className="text-primary"> *</span>
            </span>
            <div className="flex h-9 items-center justify-between rounded border border-[#d2d6db] px-2.5">
              <span className="flex items-center gap-1.5 text-sm text-[#212121]">
                {field.value}
                {field.chip && (
                  <span className="rounded-full bg-primary-lightest px-1.5 py-0.5 text-[9px] font-medium text-primary">{field.chip}</span>
                )}
              </span>
              <img src={iconChevron} alt="" className="size-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Figma node 2230:275 — "Hero 2-Feature cards". A verified-DB application
 * card (full width, real DOM field previews) followed by a two-column row
 * (mobile-responsive application / member·non-member document submission).
 * Phone UI mockups are flattened screenshots; card shells, headings, copy
 * and CTA pills are real markup.
 */
export function Hero2DbOgMobileGrid() {
  return (
    <Section className="bg-white px-6 pb-28 pt-[60px] md:px-16">
      <Container maxWidth={1208} className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex w-full flex-col gap-8 overflow-hidden rounded-2xl bg-gray-150 p-8"
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">검증된 DB 기반 지원서</h3>
            <p className="text-lg leading-[1.45] tracking-[-0.08px] text-black/55">
              인증된 학교·학과명, 어학성적 데이터를 제공하여, 표기 차이 없이 정확한 지원자 정보를 수집할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex shrink-0 items-center gap-3">
              <img src={logoUnivcert} alt="대학알리미" className="h-8 w-auto" />
              <img src={logoYbm} alt="YBM" className="h-6 w-auto" />
            </div>
            <div className="flex flex-1 flex-wrap gap-4">
              <FieldCard title="외국어시험" fields={[{ label: '시험명', value: 'TOEIC' }, { label: '점수', value: '880' }]} />
              <FieldCard
                title="대학교"
                fields={[
                  { label: '학교명', value: '서울대학교', chip: '본교' },
                  { label: '주전공', value: '경영학과' },
                ]}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="relative flex h-[580px] flex-col items-center gap-6 overflow-hidden rounded-2xl bg-gray-150 pb-10"
          >
            <div className="flex w-full flex-col gap-3 p-8 pb-0">
              <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">모바일 반응형 지원서</h3>
              <p className="text-lg leading-[1.45] tracking-[-0.08px] text-black/55">
                PC와 모바일 기기에 상관없이 어디에서나 지원서를 작성할 수 있습니다.
              </p>
              <p className="text-sm tracking-[-0.07px] text-black/30">*2025년 모바일 기기 접속률 15% 이상 (출처: 커리어링크)</p>
            </div>

            <div className="relative w-[370px]">
              <img src={phoneMobileForm} alt="모바일 화면에서 작성하는 지원서 미리보기" className="w-full" />
              <div className="absolute bottom-6 right-3 flex flex-col items-end gap-2">
                <button
                  type="button"
                  className="min-w-16 rounded-lg bg-primary px-[22px] py-[8px] text-[15px] font-medium text-white shadow-card"
                >
                  최종제출
                </button>
                <button
                  type="button"
                  className="min-w-16 rounded-lg bg-[#d1dae4] px-[22px] py-[8px] text-[15px] font-medium text-text shadow-card"
                >
                  임시저장
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="flex h-[580px] flex-col items-center gap-8 overflow-hidden rounded-2xl bg-gray-150 pt-0"
          >
            <div className="flex w-full flex-col gap-3 p-8">
              <h3 className="text-[32px] font-bold leading-[1.2] tracking-[-0.64px] text-black">회원 · 비회원 서류접수</h3>
              <p className="text-lg leading-[1.45] tracking-[-0.08px] text-black/55">
                회원전용 공고 또는 비회원전용 공고로 구분하여 공고를 생성할 수 있습니다.
              </p>
            </div>
            <img src={phoneOgShare} alt="채용 공고 링크를 공유했을 때 보여지는 오픈그래프 미리보기" className="h-[488px] w-[370px]" />
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
