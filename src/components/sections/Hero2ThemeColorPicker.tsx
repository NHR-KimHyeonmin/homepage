import { getThemeShades, swatchBorder } from '../../lib/colorShades'

interface Hero2ThemeColorPickerProps {
  /** Currently-selected palette color, e.g. "#6E23D7". */
  color: string
}

const TRANSITION = 'transition-colors duration-300'

/**
 * Figma node 2280:639 — "Frame 131". The floating HSV color-picker popup
 * that overlaps the dashboard mockup's bottom-left corner. Every purple
 * fill/border here is derived from the `color` prop via the shared shade
 * ramp in `lib/colorShades.ts`, so picking a new swatch in
 * Hero2ThemeShowcase recolors this popup live, in sync with Frame 117.
 */
export function Hero2ThemeColorPicker({ color }: Hero2ThemeColorPickerProps) {
  const shades = getThemeShades(color)

  const themeSwatches = [shades.base, shades.dark1, shades.dark2, shades.light1, shades.light2, '#ffffff']
  const themeSwatchBorders = themeSwatches.map((swatch, i) => (i === 5 ? '#cccccc' : swatchBorder(swatch)))

  return (
    <div className="rounded-ui bg-white p-2 shadow-[0px_2px_14px_0px_rgba(32,40,45,0.08)]">
      <div className="flex w-[280px] flex-col">
        {/* Saturation/lightness square + hue bar */}
        <div className="rounded-ui border border-[#d2d6db] p-px">
          <div
            className={`relative h-[200px] w-full rounded-t-chip ${TRANSITION}`}
            style={{
              backgroundImage: `linear-gradient(0deg, rgb(0,0,0) 0%, rgba(0,0,0,0) 100%), linear-gradient(90deg, rgb(255,255,255) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, ${shades.pureHue} 0%, ${shades.pureHue} 100%)`,
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-t-chip shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.05)]" />
            <div className="absolute left-[220px] top-[12px] flex size-[28px] items-center justify-center rounded-card border-4 border-white bg-white drop-shadow-[0px_2px_2px_rgba(0,0,0,0.2)]">
              <div className={`size-full rounded-card ${TRANSITION}`} style={{ backgroundColor: shades.base }} />
            </div>
          </div>
          <div
            className="relative h-[24px] w-full rounded-b-chip"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgb(255,0,0) 0%, rgb(255,255,0) 17%, rgb(0,255,0) 33%, rgb(0,255,255) 50%, rgb(0,0,255) 67%, rgb(255,0,255) 83%, rgb(255,0,0) 100%)',
            }}
          >
            {/* 색이 바뀌면 이 손잡이도 색상환 위를 옮겨 다닌다. 공용
                TRANSITION 은 transition-colors 라 색만 넘어가고 left 는
                즉시 점프했다 — 위치도 같이 전환시킨다. */}
            <div
              className="absolute top-1/2 flex size-[20px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-card border-4 border-white bg-white drop-shadow-[0px_2px_2px_rgba(0,0,0,0.2)] transition-[left,background-color] duration-[600ms] ease-out"
              style={{ left: `${(shades.hue / 360) * 100}%` }}
            >
              <div className={`size-full rounded-chip ${TRANSITION}`} style={{ backgroundColor: shades.pureHue }} />
            </div>
          </div>
        </div>

        {/* 테마 색상 shade swatches */}
        <div className="max-h-[176px] pt-2">
          <div className="flex flex-col gap-1 px-2">
            <p className="text-sm leading-5 text-[#212121]">테마 색상</p>
            <div className="-ml-2 flex items-center">
              {themeSwatches.map((swatch, i) => (
                <div key={i} className="flex flex-1 max-w-[45.33px] flex-col pl-2 pt-2">
                  <div className="flex size-10 items-center justify-center rounded-ui">
                    <div
                      className={`size-full rounded-ui border ${TRANSITION}`}
                      style={{
                        backgroundColor: swatch,
                        borderColor: themeSwatchBorders[i],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
