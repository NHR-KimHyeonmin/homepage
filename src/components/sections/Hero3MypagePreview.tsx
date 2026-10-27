import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { IconCornerDownRight, IconFileSearch } from '@tabler/icons-react'
import { useSequence } from '../../hooks/useStepSequence'
import { POINTER_SKIN } from '../../lib/demoCursor'
import popupTicket from '../../assets/sections/hero3-mypage/popup-admission-ticket.png'
import popupAttendance from '../../assets/sections/hero3-mypage/popup-attendance.png'
import popupDocuments from '../../assets/sections/hero3-mypage/popup-documents.png'
import popupNotice from '../../assets/sections/hero3-mypage/popup-notice.png'
import popupResult from '../../assets/sections/hero3-mypage/popup-result.png'

/**
 * "마이페이지 발송" 탭 — 지원자가 보는 마이페이지 화면.
 *
 * 전에는 왼쪽 미리보기 판에 팝업 스크린샷을 띄우고 오른쪽 메뉴로 갈아 끼우는
 * 구성이었는데, 정작 이 기능이 보여 줄 것(지원자가 자기 전형 상황을 한 화면에서
 * 본다)은 팝업 네 장이 아니라 그 화면 자체다. 내 정보 한 장과 공고별 전형 묶음
 * 으로 다시 짰고, 전부 DOM 이라 어느 배율에서도 선명하다.
 */
const META = ['NHR', '경력 1 - 3년', '정규직 · 경력', '제출완료', '2026.12.31']

/**
 * 전형마다 지원자가 눌러 볼 수 있는 것이 다르다. 색은 그 성격을 나눈다 —
 * 파랑은 지원자가 답해야 하는 것(참석여부·수험표), 초록은 내야 하는 것
 * (자료제출), 검정은 읽기만 하는 안내다.
 */
type Tone = 'read' | 'reply' | 'submit'

/**
 * 버튼을 누르면 뜨는 발송 내용. 지원자가 받는 메일·수험표가 실제로 어떻게
 * 생겼는지까지 보여 줘야 "마이페이지로 안내한다" 가 말이 아니라 화면이 된다.
 * 다섯 버튼이 각자 자기 그림을 가진다.
 */
const POPUPS: Record<string, string> = {
  결과발표: popupResult,
  전형안내: popupNotice,
  수험표: popupTicket,
  자료제출: popupDocuments,
  참석여부: popupAttendance,
}

/**
 * 세로로 유독 긴 문서(수험표는 1:2)는 높이에 먼저 걸려서, 같은 높이 한도를
 * 쓰면 다른 넷보다 화면을 훨씬 많이 차지한다. 이 한 장만 한도를 낮춘다.
 */
const TALL_POPUPS = new Set(['수험표'])

/**
 * 들어오자마자 한 번 도는 손가락 시늉.
 *   1 커서 나타남 → 2 전형안내로 이동 → 3 눌림 → 4 손 뗌 → 5 사라짐
 *
 * 이 화면은 버튼이 눌리는 곳인데 가만히 두면 그냥 그림으로 보인다. 커서가
 * 한 번 다녀가면 "눌러 볼 수 있는 화면" 이라는 게 설명 없이 전달된다.
 *
 * 시간표(패널에 들어온 순간부터):
 *   0.30s  커서가 떠오른다
 *   0.56s  전형안내로 출발 — 0.72s 동안 날아가 1.28s 에 도착
 *   1.30s  테두리 깜빡임 시작 + 커서 눌림  ← 둘이 같이 간다
 *   1.58s  손 뗌
 *   2.20s  커서가 사라지고, 깜빡임도 같은 자리에서 끝난다
 *
 * 깜빡임을 이동 중이 아니라 도착 뒤로 미룬 이유는, 누르는 손과 눌리는 버튼이
 * 같은 순간에 반응해야 "이걸 눌렀다" 로 읽히기 때문이다.
 */
const POINTER_STEPS = [300, 260, 780, 240, 620]

const TONE: Record<Tone, string> = {
  read: 'text-ink',
  reply: 'text-[#1d4ed8]',
  submit: 'text-[#1f9254]',
}

/** 지원자가 겪는 순서대로 — 서류 → 필기 시험 → (사이에 끼는) 자료 제출 → 실무 면접. */
const STAGES: { title: string; actions: { label: string; tone: Tone }[] }[] = [
  { title: '서류전형', actions: [{ label: '결과발표', tone: 'read' }] },
  { title: '필기 시험', actions: [{ label: '전형안내', tone: 'read' }, { label: '수험표', tone: 'reply' }] },
  { title: '추가자료 제출', actions: [{ label: '자료제출', tone: 'submit' }] },
  { title: '실무 면접', actions: [{ label: '참석여부', tone: 'reply' }] },
]

