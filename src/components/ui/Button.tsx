import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'sky' | 'primary' | 'outline' | 'glass'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  sky: 'bg-[#60cdff] text-black hover:bg-[#4bc2fb]',
  primary: 'bg-primary text-white hover:bg-[#00379b]',
  outline: 'border border-gray-400 text-ink hover:bg-gray-150',
  // 메인 배너처럼 색이 있는 배경 위에 올라가는 버튼. 배경이 비치도록
  // 반투명 + blur 로 두고, 테두리는 네 겹의 그림자로 만든다 —
  //   ① 윗변만 밝게: 위에서 빛이 드는 유리의 하이라이트
  //   ② 전체 한 줄: 가장자리를 끊기지 않게 잡아 주는 얇은 테
  //   ③ 아랫변 살짝: 반대쪽 가장자리에 맺히는 반사
  //   ④ 바깥 그림자: 배경에서 떠 있게
  // 테두리(border) 대신 inset shadow 라 버튼 크기가 밀리지 않는다.
  glass:
    'bg-[#0c0805]/74 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.26),inset_0_-1px_0_rgba(255,255,255,0.14),0_8px_24px_rgba(12,8,5,0.3)] backdrop-blur-md hover:bg-[#0c0805]/86',
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
