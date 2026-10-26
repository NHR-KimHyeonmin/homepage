import { useRef, type ReactNode } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import iconChevron from '../../assets/sections/hero2-db-og-mobile/icon-chevron.svg'
import { useFitScale } from '../../hooks/useFitScale'
import { useSequence } from '../../hooks/useStepSequence'

/**
 * "회원 · 비회원 서류접수" 카드. 전에는 로그인 창과 비회원 창이 서로
 * 겹친 채 멈춰 있는 스크린샷이라, 두 창이 같은 "지원하기" 에서 갈라지는
 * 두 갈래라는 게 읽히지 않았다. DOM 으로 다시 그려서 "지원하기" 가 눌리면
 * 두 창이 한 번에 하나씩 나타나고, 끝나면 나란히 선다 — 둘 중 하나를
 * 고르는 화면이 아니라, 공고 설정에 따라 둘 중 하나가 뜬다는 뜻이다.
 */
const DESIGN_WIDTH = 640
/** 공고 카드 86 + 갈래 화살표 44 + 창 246. */
const DESIGN_HEIGHT = 376
const PANEL_HEIGHT = 246

const FORK_WIDTH = DESIGN_WIDTH
const FORK_HEIGHT = 44
const FORK_PATHS = [
  'M320 0V12',
  'M320 12H161Q155 12 155 18V34M150.5 29.5L155 34L159.5 29.5',
  'M320 12H479Q485 12 485 18V34M480.5 29.5L485 34L489.5 29.5',
]

/** 1 "지원하기" 눌림 → 2 손 뗌 · 화살표 → 3 회원 창 → 4 비회원 창 */
const STEP_DELAYS = [750, 260, 480, 780]

const FIELD = 'relative h-[34px] rounded-ui border border-[#d2d6db] px-[10px] flex items-center'
const FIELD_LABEL = 'absolute -top-[7px] left-[9px] bg-white px-1 text-[10px] leading-[14px] text-[#6c737f]'
const FIELD_VALUE = 'truncate text-[13px] tracking-[-0.07px] text-[#212121]'

function Field({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`${FIELD} ${className}`}>
      <span className={FIELD_LABEL}>{label}</span>
      <span className={FIELD_VALUE}>{value}</span>
    </div>
  )
}

/**
 * 한 갈래를 담는 창. 배지가 창 머리에 붙어 있어야 어느 쪽 지원인지
 * 창만 보고 알 수 있다.
 */
/**
 * 배지 두 개는 같은 파랑을 쓰되 칠하는 방식이 반대다 — 회원은 꽉 찬 면,
 * 비회원은 점선 테두리만. 색만 다르면 "둘 중 뭐가 다른가" 가 안 남는데,
 * 채움 / 비움은 흑백으로 봐도, 축소해서 봐도 구분된다.
 */
const TONES = {
  member: {
    badge: 'bg-primary text-white',
    note: 'text-primary/70',
  },
  guest: {
    badge: 'border border-dashed border-primary/55 bg-white text-primary',
    note: 'text-black/45',
  },
} as const

/**
 * 배지 안의 아이콘이 두 갈래의 성격을 하나씩 맡는다.
 *   회원  — 방패 위에 체크가 그어진다. 이미 인증해 둔 정보로 지원한다는 뜻.
 *   비회원 — 번개가 튕기듯 들어온다. 로그인을 건너뛰고 바로 시작한다는 뜻.
 * 둘 다 창이 뜨고 난 뒤에 한 박자 늦게 움직여, 창 등장과 겹쳐 묻히지 않는다.
 */
function BadgeIcon({ tone, shown }: { tone: keyof typeof TONES; shown: boolean }) {
  if (tone === 'member') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="size-[13px] shrink-0">
        <path d="M12 2.4 20 5.5v6.2c0 4.6-3.3 8.3-8 9.9-4.7-1.6-8-5.3-8-9.9V5.5l8-3.1Z" fill="currentColor" />
        <path
          d="m8.2 12.1 2.7 2.7 4.9-5.1"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="12"
          style={{
            strokeDashoffset: shown ? 0 : 12,
            transition: 'stroke-dashoffset 420ms ease-out 280ms',
          }}
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={clsx(
        'size-[13px] shrink-0',
        shown
          ? '[animation:badge-bolt-pop_520ms_cubic-bezier(0.34,1.56,0.64,1)_220ms_both]'
          : 'scale-50 opacity-0',
      )}
    >
      <path d="M13.4 2 4.6 13.6h5.4L9.6 22l8.8-11.8h-5.6L13.4 2Z" fill="currentColor" />
    </svg>
  )
}