/** 지원자가 남긴 문의와 그에 달린 관리자 답변. 마이페이지는 전형을 확인만
 *  하는 곳이 아니라 되묻는 곳이기도 해서, 전형 묶음 아래에 같이 둔다. */
const INQUIRY = {
  meta: ['NHR', '일반문의', '답변완료', '2026.10.26'],
  title: '면접일정 변경 문의드립니다.',
  body: '안녕하세요, 12/2일 면접 예정입니다. 개인일정으로 참석이 불가하여 혹시 면접일정 변경이 가능할지 문의드립니다. 감사합니다.',
  reply: [
    '안녕하세요, 지원자님.',
    '12월 2일 면접 일정에 대한 변경 요청을 접수하였습니다. 면접 일정 조정이 가능한지 내부 검토 후 안내드리도록 하겠습니다.',
  ],
}

/**
 * `항목 | 항목 | 항목` 한 줄.
 *
 * 전에는 바깥 flex 의 gap 과 항목 뒤에 둔 별도 spacer 가 겹쳐서 구분자
 * 오른쪽만 넓어 보였다. 구분자 자신이 좌우 여백을 같은 값으로 들고 있게
 * 하면 어긋날 자리가 없다.
 */
function Separated({ items, className }: { items: string[]; className: string }) {
  return (
    <p className={className}>
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 && <span className="px-2.5 text-[#d2d6db]">|</span>}
          {item}
        </span>
      ))}
    </p>
  )
}

function Reply() {
  return (
    <IconCornerDownRight size={18} stroke={1.6} className="shrink-0 text-[#9aa3af]" />
  )
}

function DocumentIcon() {
  return (
    <IconFileSearch size={18} stroke={1.6} />
  )
}

