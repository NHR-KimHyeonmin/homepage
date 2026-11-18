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
const OTHER = '기타'

const INBOUND_API = 'https://api.inhr.co.kr/v1/post/inbound/insert'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PRIVACY = `주식회사 엔에이치알은 아래와 같이 개인정보를 수집 및 이용합니다.

1. 수집 · 이용 항목
- 기업명, 이름, 이메일, 연락처, 유입경로

2. 수집 · 이용 목적
- 도입 문의 상담 및 서비스 안내

3. 보유 · 이용 기간
- 문의 처리 완료 후 1년간 보관 후 파기

4. 동의를 거부할 권리
- 개인정보 수집 및 이용에 동의하지 않을 수 있으나, 동의하지 않으면 문의 접수가 제한됩니다.`

const ERROR = '!border-[#e5484d] focus:!ring-[#e5484d]/10'

const FIELD =
  'w-full rounded-ui border border-[#d6dade] bg-white px-4 text-[15px] text-title outline-none transition-colors placeholder:text-[#9aa5b1] hover:border-[#b8c2cc] focus:border-primary focus:ring-3 focus:ring-primary/10'

export function InquiryPage() {
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', source: '', sourceEtc: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  /** 이메일 칸을 한 번 떠났는지 — 치는 도중부터 빨갛게 하지 않는다. */
  const [emailTouched, setEmailTouched] = useState(false)
  /** 연락처에 숫자 아닌 글자를 쳤다 — 그 글자는 버리고 안내만 띄운다. */
  const [phoneWarn, setPhoneWarn] = useState(false)
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }))

  const emailValid = EMAIL_RE.test(form.email.trim())
  const emailError = emailTouched && form.email.trim() !== '' && !emailValid
  const ready = agreed && form.company.trim() && form.name.trim() && emailValid && form.phone.trim() && !sending

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    const refer = form.source === OTHER ? form.sourceEtc.trim() || OTHER : form.source
    setSending(true)
    setFailed(false)
    try {
      const response = await fetch(INBOUND_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coNm: form.company.trim(),
          asgnrNm: form.name.trim(),
          email: form.email.trim(),
          cnryNo: '82',
          tel: form.phone,
          titl: refer ? `도입 문의 (유입경로 : ${refer})` : '도입 문의',
          refer,
          cntn: form.message.trim(),
          privacyAgreeYn: 'Y',
        }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setSent(true)
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
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
                <div>
                  <input
                    aria-label="이메일"
                    required
                    type="email"
                    placeholder="이메일"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set('email')(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    aria-invalid={emailError}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    className={`${FIELD} h-12 ${emailError ? ERROR : ''}`}
                  />
                  {emailError && (
                    <p id="email-error" className="mt-1.5 pl-1 text-[13px] text-[#e5484d]">
                      이메일 형식으로 입력해 주세요. (예: name@company.com)
                    </p>
                  )}
                </div>
                <div>
                  <input
                    aria-label="연락처"
                    required
                    type="tel"
                    inputMode="numeric"
                    placeholder="연락처 (숫자만 입력)"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '')
                      setPhoneWarn(digits !== e.target.value)
                      set('phone')(digits)
                    }}
                    aria-describedby={phoneWarn ? 'phone-warn' : undefined}
                    className={`${FIELD} h-12 ${phoneWarn ? ERROR : ''}`}
                  />
                  {phoneWarn && (
                    <p id="phone-warn" role="alert" className="mt-1.5 pl-1 text-[13px] text-[#e5484d]">
                      숫자만 입력가능합니다.
                    </p>
                  )}
                </div>
                <Dropdown
                  options={SOURCES}
                  value={form.source}
                  onChange={set('source')}
                  onClear={() => setForm((current) => ({ ...current, source: '', sourceEtc: '' }))}
                  label="어떻게 알게 되셨나요?"
                  placeholder="어떻게 알게 되셨나요?"
                  buttonClassName={`${FIELD} h-12`}
                />
                {form.source === OTHER && (
                  <div className="relative">
                    <input
                      aria-label="유입 경로 직접 입력"
                      placeholder="어떻게 알게 되셨는지 직접 입력해 주세요."
                      maxLength={100}
                      value={form.sourceEtc}
                      onChange={(e) => set('sourceEtc')(e.target.value)}
                      className={`${FIELD} h-12 pr-16`}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#9aa5b1]">
                      {form.sourceEtc.length}/100
                    </span>
                  </div>
                )}
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

                {failed && (
                  <p role="alert" className="mt-1 text-[13px] leading-[1.6] text-[#e5484d]">
                    문의를 보내지 못했습니다. 잠시 후 다시 시도하시거나 careerlink@nhr.kr 로 보내 주세요.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!ready}
                  className="mt-2 h-[52px] cursor-pointer rounded-full bg-cta text-[16px] font-semibold text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:bg-[#d6dade] disabled:text-white"
                >
                  {sending ? '보내는 중…' : '문의하기'}
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
