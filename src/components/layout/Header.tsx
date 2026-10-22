import logoMark from '../../assets/sections/header/logo-mark.png'

const NAV_LINKS = [
  { label: '제안서', href: '#' },
  { label: 'Resources', href: '#' },
  { label: 'Pricing', href: '#' },
]

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-6 md:px-8">
      <a href="#top" aria-label="커리어링크 홈">
        <img src={logoMark} alt="커리어링크" className="h-[23px] w-auto" />
      </a>
      <nav className="flex items-center gap-8 text-base font-medium text-ink">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="whitespace-nowrap hover:opacity-80">
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
