import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'sky' | 'primary' | 'outline' | 'dark'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  sky: 'bg-[#60cdff] text-black hover:bg-[#4bc2fb]',
  primary: 'bg-primary text-white hover:bg-[#00379b]',
  outline: 'border border-gray-400 text-ink hover:bg-gray-150',
  dark: 'bg-[#0c0805] text-white hover:bg-[#2a211c]',
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex cursor-pointer items-center justify-center rounded-card px-5 py-3 text-[18px] font-semibold tracking-[-0.09px] transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