export function Hero3MypagePreview() {
  const [popup, setPopup] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  /** 커서가 날아갈 자리. 패널 가운데에서 "전형안내" 버튼 한가운데로 간다. */
  const panelRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLButtonElement>(null)
  const [path, setPath] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(null)
  const step = useSequence(POINTER_STEPS, !!path && !reduceMotion, 0, false)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const target = targetRef.current
    if (!panel || !target || reduceMotion) return
    const panelBox = panel.getBoundingClientRect()
    const targetBox = target.getBoundingClientRect()
    setPath({
      from: { x: panelBox.width / 2, y: panelBox.height / 2 },
      to: {
        x: targetBox.left + targetBox.width / 2 - panelBox.left,
        y: targetBox.top + targetBox.height / 2 - panelBox.top,
      },
    })
  }, [reduceMotion])

  useEffect(() => {
    if (!popup) return

    // Esc 로도 닫는다 — 덮개를 누르는 것 말고도 빠져나갈 길이 있어야 한다.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPopup(null)
    }
    window.addEventListener('keydown', onKey)

    // 팝업이 떠 있는 동안 뒤 페이지는 멈춘다. 스크롤바가 사라지면서 폭이
    // 줄어 내용이 옆으로 튀므로, 사라진 스크롤바 너비만큼 오른쪽을 채워 둔다.
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [popup])

  return (
    <div
      ref={panelRef}
      style={{ cursor: POINTER_SKIN }}
      className="relative flex w-full flex-col gap-4 overflow-hidden rounded-card bg-white p-6 shadow-card"
    >
      {/* 지원한 공고 하나와 그 안의 전형들. 내 정보와 같은 테두리로 묶는다 —
          둘 다 지원자가 자기 것으로 보는 덩어리인데 한쪽만 선이 없으면
          공고 쪽이 카드에서 흘러나온 것처럼 보인다. */}
      <div className="flex flex-col gap-3 rounded-card border border-[#eceef2] px-6 py-4">
        <Separated items={META} className="text-[14px] text-[#9aa3af]" />

        <div className="flex items-center justify-between">
          {/* 공고명이 들어가는 자리다. */}
          <p className="text-[23px] font-bold tracking-[-0.12px] text-ink">커리어링크 경력 채용</p>
          <span className="flex items-center gap-2 rounded-ui border border-[#e1e4e8] px-4 py-2.5 text-[15px] text-text">
            <DocumentIcon />
            지원서 보기
          </span>
        </div>

        {/* 칸마다 높이가 다른 건 전형마다 눌러 볼 게 다르기 때문이다 —
            억지로 맞추지 않고 내용만큼만 차지하게 둔다. */}
        <div className="grid grid-cols-4 items-start gap-4">
          {STAGES.map((stage) => (
            <div key={stage.title} className="flex flex-col gap-2 rounded-card bg-[#f7f8f9] p-4">
              <p className="pb-0.5 text-center text-[16px] font-semibold text-ink">{stage.title}</p>
              {stage.actions.map((action) => (
                <button
                  key={action.label}
                  ref={action.label === '전형안내' ? targetRef : undefined}
                  type="button"
                  onClick={() => setPopup(action.label)}
                  /* 들어오자마자 테두리가 한 번 밝아졌다 돌아온다 — 눌러 볼 수
                     있는 자리라는 표시다. 애니메이션은 1회만 돈다. */
                  className={`cursor-[inherit] rounded-ui border border-[#e1e4e8] bg-white py-2 text-center text-[14px] font-medium transition-colors [animation:hint-ring_0.9s_ease-in-out_1.3s_1] hover:border-[#c8ccd2] hover:bg-[#fafbfc] ${TONE[action.tone]}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 제목과 등록 버튼을 카드 밖에 따로 두면 줄 하나가 더 생긴다 —
          카드 머리로 들여 한 덩어리로 묶었다. */}
      <div className="flex flex-col rounded-card border border-[#eceef2] px-6 py-4">
        <div className="flex items-center justify-between border-b border-[#f1f3f5] pb-3">
          <p className="text-[18px] font-bold tracking-[-0.09px] text-ink">1:1 문의</p>
          <span className="rounded-ui bg-ink px-4 py-2 text-[14px] font-semibold text-white">
            1:1 문의 등록하기
          </span>
        </div>

        <div className="pt-3">
          <Separated items={INQUIRY.meta} className="text-[14px] text-[#9aa3af]" />
          <p className="pt-1.5 text-[18px] font-bold tracking-[-0.09px] text-ink">{INQUIRY.title}</p>
          <p className="pt-2 text-[14px] leading-[1.55] text-text">{INQUIRY.body}</p>

          <div className="flex gap-3 pt-3">
            <Reply />
            <div className="flex-1 rounded-ui bg-[#f7f8f9] px-4 py-3">
              <Separated items={['인사담당자', '2026.10.26']} className="text-[14px] text-[#9aa3af]" />
              <div className="pt-1.5 text-[14px] leading-[1.6] text-text">
                {INQUIRY.reply.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 손가락 시늉. 패널 가운데에서 떠올라 "전형안내" 로 날아가 한 번
          눌렀다 사라진다. 자리는 실측해 두었다가 x/y 로만 옮긴다 — 레이아웃을
          건드리지 않으니 버튼들이 밀리지 않는다. */}
      {path && !reduceMotion && (
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            x: step >= 2 ? path.to.x : path.from.x,
            y: step >= 2 ? path.to.y : path.from.y,
            opacity: step >= 1 && step < POINTER_STEPS.length ? 1 : 0,
            scale: step === 3 ? 0.72 : 1,
          }}
          transition={{
            x: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.28 },
            scale: { duration: 0.16 },
          }}
          className="pointer-events-none absolute left-0 top-0 z-20 -ml-[15px] -mt-[15px] size-[30px] rounded-full bg-[rgba(77,87,97,0.7)] ring-2 ring-white"
        />
      )}

      {/* 덮개와 팝업은 body 로 보낸다. 이 패널 위쪽에 transform 이 걸린
          상자가 있어서, 그 안에 두면 position:fixed 가 화면이 아니라 그
          상자를 기준으로 잡혀 가운데가 어긋난다. */}
      {createPortal(
        <AnimatePresence>
          {popup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setPopup(null)}
              role="dialog"
              aria-modal="true"
              aria-label={`${popup} 발송 내용`}
              className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/45 p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
                /* 폭과 높이를 둘 다 묶고, 그림이 더 빡빡한 쪽에 맞춰 줄어들게
                   둔다. 폭만 묶으면 세로로 유독 긴 수험표(1:2)가 화면을 넘겨
                   팝업 안에 스크롤이 생기고, 높이만 묶으면 나머지 넷이 지나치게
                   좁아져 글자를 못 읽는다. 둘 다 묶으면 한 규칙으로 다섯 장이
                   모두 스크롤 없이 들어온다. 572 = 440 x 1.3. */
                className="relative cursor-default overflow-hidden rounded-card bg-white shadow-[0_24px_60px_rgba(15,26,61,0.35)]"
              >
                <img
                  src={popup ? POPUPS[popup] : undefined}
                  alt={`${popup} 발송 내용`}
                  className={`block h-auto w-auto max-w-[min(92vw,572px)] ${
                    TALL_POPUPS.has(popup) ? 'max-h-[66vh]' : 'max-h-[82vh]'
                  }`}
                />
                {/* 그림 머리에 X 가 그려져 있다 — 그 자리에 진짜 버튼을 포갠다.
                    내용과 같이 굴러가서 그려진 X 와 늘 붙어 다닌다. */}
                <button
                  type="button"
                  onClick={() => setPopup(null)}
                  aria-label="닫기"
                  className="absolute right-2 top-2 size-10 cursor-pointer"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
