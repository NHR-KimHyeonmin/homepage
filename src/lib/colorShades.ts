/**
 * Color-math helper for the "테마 색상 커스터마이징" demo (Hero2ThemeShowcase).
 *
 * Figma's reference palette defines a fixed set of tint/shade "relatives" for
 * the default brand purple `#6e23d7`:
 *
 *   #6e23d7 → #581cac → #421581   (progressively darker, same hue/saturation)
 *   #6e23d7 → #b791eb → #f1e9fb   (progressively lighter, tinting toward white)
 *
 * All of those share the same hue (~265°) as the base color. Converting each
 * to HSL and diffing against the base gives a reusable ramp:
 *
 *   dark1  = same H, same S, L - 9.8
 *   dark2  = same H, same S, L - 19.6
 *   light1 = same H, S - 2.77, L + 25.49
 *   light2 = same H, S - 2.77, L + 45.88
 *
 * Swatch borders in the reference (`#581cac` bordering the `#6e23d7` swatch,
 * `#46168a` bordering the `#581cac` swatch, etc.) are each swatch's own fill
 * darkened a bit further — Figma's actual deltas taper as the ramp gets
 * darker/lighter (and desaturate a lot for the pale swatches), but per-task
 * guidance a single "darken by one dark-step" approximation is close enough
 * visually and much simpler to reuse across both mockups.
 *
 * These deltas are applied relative to ANY selected palette color, not just
 * the default purple, so picking a new swatch recolors every dependent shade
 * at once.
 */

export interface ThemeShades {
  /** The selected color itself, normalized to lowercase #rrggbb. */
  base: string
  /** One step darker (same hue/sat) — e.g. swatch borders, pressed states. */
  dark1: string
  /** Two steps darker — deeper accents. */
  dark2: string
  /** One step lighter/tinted toward white — light hover backgrounds. */
  light1: string
  /** Two steps lighter/tinted toward white — very pale backgrounds. */
  light2: string
  /** Fully-saturated pure hue (S=100, L=50) — used by the hue slider thumb
   *  and the saturation/lightness gradient in the color picker. */
  pureHue: string
  /** Hue in degrees, 0-360 — used to position the hue-slider thumb. */
  hue: number
}

// Deltas measured from the Figma reference ramp (see file header).
const DARK_1_DL = -9.8
const DARK_2_DL = -19.6
const LIGHT_1_DL = 25.49
const LIGHT_1_DS = -2.77
const LIGHT_2_DL = 45.88
const LIGHT_2_DS = -2.77
/** Approximates the reference border deltas ("darken by ~10-15%"). */
const BORDER_DL = -9.8

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value))
}

/** #rrggbb -> [h (0-360), s (0-100), l (0-100)] */
export function hexToHsl(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) {
    return [0, 0, l * 100]
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h: number
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0)
      break
    case g:
      h = (b - r) / d + 2
      break
    default:
      h = (r - g) / d + 4
  }
  h *= 60

  return [h, s * 100, l * 100]
}

/** [h (0-360), s (0-100), l (0-100)] -> #rrggbb */
export function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360
  const sat = clamp(s) / 100
  const lig = clamp(l) / 100

  if (sat === 0) {
    const v = Math.round(lig * 255)
    const hx = v.toString(16).padStart(2, '0')
    return `#${hx}${hx}${hx}`
  }

  const q = lig < 0.5 ? lig * (1 + sat) : lig + sat - lig * sat
  const p = 2 * lig - q

  const hueToRgb = (t: number): number => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }

  const r = Math.round(hueToRgb(hue / 360 + 1 / 3) * 255)
  const g = Math.round(hueToRgb(hue / 360) * 255)
  const b = Math.round(hueToRgb(hue / 360 - 1 / 3) * 255)

  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

/** Darkens a hex color's lightness by `amount` percentage points. */
export function darken(hex: string, amount = 12): string {
  const [h, s, l] = hexToHsl(hex)
  return hslToHex(h, s, clamp(l - amount))
}

/** Derives the full Figma-style shade ramp for any selected base color. */
export function getThemeShades(hex: string): ThemeShades {
  const [h, s, l] = hexToHsl(hex)
  return {
    base: hex.toLowerCase(),
    dark1: hslToHex(h, s, clamp(l + DARK_1_DL)),
    dark2: hslToHex(h, s, clamp(l + DARK_2_DL)),
    light1: hslToHex(h, clamp(s + LIGHT_1_DS), clamp(l + LIGHT_1_DL)),
    light2: hslToHex(h, clamp(s + LIGHT_2_DS), clamp(l + LIGHT_2_DL)),
    pureHue: hslToHex(h, 100, 50),
    hue: h,
  }
}

/** border = fill darkened by one dark-step, matching the reference ramp. */
export function swatchBorder(hex: string): string {
  return darken(hex, Math.abs(BORDER_DL))
}
