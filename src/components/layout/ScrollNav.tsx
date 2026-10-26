import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

/**
 * 오른쪽 가장자리에 붙는 챕터 네비게이터.
 *
 * 이 페이지는 아홉 덩어리가 세로로 길게 이어져서, 스크롤 중에 지금 어디쯤
 * 인지도 앞으로 뭐가 남았는지도 알 수 없었다. 점 하나가 한 챕터이고, 지금
 * 보고 있는 챕터만 이름이 함께 뜬다 — 이름을 전부 띄우면 본문 옆에 목차를
 * 하나 더 세우는 셈이라 읽는 걸 방해한다.
 *
 * 챕터는 각 구역의 머리글 섹션을 가리킨다. 그 섹션의 위가 화면 한가운데를
 * 지나는 순간 그 챕터로 넘어간다 — "보이기 시작할 때" 로 잡으면 두 챕터가
 * 동시에 보이는 구간에서 깜빡인다.
 */
const CHAPTERS: { id: string; label: string; dark?: boolean }[] = [
  { id: 'top', label: 'MAIN' },
  { id: 'hero2-headline', label: '모집' },
  { id: 'hero2-application-title', label: '접수' },
  { id: 'dashboard', label: '운영' },
  { id: 'evaluation', label: '평가' },
  { id: 'integrations', label: '검사' },
  /* 보안 구역은 바탕이 검다 — 점과 이름표를 밝은 쪽으로 뒤집지 않으면
     그 구간에서만 길잡이가 통째로 사라진다. */
  { id: 'security', label: '보안', dark: true },
  { id: 'support', label: '지원' },
  { id: 'testimonials', label: '후기' },
  { id: 'faq', label: 'FAQ' },
]

export function ScrollNav() {
  const [active, setActive] = useState(CHAPTERS[0].id)
  const onDark = CHAPTERS.find((chapter) => chapter.id === active)?.dark ?? false
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      const middle = window.innerHeight / 2
      // 화면 한가운데를 이미 지나친 섹션 중 마지막 것이 지금 챕터다.
      const passed = CHAPTERS.filter((chapter) => {
        const el = document.getElementById(chapter.id)
        return el ? el.getBoundingClientRect().top <= middle : false
      })
      setActive((passed[passed.length - 1] ?? CHAPTERS[0]).id)
    }

    // 스크롤마다 레이아웃을 열 번씩 읽으므로 프레임당 한 번으로 묶는다.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    /* 화면 폭이 좁으면 본문 위에 겹친다 — 둘 다 보여 줄 자리가 없으면
       길잡이보다 본문이 먼저다. */
    <nav
      aria-label="페이지 구역 바로가기"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 xl:flex"
    >
      {CHAPTERS.map((chapter) => {
        const isActive = chapter.id === active
        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() =>
              document.getElementById(chapter.id)?.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start',
              })
            }
            aria-current={isActive ? 'true' : undefined}
            className="group flex cursor-pointer items-center justify-end gap-3"
          >
            {/* 이름표는 지금 챕터일 때, 그리고 마우스를 올렸을 때만 나온다.
                자리는 늘 차지하고 있어서 점이 좌우로 밀리지 않는다. */}
            <span
              className={clsx(
                'text-[11px] font-semibold tracking-[0.12em] transition-[opacity,color] duration-300',
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-70',
                onDark ? 'text-white' : isActive ? 'text-ink' : 'text-text',
              )}
            >
              {chapter.label}
            </span>
            <span
              className={clsx(
                'block rounded-full transition-all duration-300',
                isActive ? 'size-[9px]' : 'size-[6px]',
                onDark
                  ? isActive
                    ? 'bg-white'
                    : 'bg-white/30 group-hover:bg-white/60'
                  : isActive
                    ? 'bg-ink'
                    : 'bg-ink/25 group-hover:bg-ink/50',
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
