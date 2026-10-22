import logoMark from '../../assets/sections/header/logo-mark.png'
import socialInstagram from '../../assets/sections/footer/social-1.svg'
import socialLinkedin from '../../assets/sections/footer/social-2.svg'
import socialX from '../../assets/sections/footer/social-3.svg'

const NAV_LINKS = [
  { label: 'Features', href: '#' },
  { label: 'Learn more', href: '#' },
  { label: 'Support', href: '#' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', icon: socialInstagram, href: '#' },
  { label: 'LinkedIn', icon: socialLinkedin, href: '#' },
  { label: 'X (Twitter)', icon: socialX, href: '#' },
]

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-8 border-t border-black/10 px-5 py-12 md:flex-row md:px-8">
      <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
        <a href="#top" aria-label="커리어링크 홈">
          <img src={logoMark} alt="커리어링크" className="h-[20px] w-auto" />
        </a>
        <nav className="flex items-center gap-8 text-base font-medium tracking-[-0.08px] text-black/55">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="whitespace-nowrap hover:text-black">
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <nav className="flex items-center gap-6">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            className="block size-6 shrink-0 transition-opacity hover:opacity-70"
          >
            <img src={link.icon} alt="" className="size-full" />
          </a>
        ))}
      </nav>
    </footer>
  )
}
