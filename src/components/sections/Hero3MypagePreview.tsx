import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import iconBirth from '../../assets/sections/hero3-mypage/icon-birth.svg'
import iconEdit from '../../assets/sections/hero3-mypage/icon-edit.svg'
import iconMail from '../../assets/sections/hero3-mypage/icon-mail.svg'
import iconPhone from '../../assets/sections/hero3-mypage/icon-phone.svg'
import popupTicket from '../../assets/sections/hero3-mypage/popup-admission-ticket.webp'
import popupAttendance from '../../assets/sections/hero3-mypage/popup-attendance.webp'
import popupDocuments from '../../assets/sections/hero3-mypage/popup-documents.webp'
import popupNotice from '../../assets/sections/hero3-mypage/popup-notice.webp'
import { useFitScale } from '../../hooks/useFitScale'

// Figma node 2320:25613 — "전형운영>마이페이지 발송".
const DESIGN_WIDTH = 1142
const DESIGN_HEIGHT = 640

const MENU = [
  { id: 'attendance', label: '참석여부', src: popupAttendance, alt: '참석 여부를 선택하는 지원자 마이페이지 팝업' },
  { id: 'notice', label: '전형 안내', src: popupNotice, alt: '전형 안내 발송 내용을 보여주는 팝업' },
  { id: 'ticket', label: '수험표', src: popupTicket, alt: '지원자 수험표 팝업' },
  { id: 'documents', label: '자료제출', src: popupDocuments, alt: '추가 자료를 제출하는 팝업' },
] as const

const PROFILE = [
  { icon: iconMail, text: 'hanminji@gmail.com' },
  { icon: iconBirth, text: '1990.01.13 (여)' },
  { icon: iconPhone, text: '01000004567' },
]

/**
 * The "마이페이지 발송" tab of the 전형 운영 section. Picking one of the four
 * items on the right swaps the popup shown on the preview panel to the left.
 * The profile card and the menu are real markup; each popup is an exported
 * screenshot (Figma nodes 2349:17738 / 17807 / 17873 / 17632).
 */
export function Hero3MypagePreview() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const [selected, setSelected] = useState<(typeof MENU)[number]['id']>('attendance')
  const active = MENU.find((item) => item.id === selected) ?? MENU[0]

  return (
    <div className="w-full overflow-hidden rounded-card bg-white shadow-card">
      <div ref={ref} className="w-full overflow-hidden" style={{ height: DESIGN_HEIGHT * scale }}>
      <div
        className="relative"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Preview panel (node 2320:25670) */}
        <div className="absolute left-[42px] top-[39px] flex h-[568px] w-[731px] items-center justify-center rounded-card bg-[#f9fafb]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={active.id}
              src={active.src}
              alt={active.alt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="max-h-[494px] w-[400px] max-w-none object-contain"
            />
          </AnimatePresence>
        </div>

        {/* Applicant card + menu (node 2320:25625) */}
        <div className="absolute left-[792px] top-[34px] flex w-[324px] flex-col gap-4">
          <div className="flex flex-col rounded-ui border border-[#e5e7eb] bg-white p-[16.833px]">
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-bold leading-8 text-[#212121]">
                한민지 <span className="text-[14px] font-medium leading-[22.4px]">님</span>
              </p>
              <span className="flex items-center justify-center rounded-full bg-[#f9fafb] p-[5px]">
                <img src={iconEdit} alt="" className="size-[18px]" />
              </span>
            </div>
            <div className="flex flex-col gap-4 pt-3">
              {PROFILE.map((row) => (
                <div key={row.text} className="flex items-center gap-2">
                  <img src={row.icon} alt="" className="size-5 shrink-0" />
                  <span className="text-[14px] leading-5 text-[#212121]">{row.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-[293px] flex-col gap-1.5 rounded-ui border border-[#f3f4f6] bg-white p-1.5">
            {MENU.map((item) => {
              const isSelected = item.id === selected
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  aria-pressed={isSelected}
                  className={clsx(
                    'w-full cursor-pointer rounded-chip px-4 py-1.5 text-[14px] font-semibold leading-[1.6] tracking-[-0.07px] transition-colors',
                    isSelected ? 'bg-[#f4f8ff] text-[#3379f3]' : 'text-black/30 hover:text-black/50',
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
