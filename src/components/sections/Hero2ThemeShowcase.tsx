import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useFitScale } from '../../hooks/useFitScale'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { Hero2ThemeColorPicker } from './Hero2ThemeColorPicker'
import { Hero2ThemeFrame117 } from './Hero2ThemeFrame117'

const PALETTE = ['#EB7565', '#FFA113', '#93CF3F', '#06B6D2', '#6E23D7']
const DEFAULT_COLOR = '#6E23D7'

/**
 * Figma node 2230:178 — "Hero 2-Feature cards". A theme-customization
 * admin-panel mockup: a row of clickable theme-color swatches (radio-button
 * behavior) above a browser-chrome card that shows the theme editor
 * (Frame 117, node 2255:299) with a floating color-picker popup
 * (Frame 131, node 2280:639) overlapping its bottom-left corner.
 *
 * Both mockups are real DOM (see Hero2ThemeFrame117 / Hero2ThemeColorPicker)
 * so every `#6e23d7`-family element recolors live, together, when a
 * different swatch is selected.
 */
export function Hero2ThemeShowcase() {
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR)
  // The mockup is real DOM laid out at a fixed 1000px width, so on a
  // narrow window it is scaled down as one block rather than clipped —
  // matching how the 서류 접수 screenshot below simply shrinks.
  const { ref: fitRef, scale } = useFitScale(1000)

  return (
    <Section className="flex flex-col items-center gap-10 overflow-hidden bg-white px-6 pb-24 pt-16 md:px-16">
      <Container maxWidth={1280} className="flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-[2px]"
        >
          {PALETTE.map((hex) => {
            const isSelected = hex.toLowerCase() === selectedColor.toLowerCase()
            return (
              <button
                key={hex}
                type="button"
                aria-label={`테마 색상 ${hex} 선택`}
                aria-pressed={isSelected}
                onClick={() => setSelectedColor(hex)}
                className="flex items-center justify-center rounded-full"
              >
                <span
                  className={clsx(
                    'flex items-center justify-center rounded-full border-[2.6px] p-1 transition-colors duration-300',
                    isSelected ? 'border-[#0042b7]' : 'border-transparent',
                  )}
                >
                  <span className="size-[44px] rounded-full" style={{ backgroundColor: hex }} />
                </span>
              </button>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="relative h-[760px] w-full max-w-[1280px] overflow-visible rounded-[20px] border-[12px] border-[#e8eaee] bg-white shadow-card"
        >
          <div ref={fitRef} className="size-full overflow-hidden rounded-[8px]">
            <div
              style={
                scale < 1
                  ? { width: 1000, transform: `scale(${scale})`, transformOrigin: 'top left' }
                  : undefined
              }
            >
              <Hero2ThemeFrame117 color={selectedColor} />
            </div>
          </div>

          {/* Aligned to sit directly under the "메인 색상" swatch in the 테마
              설정 panel, top-edge matched to the "모서리 둥글기" row —
              measured against the live mockup rather than the original
              Figma popup offset, which assumed a different mockup width. */}
          <div
            className="absolute hidden drop-shadow-[0_8px_24px_rgba(15,26,61,0.16)] md:block"
            style={{ left: 77 * scale, top: 161 * scale, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          >
            <Hero2ThemeColorPicker color={selectedColor} />
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
