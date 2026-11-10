import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconMenu2, IconX } from '@tabler/icons-react'
import logoMark from '../../assets/sections/header/logo-mark.png'

/**
 * 상단 탭. 각 항목은 홈의 해당 섹션으로 내려간다. /ci 같은 다른 페이지에서도
 * 눌리도록 경로를 붙인다 — 홈에서는 같은 문서 안 이동이라 그대로 스크롤된다.
 */
const NAV_LINKS = [
  { label: '상품 소개', href: '/#top' },
  { label: '운영 지원', href: '/#support' },
  { label: 'FAQ', href: '/#faq' },
]

/**
 * 도입문의만 성격이 다르다 — 둘러보는 링크가 아니라 전환 지점이라 나머지와 같은
 * 무게로 두지 않고 버튼으로 뺀다. 휴대폰에서도 메뉴 속에 숨기지 않고 늘 보인다.
 * 연결할 곳이 정해지면 링크로 바꾼다.
 */
function InquiryButton() {
  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-cta px-4 py-2 text-[15px] font-semibold tracking-[-0.08px] text-white transition-colors hover:bg-cta-hover"
    >
      도입문의
    </button>
  )
}

export function Header() {
  // 휴대폰에서 링크 셋을 접어 두는 메뉴. 한 줄에 다 놓으면 로고 아래로 밀려 헤더가 두 줄이 됐다.
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    /* 스크롤해도 늘 위에 붙어 있다. 흰 바탕 아래 옅은 그림자로 본문과 구분한다. */
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_2px_14px_rgba(16,38,58,0.07)]">
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="/#top" aria-label="커리어링크 홈" className="shrink-0">
          <img src={logoMark} alt="커리어링크" className="h-[23px] w-auto" />
        </a>

        {/* 태블릿·PC: 링크를 한 줄에 */}
        <nav className="hidden items-center gap-x-5 text-base font-medium text-title md:flex lg:gap-x-8">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="whitespace-nowrap hover:opacity-80">
              {link.label}
            </a>
          ))}
          <InquiryButton />
        </nav>

        {/* 휴대폰: 도입문의 + 메뉴 버튼 */}
        <div className="flex items-center gap-2 md:hidden">
          <InquiryButton />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-title transition-colors hover:bg-black/5"
          >
            {open ? <IconX size={24} stroke={1.8} /> : <IconMenu2 size={24} stroke={1.8} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="주 메뉴"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black/5 md:hidden"
          >
            <ul className="flex flex-col px-5 py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 text-[17px] font-semibold text-title"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
