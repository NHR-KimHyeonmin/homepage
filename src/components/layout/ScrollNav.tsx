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
const CHAPTERS: { id: string; label: string }[] = [
  { id: 'top', label: 'MAIN' },
  { id: 'hero2-headline', label: '모집' },
  { id: 'hero2-application-title', label: '접수' },
  { id: 'dashboard', label: '운영' },
  { id: 'evaluation', label: '평가' },
  { id: 'integrations', label: '검사' },
  { id: 'security', label: '보안' },
  { id: 'support', label: '서비스' },
  { id: 'testimonials', label: '후기' },
  { id: 'faq', label: 'FAQ' },
]

export function ScrollNav() {
  const [active, setActive] = useState(CHAPTERS[0].id)
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
       길잡이보다 본문이 먼저다.

       반투명 흰 바탕을 깔아 사진·검은 구역·푸터 어디에 겹쳐도 같은 색으로 읽힌다.
       구역마다 색을 뒤집으면 구역 경계와 실제 배경이 어긋나는 자리에서 사라진다. */
    <nav
      aria-label="페이지 구역 바로가기"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center rounded-full bg-white/80 px-1 py-2 shadow-soft backdrop-blur-md xl:flex"
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
            aria-label={chapter.label}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex h-[26px] w-5 cursor-pointer items-center justify-center"
          >
            <span
              className={clsx(
                'block w-1.5 rounded-full transition-all duration-300',
                isActive ? 'h-[18px] bg-brand-700' : 'h-1.5 bg-brand-200 group-hover:bg-brand-500',
              )}
            />
            {/* 이름표는 마우스를 올리거나 키보드로 고른 동안에만 나온다. 지금 구역은 막대가 알려 준다. */}
            <span className="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-[6px] bg-title px-2 py-1 text-[12px] font-semibold leading-none text-white opacity-0 shadow-[0_2px_8px_rgba(32,40,45,0.25)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {chapter.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
