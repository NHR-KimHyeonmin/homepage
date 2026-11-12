import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconCheck, IconChevronDown } from '@tabler/icons-react'

interface DropdownProps {
  options: readonly string[]
  value: string
  onChange: (next: string) => void
  /** 스크린리더용 이름. */
  label: string
  /** 아무것도 고르지 않았을 때 보이는 글. 없으면 첫 항목을 고른 것으로 본다. */
  placeholder?: string
  /** 닫힌 버튼의 겉모양. 쓰는 자리의 입력칸과 맞춘다. */
  buttonClassName: string
  className?: string
}

/**
 * 고르기 목록. 브라우저 기본 select 는 펼친 목록을 운영체제가 그려(파란 줄, 각진 상자)
 * 입력칸들과 어울리지 않아 직접 그린다. 키보드: ↑↓ 로 옮기고 Enter 로 고르고 Esc 로 닫는다.
 */
export function Dropdown({ options, value, onChange, label, placeholder, buttonClassName, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') return setOpen(false)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setCursor(Math.max(0, options.indexOf(value)))
        return setOpen(true)
      }
      const step = event.key === 'ArrowDown' ? 1 : -1
      setCursor((current) => (current + step + options.length) % options.length)
    }
    if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault()
      pick(options[cursor])
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`} onKeyDown={onKey}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => {
          setCursor(Math.max(0, options.indexOf(value)))
          setOpen((current) => !current)
        }}
        className={`${buttonClassName} flex cursor-pointer items-center justify-between gap-3 text-left ${open ? 'border-primary ring-3 ring-primary/10' : ''}`}
      >
        <span className={value ? 'text-title' : 'text-[#9aa5b1]'}>{value || placeholder}</span>
        <IconChevronDown size={18} stroke={1.8} className={`shrink-0 text-sub transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-30 flex flex-col gap-0.5 rounded-ui border border-[#e1e4e8] bg-white p-1.5 shadow-float"
          >
            {options.map((source, index) => {
              const selected = source === value
              return (
                <li
                  key={source}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setCursor(index)}
                  onClick={() => pick(source)}
                  className={`flex cursor-pointer items-center justify-between rounded-[6px] px-3 py-2.5 text-[15px] transition-colors ${
                    index === cursor ? 'bg-brand-50' : ''
                  } ${selected ? 'font-semibold text-primary' : 'text-title'}`}
                >
                  {source}
                  {selected && <IconCheck size={18} stroke={2} />}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
