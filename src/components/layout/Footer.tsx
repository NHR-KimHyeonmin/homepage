import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconBrandLinkedin, IconChevronDown } from '@tabler/icons-react'

const NAV_LINKS = [
  { label: '개인정보처리방침', href: '#', strong: true },
  { label: '서비스 소개', href: '#' },
  { label: '도입문의', href: '#contact' },
  { label: 'CI 소개', href: '#' },
  { label: '업데이트 노트', href: '#' },
]

/** TODO: 실제 주소를 받으면 value 에 넣고 onChange 로 이동시킨다. */
const FAMILY_SITES = ['대학내일', 'NHR', 'N-HR연구소(커리어앤)', '올인원 채용솔루션 peak']

/**
 * 패밀리 사이트 고르개.
 *
 * 네이티브 select 로 뒀다가 직접 만들었다 — 펼쳐지는 목록은 브라우저가
 * 그리는 부분이라 CSS 가 닿지 않아, 모서리를 둥글게 하거나 줄 간격을 맞출
 * 수가 없다. 대신 바깥 클릭과 Esc 로 닫는 길은 손으로 달아 둔다.
 *
 * 목록은 위로 편다. 푸터는 페이지 맨 아래라 아래로 펴면 화면 밖으로 나간다.
 */
function FamilySitePicker() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative w-full md:w-[240px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-ui border border-black/10 bg-white px-4 py-2 text-left text-[15px] tracking-[-0.08px] text-body"
      >
        {selected ?? '패밀리 사이트'}
        <IconChevronDown
          size={20}
          stroke={1.8}
          aria-hidden
          className={`shrink-0 text-sub transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 버튼 윗변에서 자라 나온다 — 다 펼쳐진 판이 툭 나타나면 딸린
          목록이 아니라 따로 뜬 창으로 보인다. 높이는 내용에 맡기므로
          항목 수가 바뀌어도 손댈 데가 없다. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full left-0 right-0 z-20 overflow-hidden rounded-ui border border-black/10 bg-white shadow-[0_12px_28px_-8px_rgba(32,41,57,0.3)]"
          >
            <div className="py-1">
          {FAMILY_SITES.map((site) => {
            const isSelected = site === selected
            return (
              <li key={site}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelected(site)
                    setOpen(false)
                  }}
                  className={`block w-full cursor-pointer px-4 py-2.5 text-left text-[15px] tracking-[-0.08px] transition-colors ${
                    isSelected ? 'bg-brand-100 text-brand-700' : 'text-body hover:bg-brand-50'
                  }`}
                >
                  {site}
                </button>
              </li>
            )
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#f3f6f9] px-5 py-12 text-body md:px-8">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
        {/* 1줄: 바로가기 + 소셜 */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] tracking-[-0.08px]">
            {NAV_LINKS.map((link, index) => (
              <div key={link.label} className="flex items-center gap-x-4">
                {/* 칸막이는 항목 사이에만. 첫 항목 앞에 세우면 목록이
                    잘려 나온 것처럼 보인다. */}
                {index > 0 && <span aria-hidden className="h-3 w-px bg-black/15" />}
                <a
                  href={link.href}
                  className={`whitespace-nowrap transition-colors hover:text-title ${
                    link.strong ? 'font-bold text-body' : 'text-sub'
                  }`}
                >
                  {link.label}
                </a>
              </div>
            ))}
          </nav>

          <nav className="flex items-center gap-3">
            {/* 네이버는 Tabler 에 브랜드 아이콘이 없다. 손으로 그리지 않고
                머리글자를 그대로 세운다. */}
            <a
              href="#"
              aria-label="네이버 블로그"
              className="flex size-9 items-center justify-center rounded-full bg-black/5 text-[15px] font-bold transition-colors hover:bg-black/10"
            >
              N
            </a>
            <a
              href="#"
              aria-label="링크드인"
              className="flex size-9 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
            >
              <IconBrandLinkedin size={20} stroke={1.8} />
            </a>
          </nav>
        </div>

        {/* 2줄: 사업자 정보 + 패밀리 사이트 */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <address className="flex flex-col gap-1.5 text-[15px] not-italic leading-[1.6] tracking-[-0.08px] text-sub">
            <span className="font-semibold text-body">(주)엔에이치알</span>
            <span>07727 서울특별시 강서구 까치산로 23 NHR타워 | 대표이사 김종원</span>
            <span>사업자등록번호: 161-86-01410</span>
          </address>

          <FamilySitePicker />
        </div>

        <p className="text-[15px] tracking-[-0.08px] text-sub">© 2026 NHR. All Rights Reserved</p>
      </div>
    </footer>
  )
}
