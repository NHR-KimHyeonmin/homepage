import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import screeningSimple from '../../assets/sections/hero3-tabs/screening-simple.webp'
import screeningStandard from '../../assets/sections/hero3-tabs/screening-standard.webp'
import { useFitScale } from '../../hooks/useFitScale'

// Figma node 2320:25550 — "전형운영>일반/간편전형", laid out at this size.
const DESIGN_WIDTH = 1142
const DESIGN_HEIGHT = 640

/** Where the two screenshots sit (Figma nodes 2320:25553 / 25552). The
 *  selected one takes the front slot — up and to the right, fully opaque —
 *  and the other drops back to 30%. */
const SLOTS = {
  front: { left: 246, top: 101, zIndex: 2, opacity: 1 },
  back: { left: 77, top: 116, zIndex: 1, opacity: 0.3 },
} as const

const SCREENINGS = [
  {
    id: 'standard',
    label: '일반 전형',
    src: screeningStandard,
    width: 820,
    alt: '일반 전형으로 운영되는 전형 관리 화면',
  },
  {
    id: 'simple',
    label: '간편 전형',
    src: screeningSimple,
    width: 820,
    alt: '간편 전형으로 운영되는 전형 관리 화면',
  },
] as const

type ScreeningId = (typeof SCREENINGS)[number]['id']

/**
 * The "일반/간편 전형" tab of the 전형 운영 section. The segmented control is
 * real markup; picking a type brings that screenshot to the front slot at
 * full opacity and sends the other one back to 30%, swapping places.
 */
export function Hero3ScreeningToggle() {
  const { ref, scale } = useFitScale(DESIGN_WIDTH)
  const [selected, setSelected] = useState<ScreeningId>('standard')

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white p-8 shadow-card">
      <div ref={ref} className="w-full overflow-hidden" style={{ height: DESIGN_HEIGHT * scale }}>
        <div
          className="relative overflow-hidden"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {SCREENINGS.map((screening) => {
            const slot = screening.id === selected ? SLOTS.front : SLOTS.back
            return (
              <motion.img
                key={screening.id}
                src={screening.src}
                alt={screening.alt}
                animate={slot}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'absolute', width: screening.width }}
                className="max-w-none rounded-xl shadow-[0px_4px_24px_0px_rgba(32,40,45,0.12)]"
              />
            )
          })}

          {/* Figma node 2320:25554 */}
          <div className="absolute left-[23px] top-[20px] z-10 flex items-center gap-1.5 rounded-lg border border-[#f3f4f6] bg-white p-1.5">
            {SCREENINGS.map((screening) => {
              const isSelected = screening.id === selected
              return (
                <button
                  key={screening.id}
                  type="button"
                  onClick={() => setSelected(screening.id)}
                  aria-pressed={isSelected}
                  className={clsx(
                    'w-[120px] cursor-pointer rounded px-2 py-1.5 text-[18px] font-semibold leading-[1.6] tracking-[-0.09px] transition-colors',
                    isSelected ? 'bg-[#f4f8ff] text-[#3379f3]' : 'text-black/30 hover:text-black/50',
                  )}
                >
                  {screening.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