function Panel({
  badge,
  note,
  tone,
  closable,
  shown,
  children,
}: {
  badge: string
  note: string
  tone: keyof typeof TONES
  closable?: boolean
  shown: boolean
  children: ReactNode
}) {
  const skin = TONES[tone]

  return (
    <div
      aria-hidden={!shown}
      className={clsx(
        'flex flex-col rounded-card bg-white p-[18px] shadow-card transition-all duration-500 ease-out',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
      )}
      style={{ height: PANEL_HEIGHT }}
    >
      <div className="mb-[14px] flex items-center gap-2">
        <span
          className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-semibold', skin.badge)}
        >
          <BadgeIcon tone={tone} shown={shown} />
          {badge}
        </span>
        <span className={clsx('text-[12px] leading-[16px]', skin.note)}>{note}</span>
        {closable && (
          <svg aria-hidden viewBox="0 0 24 24" className="ml-auto size-[15px]">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#9499a2" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {children}
    </div>
  )
}

export function Hero2MemberGuestApply() {
  const { ref: fitRef, scale } = useFitScale(DESIGN_WIDTH)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.35 })
  const reduceMotion = useReducedMotion()
  const step = useSequence(STEP_DELAYS, inView, 0, !!reduceMotion)

  return (
    /* 좌우 여백은 바깥에 둔다 — useFitScale 이 재는 clientWidth 에는
       패딩이 포함되므로, 재는 쪽에 패딩이 있으면 그만큼 크게 잡아 내용이
       넘친다. */
    <div className="w-full px-8 pb-8 pt-2">
      <div ref={fitRef} className="w-full" style={{ height: DESIGN_HEIGHT * scale }}>
        <div
          ref={stageRef}
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            marginLeft: '50%',
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* 공고 카드 — 두 갈래가 갈라져 나오는 출발점. 여기가 주인공이
              아니라서 아래 두 창보다 작게 잡는다. 폭도 두 창을 합친 너비보다
              좁혀 가운데에 세운다 — 하나에서 둘로 갈라진다는 게 폭으로도
              보인다. 지원직무 셀렉트는 뺐다 — 이
              카드가 할 말은 "지원하기를 누르면 무슨 일이 생기는가" 하나뿐이고,
              직무를 고르는 단계는 그 이야기에 들어 있지 않다. */}
          <div className="mx-auto flex h-[86px] w-[540px] items-center justify-between rounded-card bg-white px-4 py-2 shadow-card">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate text-[15px] font-bold leading-[22px] tracking-[-0.3px] text-[#212121]">
                커리어링크 경력사원 채용
              </p>
              <p className="text-[11px] leading-[15px] text-black/45">
                2025.07.30 ~ 2026.09.18 04:05
                <span className="px-1.5 text-[#d2d6db]">|</span>
                <span className="font-bold text-primary">D-18</span>
              </p>
              <div className="flex gap-1">
                {['#서비스 기획', '#UX/UI'].map((tag) => (
                  <span key={tag} className="rounded-chip bg-[#f3f4f6] px-[6px] py-[1px] text-[10px] text-text">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
  
            <button
                type="button"
                /* 눌린 티. 줄어들기만 하면 0.2초짜리라 놓치기 쉬워서,
                   색이 한 번 짙어지고 테두리에 빛이 번졌다 돌아온다. */
                className={clsx(
                  'h-[36px] shrink-0 rounded-ui px-[16px] text-[13px] font-bold text-white transition-all duration-150',
                  step === 1
                    ? 'scale-95 bg-[#002f80] shadow-[0_0_0_5px_rgba(0,66,183,0.25)]'
                    : 'scale-100 bg-primary shadow-none',
                )}
              >
                지원하기
              </button>
          </div>
  
          {/* 버튼에서 손을 떼는 순간 그어지는 선. 가운데로 한 번 내려왔다가
              두 창 머리로 갈라진다 — "지원하기 하나가 둘로 나뉜다" 를
              화살표 모양 자체가 말하게 한다. 끝점 155 / 485 는 두 칸
              (각 310 + 사이 20)의 한가운데다.

              선 굵기·색은 위 "검증된 DB 기반 지원서" 의 연결선과 같다 —
              두 카드 모두 "여기서 저기로 이어진다" 를 그리는 선이라, 같은
              선이어야 한 제품의 같은 표현으로 읽힌다.

              그리는 방식은 경로별 stroke-dashoffset 이 아니라, 그림 전체를
              담은 상자의 높이를 0에서 늘리는 쪽이다. dash 는 경로가 그려진
              방향을 따라가므로 가로로 뻗는 두 팔이 가운데에서 바깥으로 기어
              나가는 것처럼 보였는데, 상자를 여는 쪽은 선이 어느 방향으로
              그려졌든 언제나 위에서 아래로 드러난다. */}
          <div style={{ height: FORK_HEIGHT }}>
            <div
              className="overflow-hidden transition-[height] duration-500 ease-out"
              style={{ height: step >= 2 ? FORK_HEIGHT : 0 }}
            >
              <svg
                aria-hidden
                viewBox="0 0 640 44"
                width={FORK_WIDTH}
                height={FORK_HEIGHT}
                fill="none"
                stroke="#3379f3"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {FORK_PATHS.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
            </div>
          </div>
  
          {/* 두 갈래. 한 번에 하나씩 나타나고, 끝나면 나란히 선다. */}
          <div className="grid grid-cols-2 items-start gap-5">
            <Panel badge="회원" note="인증된 내 정보로 지원" tone="member" shown={step >= 3}>
              <div className="flex flex-col gap-[10px]">
                <Field label="이메일" value="careerlink@gmail.com" />
                <div className={`${FIELD} justify-between`}>
                  <span className={FIELD_LABEL}>비밀번호</span>
                  {/* `*` 는 글자 상자 위쪽에만 잉크가 있어서, 줄 상자를 가운데
                    맞춰도 눈에는 떠 보인다. 13px 기준 잉크 중심이 상자 중심보다
                    2.2px 위라 그만큼 내려 앉힌다. */}
                <span className="translate-y-[2px] text-[13px] text-[#212121]">**********</span>
                  <svg aria-hidden viewBox="0 0 24 24" className="size-[15px] shrink-0">
                    <path
                      d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"
                      fill="none"
                      stroke="#6c737f"
                      strokeWidth="1.6"
                    />
                    <circle cx="12" cy="12" r="2.6" fill="#6c737f" />
                  </svg>
                </div>
                <span className="flex items-center gap-2 text-[12px] text-text">
                  <span className="size-[14px] rounded-[3px] border border-[#9499a2]" />
                  이메일 저장
                </span>
              </div>
              <button
                type="button"
                className="mt-auto h-[42px] rounded-ui bg-primary text-[15px] font-bold text-white"
              >
                로그인
              </button>
            </Panel>
  
            <Panel badge="비회원" note="로그인 없이 바로 시작" tone="guest" closable shown={step >= 4}>
              <div className="flex flex-col gap-[10px]">
                <Field label="이메일" value="careerlink@nhr.kr" />
                <div className="flex gap-2">
                  <div className={`${FIELD} w-[86px] shrink-0 justify-between`}>
                    <span className={FIELD_VALUE}>+82</span>
                    <img loading="lazy" decoding="async" src={iconChevron} alt="" className="size-[18px] shrink-0" />
                  </div>
                  <Field label="휴대폰번호" value="01000005678" className="min-w-0 flex-1" />
                </div>
                <Field label="이름" value="홍길동" />
              </div>
              <button
                type="button"
                className="mt-auto h-[42px] rounded-ui bg-primary-lightest text-[15px] font-bold text-primary"
              >
                지원서 작성하기
              </button>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
