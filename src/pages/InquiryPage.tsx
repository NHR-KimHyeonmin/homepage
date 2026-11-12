import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { IconArrowLeft, IconCircleCheck, IconMail, IconPhone } from '@tabler/icons-react'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { Dropdown } from '../components/ui/Dropdown'
import { SectionEyebrow } from '../components/ui/SectionEyebrow'

/**
 * /inquiry — 도입 문의.
 *
 * 왼쪽은 무엇을 안내받는지와 연락처, 오른쪽은 입력 양식. 바탕은 첫 화면과 같은
 * 옅은 하늘빛 그라데이션, 글자 규격과 버튼은 홈과 같은 것을 쓴다.
 */

const SOURCES = ['검색(네이버·구글 등)', '지인 추천', '커리어톡', 'SNS·광고', '기타']

const PRIVACY = `주식회사 엔에이치알은 아래와 같이 개인정보를 수집 및 이용합니다.

1. 수집 · 이용 항목
- 기업명, 이름, 이메일, 연락처, 유입경로

2. 수집 · 이용 목적
- 도입 문의 상담 및 서비스 안내

3. 보유 · 이용 기간
- 문의 처리 완료 후 1년간 보관 후 파기

4. 동의를 거부할 권리
- 개인정보 수집 및 이용에 동의하지 않을 수 있으나, 동의하지 않으면 문의 접수가 제한됩니다.`

const FIELD =
  'w-full rounded-ui border border-[#d6dade] bg-white px-4 text-[15px] text-title outline-none transition-colors placeholder:text-[#9aa5b1] hover:border-[#b8c2cc] focus:border-primary focus:ring-3 focus:ring-primary/10'

export function InquiryPage() {
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', source: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }))

  const ready = agreed && form.company.trim() && form.name.trim() && form.email.trim() && form.phone.trim()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    // ponytail: 받을 곳(메일·API)이 정해지면 여기서 보낸다. 지금은 접수 화면만 보여 준다.
    setSent(true)
  }

  return (
    <>
    <Header />
    {/* 헤더가 위에 떠 있으므로(fixed) 그 높이만큼 위를 더 띄운다. */}
    <main className="min-h-screen w-full bg-[linear-gradient(160deg,#f3f6ff_0%,#eaf3fd_45%,#e3f4f8_100%)]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 pb-14 pt-28 md:px-8 md:pb-24 md:pt-36 lg:grid-cols-[1fr_500px] lg:gap-16 lg:pb-32 lg:pt-40">
        {/* 왼쪽: 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col lg:pt-10"
        >
          <a href="/" className="mb-8 inline-flex w-fit items-center gap-1.5 text-[14px] font-medium text-sub transition-colors hover:text-title lg:hidden">
            <IconArrowLeft size={18} stroke={1.8} />
            커리어링크 홈으로
          </a>
          <SectionEyebrow className="w-fit">커리어링크 도입 문의</SectionEyebrow>
          <h1 className="mt-3 text-[32px] font-bold leading-[1.35] tracking-[-0.8px] text-title md:text-[44px]">
            최적의 플랜을 안내 드립니다.
          </h1>
          <p className="mt-4 type-lead">채용 전문가들이 제공하는 맞춤형 솔루션으로 완벽한 인재를 찾아보세요.</p>

          <p className="mt-10 text-[16px] text-body">
            몇 가지 정보를 알려주시면 빠른 시간 내에 적합한 도입 플랜을 안내드리겠습니다.
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-[16px] text-title">
            {['커리어링크에 대한 전반적인 소개', '채용 현황에 따른 맞춤형 안내 및 추가 개발 사항 협의', '적합한 견적 안내'].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <IconCircleCheck size={20} stroke={1.8} className="mt-[1px] shrink-0 text-brand-500" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-5 border-t border-[#d6e2ee] pt-8 sm:flex-row sm:gap-12">
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-[14px] font-semibold text-sub">
                <IconMail size={18} stroke={1.8} />
                이메일
              </span>
              <a href="mailto:careerlink@nhr.kr" className="text-[16px] font-medium text-title hover:underline">
                careerlink@nhr.kr
              </a>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-[14px] font-semibold text-sub">
                <IconPhone size={18} stroke={1.8} />
                전화
              </span>
              <a href="tel:0269534828" className="text-[16px] font-medium text-title hover:underline">
                02)6953-4828
              </a>
            </div>
          </div>
        </motion.div>

        {/* 오른쪽: 양식 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="flex flex-col"
        >
          <a href="/" className="mb-4 hidden w-fit items-center gap-1.5 self-end text-[14px] font-medium text-sub transition-colors hover:text-title lg:inline-flex">
            <IconArrowLeft size={18} stroke={1.8} />
            커리어링크 홈으로
          </a>

          <div className="rounded-card bg-white p-6 shadow-float md:p-8">
            {sent ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center gap-3 text-center">
                <IconCircleCheck size={48} stroke={1.6} className="text-brand-500" />
                <p className="text-[22px] font-bold text-title">문의가 접수되었습니다.</p>
                <p className="type-card-body">빠른 시간 내에 담당자가 연락드리겠습니다.</p>
                <a href="/" className="mt-4 inline-flex items-center justify-center rounded-full bg-cta px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-cta-hover">
                  커리어링크 홈으로
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3.5">
                <input aria-label="기업명" required placeholder="기업명" value={form.company} onChange={(e) => set('company')(e.target.value)} className={`${FIELD} h-12`} />
                <input aria-label="이름" required placeholder="이름" autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} className={`${FIELD} h-12`} />
                <input aria-label="이메일" required type="email" placeholder="이메일" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} className={`${FIELD} h-12`} />
                <input aria-label="연락처" required type="tel" placeholder="연락처" autoComplete="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} className={`${FIELD} h-12`} />
                <Dropdown
                  options={SOURCES}
                  value={form.source}
                  onChange={set('source')}
                  label="어떻게 알게 되셨나요?"
                  placeholder="어떻게 알게 되셨나요?"
                  buttonClassName={`${FIELD} h-12`}
                />
                <textarea
                  aria-label="문의하실 내용"
                  placeholder="문의하실 내용"
                  rows={5}
                  value={form.message}
                  onChange={(e) => set('message')(e.target.value)}
                  className={`${FIELD} resize-none py-3 leading-[1.6]`}
                />

                <div className="mt-2 border-t border-[#eceff3] pt-4">
                  <label className="flex w-fit cursor-pointer items-center gap-2.5 text-[14px] font-semibold text-title">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="size-[18px] cursor-pointer accent-primary" />
                    개인정보 수집 및 이용 동의 (필수)
                  </label>
                  <div
                    tabIndex={0}
                    aria-label="개인정보 수집 및 이용 안내"
                    className="mt-3 h-[140px] overflow-y-auto whitespace-pre-line rounded-ui border border-[#e1e4e8] bg-[#f9fafb] px-4 py-3 text-[13px] leading-[1.7] text-body"
                  >
                    {PRIVACY}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!ready}
                  className="mt-2 h-[52px] cursor-pointer rounded-full bg-cta text-[16px] font-semibold text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:bg-[#d6dade] disabled:text-white"
                >
                  문의하기
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
    </>
  )
}
