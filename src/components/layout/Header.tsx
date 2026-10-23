import logoMark from '../../assets/sections/header/logo-mark.png'

/**
 * 상단 탭. 각 항목은 페이지 안의 해당 섹션으로 내려간다 — 바깥으로
 * 나가는 링크가 아니므로 전부 같은 페이지의 앵커다.
 */
const NAV_LINKS = [
  { label: '서비스소개', href: '#hero2-headline' },
  { label: '고객사례', href: '#hero2-client-showcase' },
  { label: '기능소개', href: '#dashboard' },
  { label: '연동관리', href: '#integrations' },
]

/**
 * 폰트 폭이나 브라우저 배율에 따라 메뉴가 조금만 길어져도, 페이지 루트의
 * overflow-x-hidden 때문에 오른쪽이 소리 없이 잘려 나간다 — 스크롤바도
 * 안 생기니 잘린 줄도 모른다. 간격을 화면 폭에 따라 줄이고 줄바꿈을
 * 허용해, 넘치면 잘리는 대신 접히게 한다.
 */
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-6 md:px-8">
      <a href="#top" aria-label="커리어링크 홈" className="shrink-0">
        <img src={logoMark} alt="커리어링크" className="h-[23px] w-auto" />
      </a>
      <nav className="flex min-w-0 flex-wrap items-center justify-end gap-x-5 gap-y-2 text-base font-medium text-ink lg:gap-x-8">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="whitespace-nowrap hover:opacity-80">
            {link.label}
          </a>
        ))}
        {/* 도입문의만 성격이 다르다 — 둘러보는 링크가 아니라 전환 지점이라
            나머지와 같은 무게로 두지 않고 버튼으로 뺀다. */}
        <a
          href="#contact"
          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-card bg-[#0c0805] px-4 py-2 text-[15px] font-semibold tracking-[-0.08px] text-white transition-colors hover:bg-[#2a211c]"
        >
          도입문의
        </a>
      </nav>
    </header>
  )
}
