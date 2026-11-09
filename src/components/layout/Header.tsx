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
 * 폰트 폭이나 브라우저 배율에 따라 메뉴가 조금만 길어져도, 페이지 루트의
 * overflow-x-hidden 때문에 오른쪽이 소리 없이 잘려 나간다 — 스크롤바도
 * 안 생기니 잘린 줄도 모른다. 간격을 화면 폭에 따라 줄이고 줄바꿈을
 * 허용해, 넘치면 잘리는 대신 접히게 한다.
 */
export function Header() {
  return (
    /* 스크롤해도 늘 위에 붙어 있다. 흰 바탕 아래 옅은 그림자로 본문과 구분한다. */
    <header className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 bg-white px-5 py-4 shadow-[0_2px_14px_rgba(16,38,58,0.07)] md:px-8">
      <a href="/#top" aria-label="커리어링크 홈" className="shrink-0">
        <img src={logoMark} alt="커리어링크" className="h-[23px] w-auto" />
      </a>
      <nav className="flex min-w-0 flex-wrap items-center justify-end gap-x-5 gap-y-2 text-base font-medium text-title lg:gap-x-8">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="whitespace-nowrap hover:opacity-80">
            {link.label}
          </a>
        ))}
        {/* 도입문의만 성격이 다르다 — 둘러보는 링크가 아니라 전환 지점이라
            나머지와 같은 무게로 두지 않고 버튼으로 뺀다. 연결할 곳이 정해지면 링크로 바꾼다. */}
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-cta px-4 py-2 text-[15px] font-semibold tracking-[-0.08px] text-white transition-colors hover:bg-cta-hover"
        >
          도입문의
        </button>
      </nav>
    </header>
  )
}
